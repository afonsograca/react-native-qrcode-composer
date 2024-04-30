module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "@react-native-community",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: `{${internalModulesGlob}}`,
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: [],
        "newlines-between": "always",
      },
    ],
  },
};
