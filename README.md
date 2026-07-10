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

| Android                                      | iOS                                      |
| -------------------------------------------- | ---------------------------------------- |
| ![](./docs/static/assets/exampleAndroid.gif) | ![](./docs/static/assets/exampleiOS.gif) |

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
import {QRCode} from 'react-native-qrcode-composer';
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

The `react-native-qrcode-composer` library provides several props that you can use to customize the QR code and its appearance. These props allow you to specify the content of the QR code, its size, and the logo that appears in the center of the QR code, among other things. You can also specify a function that is called when an error occurs; if encoding or rendering fails, the component renders nothing (`null`) and invokes `onError` when provided.

The following sections provide more details about these props and how to use them.

### QRCodeProps

| Property    | Type                               | Optional | Default                          | Description                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------- | -------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | [`QRCodeContents`](#content-types) | No       | —                                | The content to be encoded in the QR code — a plain string or one of the typed [content objects](#content-types)                                                                                                                                           |
| `size`      | number                             | Yes      | `100`                            | The size of the QR code in pixels                                                                                                                                                                                                                         |
| `logo`      | `LogoProp`                         | Yes      | `undefined`                      | A custom logo to be displayed at the center of the QR code                                                                                                                                                                                                |
| `logoStyle` | [LogoStyle](#logostyle)            | Yes      | `undefined`                      | The style of the logo                                                                                                                                                                                                                                     |
| `style`     | [QRCodeStyle](#qrcodestyle)        | Yes      | `undefined`                      | The style of the QR code container                                                                                                                                                                                                                        |
| `ref`       | `React.Ref<Svg>`                   | Yes      | `undefined`                      | A ref to the underlying `react-native-svg` `Svg` element                                                                                                                                                                                                  |
| `getRef`    | `React.Ref<Svg>`                   | Yes      | `undefined`                      | **Deprecated** — use `ref` instead. A ref to the QR code SVG element for direct access                                                                                                                                                                    |
| `onError`   | `(error: Error) => void`           | Yes      | `undefined`                      | Callback function triggered if an error occurs during encoding or rendering. When an error occurs, the component renders nothing (`null`). Fires once per distinct error, not on every failing render, only firing again when the error changes or clears |
| `testID`    | `string`                           | Yes      | `'react-native-qrcode-composer'` | Identification prefix for the internal parts of the component                                                                                                                                                                                             |

The `logo` prop accepts a `LogoProp`, which is `ImageSourcePropType | React.FunctionComponent<SvgProps>` — either a React Native image source (for PNG/remote logos) or an SVG component (for vector logos). `LogoProp` is exported from the package.

### Content types

The `value` prop accepts a `QRCodeContents` value: either a plain `string` (encoded as-is) or one of the typed content objects below, discriminated by their `type` field. Typed objects are encoded into the appropriate payload format (mailto, WIFI, vCard, iCalendar, etc.) for you. `QRCodeContents` and all of the content interfaces (`PlainText`, `URLContent`, `Email`, `Phone`, `SMS`, `WiFi`, `GeolocationContent`, `VCard`, `MeCard`, `CalendarEvent`) are exported from the package, along with `SecurityType`. The package also exports the component prop and style types (`QRCodeProps`, `QRCodeStyle`, `LogoStyle`, `LogoProp`, `PatternOptions`, `DetectionMarkerOptions`) and the `ErrorCorrectionLevel` enum.

```typescript
// Plain string
<QRCode value="Any message" />

// URL
<QRCode value={{type: 'url', url: 'https://github.com/afonsograca/react-native-qrcode-composer'}} />
```

#### PlainText

| Property  | Type           | Optional | Description                |
| --------- | -------------- | -------- | -------------------------- |
| `type`    | `'plain-text'` | No       | Content type discriminator |
| `content` | string         | No       | The text to encode         |

#### URL

| Property | Type    | Optional | Description                |
| -------- | ------- | -------- | -------------------------- |
| `type`   | `'url'` | No       | Content type discriminator |
| `url`    | string  | No       | The URL to encode          |

#### Email

| Property  | Type      | Optional | Description                   |
| --------- | --------- | -------- | ----------------------------- |
| `type`    | `'email'` | No       | Content type discriminator    |
| `email`   | string    | No       | The recipient's email address |
| `subject` | string    | Yes      | The email subject             |
| `body`    | string    | Yes      | The email body                |
| `cc`      | string    | Yes      | Carbon copy recipient         |
| `bcc`     | string    | Yes      | Blind carbon copy recipient   |

#### Phone

| Property    | Type      | Optional | Description                                                                             |
| ----------- | --------- | -------- | --------------------------------------------------------------------------------------- |
| `type`      | `'phone'` | No       | Content type discriminator                                                              |
| `telephone` | string    | No       | The phone number to dial. Spaces, parentheses, and hyphens are stripped before encoding |

#### SMS

| Property      | Type    | Optional | Description                                                                                |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------ |
| `type`        | `'sms'` | No       | Content type discriminator                                                                 |
| `phoneNumber` | string  | No       | The phone number to message. Spaces, parentheses, and hyphens are stripped before encoding |
| `message`     | string  | Yes      | A prefilled message. Percent-encoded (`encodeURIComponent`) in the generated payload       |

#### WiFi

| Property   | Type                                   | Optional | Description                   |
| ---------- | -------------------------------------- | -------- | ----------------------------- |
| `type`     | `'wifi'`                               | No       | Content type discriminator    |
| `security` | `'WEP' \| 'WPA' \| 'WPA3' \| 'nopass'` | No       | The network's security type   |
| `ssid`     | string                                 | No       | The network name              |
| `password` | string                                 | Yes      | The network password          |
| `hidden`   | boolean                                | Yes      | Whether the network is hidden |

```typescript
<QRCode
  value={{
    type: 'wifi',
    security: 'WPA',
    ssid: 'Home Network',
    password: 'hunter2',
  }}
/>
```

#### Geolocation

| Property    | Type            | Optional | Description                |
| ----------- | --------------- | -------- | -------------------------- |
| `type`      | `'geolocation'` | No       | Content type discriminator |
| `latitude`  | number          | No       | The latitude coordinate    |
| `longitude` | number          | No       | The longitude coordinate   |
| `altitude`  | number          | Yes      | The altitude               |

#### VCard

| Property             | Type                              | Optional | Description                        |
| -------------------- | --------------------------------- | -------- | ---------------------------------- |
| `type`               | `'vcard'`                         | No       | Content type discriminator         |
| `fullName`           | string                            | No       | The contact's full name (`FN`)     |
| `address`            | string                            | Yes      | Postal address (`ADR`)             |
| `anniversary`        | `Date`                            | Yes      | Anniversary date (`ANNIVERSARY`)   |
| `birthday`           | `Date`                            | Yes      | Birth date (`BDAY`)                |
| `calendarAddressURI` | string                            | Yes      | Calendar address URI (`CALADRURI`) |
| `calendarURI`        | string                            | Yes      | Calendar URI (`CALURI`)            |
| `categories`         | `string[]`                        | Yes      | Categories (`CATEGORIES`)          |
| `clientPIDMap`       | string                            | Yes      | Client PID map (`CLIENTPIDMAP`)    |
| `email`              | string                            | Yes      | Email address (`EMAIL`)            |
| `facebookURL`        | string                            | Yes      | Facebook URL (`FBURL`)             |
| `gender`             | `'M' \| 'F' \| 'O' \| 'N' \| 'U'` | Yes      | Gender (`GENDER`)                  |
| `geo`                | string                            | Yes      | Geographic position (`GEO`)        |
| `instantMessenger`   | string                            | Yes      | Instant messenger handle (`IMPP`)  |
| `key`                | string                            | Yes      | Public key (`KEY`)                 |
| `kind`               | string                            | Yes      | Kind of object (`KIND`)            |
| `language`           | string                            | Yes      | Preferred language (`LANG`)        |
| `logo`               | string                            | Yes      | Logo (`LOGO`)                      |
| `member`             | string                            | Yes      | Group member (`MEMBER`)            |
| `name`               | `string \| string[]`              | Yes      | Structured name components (`N`)   |
| `nickname`           | string                            | Yes      | Nickname (`NICKNAME`)              |
| `note`               | string                            | Yes      | Note (`NOTE`)                      |
| `organization`       | string                            | Yes      | Organization (`ORG`)               |
| `productID`          | string                            | Yes      | Product identifier (`PRODID`)      |
| `related`            | string                            | Yes      | Related entity (`RELATED`)         |
| `role`               | string                            | Yes      | Role (`ROLE`)                      |
| `sound`              | string                            | Yes      | Sound (`SOUND`)                    |
| `source`             | string                            | Yes      | Source (`SOURCE`)                  |
| `telephone`          | string                            | Yes      | Phone number (`TEL`)               |
| `title`              | string                            | Yes      | Job title (`TITLE`)                |
| `timezone`           | string                            | Yes      | Time zone (`TZ`)                   |
| `uid`                | string                            | Yes      | Unique identifier (`UID`)          |
| `url`                | string                            | Yes      | Website URL (`URL`)                |
| `xml`                | string                            | Yes      | Extended XML data (`XML`)          |

```typescript
<QRCode
  value={{
    type: 'vcard',
    fullName: 'Ada Lovelace',
    organization: 'Analytical Engines Ltd',
    telephone: '+44 20 7946 0958',
    email: 'ada@example.com',
    birthday: new Date(1815, 11, 10),
  }}
/>
```

#### MeCard

| Property    | Type       | Optional | Description                  |
| ----------- | ---------- | -------- | ---------------------------- |
| `type`      | `'mecard'` | No       | Content type discriminator   |
| `firstName` | string     | No       | The contact's first name     |
| `lastName`  | string     | No       | The contact's last name      |
| `address`   | string     | Yes      | Postal address               |
| `birthday`  | `Date`     | Yes      | Birth date                   |
| `email`     | string     | Yes      | Email address                |
| `nickname`  | string     | Yes      | Nickname                     |
| `note`      | string     | Yes      | Note                         |
| `sound`     | string     | Yes      | Phonetic reading of the name |
| `telephone` | string     | Yes      | Phone number                 |
| `videoCall` | string     | Yes      | Video call address           |
| `website`   | string     | Yes      | Website URL                  |

#### CalendarEvent

| Property      | Type                                        | Optional | Description                                   |
| ------------- | ------------------------------------------- | -------- | --------------------------------------------- |
| `type`        | `'calendar-event'`                          | No       | Content type discriminator                    |
| `uid`         | string                                      | No       | Unique identifier for the event               |
| `dtStart`     | `Date`                                      | No       | Event start date and time                     |
| `dtEnd`       | `Date`                                      | Yes      | Event end date and time                       |
| `duration`    | string                                      | Yes      | Event duration (used when `dtEnd` is not set) |
| `summary`     | string                                      | Yes      | Short summary of the event                    |
| `description` | string                                      | Yes      | Longer description                            |
| `location`    | string                                      | Yes      | Event location                                |
| `url`         | string                                      | Yes      | Associated URL                                |
| `geo`         | string                                      | Yes      | Geographic position                           |
| `categories`  | `string[]`                                  | Yes      | Event categories                              |
| `status`      | `'TENTATIVE' \| 'CONFIRMED' \| 'CANCELLED'` | Yes      | Event status                                  |
| `transp`      | `'TRANSPARENT' \| 'OPAQUE'`                 | Yes      | Time transparency                             |
| `organizer`   | string                                      | Yes      | Event organizer                               |
| `attach`      | string                                      | Yes      | Attachment                                    |
| `priority`    | number                                      | Yes      | Priority, clamped to 0–9                      |
| `rrule`       | string                                      | Yes      | Recurrence rule                               |
| `sequence`    | number                                      | Yes      | Revision sequence number                      |
| `class`       | `'PUBLIC' \| 'PRIVATE' \| 'CONFIDENTIAL'`   | Yes      | Access classification                         |

```typescript
<QRCode
  value={{
    type: 'calendar-event',
    uid: 'launch-party@example.com',
    dtStart: new Date(Date.UTC(2026, 7, 1, 18, 0)),
    dtEnd: new Date(Date.UTC(2026, 7, 1, 21, 0)),
    summary: 'Launch party',
    location: 'Lisbon',
  }}
/>
```

### LogoStyle

| Property          | Type         | Optional | Default                 | Description                                                                                                                                                                                                               |
| ----------------- | ------------ | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`            | number       | Yes      | 20% of the QR code size | The size of the logo in pixels                                                                                                                                                                                            |
| `backgroundColor` | `ColorValue` | Yes      | `transparent`           | The background color of the logo                                                                                                                                                                                          |
| `margin`          | number       | Yes      | `0`                     | The margin around the logo in pixels                                                                                                                                                                                      |
| `borderRadius`    | number       | Yes      | `0`                     | The border radius of the logo's corners, in pixels. The logo's background rectangle uses this radius plus the `margin` so its corners track the logo's. Set it to half the logo `size` for a circular logo and background |

### QRCodeStyle

| Property                 | Type                                               | Optional | Default                        | Description                                                                |
| ------------------------ | -------------------------------------------------- | -------- | ------------------------------ | -------------------------------------------------------------------------- |
| `color`                  | `ColorValue`                                       | Yes      | `black`                        | The color of the QR code pattern                                           |
| `backgroundColor`        | `ColorValue`                                       | Yes      | `white`                        | The background color of the entire QR code                                 |
| `quietZone`              | number                                             | Yes      | `0`                            | The margin around the QR code, in pixels                                   |
| `cornerRadius`           | number                                             | Yes      | `0`                            | The corner radius, in absolute pixels, applied to the QR code's quiet zone |
| `errorCorrectionLevel`   | [`ErrorCorrectionLevel`](#errorcorrectionlevel)    | Yes      | `M`                            | The error correction level, enhancing robustness                           |
| `linearGradient`         | `[ColorValue, ColorValue]`                         | Yes      | `undefined`                    | The colors for a linear gradient effect                                    |
| `gradientDirection`      | `[NumberProp, NumberProp, NumberProp, NumberProp]` | Yes      | `['0%', '0%', '100%', '100%']` | The directions for gradient application                                    |
| `detectionMarkerOptions` | [DetectionMarkerOptions](#detectionmarkeroptions)  | Yes      | `undefined`                    | Options for styling the detection markers                                  |
| `patternOptions`         | [PatternOptions](#patternoptions)                  | Yes      | `undefined`                    | Options for modifying the QR pattern                                       |

> **Note on sizing:** when `quietZone` is greater than `0`, the rendered element measures `size + 2 * quietZone` pixels on each side — the `size` prop defines the QR code area, not the total footprint.

### ErrorCorrectionLevel

`ErrorCorrectionLevel` is an enum exported from the package. Higher levels tolerate more damage/obstruction (for example a centered logo) at the cost of denser codes:

| Value                    | Recovery capacity |
| ------------------------ | ----------------- |
| `ErrorCorrectionLevel.L` | ~7%               |
| `ErrorCorrectionLevel.M` | ~15%              |
| `ErrorCorrectionLevel.Q` | ~25%              |
| `ErrorCorrectionLevel.H` | ~30%              |

### DetectionMarkerOptions

| Property            | Type    | Optional | Default | Description                                                                                                                                                            |
| ------------------- | ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connected`         | boolean | Yes      | `true`  | Indicates if the blocks that make up the marker are connected                                                                                                          |
| `cornerRadius`      | number  | Yes      | `0`     | Corner roundness of the detection markers, from `0` (square) to `1` (fully round). Note: This does not take precedence over `outerCornerRadius` or `innerCornerRadius` |
| `outerCornerRadius` | number  | Yes      | `0`     | Specific corner roundness for the outer part of the markers, from `0` (square) to `1` (fully round)                                                                    |
| `innerCornerRadius` | number  | Yes      | `0`     | Specific corner roundness for the inner part of the markers, from `0` (square) to `1` (fully round)                                                                    |

### PatternOptions

| Property       | Type    | Optional | Default | Description                                                                                   |
| -------------- | ------- | -------- | ------- | --------------------------------------------------------------------------------------------- |
| `connected`    | boolean | Yes      | `false` | Indicates if the blocks in the QR code pattern are connected                                  |
| `cornerRadius` | number  | Yes      | `0`     | Corner roundness of each block in the QR code pattern, from `0` (square) to `1` (fully round) |

> **Note on corner radius units:** `style.cornerRadius` (the background rectangle) and `logoStyle.borderRadius` are expressed in absolute pixels, whereas `patternOptions.cornerRadius` and the `detectionMarkerOptions` corner radii are roundness fractions between 0 (square corners) and 1 (fully round, i.e. a radius of half the module/marker size). Values outside this range are silently clamped into [0, 1].

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
