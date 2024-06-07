export default {
  preset: 'react-native',
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        extends: './babel.config.cjs',
        plugins: [['@babel/plugin-proposal-private-methods', {loose: true}]],
      },
    ],
  },
  setupFilesAfterEnv: [
    '<rootDir>/node_modules/@testing-library/jest-native/extend-expect.js',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/__mocks__/svgMock.ts',
    '\\.png': '<rootDir>/src/__mocks__/pngMock.ts',
  },
};
