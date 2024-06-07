import {renderHook} from '@testing-library/react-native';
import {useQRMatrix} from 'hooks/useQRMatrix';
import {ErrorCorrectionLevel} from 'types';
import QRCode from 'qrcode';

describe('useQRCodeGenerator', () => {
  afterEach(jest.restoreAllMocks);

  it('should generate QR code path from matrix', () => {
    const value = 'Hello, World!';
    const size = 200;
    const errorCorrectionLevel = ErrorCorrectionLevel.M;
    const detectionMarkerOptions = {
      outerCornerRadius: 0.2,
      innerCornerRadius: 0.3,
      connected: true,
    };
    const patternOptions = {
      cornerRadius: 0.1,
      connected: true,
    };

    const {result} = renderHook(() =>
      useQRMatrix({
        value,
        size,
        errorCorrectionLevel,
        detectionMarkerOptions,
        patternOptions,
      }),
    );
    const qrMatrixResult = result.current;

    if (qrMatrixResult.status !== 'success') {
      throw new Error('QR Matrix generation failed');
    }

    expect(qrMatrixResult.value.path).toMatchSnapshot();
  });

  it('should handle error and call onError', () => {
    const value = '';
    const size = 200;
    const error = new Error('Matrix cannot be empty');

    jest.spyOn(QRCode, 'create').mockImplementation(() => {
      throw error;
    });

    const {result} = renderHook(() =>
      useQRMatrix({
        value,
        size,
      }),
    );
    const qrMatrixResult = result.current;

    if (qrMatrixResult.status === 'success') {
      throw new Error('QR Matrix generation failed');
    }
    expect(qrMatrixResult.error).toBe(error);
  });
});
