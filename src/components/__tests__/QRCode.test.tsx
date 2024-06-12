import React from 'react';
import {render, renderHook, screen} from '@testing-library/react-native';
import {DEFAULT_TEST_ID, QRCode} from '../QRCode';
import Logo from 'logo.svg';
import * as UseQRMatrixHook from '../../hooks/useQRMatrix';
import {useQRMatrix} from '../../hooks/useQRMatrix';

describe('QRCode', () => {
  afterEach(jest.restoreAllMocks);

  describe('Snapshots', () => {
    it('renders a default QR code', () => {
      const qrCode = render(<QRCode />).toJSON() as unknown;

      expect(qrCode).toMatchSnapshot();
    });

    it('renders a QR code with a logo', () => {
      const qrCode = render(<QRCode logo={Logo} />).toJSON() as unknown;

      expect(qrCode).toMatchSnapshot();
    });
  });

  it('renders without error', () => {
    render(<QRCode />);

    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.error`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.logo`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.qrcode`)).not.toBeNull();
  });

  it('renders with custom size', () => {
    const size = 200;
    render(<QRCode size={size} />);

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
      expect.objectContaining({d: qrMatrixResult.value.path}),
    );
  });

  it('renders with custom logo', () => {
    render(<QRCode logo={Logo} />);

    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.error`)).toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.logo`)).not.toBeNull();
    expect(screen.queryByTestId(`${DEFAULT_TEST_ID}.qrcode`)).not.toBeNull();
  });

  describe('when there is an error', () => {
    const error = new Error('QRCodeError');

    it('if onError is set, no text message should be displayed', () => {
      const onError = jest.fn();
      jest.spyOn(UseQRMatrixHook, 'useQRMatrix').mockReturnValue({
        status: 'failure',
        error: error,
      });

      render(<QRCode onError={onError} />);

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('if there is no onError, the error message is displayed', () => {
      jest.spyOn(UseQRMatrixHook, 'useQRMatrix').mockReturnValue({
        status: 'failure',
        error: error,
      });

      render(<QRCode />);

      expect(screen.getByTestId(`${DEFAULT_TEST_ID}.error`)).toHaveTextContent(
        error.message,
      );
    });
  });
});
