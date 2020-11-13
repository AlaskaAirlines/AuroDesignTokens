# Auro Design Tokens

## Install

[![Build Status](https://img.shields.io/github/workflow/status/AlaskaAirlines/orion-design-tokens/Test%20and%20publish?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/orion-design-tokens/actions?query=workflow%3A%22test+and+publish%22)
[![See it on NPM!](https://img.shields.io/npm/v/@alaskaairux/orion-design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens)
[![License](https://img.shields.io/npm/l/@alaskaairux/orion-design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

```
$ npm i @alaskaairux/orion-design-tokens
```

## Use pre-processed resources

Located in the `./dist/tokens` directory of the [npm](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens).

```
└── tokens
  ├── CSSCustomProperties--classicColors.css
  ├── CSSCustomProperties.css
  ├── CSSCustomPropertiesColorRGB.css
  ├── CSSOpacityProperties.scss
  ├── CSSSizeCustomProperties.css
  ├── CSSTokenProperties.css
  ├── JSData--color.js
  ├── JSObject--allTokens.js
  ├── JSObject--classicColors.js
  ├── JSObject--deprecated.js
  ├── JSVariables--color.js
  ├── SCSSOpacityVariables.scss
  ├── SCSSVariableMap.scss
  ├── SCSSVariables.scss
  ├── SassCustomProperties--classicColors.scss
  ├── SassCustomProperties.scss
  ├── SassCustomPropertiesColorRGB.scss
  ├── SassSizeCustomProperties.scss
  ├── TokenColorVariables.js
  ├── TokenVariables.esm.js
  ├── _TokenProperties.scss
  └── _TokenVariables.scss
```

### Resource Descriptions

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| CSSCustomProperties--classicColors | CSS | custom properties | current | filter: classic |
| CSSCustomProperties | CSS | custom properties | current | full list of v2.8 release tokens |
| CSSCustomPropertiesColorRGB | CSS | custom properties | current| Filter: color, public<br>custom RGB output
| CSSOpacityProperties | Sass | custom properties | current | filter: opacity |
| CSSSizeCustomProperties | CSS | custom properties | current | filter: size, public |
| JSData--color | JS module | color data | current | filter: color, current |
| JSObject--allTokens.js | JS module | all data | current | filter: public |
| JSObject--classicColors | js module | color data | current | filter: classic |
| JSObject--deprecated | js module | deprecated tokens | current | filter: deprecated |
| JSVariables--color | js es6 | color data | current | filter: color |
| SCSSOpacityVariables | Sass | Sass variables | current | filter: opacity |
| SCSSVariableMap | Sass | Sass variable map | current | filter: size, public |
| SCSSVariables | scss | Sass variables | current | full list of v2.8 release tokens |
| SassCustomProperties--classicColors | scss | custom properties | current | filter: classic |
| SassCustomProperties | scss | custom properties | current | full list of v2.8 release tokens |
| SassCustomPropertiesColorRGB | Sass | custom properties | current| Filter: color, public<br>custom RGB output
| SassSizeCustomProperties | Sass | custom properties | current | filter: size, public |
| TokenColorVariables | js module | color data | deprecated | filter: color |
| CSSTokenProperties | CSS | custom properties | deprecated | full list of < v2.8 tokens |
| TokenVariables.esm | js es6 | all data | deprecated | full list of < v2.8 tokens |
| _TokenProperties | scss | custom properties | deprecated | full list of < v2.8 tokens |
| _TokenVariables | scss | Sass variables | deprecated | full list of < v2.8 tokens |


### Install with Sass

```scss
@import "~@alaskaairux/orion-design-tokens/dist/tokens/SCSSVariables";

// or

@import "~@alaskaairux/orion-design-tokens/dist/tokens/SassCustomProperties";
```

### Install with CSS

With React or similar framework, the CSS file can be imported directly from the npm:

```js
import "@alaskaairux/orion-design-tokens/dist/tokens/CSSCustomProperties.css"
```

For other frameworks, it's suggested that the CSS file be copied from the npm into the scope of the project with a build scenario.

### Install ESModules

Within a webpacked application or a `type="module"` script:

```js
import { ColorAlertNotificationOnLight, ColorBorderErrorOnLight } from '@alaskaairux/orion-design-tokens/dist/tokens/JSVariables--color.js';
```

### Install from CDN

Using unpkg.com, every file in the dist directory can be accessed.

```html
<link rel="stylesheet" href="https://unpkg.com/@alaskaairux/orion-design-tokens@latest/dist/tokens/CSSCustomProperties.css">
```

For specifically the CSSCustomProperties.css file, a faster CDN resource is available.

```html
<link rel="stylesheet" href="https://p2pcontent-fd-prod.azurefd.net/auro/orion-design-tokens/tokens/CSSCustomProperties.css">
```
