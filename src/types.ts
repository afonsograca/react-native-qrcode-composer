import type {Ref} from 'react';
import type {ImageURISource} from 'react-native';
import type {SvgProps} from 'react-native-svg';
import type Svg from 'react-native-svg';

export type LogoProp = ImageURISource | React.FunctionComponent<SvgProps>;

export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export interface QRCodeProps {
  value?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: LogoProp;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  enableLinearGradient?: boolean;
  gradientDirection?: [string, string, string, string];
  linearGradient?: string[];
  errorCorrectionLevel?: ErrorCorrectionLevel;
  getRef?: Ref<Svg>;
  onError?: (error: Error) => void;
}
