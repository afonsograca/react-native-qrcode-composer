import React from 'react';
import type {SvgProps} from 'react-native-svg';
import {G, Defs, ClipPath, Rect, Image} from 'react-native-svg';
import type {LogoProp, LogoStyle} from '../types';
import type {ImageSourcePropType} from 'react-native';
import {svgLocalId} from '../utils/svgId';

const isImageSourcePropType = (logo: LogoProp): logo is ImageSourcePropType =>
  typeof logo === 'number' || (typeof logo === 'object' && 'uri' in logo);

const isReactComponent = (
  logo: LogoProp,
): logo is React.FunctionComponent<SvgProps> => typeof logo === 'function';

const logoBackgroundClipPath = 'logo-background-clip-path';
const logoClipPath = 'logo-clip-path';

interface LogoProps {
  qrCodeSize: number;
  testID: string;
  instanceId: number;
  logo?: LogoProp;
  logoStyle?: LogoStyle;
}

export const Logo = ({
  qrCodeSize,
  testID,
  instanceId,
  logo,
  logoStyle,
}: LogoProps) => {
  if (logo === undefined) {
    return null;
  }
  const logoBackgroundClipPathId = svgLocalId(
    logoBackgroundClipPath,
    instanceId,
  );
  const logoClipPathId = svgLocalId(logoClipPath, instanceId);
  const {
    size = qrCodeSize * 0.2,
    backgroundColor = 'transparent',
    margin = 0,
    borderRadius = 0,
  } = logoStyle ?? {};

  const marginOffset = margin * 2;
  const position = (qrCodeSize - size - marginOffset) / 2;
  const backgroundSize = size + marginOffset;
  const backgroundBorderRadius = borderRadius + margin;

  const LogoElement = isReactComponent(logo) ? logo : undefined;
  const logoImage = isImageSourcePropType(logo) ? logo : undefined;

  return (
    <G x={position} y={position} testID={testID}>
      <Defs>
        <ClipPath id={logoBackgroundClipPathId}>
          <Rect
            testID={`rect.${logoBackgroundClipPath}`}
            width={backgroundSize}
            height={backgroundSize}
            rx={backgroundBorderRadius}
            ry={backgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id={logoClipPathId}>
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
          clipPath={`url(#${logoBackgroundClipPathId})`}
        />
      </G>
      <G x={margin} y={margin} testID="g.logo-container">
        {LogoElement !== undefined ? (
          <LogoElement
            width={size}
            height={size}
            clipPath={`url(#${logoClipPathId})`}
          />
        ) : null}
        {logoImage !== undefined ? (
          <Image
            width={size}
            height={size}
            href={logoImage}
            clipPath={`url(#${logoClipPathId})`}
          />
        ) : null}
      </G>
    </G>
  );
};
