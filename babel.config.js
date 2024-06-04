export default {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          hooks: './hooks',
        },
      },
    ],
  ],
};
