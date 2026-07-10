import {Logo as LogoView} from '../Logo';
import Logo from 'logo.svg';
import logo from 'logo.png';
import {G, Image, Rect} from 'react-native-svg';

describe('Logo', () => {
  it('should return null when logo is undefined', () => {
    const logoComponent = LogoView({
      qrCodeSize: 100,
      testID: '',
      instanceId: 1,
      logo: undefined,
    });
    expect(logoComponent).toBeNull();
  });

  describe('Logo style', () => {
    it('should render the logo with a custom background color', () => {
      const backgroundColor = 'red';
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
        logoStyle: {backgroundColor},
      });
      const logoBackground = findChildComponent(
        logoComponent,
        Rect,
        'rect.logo-background',
      );

      expect(logoBackground?.props).toEqual(
        expect.objectContaining({fill: backgroundColor}),
      );
    });

    it('should render the logo with a custom margin', () => {
      const margin = 50;
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
        logoStyle: {margin},
      });
      const logoContainer = findChildComponent(
        logoComponent,
        G,
        'g.logo-container',
      );

      expect(logoContainer?.props).toEqual(
        expect.objectContaining({x: margin, y: margin}),
      );
    });

    it('should render the logo with a custom border radius', () => {
      const borderRadius = 10;
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
        logoStyle: {borderRadius},
      });
      const logoClip = findChildComponent(
        logoComponent,
        Rect,
        'rect.logo-clip-path',
      );
      expect(logoClip?.props).toEqual(
        expect.objectContaining({rx: borderRadius, ry: borderRadius}),
      );
    });

    it('should round the background rect corners in pixels, tracking the margin', () => {
      const borderRadius = 10;
      const margin = 4;
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
        logoStyle: {borderRadius, margin},
      });
      const backgroundClip = findChildComponent(
        logoComponent,
        Rect,
        'rect.logo-background-clip-path',
      );
      expect(backgroundClip?.props).toEqual(
        expect.objectContaining({
          rx: borderRadius + margin,
          ry: borderRadius + margin,
        }),
      );
    });
  });

  describe('Logo image', () => {
    it('should render the logo component when logo is an image source', () => {
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo,
      });

      expect(logoComponent).toBeDefined();
    });

    it('should render the image source', () => {
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo,
      });
      const imageLogo = findChildComponent(logoComponent, Image);

      expect(imageLogo?.props).toEqual(expect.objectContaining({href: logo}));
    });

    it('should render the image with a custom size', () => {
      const size = 50;
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo,
        logoStyle: {size},
      });
      const imageLogo = findChildComponent(logoComponent, Image);

      expect(imageLogo?.props).toEqual(
        expect.objectContaining({width: size, height: size}),
      );
    });
  });

  describe('Logo SVG', () => {
    it('should render the logo component when logo is a React component', () => {
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
      });
      expect(logoComponent).toBeDefined();
    });

    it('should render the SVG provided', () => {
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
      });
      const svgLogo = findChildComponent(logoComponent, Logo);

      expect(svgLogo?.type).toBe(Logo);
    });

    it('should render the SVG with a custom size', () => {
      const size = 50;
      const logoComponent = LogoView({
        qrCodeSize: 100,
        testID: '',
        instanceId: 1,
        logo: Logo,
        logoStyle: {size},
      });
      const svgLogo = findChildComponent(logoComponent, Logo);

      expect(svgLogo?.props).toEqual(
        expect.objectContaining({width: size, height: size}),
      );
    });
  });
});
