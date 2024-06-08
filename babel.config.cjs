module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          hooks: './src/hooks',
          components: './src/components',
          types: './src/types',
          tests: './src/__tests__',
        },
      },
    ],
  ],
};
