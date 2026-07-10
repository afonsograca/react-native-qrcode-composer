import React from 'react';
import type Svg from 'react-native-svg';
import {render, renderHook, screen} from '@testing-library/react-native';
import {DEFAULT_TEST_ID, QRCode} from '../QRCode';
import type {QRCodeProps} from '../../types';
import Logo from 'logo.svg';
import * as UseQRMatrixHook from '../../hooks/useQRMatrix';
import {useQRMatrix} from '../../hooks/useQRMatrix';

const DEFAULT_VALUE = 'QR code message';

describe('QRCode', () => {
  afterEach(jest.restoreAllMocks);

  describe('Snapshots', () => {
    it('renders a default QR code', () => {
      const qrCode = render(
        <QRCode value={DEFAULT_VALUE} />,
      ).toJSON() as unknown;

      expect(qrCode).toMatchSnapshot();
    });

    it('renders a QR code with a logo', () => {
      const qrCode = render(
        <QRCode value={DEFAULT_VALUE} logo={Logo} />,
      ).toJSON() as unknown;

      expect(qrCode).toMatchSnapshot();
    });
  });

  it('renders without error', () => {
    render(<QRCode value={DEFAULT_VALUE} />);

    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.error`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.logo`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.qrcode`)).not.toBeNull();
  });

  it('renders with custom size', () => {
    const size = 200;
    render(<QRCode value={DEFAULT_VALUE} size={size} />);

    const qrCodeProps = screen.queryByTestId(
      `${DEFAULT_TEST_ID}.qrcode`,
    )?.props;

    expect(qrCodeProps).toEqual(
      expect.objectContaining({width: size, height: size}),
    );
  });

  it('renders with custom value', () => {
    const value = 'Custom QR code message';
    const size = 100;

    const {result} = renderHook(() => useQRMatrix({value, size}));
    const qrMatrixResult = result.current;

    render(<QRCode value={value} size={100} />);

    const pathProps = screen.queryByTestId(`${DEFAULT_TEST_ID}.path`)?.props;

    if (qrMatrixResult.status !== 'success') {
      throw new Error('QR Matrix generation failed');
    }
    expect(qrMatrixResult.status).toBe('success');
    expect(pathProps).toEqual(
      expect.objectContaining({d: qrMatrixResult.value}),
    );
  });

  it('renders with custom logo', () => {
    render(<QRCode value={DEFAULT_VALUE} logo={Logo} />);

    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.error`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.logo`)).not.toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.qrcode`)).not.toBeNull();
  });

  it('forwards the ref to the underlying Svg', () => {
    const ref = React.createRef<Svg>();
    const getRef = jest.fn();

    render(<QRCode value={DEFAULT_VALUE} ref={ref} getRef={getRef} />);

    expect(ref.current).not.toBeNull();
    expect(getRef).toHaveBeenCalledWith(ref.current);
  });

  describe('when there is an error', () => {
    const error = new Error('QRCodeError');

    it('calls onError and renders nothing', () => {
      const onError = jest.fn();
      jest.spyOn(UseQRMatrixHook, 'useQRMatrix').mockReturnValue({
        status: 'failure',
        error: error,
      });

      const {toJSON} = render(
        <QRCode value={DEFAULT_VALUE} onError={onError} />,
      );

      expect(onError).toHaveBeenCalledWith(error);
      expect(toJSON()).toBeNull();
    });

    it('renders nothing when onError is not provided', () => {
      jest.spyOn(UseQRMatrixHook, 'useQRMatrix').mockReturnValue({
        status: 'failure',
        error: error,
      });

      const {toJSON} = render(<QRCode value={DEFAULT_VALUE} />);

      expect(toJSON()).toBeNull();
      expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.error`)).toBeNull();
    });

    it('reports the same error only once across re-renders', () => {
      const onError = jest.fn();
      jest.spyOn(UseQRMatrixHook, 'useQRMatrix').mockReturnValue({
        status: 'failure',
        error: error,
      });

      const {rerender} = render(
        <QRCode
          value={DEFAULT_VALUE}
          onError={() => {
            onError();
          }}
        />,
      );
      rerender(
        <QRCode
          value={DEFAULT_VALUE}
          onError={() => {
            onError();
          }}
        />,
      );
      rerender(
        <QRCode
          value={DEFAULT_VALUE}
          onError={() => {
            onError();
          }}
        />,
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('when encoding the value fails', () => {
    const invalidValue = {
      type: 'vcard',
      fullName: 'Jane Doe',
      birthday: 'not-a-date',
    } as unknown as QRCodeProps['value'];

    it('calls onError and renders nothing instead of throwing', () => {
      const onError = jest.fn();

      const {toJSON} = render(
        <QRCode value={invalidValue} onError={onError} />,
      );

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(toJSON()).toBeNull();
    });

    it('renders nothing when onError is not provided', () => {
      const {toJSON} = render(<QRCode value={invalidValue} />);

      expect(toJSON()).toBeNull();
    });
  });
});
