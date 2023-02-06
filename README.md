# Auro Design Tokens

## Install

[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/AuroDesignTokens/testPublish.yml?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/AuroDesignTokens/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@alaskaairux/design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@alaskaairux/design-tokens)
[![License](https://img.shields.io/npm/l/@alaskaairux/design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

```
$ npm i @alaskaairux/design-tokens
```

## Use pre-processed resources

Located in the `./dist/tokens` directory of the [npm](https://www.npmjs.com/package/@alaskaairux/design-tokens).

```
└── tokens
   ├── CSSCustomProperties.css
   ├── CSSCustomPropertiesColorRGB.css
   ├── CSSOpacityProperties.scss
   ├── CSSSizeCustomProperties.css
   ├── JSData--color.js
   ├── JSObject--allTokens.js
   ├── JSObject--deprecated.js
   ├── JSVariables--color.js
   ├── SCSSOpacityVariables.scss
   ├── SCSSVariableMap.scss
   ├── SCSSVariables.scss
   ├── SCSSVariablesMapFlat.scss
   ├── SassCustomProperties.scss
   ├── SassCustomPropertiesColorRGB.scss
   └── SassSizeCustomProperties.scss
```

### Resource Descriptions

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| CSSCustomProperties | CSS | custom properties | current | full list of v3.0x release tokens |
| CSSCustomPropertiesColorRGB | CSS | custom properties | current| Filter: color, public<br>custom RGB output
| CSSOpacityProperties | Sass | custom properties | current | filter: opacity |
| CSSSizeCustomProperties | CSS | custom properties | current | filter: size, public |
| JSData--color | JS module | color data | current | filter: color, current |
| JSObject--deprecated | JS module | deprecated tokens | current | filter: deprecated, pubic |
| JSObject--allTokens.js | JS module | all data | current | filter: public |
| JSVariables--color | js es6 | color data | current | filter: color |
| SCSSOpacityVariables | Sass | Sass variables | current | filter: opacity |
| SCSSVariableMap | Sass | Sass variable map | current | filter: size, public |
| SCSSVariables | scss | Sass variables | current | full list of v3.0x release tokens |
| SCSSVariablesMapFlat | scss | Scss variable map | current | full list of v3.0x release tokens |
| SassCustomProperties | scss | custom properties | current | full list of v3.0x release tokens |
| SassCustomPropertiesColorRGB | Sass | custom properties | current| Filter: color, public<br>custom RGB output
| SassSizeCustomProperties | Sass | custom properties | current | filter: size, public |


### Install with Sass

```scss
@import "~@alaskaairux/design-tokens/dist/tokens/SCSSVariables";

// or

@import "~@alaskaairux/design-tokens/dist/tokens/SassCustomProperties";
```

### Install with CSS

With React or similar framework, the CSS file can be imported directly from the npm:

```js
import "@alaskaairux/design-tokens/dist/tokens/CSSCustomProperties.css"
```

For other frameworks, it's suggested that the CSS file be copied from the npm into the scope of the project with a build scenario.

### Install ESModules

Within a webpacked application or a `type="module"` script:

```js
import { AuroColorAlertNotificationOnLight, AuroColorBorderErrorOnLight } from '@alaskaairux/design-tokens/dist/tokens/JSVariables--color.js';
```

### Install from CDN

Using unpkg.com, every file in the dist directory can be accessed.

```html
<link rel="stylesheet" href="https://unpkg.com/@alaskaairux/design-tokens@latest/dist/tokens/CSSCustomProperties.css">
```

For specifically the CSSCustomProperties.css file, a faster CDN resource is available.

```html
<link rel="stylesheet" href="https://p2pcontent-fd-prod.azurefd.net/auro/tokens/CSSCustomProperties.css">
```
