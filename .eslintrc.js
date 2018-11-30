module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": ["airbnb", "plugin:react/recommended", "./config/eslint/styling.js", "./config/eslint/react.js"],
  "parserOptions": {
    "ecmaVersion": 9,
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true
    }
  },
  "rules": {
    "max-len": ["off"],
    "camelcase": ["error"],
    "no-useless-rename": ["error"],
    "no-var": ["error"],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/no-unresolved": ["off"],
    "class-methods-use-this": ["off"],
    "guard-for-in": ["off"],
    "no-restricted-syntax": ["off"],
    "no-plusplus": ["off"],
    "func-names": ["off"],
    "no-shadow": ["warn", { "builtinGlobals": true }]
  }
};
