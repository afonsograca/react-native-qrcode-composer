import {useMemo} from 'react';
import QRCode from 'qrcode';

export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

const DEFAULT_CORNER_RADIUS = 0.0;
const MAX_CORNER_RADIUS = 0.5;

interface PatternOptions {
  connected?: boolean;
  cornerRadius?: number;
}

interface DetectionMarkerOptions {
  connected?: boolean;
  cornerRadius?: number;
  outerCornerRadius?: number;
  innerCornerRadius?: number;
}

interface QRCodeOptions {
  value: string;
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  detectionMarkerOptions?: DetectionMarkerOptions;
  patternOptions?: PatternOptions;
}

interface CornerRadius {
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

interface PathResult {
  cellSize: number;
  path: string;
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
  const size = Math.sqrt(arr.length);
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
  const topRightCorner = `a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} `;
  const bottomRightCorner = `a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} `;
  const bottomLeftCorner = `a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},-${cornerRadius} `;
  const topLeftCorner = `a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},-${cornerRadius} `;

  return (
    `M ${position.x * unitSize + padding + getRadius('topLeft')},${position.y * unitSize + padding} ` +
    `h ${size - getRadius('topLeft') - getRadius('topRight')} ` +
    (cornersWithRadius.topRight ? topRightCorner : '') +
    `v ${size - getRadius('topRight') - getRadius('bottomRight')} ` +
    (cornersWithRadius.bottomRight ? bottomRightCorner : '') +
    `h -${size - getRadius('bottomRight') - getRadius('bottomLeft')} ` +
    (cornersWithRadius.bottomLeft ? bottomLeftCorner : '') +
    `v -${size - getRadius('bottomLeft') - getRadius('topLeft')} ` +
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
  options?: DetectionMarkerOptions,
): string => {
  const outerSize = cellSize * 7;
  const padding = cellSize;
  const fillerSize = cellSize * 5;
  const centerPadding = cellSize * 2;
  const innerSize = cellSize * 3;
  const outerCornerRadiusPercentage = Math.max(
    0,
    Math.min(
      1,
      options?.outerCornerRadius ??
        options?.cornerRadius ??
        DEFAULT_CORNER_RADIUS,
    ),
  );
  const innerCornerRadiusPercentage = Math.max(
    0,
    Math.min(
      1,
      options?.innerCornerRadius ??
        options?.cornerRadius ??
        DEFAULT_CORNER_RADIUS,
    ),
  );

  const outerRadius =
    outerSize * outerCornerRadiusPercentage * MAX_CORNER_RADIUS;
  const fillerRadius =
    fillerSize * outerCornerRadiusPercentage * MAX_CORNER_RADIUS;
  const innerRadius =
    innerSize * innerCornerRadiusPercentage * MAX_CORNER_RADIUS;

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
  detectionMarkerOptions?: DetectionMarkerOptions,
  patternOptions?: PatternOptions,
): PathResult => {
  if (!matrix.length) throw new Error('Matrix cannot be empty');
  const cellSize = size / matrix.length;
  const patternCornerRadiusPercentage = Math.max(
    0,
    Math.min(1, patternOptions?.cornerRadius ?? DEFAULT_CORNER_RADIUS),
  );
  const patternCornerRadius =
    cellSize * patternCornerRadiusPercentage * MAX_CORNER_RADIUS;

  const path = matrix.reduce((acc, row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (
        (detectionMarkerOptions?.connected ?? true) &&
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
            cornersWithRadius: patternOptions?.connected ? cornersToRadius({x, y}, matrix) : undefined,
          });
        }
      }
    }
    return acc;
  }, '');

  return {cellSize, path};
};

export const useQRCodeGenerator = (
  options: QRCodeOptions,
  onError: (error: Error) => void,
): PathResult | null => {
  return useMemo(() => {
    try {
      const matrix = createQRMatrix(
        options.value,
        options.errorCorrectionLevel,
      );
      return generatePathFromMatrix(
        matrix,
        options.size,
        options.detectionMarkerOptions,
        options.patternOptions,
      );
    } catch (error) {
      onError(error);
      return null;
    }
  }, [options.value, options.size, options.errorCorrectionLevel]);
};
