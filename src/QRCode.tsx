import React, { useMemo, useState, Ref } from 'react';
import Svg, { Defs, G, Path, Rect, Image, ClipPath, LinearGradient, Stop, Text } from 'react-native-svg';
import { ErrorCorrectionLevel, useQRCodeGenerator } from './useQRMatrix';

interface LogoProps {
  size: number,
  logo?: string,
  logoSize: number,
  logoBackgroundColor: string,
  logoMargin: number,
  logoBorderRadius: number
}

const renderLogo = ({
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius
}: LogoProps) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2;
  const logoBackgroundSize = logoSize + logoMargin * 2;
  const logoBackgroundBorderRadius = logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id="clip-logo-background">
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={logoBackgroundColor}
          clipPath="url(#clip-logo-background)"
        />
      </G>
      <G x={logoMargin} y={logoMargin}>
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid slice"
          href={logo}
          clipPath="url(#clip-logo)"
        />
      </G>
    </G>
  );
}

interface QRCodeProps {
  value?: string,
  size?: number,
  color?: string,
  backgroundColor?: string,
  logo?: string,
  logoSize?: number,
  logoBackgroundColor?: string,
  logoMargin?: number,
  logoBorderRadius?: number,
  quietZone?: number,
  enableLinearGradient?: boolean,
  gradientDirection?: [string, string, string, string],
  linearGradient?: string[],
  errorCorrectionLevel?: ErrorCorrectionLevel,
  getRef?: Ref<Svg>,
  onError?: (error: Error) => void
}

export const QRCode = ({
  value = 'QR code message',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 2,
  logoBorderRadius = 0,
  quietZone = 0,
  enableLinearGradient = false,
  gradientDirection = ['0%', '0%', '100%', '100%'],
  linearGradient = ['white', 'black'],
  errorCorrectionLevel = ErrorCorrectionLevel.M,
  getRef,
  onError
}: QRCodeProps) => {
  const [error, setError] = useState<string | null>(null);
  const qrCodePath = useQRCodeGenerator({ value, size, errorCorrectionLevel: errorCorrectionLevel }, error => {
    setError(error.message);
    onError?.(error);
  });
  const memoizedLogo = useMemo(() => renderLogo({
    size, logo, logoSize, logoBackgroundColor, logoMargin, logoBorderRadius
  }), [size, logo, logoSize, logoBackgroundColor, logoMargin, logoBorderRadius]);

  if (qrCodePath) {
  const { path, cellSize } = qrCodePath;
  return (
    <Svg
      ref={getRef}
      viewBox={[ -quietZone, -quietZone, size + quietZone * 2, size + quietZone * 2 ].join(' ')}
      width={size}
      height={size}
    >
      <Defs>
        <LinearGradient
          id="grad"
          x1={gradientDirection[0]}
          y1={gradientDirection[1]}
          x2={gradientDirection[2]}
          y2={gradientDirection[3]}
        >
          <Stop offset="0" stopColor={linearGradient[0]} stopOpacity="1" />
          <Stop offset="1" stopColor={linearGradient[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <G>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2}
          fill={backgroundColor}
        />
      </G>
      <G>
        <Path
          d={path}
          fill={enableLinearGradient ? 'url(#grad)' : color}
          fillRule="evenodd"
        />
      </G>
      {logo && memoizedLogo}
    </Svg>
  );
  } else if (error && !onError) {
    return <Text>{error}</Text>;
  } else {
    return null;
  }
}
