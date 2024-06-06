// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import eslintConfig from '@react-native/eslint-config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import globals from 'globals';

// const internalModulesGlob = process.env.INTERNAL_MODULES_GLOB || 'src/**';

export default tseslint.config(
  // global ignores
  {
    ignores: [
      'node_modules/**',
      'lib/**',
      'example/node_modules/**',
      '**/*.config.js',
      '**/*.cjs',
      '**/*rc.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  //   '@react-native-community',
  // reactNative.configs.all,
  // eslintConfig,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      // 'import/order': [
      //   'error',
      //   {
      //     pathGroups: [
      //       {
      //         pattern: `{${internalModulesGlob}}`,
      //         group: 'external',
      //         position: 'after',
      //       },
      //     ],
      //     pathGroupsExcludedImportTypes: [],
      //     'newlines-between': 'always',
      //   },
      // ],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['./**/*test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
