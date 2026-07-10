import React, {useCallback, useEffect} from 'react';
import Svg, {Defs, G, Path, Rect, LinearGradient, Stop} from 'react-native-svg';
import {useQRMatrix} from '../hooks/useQRMatrix';
import {useLogo} from '../hooks/useLogo';
import {type QRCodeProps} from '../types';
import {encodeQRCodeContents} from '../types/QRContents';

export const DEFAULT_TEST_ID = 'react-native-qrcode-composer';

const assignRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
};

export const QRCode = React.memo(
  React.forwardRef<Svg, QRCodeProps>(
    (
      {
        value,
        size = 100,
        logo,
        logoStyle,
        style,
        getRef,
        onError,
        testID = DEFAULT_TEST_ID,
      }: QRCodeProps,
      ref,
    ) => {
      const matrixResult = useQRMatrix({
        value: encodeQRCodeContents(value),
        size,
        ...style,
      });
      const {
        color = 'black',
        backgroundColor = 'white',
        quietZone = 0,
        linearGradient,
        gradientDirection = ['0%', '0%', '100%', '100%'],
      } = style ?? {};
      const {logoComponent} = useLogo(size, `${testID}.logo`, logo, logoStyle);

      const handleRef = useCallback(
        (instance: Svg | null) => {
          assignRef(ref, instance);
          assignRef(getRef, instance);
        },
        [ref, getRef],
      );

      useEffect(() => {
        if (matrixResult.status === 'failure') {
          onError?.(matrixResult.error);
        }
      }, [matrixResult, onError]);

      if (matrixResult.status !== 'success') {
        return null;
      }

      const {path} = matrixResult.value;
      const actualSize = size + quietZone * 2;
      return (
        <Svg
          ref={handleRef}
          viewBox={[-quietZone, -quietZone, actualSize, actualSize].join(' ')}
          width={actualSize}
          height={actualSize}
          testID={`${testID}.qrcode`}
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
                <Stop
                  offset="0"
                  stopColor={linearGradient[0]}
                  stopOpacity="1"
                />
                <Stop
                  offset="1"
                  stopColor={linearGradient[1]}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
          ) : null}
          <G>
            <Rect
              x={-quietZone}
              y={-quietZone}
              width={actualSize}
              height={actualSize}
              fill={backgroundColor}
              rx={style?.cornerRadius}
              ry={style?.cornerRadius}
            />
          </G>
          <G>
            <Path
              d={path}
              fill={linearGradient !== undefined ? 'url(#grad)' : color}
              fillRule="evenodd"
              testID={`${testID}.path`}
            />
          </G>
          {logoComponent !== null && logoComponent}
        </Svg>
      );
    },
  ),
);

QRCode.displayName = 'QRCode';
