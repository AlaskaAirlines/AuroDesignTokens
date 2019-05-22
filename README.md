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
1. Provide example pipelines of how to use Design Tokens in prod apps

### The ./src dir

Within the project's `src/` dir are the various token values stored in `.json` format. These are the production resources distributed via npm.

### The ./example dir

Contained within the `example/` directory are example `style.scss` and `config.json` files that illustrate how the Orion Design Tokens can be included with a production project.

### ./example/config.json file

The `config.json` file, contained within the `./example/` directory will output multiple production consumable assets. Examples for the following platforms are currently supported:

1. CSS
1. Sass
1. Android
1. iOS
1. Sketch (specifically color palette generation)

### Example ./gulpfile.js

The `./gulpfile.js` file is an example build pipeline that will consume the Orion Design Tokens and create the resources for a production project. It is not used for any production or recommended for use outside this project.

See code comments for information as to the Gulp tasks.

### Run this example locally

To run locally, clone the resources and run the following commands:

```
$ npm i   // install all dependencies
$ gulp    // run example gulp build pipeline
```

Once all the dependencies are installed, the pipeline should output all the necessary build resources from the repo's example and output them within the `example/` dir.

## Contributing

Please be sure to follow current Design Token patterns and follow the [CTI Structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item). Any submissions to this project that does not follow these guidelines will be considered non-compliant and your submission will be rejected.

Also, please see this repo's [contributing guidelines](https://github.com/AlaskaAirlines/OrionDesignTokens/blob/master/CONTRIBUTING.md).

Before submitting a pull request, please ensure that your JSON is formatted correctly. Testing is easy, you can build out resource files that are not added to the repo's version control:

```
$ gulp
```

If you just want to validate the JSON, you can do the following:

```
$ gulp test
```

**All tests will run with the automated build, but it's a good idea to run tests locally to ensure stability of pull request**

## Install

To install in your project, see instructions from [npmjs.org](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens)

```
npm i @alaskaairux/orion-design-tokens
```

## Build Orion Design Tokens pipeline

The example pipeline contains all the steps you should consider when building your integrated Orion Design Tokens pipeline.

The example pipeline currently supports Sass and CSS examples. Native mobile platforms are supported, but not yet documented in this project.

### Project config.json install

To use Design Tokens with your project, it's suggested to create a `config.json` wherever makes sense for your build pipeline.

Referencing the example `config.json` file, look for the `"source"` key. Update the value to the path to where the npm packages are stored. Most likely you will use the following example.

```
"source": [ "./node_modules/@alaskaairux/orion-design-tokens/**/*.json" ]
```

### Processing

The example `config.json` file covers a lot of possible outputs from the Design Tokens. When installing this into a production project you simply need to cover the platforms you intend to use.

Update the **buildPath** key to reference the directory where you want the generated file(s) to be placed.

```
"buildPath": "./[project dir path]/[empty dir]/"
```

Update the **destination** key if you prefer a different name other than `_TokenVariables.scss`

Here is an example `config.json` file:

```
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


Dependency is installed with this package

## Install pre-processed resources

Located in the [npm](https://www.npmjs.com/package/@alaskaairux/orion-design-tokens) version of the Orion Design Tokens is a `./tokens` directory.

```
└── tokens
   ├── TokenProperties.css
   ├── _TokenProperties.scss
   └── _TokenVariables.scss
```

| file | type | syntax |
|---|---|---|
| TokenProperties.css | CSS Custom Properties | CSS |
| _TokenProperties.scss | CSS Custom Properties | SCSS |
| _TokenVariables.scss | Sass variables | SCSS |

**To install in Sass file:**

```
@import "~@alaskaairux/orion-design-tokens/tokens/TokenVariables";

or

@import "~@alaskaairux/orion-design-tokens/tokens/TokenProperties";
```

**To install CSS file:**

With React or similar framework, the CSS file can be imported directly from the npm:

```
import "@alaskaairux/orion-design-tokens/tokens/TokenProperties.css";
```

For other frameworks, it's suggested that the CSS file be copied from the npm into the scope of the project with a build scenario.

## Sass or CSS Custom Properties?

Style Dictionary is able to output variable files in either Sass or CSS Custom Properties (variables) format. The example pipeline and the `style.scss` file has references to both Sass and CSS variables.

**Important:** CSS variables need to have their references available to them in the final output CSS. Whereas Sass will convert these values to static values in the output CSS.

The example build pipeline addresses this by concatenating the CSS variables with the final CSS output file.

## Native output support

Style Dictionary fully supports native platforms and is able to output resources that are usable in both iOS and Android native development.

## CSS Custom Properties browser support

CSS Custom Properties are new to CSS and thus do not have good legacy browser support. The term polyfill is used loosely in this scenario in that legacy browser support is best addressed in a PostCSS build pipeline.

In the example `gulpfile.js` the processed Sass is put through a PostCSS process to create a fallback CSS property. You have the option to preserve the custom property or remove it from the final output CSS. It is recommended that you **preserve** the dynamic value for browsers that support this convention.
