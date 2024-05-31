import React, {useMemo} from 'react';
import {G, Defs, ClipPath, Rect, Image} from 'react-native-svg';
import type {LogoProp} from '../types';

export const useLogo = (
  size: number,
  logoSize: number,
  logoBackgroundColor: string,
  logoMargin: number,
  logoBorderRadius: number,
  logo?: LogoProp,
) => {
  const logoComponent = useMemo(() => {
    const marginOffset = logoMargin * 2;
    const logoPosition = (size - logoSize - marginOffset) / 2;
    const logoBackgroundSize = logoSize + marginOffset;
    const logoBackgroundBorderRadius =
      logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

    const LogoElement = typeof logo === 'function' ? logo : undefined;
    const logoURI = typeof logo === 'object' ? logo.uri : undefined;

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
          {LogoElement ? (
            <LogoElement width={logoSize} height={logoSize} />
          ) : (
            <Image
              width={logoSize}
              height={logoSize}
              href={logoURI}
              clipPath="url(#clip-logo)"
            />
          )}
        </G>
      </G>
    );
  }, [logo, logoSize, logoBackgroundColor, logoMargin, logoBorderRadius, size]);
  return {logoComponent};
};
