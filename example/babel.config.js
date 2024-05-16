module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        // extensions: ['.ios.js', '.android.js', '.js', '.json'],
        alias: {
          'react-native-qrcode-composer': '../src',
        },
      },
    ],
  ],
};
