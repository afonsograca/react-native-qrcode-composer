# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Typed QR code contents: the `value` prop now accepts `QRCodeContents`, a union of `string` and typed content objects for plain text, URLs, email, phone, SMS, WiFi, geolocation, vCard, MeCard, and calendar events
- The content interfaces (`PlainText`, `URLContent`, `Email`, `Phone`, `SMS`, `WiFi`, `GeolocationContent`, `VCard`, `MeCard`, `CalendarEvent`) and `QRCodeContents` are exported from the package
- Support for the standard `ref` prop, forwarded to the underlying `react-native-svg` `Svg` element

### Changed

- **Breaking:** the `value` prop is now required and typed `QRCodeContents`; the `'QR code message'` default has been removed
- **Breaking:** on encoding/render failure the component now renders nothing (`null`) instead of a raw `Text` element with the error message; `onError` is still invoked when provided
- **Breaking:** `VCard.birthday` and `VCard.anniversary` are now `Date` instead of `string`, consistent with `MeCard`
- **Breaking:** `QRCodeStyle.backgroundColor` is now typed `ColorValue` instead of `string`

### Deprecated

- The `getRef` prop — use the standard `ref` prop instead

### Fixed

- `require()` of the package no longer throws in Node consumers such as Jest and SSR: removed `"type": "module"` from package.json and added an `exports` map
- MeCard nickname is now emitted with its `NICKNAME:` key (it was previously appended without a key, corrupting the payload)
- MeCard payload prefix corrected to `MECARD:`
- WiFi, MeCard, vCard, and iCalendar payloads now use spec-compliant backslash escaping instead of percent-encoding
- vCard and iCalendar payloads now use CRLF line endings
- Calendar events are now wrapped in `BEGIN:VCALENDAR`/`END:VCALENDAR`
- vCard now encodes all of its typed fields (previously around 20 fields, such as `telephone`, `organization`, and `title`, were silently dropped)

## [0.2.0] - 2024-06-21

### Added
- The ability to add a corner radius to the QR code's quiet zone

## [0.1.4] - 2024-06-21

### Added

- Ability to display QR codes with customization

## [0.1.3] - 2024-06-20

## [0.1.0] - 2024-04-28

Project Initialization

[unreleased]: https://github.com/afonsograca/react-native-qrcode-composer/compare/0.2.0...HEAD

[0.2.0]: https://github.com/afonsograca/react-native-qrcode-composer/compare/0.1.4...0.2.0
[0.1.4]: https://github.com/afonsograca/react-native-qrcode-composer/compare/0.1.3...0.1.4
