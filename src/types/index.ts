import type {Ref} from 'react';
import type {ColorValue, ImageSourcePropType} from 'react-native';
import type {NumberProp, SvgProps} from 'react-native-svg';
import type Svg from 'react-native-svg';
import type {QRCodeContents} from './QRContents';

export type {
  QRCodeContents,
  PlainText,
  URLContent,
  Email,
  Phone,
  SMS,
  SecurityType,
  WiFi,
  GeolocationContent,
  VCard,
  MeCard,
  CalendarEvent,
} from './QRContents';

export type LogoProp = ImageSourcePropType | React.FunctionComponent<SvgProps>;

export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export interface PatternOptions {
  connected?: boolean;
  cornerRadius?: number;
}

export interface DetectionMarkerOptions {
  connected?: boolean;
  cornerRadius?: number;
  outerCornerRadius?: number;
  innerCornerRadius?: number;
}

export interface QRCodeStyle {
  color?: ColorValue;
  backgroundColor?: ColorValue;
  quietZone?: number;
  cornerRadius?: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  linearGradient?: [ColorValue, ColorValue];
  gradientDirection?: [NumberProp, NumberProp, NumberProp, NumberProp];
  detectionMarkerOptions?: DetectionMarkerOptions;
  patternOptions?: PatternOptions;
}

export interface LogoStyle {
  size?: number;
  backgroundColor?: ColorValue;
  margin?: number;
  borderRadius?: number;
}

export interface TestProps<T extends string = string> {
  testID?: T;
}

export interface QRCodeProps extends TestProps {
  value: QRCodeContents;
  size?: number;
  logo?: LogoProp;
  logoStyle?: LogoStyle;
  style?: QRCodeStyle;
  /**
   * @deprecated Use the standard `ref` prop instead.
   */
  getRef?: Ref<Svg>;
  onError?: (error: Error) => void;
}
