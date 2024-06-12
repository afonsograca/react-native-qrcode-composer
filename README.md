<p align="center">
  <img height="160" src="docs/static/assets/logo.png" />
</p>

# React Native QR Code Composer
[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]][all-contributors]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Conventional Commits][commits-badge]][commits]
[![gitmoji][gitmoji-badge]][gitmoji]
[![Keep a Changelog v1.1.0 badge][changelog-badge]][changelog]
[![Contributor Covenant][code-of-conduct-badge]][code-of-conduct]

React Native QR Code Composer is an advanced, highly customizable library designed to seamlessly integrate QR codes into your React Native applications. Leveraging the robustness of `qrcode` and the versatility of `react-native-svg`, this library offers unparalleled flexibility and ease of use, ensuring your QR code implementations are both beautiful and functional.

| Android | iOS |
| -- | -- |
|![](./docs/static/assets/exampleAndroid.gif)|![](./docs/static/assets/exampleiOS.gif)| 

## Getting Started

To install the library, you can use `npm` or `yarn`:

```
npm install react-native-qrcode-composer
```

or

```
yarn add react-native-qrcode-composer
```

### Peer Dependencies
`React Native QR Code Composer` is designed to work seamlessly within the React Native ecosystem. However, it relies on several peer dependencies that need to be installed in your project. Ensure you have the following packages installed:

- [React](https://www.npmjs.com/package/react)
- [React Native](https://www.npmjs.com/package/react-native)
- [React Native SVG ](https://www.npmjs.com/package/react-native-svg)

## Usage

Here's a basic example of how to use the library:

```typescript
import QRCode from 'react-native-qrcode-composer';
import Logo from 'assets/logo.svg';
import logo from 'assets/logo.png';

// ...

// Basic QR Code Example
<QRCode value="https://github.com/afonsograca/react-native-qrcode-composer" />

// Advanced Usage with SVG and PNG logos
<QRCode value="QR code with SVG logo" logo={Logo} />
<QRCode value="QR code with PNG logo" logo={logo} />
```

## Props

The `react-native-qrcode-composer` library provides several props that you can use to customize the QR code and its appearance. These props allow you to specify the content of the QR code, its size, and the logo that appears in the center of the QR code, among other things. You can also specify a function that is called when an error occurs. 

The following sections provide more details about these props and how to use them.

### QRCodeProps

| Property | Type | Optional | Default | Description |
|---|---|---|---|---|
| `value` | string | Yes | `'QR code message'` | The content to be encoded in the QR code |
| `size` | number | Yes | `100` | The size of the QR code in pixels |
| `logo` | `LogoProp` | Yes | `undefined` | A custom logo to be displayed at the center of the QR code |
| `logoStyle` | [LogoStyle](#logostyle) | Yes | `undefined` | The style of the logo |
| `style` | [QRCodeStyle](#qrcodestyle) | Yes | `undefined` | The style of the QR code container |
| `getRef` | `React.Ref<Svg>` | Yes | `undefined` | A ref to the QR code SVG element for direct access |
| `onError` | `(error: Error) => void` | Yes | `undefined` | Callback function triggered if an error occurs during rendering |
| `testID` | `string` | Yes | `'react-native-qrcode-composer'` | Identification prefix for the internal parts of the component |

### LogoStyle

| Property | Type | Optional | Default | Description |
|---|---|---|---|---|
| `size` | number | Yes | 20% of the QR code size | The size of the logo in pixels |
| `backgroundColor` | string | Yes | `transparent` | The background color of the logo |
| `margin` | number | Yes | `0` | The margin around the logo in pixels |
| `borderRadius` | number | Yes | `0` | The border radius of the logo's corners |

### QRCodeStyle

| Property | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `string` | Yes | `black` | The color of the QR code pattern |
| `backgroundColor` | `string` | Yes | `white` | The background color of the entire QR code |
| `quietZone` | number | Yes | `0` | The margin around the QR code |
| `errorCorrectionLevel` | `ErrorCorrectionLevel` | Yes | `M` | The error correction level, enhancing robustness |
| `linearGradient` | `[ColorValue, ColorValue]` | Yes | `undefined` | The colors for a linear gradient effect |
| `gradientDirection` | `[NumberProp, NumberProp, NumberProp, NumberProp]` | Yes | `['0%', '0%', '100%', '100%']` | The directions for gradient application |
| `detectionMarkerOptions` | [DetectionMarkerOptions](#detectionmarkeroptions) | Yes | `undefined` | Options for styling the detection markers |
| `patternOptions` | [PatternOptions](#patternoptions) | Yes | `undefined` | Options for modifying the QR pattern |

### DetectionMarkerOptions

| Property | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| `connected` | boolean | Yes | `true` | Indicates if the blocks that make up the marker are connected |
| `cornerRadius` | number | Yes | `0` | Corner radius applied to the detection markers. Note: This does not take precedence over `outerCornerRadius` or `innerCornerRadius` |
| `outerCornerRadius` | number | Yes | `0` | Specific corner radius for the outer part of the markers |
| `innerCornerRadius` | number | Yes | `0` | Specific corner radius for the inner part of the markers |

### PatternOptions

| Property | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| `connected` | boolean | Yes | `false` | Indicates if the blocks in the QR code pattern are connected |
| `cornerRadius` | number | Yes | `0` | Corner radius for each block in the QR code pattern |

## Try it out

We have provided an example app for you to try out the library. You can find it in the `/example` directory of the repository. To run the example app, navigate to its directory and run:

```
yarn
yarn start
```

## Contributing

Interested in contributing? Check out how you can make a difference in our [contributing guide](CONTRIBUTING.md).

Please note that this project is adheres to a Contributor Code of Conduct. By participating in it you agree to abide by [its terms](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project owes its gratitude to:
- The developers of `qrcode` and `react-native-svg` for creating such robust foundations.
- [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg) for initial inspiration.
- All the contributors who have helped extend and maintain this library.
- The community testers who provided valuable feedback.

<!-- badges -->

[build-badge]: https://img.shields.io/github/actions/workflow/status/afonsograca/react-native-qrcode-composer/jest.yml
[build]: https://github.com/afonsograca/react-native-qrcode-composer/actions/workflows/jest.yml
[version-badge]: https://img.shields.io/npm/v/react-native-qrcode-composer.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-qrcode-composer
[license-badge]: https://img.shields.io/npm/l/react-native-qrcode-composer.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[changelog]: ./CHANGELOG.md
[changelog-badge]: https://img.shields.io/badge/changelog-Keep_a_Changelog-orange
[commits]: https://conventionalcommits.org
[commits-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white
[gitmoji]: https://gitmoji.dev/
[gitmoji-badge]: https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square
[code-of-conduct]: ./CODE_OF_CONDUCT.md
[code-of-conduct-badge]: https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg

