# postcss-import-dynamic-scss [![Build Status][ci-img]][ci]

[PostCSS] plugin to inline @import rules content with extra features.

[postcss-import]: https://github.com/postcss/postcss-import
[PostCSS]: https://github.com/postcss/postcss

## Usage

```js
postcss([ require('postcss-import-dynamic-scss') ])
```

See [PostCSS] docs for examples for your environment.

## Resolving files with globs

The path to the file will be checked and if it contains a glob it will be used
to locate it. These can be mixed and matched with normal module paths:

```css
@import "suitcss-utils-display"; /* node_modules */
@import "./theme.[scss|css]"; /* relative path */
@import "./components/*.[scss|css]"; /* glob */
@import "suitcss-utils-size/lib/*.[scss|css]"; /* glob inside node_modules */
```

## Options

This plugin is a [postcss-import] extension which introduces its own `resolve` option.

### `prefix`

Type: `false` or `string`
Default: `false`

Allows partial-like importing with a prefix before the filename.

```css
@import 'modules/partial.[scss|css]';
/* will import modules/_partial.[scss|css] */
```

Prefixed versions are always favoured. Otherwise the non-prefix version is used:

```
├── _baz.[scss|css]
├── baz.[scss|css]
├── bar.[scss|css]
```

The matched files would be `['_baz.[scss|css]', 'bar.[scss|css]']`.

### `extensions`

Type: `array` or `string`
Default: `.[scss|css]`

Defines file extensions which will be looked for.

# License

MIT © [Bogdan Chadkin](mailto:trysound@yandex.ru)
