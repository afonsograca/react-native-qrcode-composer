module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          'react-native-qrcode-composer': './../src',
          assets: './assets',
        },
      },
    ],
  ],
};
