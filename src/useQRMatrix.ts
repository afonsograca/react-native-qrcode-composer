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

interface PathResult {
  cellSize: number;
  path: string;
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

const generateSquarePath = (
  x: number,
  y: number,
  size: number,
  cornerRadius: number,
  padding: number = 0,
): string =>
  `M ${x + padding + cornerRadius},${y + padding} ` +
  `h ${size - 2 * cornerRadius} a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} ` +
  `v ${size - 2 * cornerRadius} a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} ` +
  `h -${size - 2 * cornerRadius} a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},-${cornerRadius} ` +
  `v -${size - 2 * cornerRadius} a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},-${cornerRadius} Z`;

const generateDetectionMarkerPath = (
  position: [number, number],
  cellSize: number,
  options?: DetectionMarkerOptions,
): string => {
  const [px, py] = [position[0] * cellSize, position[1] * cellSize];

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
    generateSquarePath(px, py, outerSize, outerRadius) +
    generateSquarePath(px, py, fillerSize, fillerRadius, padding) +
    generateSquarePath(px, py, innerSize, innerRadius, centerPadding)
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
            [x, y],
            cellSize,
            detectionMarkerOptions,
          );
          x += 6;
        }
      } else {
        if (row[x]) {
          acc += generateSquarePath(
            x * cellSize,
            y * cellSize,
            cellSize,
            patternCornerRadius,
          );
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
