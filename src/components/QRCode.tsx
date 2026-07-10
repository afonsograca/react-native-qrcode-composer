import React, {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Defs, G, Path, Rect, LinearGradient, Stop} from 'react-native-svg';
import {useQRMatrix} from '../hooks/useQRMatrix';
import {useLogo} from '../hooks/useLogo';
import {type QRCodeProps} from '../types';
import {encodeQRCodeContents} from '../types/QRContents';
import type {QRCodeContents} from '../types/QRContents';
import type {Result} from '../types/result';
import {svgLocalId} from '../utils/svgId';

export const DEFAULT_TEST_ID = 'react-native-qrcode-composer';

// Instance counter instead of React.useId: peerDependencies allow React 17.
let instanceCounter = 0;

const encodeContents = (contents: QRCodeContents): Result<string> => {
  try {
    return {status: 'success', value: encodeQRCodeContents(contents)};
  } catch (error) {
    return {
      status: 'failure',
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

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
      // Not memoized on `value`: consumers pass inline literals; the encoded
      // string is the stable matrix-memo key.
      const encodeResult = encodeContents(value);
      const matrixResult = useQRMatrix({
        value: encodeResult.status === 'success' ? encodeResult.value : '',
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
      const {logoComponent} = useLogo({
        qrCodeSize: size,
        testID: `${testID}.logo`,
        instanceId,
        logo,
        logoStyle,
      });

      const handleRef = useCallback(
        (instance: Svg | null) => {
          assignRef(ref, instance);
          assignRef(getRef, instance);
        },
        [ref, getRef],
      );

      const error =
        encodeResult.status === 'failure'
          ? encodeResult.error
          : matrixResult.status === 'failure'
            ? matrixResult.error
            : undefined;

      const lastReportedError = useRef<Error | null>(null);
      useEffect(() => {
        if (error === undefined) {
          lastReportedError.current = null;
          return;
        }
        // Compare by message: the encode branch creates a fresh Error each
        // render.
        if (lastReportedError.current?.message !== error.message) {
          lastReportedError.current = error;
          onError?.(error);
        }
      }, [error, onError]);

      if (error !== undefined || matrixResult.status !== 'success') {
        return null;
      }

      const {path} = matrixResult.value;
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
              fill={
                linearGradient !== undefined ? `url(#${gradientId})` : color
              }
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
