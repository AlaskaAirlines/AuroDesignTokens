<img src="https://resource.alaskaair.net/-/media/2C1969F8FB244C919205CD48429C13AC" alt="Orion Design System Logo" title="Be the change you want to see" width="125" align="right" />

[![Build Status](https://travis-ci.org/AlaskaAirlines/AuroDesignTokens.svg?branch=master)](https://travis-ci.org/AlaskaAirlines/OrionDesignTokens)
![npm (scoped)](https://img.shields.io/npm/v/@alaskaairux/orion-design-tokens.svg?color=orange)
![NPM](https://img.shields.io/npm/l/@alaskaairux/orion-design-tokens.svg?color=blue)

# Orion Design Tokens

Orion Design Tokens are abstract UI atomic values that make up the greater Orion Design System (ODS).

The goal of this project is to maintain these core values in such a way as to feed the UI of other engineering efforts, rather than be a manually communicated design dependency.

## Contained within this repository

This repository serves two purposes:

1. To maintain the single source of record of the distributed token files
1. Export pre-defined resources for projects to consume

### The ./src dir

Within the project's `src/` dir are the various token values stored in `.json` format. These are the production resources distributed via npm.

## Config filter API

The following table illustrated the different JSON options currently being used to filter the data output.

By default, no tokens are exposed in an output file unless specifically designated by a config filter option. See the table below for the different types of filters currently in use.

| filter | type | description |
|---|---|---|
| attributes {category/type/option} | string | follow the pattern of the [CTI Structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item) to determine the value of a category, type or option in the JSON |
| classic | boolean | token filter for `classic` theme values |
| deprecated | boolean | token marked as `deprecated` will be deleted with next MAJOR release version |
| legacy | boolean | token filter for legacy values |
| opacity | boolean | token filter for base colors with an alpha transparency |
| public | boolean | token filter for publicly exposed Design System tokens per the most recent spec |
| redirect | boolean | token filter for legacy values that have a new reference |

* **Classic:** Tokens that reference Alaska CLASSIC themes
* **Legacy:** Tokens established prior to v2.8 release
* **Public:** Currently approved for use Orion Design Tokens


Additional content options are made available within the token data. See the table below for these options and their descriptions.

| option | type | description |
|---|---|---|
| comment | string | comment that will appear in CSS/Sass output |
| reference | string | new token redirect reference |
| usage | string | description of token use |
| wcag | string | WCAG accessibility rating if applicable |
| value | string / number | the value of the token |

## Contributing

Please be sure to follow current Design Token patterns and follow the [CTI Structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item). Any submissions to this project that does not follow these guidelines will be considered non-compliant and your submission will be rejected.

Also, please see this repo's [contributing guidelines](https://github.com/AlaskaAirlines/OrionDesignTokens/blob/master/CONTRIBUTING.md).

Before submitting a pull request, please ensure that your JSON is formatted correctly. Testing is easy, you can build out resource files that are not added to the repo's version control.

To mimic a CI Build and ensure a successful build with a merge, please run the following command to test the build pipeline:

```bash
$ npm run ciBuild
```

**All tests will run with the automated build, but it's a good idea to run tests locally to ensure stability of pull request**

## Install

To install in your project, see instructions from [npmjs.org](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens)

```
npm i @alaskaairux/orion-design-tokens
```

## Install pre-processed resources

Located in the Orion Design Tokens [npm](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens) in the `./tokens` directory.

```
└── tokens
  ├── CSSCustomProperties--classicColors.css
  ├── CSSCustomProperties.css
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
  ├── SassSizeCustomProperties.scss
  ├── TokenColorVariables.js
  ├── TokenVariables.esm.js
  ├── _TokenProperties.scss
  └── _TokenVariables.scss
```

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| CSSCustomProperties--classicColors | CSS | custom properties | current | filter: classic |
| CSSCustomProperties | CSS | custom properties | deprecated | full list of v2.8 release tokens |
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
| SassSizeCustomProperties | Sass | custom properties | current | filter: size, public |
| TokenColorVariables | js module | color data | deprecated | filter: color |
| CSSTokenProperties | CSS | custom properties | deprecated | full list of < v2.8 tokens |
| TokenVariables.esm | js es6 | all data | deprecated | full list of < v2.8 tokens |
| _TokenProperties | scss | custom properties | deprecated | full list of < v2.8 tokens |
| _TokenVariables | scss | Sass variables | deprecated | full list of < v2.8 tokens |


**To install in Sass file:**

```scss
@import "~@alaskaairux/orion-design-tokens/dist/tokens/SCSSVariables";

// or

@import "~@alaskaairux/orion-design-tokens/dist/tokens/SassCustomProperties";
```

**To install CSS file:**

With React or similar framework, the CSS file can be imported directly from the npm:

```js
import "@alaskaairux/orion-design-tokens/tokens/dist/CSSCustomProperties.css";
```

For other frameworks, it's suggested that the CSS file be copied from the npm into the scope of the project with a build scenario.

**To install ESModules file:**

Within a webpacked application or a `type="module"` script:

```js
import { ColorAlertNotificationOnLight, ColorBorderErrorOnLight } from '@alaskaairux/orion-design-tokens/dist/tokens/JSVariables--color.js';
```

## Managing deprecated resources

All the Orion tokens are supported with the v2.8 release. All the new Auro tokens have been added to allow for deprecation of Orion tokens. Once v3.0 of the Design Tokens is released, all Orion tokens will be deleted from this repo.

### Orion pre-processed resources

If your project is already using pre-processed resources as listed below, your project should see no change in token support.

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| TokenColorVariables | js module | color data | deprecated | filter: color |
| CSSTokenProperties | CSS | custom properties | deprecated | full list of < v2.8 tokens |
| TokenVariables.esm | js es6 | all data | deprecated | full list of < v2.8 tokens |
| _TokenProperties | scss | custom properties | deprecated | full list of < v2.8 tokens |
| _TokenVariables | scss | Sass variables | deprecated | full list of < v2.8 tokens |

### Orion local build support

If your project is using a local Style Dictionary build, by upgrading to v2.8 you will get ALL the tokens. This will include Classic, Orion and Auro.

Adding the following filters to your config.json file will filter out all the new Auro tokens and only produce a tokens stylesheet with legacy Orion and Classic tokens.

```
  "files": [
    {
      "filter": {
        "legacy": true
      }
    }
  ]
```

### Moving from Orion to Auro tokens

When using the Design Tokens, all the deprecated token files have comments as to the status of the token. See examples below for comments that denote a new token to be used in place of a deprecated one, a token that should only be used with CLASSIC UIs, and a deprecated token with no replacement and will be removed with the next major release.

```
:root {

   --breakpoint-width-narrow: 480px; /*
  // New token, see breakpoint-sm */

   --color-classic-calm: #8ba6c1; /*
  // DO NOT USE for anything other than legacy projects or classic component themes */

   --color-background-booking-bar: #156fad; /*
  // Deprecated, no replacement; token to be REMOVED in next MAJOR release */

}
```

A web view of all the deprecated tokens will be made available. If required, please see the following data file for reference:

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| JSObject--deprecated | js module | deprecated tokens | current | filter: deprecated |


## Sass or CSS Custom Properties?

Style Dictionary is able to output variable files in either Sass or CSS Custom Properties (variables) format. The example pipeline and the `style.scss` file has references to both Sass and CSS variables.

**Important:** CSS variables need to have their references available to them in the final output CSS. Whereas Sass will convert these values to static values in the output CSS.

The example build pipeline addresses this by concatenating the CSS variables with the final CSS output file.

## Hex Codes

Style Dictionary requires that color definitions be established as hex values that then can be transformed into various outputs, e.g. rgba, rgb 6-digit hex, iOS and Android color vars.

To support alpha values, it is suggested to use 8-digit or RGBA hex values, where the last digit(s) represents the alpha value. For more information see [8-Digit Hex Codes?](https://css-tricks.com/8-digit-hex-codes/) and here for a full [#RRGGBBAA table](https://borderleft.com/toolbox/rrggbbaa/).

## Native output support

Style Dictionary fully supports native platforms and is able to output resources that are usable in both iOS and Android native development.


##

<footer>
Alaska Airlines Orion Design System<br>
Copyright 2019 Alaska Airlines, Inc. or its affiliates. All Rights Reserved.
</footer>
