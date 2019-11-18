<img src="https://resource.alaskaair.net/-/media/2C1969F8FB244C919205CD48429C13AC" alt="Orion Design System Logo" title="Be the change you want to see" width="125" align="right" />

[![Build Status](https://travis-ci.org/AlaskaAirlines/OrionDesignTokens.svg?branch=master)](https://travis-ci.org/AlaskaAirlines/OrionDesignTokens)
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
| usage | string | description of toke use |
| wcag | string | WCAG accessibility rating of applicable |
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

Located in the [npm](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens) version of the Orion Design Tokens is a `./tokens` directory.

```
└── tokens
   ├── CSSCustomProperties--classicColors.css
   ├── CSSCustomProperties.css
   ├── JSData--color.js
   ├── JSObject--classicColors.js
   ├── JSObject--colorRedirects.js
   ├── JSObject--deprecated.js
   ├── JSVariables--color.js
   ├── SCSSVariables.scss
   ├── SassCustomProperties--classicColors.scss
   ├── SassCustomProperties.scss
   ├── TokenColorVariables.js
   ├── TokenProperties.css
   ├── TokenVariables.esm.js
   ├── _TokenProperties.scss
   └── _TokenVariables.scss
```

| file | syntax | type | status | filter type / description |
|---|---|---|---|---|
| CSSCustomProperties--classicColors | CSS | custom properties | current | filter: classic |
| CSSCustomProperties | CSS | custom properties | current | full list of v2.8 release tokens |
| JSData--color | JS module | color data | current | filter: color, current |
| JSObject--classicColors | js module | color data | current | filter: classic |
| JSObject--colorRedirects | js module | color data | current | filter: redirect |
| JSObject--deprecated | js module | deprecated tokens | current | filter: deprecated |
| JSVariables--color | js es6 | color data | current | filter: color |
| SCSSVariables | scss | Sass variables | current | full list of v2.8 release tokens |
| SassCustomProperties--classicColors | scss | custom properties | current | filter: classic |
| SassCustomProperties | scss | custom properties | current | full list of v2.8 release tokens |
| TokenColorVariables | js module | color data | deprecated | filter: color |
| TokenProperties | CSS | custom properties | deprecated | full list of < v2.8 tokens |
| TokenVariables.esm | js es6 | all data | deprecated | full list of < v2.8 tokens |
| _TokenProperties | scss | customn properties | deprecated | full list of < v2.8 tokens |
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

## Build Orion Design Tokens pipeline

Install dependency

```
$ npm i style-dictionary
```

The example pipeline contains all the steps you should consider when building your integrated Orion Design Tokens pipeline.

The example pipeline currently supports Sass and CSS examples. Native mobile platforms are supported, but not yet documented in this project.

### Project config.json install

To use Design Tokens with your project, it's suggested to create a `config.json` wherever makes sense for your build pipeline.

Referencing the example `config.json` file, look for the `"source"` key. Update the value to the path to where the npm packages are stored. Most likely you will use the following example.

```json
"source": [ "./node_modules/@alaskaairux/orion-design-tokens/**/*.json" ]
```

### Processing

The example `config.json` file covers a lot of possible outputs from the Design Tokens. When installing this into a production project you simply need to cover the platforms you intend to use.

Update the **buildPath** key to reference the directory where you want the generated file(s) to be placed.

```json
"buildPath": "./[project dir path]/[empty dir]/"
```

Update the **destination** key if you prefer a different name other than `_TokenVariables.scss`

Here is an example `config.json` file:

```json
{
  "source": [ "./node_modules/@alaskaairux/orion-design-tokens/**/*.json" ],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "./assets/src/sass/global/orion-design-tokens/",
      "files": [
        {
          "destination": "_TokenVariables.scss",
          "format": "scss/variables"
        }
      ]
    }
  }
}
```

### Running Style Dictionary (options)

To run Style Dictionary, you simply need to require the dependency and call the function. This will work in any Node.js instance.

```js
// Required dependency
const StyleDictionary = require('style-dictionary').extend('./[dir]/tokensConfig.json');

// Style Dictionary build function
StyleDictionary.buildAllPlatforms();
```

#### Using ./scripts/styleDictionary.js

The easiest way to integrate the Style Dictionary step is to create a `styleDictionary.js` file using the JavaScript API example shown above.

To execute the file, you could concatenate calls in your `package.json` build step, for example;

```js
"scripts": {
  "build": "node scripts/styleDictionary.js || webpack"
},
```

For example, see `./example/scripts/styleDictionary.js`. To run, use the following command:

```
$ npm run buildTokens
```

#### Webpack Shell Plugin

This 3rd option is a combination of the two previous options. In your project you could place the required dependency call and function in `./src/scripts/styleDictionary.js`. Then in your Webpack config file, require the Webpack Shell Plugin.

```js
const WebpackShellPlugin = require('webpack-shell-plugin');
```

Then further down in the same file, add the following plugin option:

```js
module.exports = {
  ...
  plugins: [
    new WebpackShellPlugin({
      onBuildStart:['node scripts/styleDictionary.js']
    })
  ],
  ...
}
```

This plugin will execute the necessary Style Dictionary command prior to executing Webpack.

#### Webpack and build.js (ejected create-react-app)

If you are using Webpack and a `build.js` or `start.js`, simply require the dependency and call the function. The only requirement is that the Style Dictionary function must run before running Webpack.

#### Config within pipeline

If prefer, you can bypass the `config.json` dependency and extend the configuration directly within the `extend()` function of your build pipeline.

```js
const StyleDictionary = require('style-dictionary').extend({
  "source": [ "./node_modules/@alaskaairux/orion-design-tokens/**/*.json" ],
  platforms: {
    scss: {
      transformGroup: 'scss',
      "buildPath": "./assets/src/sass/global/orion-design-tokens/",
      files: [{
        destination: '_TokenVariables.scss',
        format: 'scss/variables'
      }]
    }
  }
});

StyleDictionary.buildAllPlatforms();
```

### Style Dictionary (dependency)

For processing of `.json` files to a usable Sass/CSS resources, the Orion Design Tokens project uses [Style Dictionary](https://www.npmjs.com/package/style-dictionary). Data formatting and build process are engineered to Style Dictionary's opinions.

For more information, see Style Dictionary's [documentation](https://amzn.github.io/style-dictionary/#/).

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
