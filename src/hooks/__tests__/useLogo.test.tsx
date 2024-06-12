import {renderHook} from '@testing-library/react-hooks';
import {useLogo} from '../useLogo';
import Logo from 'logo.svg';
import logo from 'logo.png';
import {G, Image, Rect} from 'react-native-svg';

describe('useLogo', () => {
  it('should return null when logo is undefined', () => {
    const {result} = renderHook(() => useLogo(100, '', undefined));
    expect(result.current.logoComponent).toBeNull();
  });

  describe('Logo style', () => {
    it('should render the logo with a custom background color', () => {
      const backgroundColor = 'red';
      const {result} = renderHook(() =>
        useLogo(100, '', Logo, {backgroundColor}),
      );
      const logoBackground = findChildComponent(
        result.current.logoComponent,
        Rect,
        'rect.logo-background',
      );

      expect(logoBackground?.props).toEqual(
        expect.objectContaining({fill: backgroundColor}),
      );
    });

    it('should render the logo with a custom margin', () => {
      const margin = 50;
      const {result} = renderHook(() => useLogo(100, '', Logo, {margin}));
      const logoContainer = findChildComponent(
        result.current.logoComponent,
        G,
        'g.logo-container',
      );

      expect(logoContainer?.props).toEqual(
        expect.objectContaining({x: margin, y: margin}),
      );
    });

    it('should render the logo with a custom border radius', () => {
      const borderRadius = 10;
      const {result} = renderHook(() => useLogo(100, '', Logo, {borderRadius}));
      const logoBackground = findChildComponent(
        result.current.logoComponent,
        Rect,
        'rect.logo-clip-path',
      );
      expect(logoBackground?.props).toEqual(
        expect.objectContaining({rx: borderRadius, ry: borderRadius}),
      );
    });
  });

  describe('Logo image', () => {
    it('should render the logo component when logo is an image source', () => {
      const {result} = renderHook(() => useLogo(100, '', logo));

      expect(result.current.logoComponent).toBeDefined();
    });

    it('should render the image source', () => {
      const {result} = renderHook(() => useLogo(100, '', logo));
      const imageLogo = findChildComponent(result.current.logoComponent, Image);

      expect(imageLogo?.props).toEqual(expect.objectContaining({href: logo}));
    });

    it('should render the image with a custom size', () => {
      const size = 50;
      const {result} = renderHook(() => useLogo(100, '', logo, {size}));
      const imageLogo = findChildComponent(result.current.logoComponent, Image);

      expect(imageLogo?.props).toEqual(
        expect.objectContaining({width: size, height: size}),
      );
    });
  });

  describe('Logo SVG', () => {
    it('should render the logo component when logo is a React component', () => {
      const {result} = renderHook(() => useLogo(100, '', Logo));
      expect(result.current.logoComponent).toBeDefined();
    });

    it('should render the SVG provided', () => {
      const {result} = renderHook(() => useLogo(100, '', Logo));
      const logo = findChildComponent(result.current.logoComponent, Logo);

      expect(logo?.type).toBe(Logo);
    });

    it('should render the SVG with a custom size', () => {
      const size = 50;
      const {result} = renderHook(() => useLogo(100, '', Logo, {size}));
      const logo = findChildComponent(result.current.logoComponent, Logo);

      expect(logo?.props).toEqual(
        expect.objectContaining({width: size, height: size}),
      );
    });
  });
});
