# Sass Dynamic imports

The library is designed to import dynamically scss files in dynamic folders.

## Install Sass

Sass library is required to use this package

```bash
npm i sass
```

## Install library

```bash
npm i -g sass-dynamic-imports
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

```json
 "scripts": {
  "dev:sass": "dynamic-sass --watch styles/index.scss:styles/index.css",
  "dev": "concurrently --kill-others \"next dev\" \"npm run dev:sass\"",
 }
```

## Usage

in scss file:

```scss
  @import './[folder_name]/**/*.scss';
```

will watch all scss files on any folder on [folder_name] folder

```scss
  .class {
    color: env(VARIABLE)
  }
```

will use env Variable

```scss
  @minimify;
```

will minimify css file
