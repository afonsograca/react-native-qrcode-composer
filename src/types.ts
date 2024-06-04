import type {Ref} from 'react';
import type {ColorValue, ImageSourcePropType} from 'react-native';
import type {NumberProp, SvgProps} from 'react-native-svg';
import type Svg from 'react-native-svg';

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
  backgroundColor?: string;
  quietZone?: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  enableLinearGradient?: boolean;
  gradientDirection?: [NumberProp, NumberProp, NumberProp, NumberProp];
  linearGradient?: [ColorValue, ColorValue];
  detectionMarkerOptions?: DetectionMarkerOptions;
  patternOptions?: PatternOptions;
}

export interface LogoStyle {
  size?: number;
  backgroundColor?: ColorValue;
  margin?: number;
  borderRadius?: number;
}

export interface QRCodeProps {
  value?: string;
  size?: number;
  logo?: LogoProp;
  logoStyle?: LogoStyle;
  style?: QRCodeStyle;
  getRef?: Ref<Svg>;
  onError?: (error: Error) => void;
}
