# Project Directory Structure

(Structure subject to change)

## Top level layout

```r
.
├─ .vscode/
├─ build/
├─ compiled/
├─ config/
├─ dist/
├─ docs/
├─ scripts/
├─ src/
├─ static/
├─ test/
└─ ...
```

### Source files ( `src/` )

The actual application files that will be compiled and distributed.

#### Main process

Code for the electron main process\
Entry point is `index.js`\

```r
.
├─ ...
├─ src/
│  ├─ main/
│  │  ├─ index.js
│  │  └─ ...
│  └─ ...
└─ ...
```

#### Render process

Code for renderer (window) processes\
Entry point is `index.js`

React components should be placed in the components folder, organised by application module, and then by module feature.

Screens should be placed in the screens folder. This folder may be unused for SPAs, as there may only be one screen, which uses different UI components.

If a feature is only one file, then it doesn't need to be contained within a feature folder

```r
.
├─ ...
├─ src/
│  ├─ ...
│  ├─ renderer/
│  │  ├─ components/
│  │  │  ├─ modulename/
│  │  │  │  ├─ featurename/
│  │  │  │  │  └─ ...
│  │  │  │  ├─ feature2.js
│  │  │  │  └─ ...
│  │  │  └─ ...
│  │  ├─ screens/
│  │  │  ├─ route/
│  │  │  │  └─ ...
│  │  │  ├─ root.js
│  │  │  └─ ...
│  │  └─ index.js
│  └─ ...
└─ ...
```

#### Server process

If the app has an internal server (e.g. an express server), then the code for that goes here.

```r
.
├─ ...
├─ src/
│  ├─ ...
│  ├─ server/
│  │  └─ ...
│  └─ ...
└─ ...
```

#### Common

Code that is shared between multiple processes.

```r
.
├─ ...
├─ src/
│  ├─ ...
│  └─ common/
│     └─ ...
└─ ...
```

### Documentation files ( `docs/` )

Documentation of the app and workspace environment

### Test files ( `test/` )

Files for unit testing and other testing

### VSCode workspace files ( `.vscode/` )

A pre-configured vscode workspace for the project

### Build files ( `build/` )

Files used explicitly in the build process, e.g. installer icons

### Static files ( `static/` )

Files to be bundled and distributed with the app without compilation or any other transformations. Accessible with the `_static` variable ([see here](https://webpack.electron.build/using-static-assets))

### Config files ( `config/` )

Configurations for dev tools, the build process and any other dev environment configurations.

```r
.
├─ ...
├─ config/
│  ├─ eslint/
│  │  └─ ...
│  └─ ...
└─ ...
```

### Script files ( `scripts/` )

Scripts used for the build and release processes, both in a local environment and on CI server.

```r
.
├─ ...
├─ scripts/
│  ├─ release-scripts/
│  │  └─ ...
│  └─ ...
└─ ...
```

### Semi-compiled files ( `dist/` )

JS code that is minified, bundled and generally compiled, but is not packaged for distribution

### Compiled files ( `compiled/` )

Code that has been compiled/packaged and is ready for distribution

## Complete tree for reference

```r
.
├─ .vscode/
├─ build/
├─ compiled/
│  └─ ...
├─ config/
│  ├─ eslint/
│  │  └─ ...
│  └─ ...
├─ dist/
│  └─ ...
├─ docs/
│  └─ ...
├─ scripts/
│  ├─ release-scripts/
│  │  └─ ...
│  └─ ...
├─ src/
│  ├─ main/
│  │  ├─ index.js
│  │  └─ ...
│  ├─ renderer/
│  │  ├─ components/
│  │  │  ├─ modulename/
│  │  │  │  ├─ featurename/
│  │  │  │  │  └─ ...
│  │  │  │  ├─ feature2.js
│  │  │  │  └─ ...
│  │  │  └─ ...
│  │  ├─ screens/
│  │  │  ├─ route/
│  │  │  │  └─ ...
│  │  │  ├─ root.js
│  │  │  └─ ...
│  │  └─ index.js
│  ├─ server/
│  │  └─ ...
│  └─ common/
│     └─ ...
├─ static/
│  └─ ...
└─ ...
```
