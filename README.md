# Electron-React-Template

# Status

# Features

- 

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

## Path Structure
Approximately following directory structure found [here](https://webpack.electron.build/project-structure) \
(Structure subject to change)

```
project-folder/
├─ dist/
└─ src/
   ├─ common/
   │  └─ index.js
   ├─ main/
   │  └─ index.js
   └─ renderer/
```

### Main Process (`src/main/`)
Main process code (i.e. electron stuff)\
Entry point for electron is `index.js`

### Renderer Process (`src/renderer/`)
Renderer code (i.e. react stuff)\
Entry point for react is `index.js`

### Common scripts (`src/common/`)
Common scripts that may be used for both processes

# Credits
Project Owner: Daniel Nichols (Hexellate)

### Licence: see `LICENCE`
