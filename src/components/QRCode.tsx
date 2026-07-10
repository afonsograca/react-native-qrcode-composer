import React, {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Defs, Path, Rect, LinearGradient, Stop} from 'react-native-svg';
import {useQRMatrix} from '../hooks/useQRMatrix';
import {Logo} from './Logo';
import {type QRCodeProps} from '../types';
import {svgLocalId} from '../utils/svgId';

export const DEFAULT_TEST_ID = 'react-native-qrcode-composer';

// Instance counter instead of React.useId: peerDependencies allow React 17.
let instanceCounter = 0;

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
      const [instanceId] = useState(() => ++instanceCounter);
      const matrixResult = useQRMatrix({
        value,
        size,
        errorCorrectionLevel: style?.errorCorrectionLevel,
        detectionMarkerOptions: style?.detectionMarkerOptions,
        patternOptions: style?.patternOptions,
      });
      const {
        color = 'black',
        backgroundColor = 'white',
        quietZone = 0,
        linearGradient,
        gradientDirection = ['0%', '0%', '100%', '100%'],
      } = style ?? {};

      const handleRef = useCallback(
        (instance: Svg | null) => {
          assignRef(ref, instance);
          assignRef(getRef, instance);
        },
        [ref, getRef],
      );

      const error =
        matrixResult.status === 'failure' ? matrixResult.error : undefined;

      const lastReportedError = useRef<Error | null>(null);
      useEffect(() => {
        if (error === undefined) {
          lastReportedError.current = null;
          return;
        }
        if (lastReportedError.current !== error) {
          lastReportedError.current = error;
          onError?.(error);
        }
      }, [error, onError]);

      if (matrixResult.status !== 'success') {
        return null;
      }

      const path = matrixResult.value;
      const actualSize = size + quietZone * 2;
      const gradientId = svgLocalId('grad', instanceId);
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
                id={gradientId}
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
          <Rect
            x={-quietZone}
            y={-quietZone}
            width={actualSize}
            height={actualSize}
            fill={backgroundColor}
            rx={style?.cornerRadius}
            ry={style?.cornerRadius}
          />
          <Path
            d={path}
            fill={linearGradient !== undefined ? `url(#${gradientId})` : color}
            fillRule="evenodd"
            testID={`${testID}.path`}
          />
          {logo !== undefined && (
            <Logo
              qrCodeSize={size}
              testID={`${testID}.logo`}
              instanceId={instanceId}
              logo={logo}
              logoStyle={logoStyle}
            />
          )}
        </Svg>
      );
    },
  ),
);

QRCode.displayName = 'QRCode';
