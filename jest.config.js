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
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupJest.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/src/__tests__/'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/src/__mocks__/svgMock.ts',
    '\\.png': '<rootDir>/src/__mocks__/pngMock.ts',
  },
};
