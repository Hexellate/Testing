# autoupdate-test

[![Dependencies](https://david-dm.org/Hexellate/Electron-React-Template.svg?branch=master)](https://david-dm.org/Hexellate/Electron-React-Template?type=dev&branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ea35c94d99f6ddb497f4/maintainability)](https://codeclimate.com/github/Hexellate/Electron-React-Template/maintainability)
[![Build Status](https://dev.azure.com/hexellate/autoupdate-test/_apis/build/status/Hexellate.autoupdate-test)](https://dev.azure.com/hexellate/autoupdate-test/_build/latest?definitionId=1)
\
This is a test for automatically updating both installed and portable installations

# Status

# Features

- Set up for developing a React app in Electron
- Support for SCSS, Less and typescript
- Uses webpack in build process
- Hotloading during development

# Proposed Features

-

# Build Instructions

Assuming that the dev environment has been set up properly, you should be able to build a dev version of the project just by running `npm run dev` in a terminal or commend prompt (from the project directory)

# Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## setting up dev environment

1. Install npm and node if not already installed (feel free to use yarn, but keep in mind that everything is set up to use npm)
2. Clone repo to your pc
3. Run npm install from project root to install dependencies
4. Make sure that files for your dev environment are excluded in the `.gitignore` file

## Commands

All commands are run with `npm run commandname` (i.e. `npm run dev`)

- `dev` : Launches both the Webpack dev environment and React-devtools
- `webpack-dev` : Runs Webpack dev environment, with hotloading enabled
- `react-devtools` : Opens the React devtools
- `clean` : Removes the `dist/` directory
- `clean-npm` : Deletes all packages and `package-lock.json`
- `clean-all` : Runs all clean commands
- `rebuild-npm` : Cleans all npm packages and reinstalls all packages and dependencies
- `pack` : Packs the source for distribution
- `prebuild` : Run before building a new version
- Build:
  - The build command is formatted as `build-platform:type`, where platform can be either `win`, `lin` or `mac`, for building Windows, Linux or Mac OS respectively, and type can be either `stable`, `canary` or `next`. e.g. `build-win:canary` would produce a canary version for windows. The reason for having separate commands for each type is to change the build config that is used.

## Path Structure

(Structure subject to change)

```
project-folder/
├─ dist/
├─ compiled/
├─ src/
│  ├─ main/
│  │  └─ index.js
│  ├─ renderer/
│  │  └─ index.js
│  └─ common/
├─ config/
│  ├─ canary.json
│  ├─ next.json
│  └─ stable.json
├─ build/
└─ static/
```

### Main Process ( `src/main/` )

Main process code (i.e. electron stuff)\
Entry point for electron is `index.js`

### Renderer Process ( `src/renderer/` )

Renderer code (i.e. react stuff)\
Entry point for react is `index.js`

### Common scripts ( `src/common/` )

Common scripts that may be used for both processes

### Components used for distribution ( `build/` )

Things like application icons used in release builds

### Assets that are not packed with webpack ( `static/` )

Files in this folder will not be compressed with webpack, and are accessible with the `_static` variable ([see here](https://webpack.electron.build/using-static-assets))

### Configurations ( `config/` )

Extra configurations for some things are placed here (e.g. build configs for different channels)

### Project build directory ( `dist/` )

Where stuff produced by webpack goes

### Project compile directory ( `compiled/` )

When the project is compiled into a distributable format, then that goes here

# Credits

Project Owner: Daniel Nichols (Hexellate)

### Licence: see `LICENCE`
