module.exports = {
  presets: [
    // disableStaticViewConfigsCodegen: the codegen plugin emits ESM exports that
    // escape the CommonJS transform under Jest; native view configs aren't needed in tests.
    ['module:@react-native/babel-preset', {disableStaticViewConfigsCodegen: true}],
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
