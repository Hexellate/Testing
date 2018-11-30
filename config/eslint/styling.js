module.exports = {
  "rules": {
    "quote-props": ["error", "always", { "numbers": false }],
    "quotes": [
      "error",
      "double",
      { "avoidEscape": true, "allowTemplateLiterals": true }
    ],
    "linebreak-style": ["warn", "unix"],
    "semi": ["error", "always"],
    "no-extra-semi": ["error"],
    "comma-dangle": ["error", "never"],
    "semi-spacing": ["warn", { "before": false, "after": true }],
    "array-bracket-newline": ["warn", "consistent"],
    "array-bracket-spacing": ["warn", "never"],
    "array-element-newline": ["warn", "consistent"]
  }
};
