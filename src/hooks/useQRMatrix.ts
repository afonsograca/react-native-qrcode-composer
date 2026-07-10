import {useMemo, useRef} from 'react';
import QRCode from 'qrcode';

import type {DetectionMarkerOptions, PatternOptions} from '../types';
import {ErrorCorrectionLevel} from '../types';
import type {QRCodeContents} from '../types';
import {encodeQRCodeContents} from '../encoding';
import type {Result} from '../types/result';
import {tryResult} from '../types/result';

const DEFAULT_CORNER_RADIUS = 0.0;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// 0–1 sweeps square → fully round; size/2 is the geometric maximum radius.
const cornerRadiusToPixels = (fraction: number, size: number): number =>
  (fraction * size) / 2;

interface QRCodeOptions {
  value: QRCodeContents;
  size: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  detectionMarkerOptions?: DetectionMarkerOptions;
  patternOptions?: PatternOptions;
}

interface ResolvedMarkerOptions {
  connected: boolean;
  outerCornerRadius: number;
  innerCornerRadius: number;
}

interface ResolvedPatternOptions {
  connected: boolean;
  cornerRadius: number;
}

interface CornerRadius {
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

interface Position {
  x: number;
  y: number;
}

const createQRMatrix = (
  value: string,
  errorCorrectionLevel: ErrorCorrectionLevel,
): number[][] => {
  const qrData = QRCode.create(value, {errorCorrectionLevel});
  const arr = [...qrData.modules.data];
  const size = qrData.modules.size;
  return Array.from({length: size}, (_, rowIndex) => {
    return arr.slice(rowIndex * size, (rowIndex + 1) * size);
  });
};

const isDrawingDetectionMarker = (
  column: number,
  row: number,
  size: number,
): boolean =>
  (row < 7 && (column < 7 || column >= size - 7)) ||
  (row >= size - 7 && column < 7);

const isDetectionMarkerStartingPoint = (
  column: number,
  row: number,
  size: number,
): boolean =>
  (row === 0 && (column === 0 || column === size - 7)) ||
  (row === size - 7 && column === 0);

interface GenerateSquarePathProps {
  position: Position;
  size: number;
  cornerRadius: number;
  padding?: number;
  unitSize?: number;
  cornersWithRadius?: CornerRadius;
}

const generateSquarePath = ({
  position,
  size,
  cornerRadius,
  padding = 0,
  unitSize = size,
  cornersWithRadius = {
    topLeft: true,
    topRight: true,
    bottomLeft: true,
    bottomRight: true,
  },
}: GenerateSquarePathProps): string => {
  const getRadius = (corner: keyof typeof cornersWithRadius) =>
    cornersWithRadius[corner] ? cornerRadius : 0;
  const cornerRadiusString = cornerRadius.toString();
  const svgCornerRadiusArc = `a${cornerRadiusString},${cornerRadiusString} 0 0 1`;
  const topRightCorner = `${svgCornerRadiusArc} ${cornerRadiusString},${cornerRadiusString} `;
  const bottomRightCorner = `${svgCornerRadiusArc} -${cornerRadiusString},${cornerRadiusString} `;
  const bottomLeftCorner = `${svgCornerRadiusArc} -${cornerRadiusString},-${cornerRadiusString} `;
  const topLeftCorner = `${svgCornerRadiusArc} ${cornerRadiusString},-${cornerRadiusString} `;

  const startingXPoint = position.x * unitSize + padding + getRadius('topLeft');
  const startingYPoint = position.y * unitSize + padding;
  const topLine = size - getRadius('topLeft') - getRadius('topRight');

  const rightLine = size - getRadius('topRight') - getRadius('bottomRight');
  const bottomLine = size - getRadius('bottomRight') - getRadius('bottomLeft');
  const leftLine = size - getRadius('bottomLeft') - getRadius('topLeft');
  return (
    `M ${startingXPoint.toString()},${startingYPoint.toString()} ` +
    `h ${topLine.toString()} ` +
    (cornersWithRadius.topRight ? topRightCorner : '') +
    `v ${rightLine.toString()} ` +
    (cornersWithRadius.bottomRight ? bottomRightCorner : '') +
    `h -${bottomLine.toString()} ` +
    (cornersWithRadius.bottomLeft ? bottomLeftCorner : '') +
    `v -${leftLine.toString()} ` +
    (cornersWithRadius.topLeft ? topLeftCorner : '') +
    `Z`
  );
};

const cornersToRadius = (
  position: Position,
  matrix: number[][],
): CornerRadius => {
  const {x, y} = position;
  const maxY = matrix.length - 1;
  const maxX = matrix[0].length - 1;

  const topOff = y === 0 || matrix[y - 1][x] === 0;
  const rightOff = x === maxX || matrix[y][x + 1] === 0;
  const bottomOff = y === maxY || matrix[y + 1][x] === 0;
  const leftOff = x === 0 || matrix[y][x - 1] === 0;

  return {
    topLeft: topOff && leftOff,
    topRight: topOff && rightOff,
    bottomLeft: bottomOff && leftOff,
    bottomRight: bottomOff && rightOff,
  };
};

const generateDetectionMarkerPath = (
  position: Position,
  cellSize: number,
  options: ResolvedMarkerOptions,
): string => {
  const outerSize = cellSize * 7;
  const padding = cellSize;
  const fillerSize = cellSize * 5;
  const centerPadding = cellSize * 2;
  const innerSize = cellSize * 3;

  const outerRadius = cornerRadiusToPixels(
    options.outerCornerRadius,
    outerSize,
  );
  const fillerRadius = cornerRadiusToPixels(
    options.outerCornerRadius,
    fillerSize,
  );
  const innerRadius = cornerRadiusToPixels(
    options.innerCornerRadius,
    innerSize,
  );

  return (
    generateSquarePath({
      position,
      size: outerSize,
      cornerRadius: outerRadius,
      unitSize: cellSize,
    }) +
    generateSquarePath({
      position,
      size: fillerSize,
      cornerRadius: fillerRadius,
      padding,
      unitSize: cellSize,
    }) +
    generateSquarePath({
      position,
      size: innerSize,
      cornerRadius: innerRadius,
      padding: centerPadding,
      unitSize: cellSize,
    })
  );
};

const generatePathFromMatrix = (
  matrix: number[][],
  size: number,
  detectionMarkerOptions: ResolvedMarkerOptions,
  patternOptions: ResolvedPatternOptions,
): string => {
  if (!matrix.length) throw new Error('Matrix cannot be empty');
  const cellSize = size / matrix.length;
  const patternCornerRadius = cornerRadiusToPixels(
    patternOptions.cornerRadius,
    cellSize,
  );

  const path = matrix.reduce((acc, row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (
        detectionMarkerOptions.connected &&
        isDrawingDetectionMarker(x, y, matrix.length)
      ) {
        if (isDetectionMarkerStartingPoint(x, y, matrix.length)) {
          acc += generateDetectionMarkerPath(
            {x, y},
            cellSize,
            detectionMarkerOptions,
          );
          x += 6;
        }
      } else {
        if (row[x]) {
          acc += generateSquarePath({
            position: {x, y},
            size: cellSize,
            cornerRadius: patternCornerRadius,
            cornersWithRadius: patternOptions.connected
              ? cornersToRadius({x, y}, matrix)
              : undefined,
          });
        }
      }
    }
    return acc;
  }, '');

  return path;
};

export const useQRMatrix = ({
  value,
  size,
  errorCorrectionLevel = ErrorCorrectionLevel.M,
  detectionMarkerOptions,
  patternOptions,
}: QRCodeOptions): Result<string> => {
  // Encode every render: consumers pass inline object literals, so the
  // contents identity is unstable; the encoded string is the stable memo key.
  const encodeResult = tryResult(() => encodeQRCodeContents(value));
  const encoded = encodeResult.status === 'success' ? encodeResult.value : null;

  const matrixResult = useMemo<Result<string> | null>(() => {
    if (encoded === null) {
      return null;
    }
    return tryResult(() => {
      const marker: ResolvedMarkerOptions = {
        connected: detectionMarkerOptions?.connected ?? true,
        outerCornerRadius: clamp01(
          detectionMarkerOptions?.outerCornerRadius ??
            detectionMarkerOptions?.cornerRadius ??
            DEFAULT_CORNER_RADIUS,
        ),
        innerCornerRadius: clamp01(
          detectionMarkerOptions?.innerCornerRadius ??
            detectionMarkerOptions?.cornerRadius ??
            DEFAULT_CORNER_RADIUS,
        ),
      };
      const pattern: ResolvedPatternOptions = {
        connected: patternOptions?.connected ?? false,
        cornerRadius: clamp01(
          patternOptions?.cornerRadius ?? DEFAULT_CORNER_RADIUS,
        ),
      };

      const matrix = createQRMatrix(encoded, errorCorrectionLevel);
      return generatePathFromMatrix(matrix, size, marker, pattern);
    });
    // Primitive deps: equal-valued inline option objects must not invalidate
    // the memo.
  }, [
    encoded,
    size,
    errorCorrectionLevel,
    detectionMarkerOptions?.connected,
    detectionMarkerOptions?.cornerRadius,
    detectionMarkerOptions?.outerCornerRadius,
    detectionMarkerOptions?.innerCornerRadius,
    patternOptions?.connected,
    patternOptions?.cornerRadius,
  ]);

  // Encoding mints a fresh Error each render; cache by message so the failure
  // identity stays stable across re-renders for the component's onError dedup.
  const lastEncodeFailure = useRef<Error | null>(null);
  if (encodeResult.status === 'failure') {
    if (lastEncodeFailure.current?.message !== encodeResult.error.message) {
      lastEncodeFailure.current = encodeResult.error;
    }
    return {status: 'failure', error: lastEncodeFailure.current};
  }

  // Encoding succeeded, so the memo produced a result; this narrows the type.
  return (
    matrixResult ?? {
      status: 'failure',
      error: new Error('Unable to generate QR matrix'),
    }
  );
};
