# Sass Dynamic imports

The library is designed to import dynamically scss files in dynamic folders

## Install Sass

Sass library is required to use this package

```bash
npm i sass
```

## Install library

```bash
npm i sass-dynamic-imports
```

## Use watcher

```bash
dynamic-sass --watch path/file.scss:path/file.css
```

## Use with concurrently

```bash
npm i concurrently
```

Add this scripts on your package.json "scripts" key:

```bash
  "dev:sass": "dynamic-sass --watch styles/index.scss:styles/index.css",
  "dev": "concurrently --kill-others \"next dev\" \"npm run dev:sass\"",
```

## Scss file syntax

*in .scss file:

```bash
  @import './[folder_name]/**/*.scss';
```
