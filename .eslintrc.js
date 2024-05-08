module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/semi': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: `{${internalModulesGlob}}`,
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
      },
    ],
    'prettier/prettier': 'error',
  },
};
