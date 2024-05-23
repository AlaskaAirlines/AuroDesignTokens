# Auro Design Tokens

## Installation

[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/AuroDesignTokens/testPublish.yml?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/AuroDesignTokens/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@aurodesignsystem/design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@aurodesignsystem/design-tokens)
[![License](https://img.shields.io/npm/l/@aurodesignsystem/design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

```
$ npm i @aurodesignsystem/design-tokens
```

## Using Pre-processed Resources

Pre-processed resources are available in the `./dist/tokens` directory of the [npm package](https://www.npmjs.com/package/@aurodesignsystem/design-tokens).

```
└── tokens
   ├── CSSCustomProperties.css
   ├── CSSSizeCustomProperties.css
   ├── JSData--color.js
   ├── JSONVariablesFlat.json
   ├── JSONVariablesNested.json
   ├── JSObject--allTokens.js
   ├── JSObject--deprecated.js
   ├── JSVariables--color.js
   ├── SCSSVariableMap.scss
   ├── SCSSVariables.scss
   ├── SCSSVariablesMapFlat.scss
   ├── SassCustomProperties.scss
   ├── SassSizeCustomProperties.scss
   ├── darkmode
   |  ├── CSSCustomProperties.css
   |  ├── JSDataColor.js
   |  ├── JSObject--deprecatedDark.js
   |  ├── JSVariablesColor.js
   |  ├── SCSSVariables.scss
   |  ├── SCSSVariablesMapFlat.scss
   |  └── SassCustomProperties.scss
   └── excursion
      ├── JSONVariablesFlat.json
      └── JSONVariablesNested.json
```

### Resource Descriptions

| File                   | Syntax    | Type               | Status  | Filter Type / Description  |
|------------------------|-----------|--------------------|---------|-----------------------------|
| CSSCustomProperties    | CSS       | Custom properties  | Current | All v4.0x release tokens   |
| CSSSizeCustomProperties| CSS       | Custom properties  | Current | Filter: size, public       |
| JSData--color          | JS module | Color data         | Current | Filter: color, current      |
| JSONVariablesFlat      | JSON Data | All data           | Current | All v4.0x release tokens   |
| JSONVariablesNested    | JSON Data | All data           | Current | All v4.0x release tokens   |
| JSObject--deprecated   | JS module | Deprecated tokens | Current | Filter: deprecated, public |
| JSObject--allTokens.js | JS module | All data           | Current | All v4.0x release tokens   |
| JSVariables--color     | JS ES6    | Color data         | Current | Filter: color               |
| SCSSVariableMap        | Sass      | Sass variable map  | Current | Filter: size, public       |
| SCSSVariables          | SCSS      | Sass variables     | Current | All v4.0x release tokens   |
| SCSSVariablesMapFlat   | SCSS      | Sass variable map  | Current | All v4.0x release tokens   |
| SassCustomProperties   | SCSS      | Custom properties  | Current | All v4.0x release tokens   |
| SassSizeCustomProperties| Sass     | Custom properties  | Current | Filter: size, public       |

### Migration from 3.x to 4.x

With the release of Auro Design Tokens 4.x, a new variable namespace was introduced. The project has replaced `--auro` with `--ds` to support upcoming theming capabilities.

Since not all Auro web components are using the new tokens, simply replacing the 3.x version with the 4.x version will break your UI.

To ensure a smooth transition between the two sets of design tokens, we highly recommend the following approach:

1. Install the new `@aurodesignsystem/design-tokens@4.x` in your app, but DO NOT uninstall `@alaskaairux/design-tokens@3.15.5`.
2. Update to use the new `@aurodesignsystem/webcorestylesheets`, which fully supports the new token naming spec.
3. Review the [Deprecated tokens list](https://auro.alaskaair.com/getting-started/developers/design-tokens/deprecated) for a matrix of changes. Some tokens have been removed from the project and need to be updated.

By supporting both the legacy and new Auro design tokens in your project, you ensure a smooth transition until all Auro components have been updated and your project has also updated local SCSS/CSS files with the new references.

### Install with Sass

When working with Sass, the preprocessor scripting language, there are several options for incorporating design tokens into your project. First, ensure that all design tokens are included to fulfill CSS custom property requests. This can be achieved by importing the SCSS file as demonstrated below:

```scss
@import "~@aurodesignsystem/design-tokens/dist/tokens/SassCustomProperties.scss";
```

Even if Sass isn't utilized, `SassCustomProperties.scss` remains an option, though not mandatory. Alternatively, you can load all tokens using `CSSCustomProperties.css` anywhere within the project's header.

Moreover, if project specifications dictate the use of Sass variables, `SCSSVariables.scss` can be imported. This is necessary for projects utilizing WCSS due to a dependency on these variables.

```scss
@import "~@aurodesignsystem/design-tokens/dist/tokens/SCSSVariables.scss";
```

**NOTE:** When developing new UI code in Sass, it's still advisable to leverage CSS custom properties over Sass variables. See **Install with CSS** below.

### Install with CSS

For React or similar frameworks, simply import the CSS file directly from npm:

```js
import "@aurodesignsystem/design-tokens/dist/tokens/CSSCustomProperties.css"
```

For other frameworks, you'll need to copy the CSS file from the npm resource into your project using a build scenario.

### Install ESModules

In a webpack-supported application or a `type="module"` script:

```js
import { AuroColorAlertNotificationOnLight, AuroColorBorderErrorOnLight } from '@aurodesignsystem/design-tokens/dist/tokens/JSVariables--color.js';
```

### Install from CDN

Using the `https://cdn.jsdelivr.net/npm/` CDN, every file in the dist directory can be accessed like so:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm//@aurodesignsystem/design-tokens@latest/dist/tokens/CSSCustomProperties.css">
```

**Note:** Exercise caution when using this CDN solution. The Auro team is NOT responsible for the maintenance of the CDN `https://cdn.jsdelivr.net/` [uptime](https://www.isitupdown.com/jsdelivr) and are unable to effectively troubleshoot response issues. It is recommended to use the installed version of Auro Design Tokens for critical UIs. Any additional CDN solution must be maintained by the team using this solution per this [Discussion](https://github.com/orgs/AlaskaAirlines/discussions/513).
