const allExtensions = [".ts", ".d.ts", ".tsx", ".js", ".jsx"];

module.exports = {
  extends: ["@white-matrix/eslint-config"],
  parserOptions: {
    project: require.resolve("./tsconfig.json"),
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: allExtensions,
      },
    },
  },

  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-type-alias": "off",
    "node/no-unpublished-require": "off",
    // TypeScript compilation already ensures that named imports exist in the referenced module
    "import/named": "off",
  },
};
