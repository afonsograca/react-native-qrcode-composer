import React, {useMemo} from 'react';
import type {SvgProps} from 'react-native-svg';
import {G, Defs, ClipPath, Rect, Image} from 'react-native-svg';
import type {LogoProp, LogoStyle} from '../types';
import type {ImageSourcePropType} from 'react-native';

const isImageSourcePropType = (logo: LogoProp): logo is ImageSourcePropType =>
  typeof logo === 'number' || (typeof logo === 'object' && 'uri' in logo);

const isReactComponent = (
  logo: LogoProp,
): logo is React.FunctionComponent<SvgProps> => typeof logo === 'function';

export const useLogo = (
  qrCodeSize: number,
  logo?: LogoProp,
  logoStyle?: LogoStyle,
) => {
  const logoComponent = useMemo(() => {
    if (logo === undefined) {
      return null;
    }
    const {
      size = qrCodeSize * 0.2,
      backgroundColor = 'transparent',
      margin = 2,
      borderRadius = 0,
    } = logoStyle ?? {};

    const marginOffset = margin * 2;
    const position = (qrCodeSize - size - marginOffset) / 2;
    const backgroundSize = size + marginOffset;
    const backgroundBorderRadius = borderRadius * (backgroundSize / 2);

    const LogoElement = isReactComponent(logo) ? logo : undefined;
    const logoImage = isImageSourcePropType(logo) ? logo : undefined;

    return (
      <G x={position} y={position}>
        <Defs>
          <ClipPath id="clip-logo-background">
            <Rect
              width={backgroundSize}
              height={backgroundSize}
              rx={backgroundBorderRadius}
              ry={backgroundBorderRadius}
            />
          </ClipPath>
          <ClipPath id="clip-logo">
            <Rect
              width={size}
              height={size}
              rx={borderRadius}
              ry={borderRadius}
            />
          </ClipPath>
        </Defs>
        <G>
          <Rect
            width={backgroundSize}
            height={backgroundSize}
            fill={backgroundColor}
            clipPath="url(#clip-logo-background)"
          />
        </G>
        <G x={margin} y={margin}>
          {LogoElement !== undefined ? (
            <LogoElement width={size} height={size} />
          ) : null}
          {logoImage !== undefined ? (
            <Image
              width={size}
              height={size}
              href={logoImage}
              clipPath="url(#clip-logo)"
            />
          ) : null}
        </G>
      </G>
    );
  }, [logo, logoStyle, qrCodeSize]);
  return {logoComponent};
};
