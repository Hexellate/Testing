# Electron-React-Template

# Status

# Features

- Set up for developing a React app in Electron
- Support for SCSS
- Uses webpack in build process
- Hotloading during development

# Proposed Features

-

# Build Instructions
Assuming that the dev environment has been set up properly, you should be able to build a dev version of the project just by running ```npm run dev``` in a terminal or commend prompt (from the project directory)

# Contributing

## setting up dev environment

1. Install npm and node if not already installed (feel free to use yarn, but keep in mind that everything is set up to use npm)
2. Clone repo to your pc
3. Run npm install from project root to install dependencies
4. Make sure that files for your dev environment are excluded in the ```.gitignore``` file

## Commands

All commands are run with `npm run commandname` (i.e. `npm run dev`)

- `dev` : Launches electron for development, with hotloading and dev tools
- `clean` : Removes the `dist/` directory
- `clean-npm` : Deletes all packages and `package-lock.json`
- `clean-all` : Runs all clean commands
- `rebuild-npm` : Cleans all npm packages and reinstalls all packages and dependencies
- `build` : Packs the app using electron-webpack
- `dist-win` : Builds the Electron app for deployment on Windows (Set targets in `package.json` file)
- `dist-lin` : Builds the Electron app for deployment on Linux
- `dist-mac` : Builds the Electron app for deployment on MacOs

## Path Structure

Approximately following directory structure found [here](https://webpack.electron.build/project-structure) \
(Structure subject to change)

```
project-folder/
├─ dist/
├─ src/
│  ├─ main/
│  │  └─ index.js
│  ├─ renderer/
│  │  └─ index.js
│  └─ common/
└─ build/
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

### Working directory for compiling ( `dist/` )

When webpack produces packed files, or when the entire application is compiled, then that stuff goes here

# Credits

Project Owner: Daniel Nichols (Hexellate)

### Licence: see `LICENCE`
