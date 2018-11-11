module.exports = {
  "module": {
    "rules": [
      {
        "test": /\.(js|jsx)$/,
        "exclude": /node_modules/,
        "use": [
          {
            "loader": "babel-loader",
            "options": {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "targets": { "electron": "3.0.0" }
                  }
                ],
                "@babel/react"
              ]
            }
          }
        ]
      }
    ]
  },
  "resolve": {
    "extensions": [".js", ".jsx"]
  }
};
