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

  const outerRadius = outerSize * outerCornerRadiusPercentage * MAX_CORNER_RADIUS;
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
  let path = '';
  const cellSize = size / matrix.length;
  const patternCornerRadius = cellSize * (patternOptions?.cornerRadius ?? 0.0);
  const cornerRadius = cellSize * (detectionMarkerOptions?.cornerRadius ?? 0);

  matrix.forEach((row, y) => {
    let startSegment = null;

    for (let x = 0; x < row.length; x++) {
      if (isDrawingDetectionMarker(x, y, matrix.length)) {
        if (isDetectionMarkerStartingPoint(x, y, matrix.length)) {
          path += generateDetectionMarkerPath(
            [x, y],
            cellSize,
            detectionMarkerOptions,
          );
          x += 6;
        }
      } else {
        if (row[x]) {
          // This module is black
          if (startSegment === null) {
            startSegment = x;
          }
          if (x === row.length - 1 || !row[x + 1]) {
            // Last in a row or next module is white: Draw segment from startSegment to x
            const startX = startSegment * cellSize;
            const endX = (x + 1) * cellSize;
            const topY = y * cellSize;
            const bottomY = (y + 1) * cellSize;
            path +=
              `M${startX} ${topY + cornerRadius} ` +
              `A${cornerRadius},${cornerRadius} 0 0 1 ${startX + cornerRadius},${topY} ` +
              `H${endX - cornerRadius} ` +
              `A${cornerRadius},${cornerRadius} 0 0 1 ${endX},${topY + cornerRadius} ` +
              `V${bottomY - cornerRadius} ` +
              `A${cornerRadius},${cornerRadius} 0 0 1 ${endX - cornerRadius},${bottomY} ` +
              `H${startX + cornerRadius} ` +
              `A${cornerRadius},${cornerRadius} 0 0 1 ${startX},${bottomY - cornerRadius} Z `;
            startSegment = null; // Reset start of segment
          }
        } else {
          startSegment = null; // Not continuing a segment
        }
      }
    }
  });

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
