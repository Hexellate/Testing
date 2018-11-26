// prettier-ignore
module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ["airbnb", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react"],
  "rules": {
    "linebreak-style": ["warn", "unix"],
    "semi": ["error", "always"],
    "semi-spacing": ["warn", { "before": false, "after": true }],
    "no-extra-semi": ["error"],
    "comma-dangle": ["error", "never"],
    "quote-props": ["error", "always", { "numbers": false }],
    "quotes": [
      "error",
      "double",
      { "avoidEscape": true, "allowTemplateLiterals": true }
    ],
    "max-len": ["off"],
    "array-bracket-newline": ["warn", { "multiline": true }],
    "array-bracket-spacing": ["warn", "never"],
    "array-element-newline": ["warn", "consistent"],
    "camelcase": ["error"],
    "no-useless-rename": ["error"],
    "no-var": ["error"],
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/no-unresolved": ["off"],
    "react/prefer-stateless-function": ["off"],
    "react/jsx-one-expression-per-line": ["off"],
    "react/jsx-filename-extension": "off",
    "react/destructuring-assignment": ["warn", "always"],
    "react/self-closing-comp": ["off"],
    "class-methods-use-this": ["off"],
    "guard-for-in": ["off"],
    "no-restricted-syntax": ["off"],
    "no-plusplus": ["off"],
    "func-names": ["off"],
    "no-shadow": ["warn", { "builtinGlobals": true }]
  }
};
