declare module '*.svg' {
  import type {SvgProps} from 'react-native-svg';

  const content: React.FunctionComponent<SvgProps>;
  export default content;
}
