# Auro Design Tokens

## Installation

[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/AuroDesignTokens/testPublish.yml?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/AuroDesignTokens/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@aurodesignsystem/design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@aurodesignsystem/design-tokens)
[![License](https://img.shields.io/npm/l/@aurodesignsystem/design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

```
$ npm i @aurodesignsystem/design-tokens
```

## Using Pre-processed Resources

Pre-processed resources are available in the `./dist/` directory of the [npm package](https://www.npmjs.com/package/@aurodesignsystem/design-tokens).

```
└── dist
    ├── alaska
    │   └── CSSCustomProperties--alaska.css
    │   └── primitives--alaska.scss
    ├── auro-classic
    │   ├── CSSCustomProperties.css
    │   ├── CSSSizeCustomProperties.css
    │   ├── JSData--color.js
    │   ├── JSObject--deprecated.js
    │   ├── JSONVariablesFlat.json
    │   ├── JSONVariablesNested.json
    │   ├── JSVariables--color.js
    │   ├── SassCustomProperties.scss
    │   ├── SassSizeCustomProperties.scss
    │   ├── SCSSVariableMap.scss
    │   ├── SCSSVariables.scss
    │   └── SCSSVariablesMapFlat.scss
    ├── hawaiian
    │   └── CSSCustomProperties--hawaiian.css
    │   └── primitives--hawaiian.scss
    └── transparent
        └── CSSCustomProperties--transparent.css
```

### Resource Descriptions

### `alaska` theme

| File                        | Syntax | Type               | Status  | Filter Type / Description                            |
|-----------------------------|--------|--------------------|---------|------------------------------------------------------|
| CSSCustomProperties--alaska | CSS    | Custom properties  | Current | All v5.x semantic tokens for the Alaska theme       |
| primitives--alaska          | SCSS   | Sass variables     | Current | All v5.x semantic token values for the Alaska theme |

### `hawaiian` theme

| File                          | Syntax | Type               | Status  | Filter Type / Description                              |
|-------------------------------|--------|--------------------|---------|--------------------------------------------------------|
| CSSCustomProperties--hawaiian | CSS    | Custom properties  | Current | All v5.x release tokens for the Hawaiian theme         |
| primitives--hawaiian          | SCSS   | Sass variables     | Current | All v5.x semantic token values for the Hawaiian theme |

### `auro-classic` theme

| File                     | Syntax    | Type               | Status     | Filter Type / Description       |
|--------------------------|-----------|--------------------|------------|---------------------------------|
| CSSCustomProperties      | CSS       | Custom properties  | Deprecated | All v4.x release tokens         |
| CSSSizeCustomProperties  | CSS       | Custom properties  | Deprecated | Filter v4.x: size, public       |
| JSData--color            | JS module | Color data         | Deprecated | Filter v4.x: color, Deprecated  |
| JSONVariablesFlat        | JSON Data | All data           | Deprecated | All v4.x release tokens         |
| JSONVariablesNested      | JSON Data | All data           | Deprecated | All v4.x release tokens         |
| JSObject--deprecated     | JS module | Deprecated tokens  | Deprecated | Filter v4.x: deprecated, public |
| JSObject--allTokens.js   | JS module | All data           | Deprecated | All v4.x release tokens         |
| JSVariables--color       | JS ES6    | Color data         | Deprecated | Filter v4.x: color              |
| SCSSVariableMap          | Sass      | Sass variable map  | Deprecated | Filter v4.x: size, public       |
| SCSSVariables            | SCSS      | Sass variables     | Deprecated | All v4.x release tokens         |
| SCSSVariablesMapFlat     | SCSS      | Sass variable map  | Deprecated | All v4.x release tokens         |
| SassCustomProperties     | SCSS      | Custom properties  | Deprecated | All v4.x release tokens         |
| SassSizeCustomProperties | Sass      | Custom properties  | Deprecated | Filter v4.x: size, public       |

### `transparent` theme

| File                                | Syntax    | Type               | Status     | Filter Type / Description |
|-------------------------------------|-----------|--------------------|------------|---------------------------|
| CSSCustomProperties--transparent    | CSS       | Custom properties  | Deprecated | All v4.0x release tokens  |

### Migration from v4.x to v5.x

With the release of Auro Design Tokens 5.x significant changes have occurred.

- `./dist/` directory has been restructured. All file imports will need to have their paths updated.
- The v4.x default theme is now called `Auro Classic`. The files for this theme may be found in `./dist/auro-classic`. This theme is now deprecated.
- **NEW** Alaska theme found in `./dist/alaska`.
- **NEW** Hawaiian theme found in `./dist/hawaiian`.
- The Alaska theme and Hawaiian theme are intended to be used one at a time within a given DOM `scope`. It is not supported to load both themes into the same `scope` of the document.
- v4.x and v5.x token names are unique to each version. As such, the `./dist/auro-classic` theme can be loaded with any of the other themes to support old Auro component versions that do not yet run on the v5.x tokens.
- Review the [Deprecated tokens list](https://auro.alaskaair.com/getting-started/developers/design-tokens/deprecated) for a matrix of changes. Some tokens have been removed from the project and need to be updated.

By supporting both the legacy and new Auro design tokens in your project, you ensure a smooth transition until all Auro components have been updated and your project has also updated local SCSS/CSS files with the new references.

### Install with Sass

When working with Sass, the preprocessor scripting language, there are several options for incorporating design tokens into your project. First, ensure that all design tokens are included to fulfill CSS custom property requests. This can be achieved by importing the SCSS file as demonstrated below:

_note: this example is based on using the Alaska theme, substitute the directory path for the theme you wish to use._

```scss
@import "~@aurodesignsystem/design-tokens/dist/alaska/primitives--alaska.scss";
```

**NOTE:** When developing new UI code in Sass, it's still advisable to leverage CSS custom properties over Sass variables. See **Install with CSS** below.

### Install with CSS

For React or similar frameworks, simply import the CSS file directly from npm:

_note: this example is based on using the Alaska theme, substitute the directory path for the theme you wish to use._

```js
import "@aurodesignsystem/design-tokens/dist/alaska/CSSCustomProperties--alaska.css"
```

For other frameworks, you'll need to copy the CSS file from the npm resource into your project using a build scenario.

### Install ESModules

_Note: ESModules are not yet available for the v5.x tokens._

In a webpack-supported application or a `type="module"` script:

```js
import { AuroColorAlertNotificationOnLight, AuroColorBorderErrorOnLight } from '@aurodesignsystem/design-tokens/dist/auro-classic/JSVariables--color.js';
```

### Install from CDN

Using the `https://cdn.jsdelivr.net/npm/` CDN, every file in the dist directory can be accessed like so:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm//@aurodesignsystem/design-tokens@latest/dist/auro-alaska/CSSCustomProperties--alaska">
```

**Note:** Exercise caution when using this CDN solution. The Auro team is NOT responsible for the maintenance of the CDN `https://cdn.jsdelivr.net/` [uptime](https://www.isitupdown.com/jsdelivr) and are unable to effectively troubleshoot response issues. It is recommended to use the installed version of Auro Design Tokens for critical UIs. Any additional CDN solution must be maintained by the team using this solution per this [Discussion](https://github.com/orgs/AlaskaAirlines/discussions/513).
