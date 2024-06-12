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

const logoBackgroundClipPath = 'logo-background-clip-path';
const logoClipPath = 'logo-clip-path';

export const useLogo = (
  qrCodeSize: number,
  testId: string,
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
      margin = 0,
      borderRadius = 0,
    } = logoStyle ?? {};

    const marginOffset = margin * 2;
    const position = (qrCodeSize - size - marginOffset) / 2;
    const backgroundSize = size + marginOffset;
    const backgroundBorderRadius = borderRadius * (backgroundSize / 2);

    const LogoElement = isReactComponent(logo) ? logo : undefined;
    const logoImage = isImageSourcePropType(logo) ? logo : undefined;

    return (
      <G x={position} y={position} testID={testId}>
        <Defs>
          <ClipPath id={logoBackgroundClipPath}>
            <Rect
              testID={`rect.${logoBackgroundClipPath}`}
              width={backgroundSize}
              height={backgroundSize}
              rx={backgroundBorderRadius}
              ry={backgroundBorderRadius}
            />
          </ClipPath>
          <ClipPath id={logoClipPath}>
            <Rect
              testID={`rect.${logoClipPath}`}
              width={size}
              height={size}
              rx={borderRadius}
              ry={borderRadius}
            />
          </ClipPath>
        </Defs>
        <G>
          <Rect
            testID="rect.logo-background"
            width={backgroundSize}
            height={backgroundSize}
            fill={backgroundColor}
            clipPath={`url(#${logoBackgroundClipPath})`}
          />
        </G>
        <G x={margin} y={margin} testID="g.logo-container">
          {LogoElement !== undefined ? (
            <LogoElement
              width={size}
              height={size}
              clipPath={`url(#${logoClipPath})`}
            />
          ) : null}
          {logoImage !== undefined ? (
            <Image
              width={size}
              height={size}
              href={logoImage}
              clipPath={`url(#${logoClipPath})`}
            />
          ) : null}
        </G>
      </G>
    );
  }, [logo, logoStyle, qrCodeSize]);
  return {logoComponent};
};
