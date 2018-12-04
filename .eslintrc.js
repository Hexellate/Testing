module.exports = {
  "extends": ["airbnb", "./config/eslint/styling.js", "./config/eslint/react.js"],
  "env": {
    "browser": true,
    "node": true
  },
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
    "no-shadow": ["warn", { "builtinGlobals": true }],
    "no-console": ["off"],
    "no-underscore-dangle": ["off"]
  }
};
