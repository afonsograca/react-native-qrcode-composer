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
import {type QRCodeProps} from './types';

export const QRCode = ({
  value = 'QR code message',
  size = 100,
  logo,
  logoStyle,
  style,
  getRef,
  onError,
}: QRCodeProps) => {
  const [error, setError] = useState<string | null>(null);
  const qrCodePath = useQRCodeGenerator({value, size, ...style}, error => {
    setError(error.message);
    onError?.(error);
  });
  const {
    color = 'black',
    backgroundColor = 'white',
    quietZone = 0,
    linearGradient,
    gradientDirection = ['0%', '0%', '100%', '100%'],
  } = style ?? {};
  const {logoComponent} = useLogo(size, logo, logoStyle);

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
        {linearGradient !== undefined ? (
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
        ) : null}
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
            fill={linearGradient !== undefined ? 'url(#grad)' : color}
            fillRule="evenodd"
          />
        </G>
        {logoComponent !== null && logoComponent}
      </Svg>
    );
  } else if (error != null && !onError) {
    return <Text>{error}</Text>;
  } else {
    return null;
  }
};
