import React, {useState} from 'react';
import Svg, {
  Defs,
  G,
  Path,
  Rect,
  LinearGradient,
  Stop,
  Text,
} from 'react-native-svg';
import {useQRCodeGenerator} from './hooks/useQRMatrix';
import {useLogo} from './hooks/useLogo';
import {ErrorCorrectionLevel, type QRCodeProps} from './types';

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
  onError,
}: QRCodeProps) => {
  const [error, setError] = useState<string | null>(null);
  const qrCodePath = useQRCodeGenerator(
    {value, size, errorCorrectionLevel: errorCorrectionLevel},
    error => {
      setError(error.message);
      onError?.(error);
    },
  );
  const {logoComponent} = useLogo(
    size,
    logoSize,
    logoBackgroundColor,
    logoMargin,
    logoBorderRadius,
    logo,
  );

  if (qrCodePath) {
    const {path} = qrCodePath;
    return (
      <Svg
        ref={getRef}
        viewBox={[
          -quietZone,
          -quietZone,
          size + quietZone * 2,
          size + quietZone * 2,
        ].join(' ')}
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
        {logo && logoComponent}
      </Svg>
    );
  } else if (error != null && !onError) {
    return <Text>{error}</Text>;
  } else {
    return null;
  }
};
