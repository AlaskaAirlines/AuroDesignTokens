# Orion Design Tokens (ODT)

[![Build status](https://itsals.visualstudio.com/Orion%20Design%20System/_apis/build/status/Design%20Tokens)](https://itsals.visualstudio.com/Orion%20Design%20System/_build/latest?definitionId=2769)

Design Tokens are abstract UI atomic values that make up the greater Orion Design System (ODT).

The goal of this project is to maintain these core values in such a way as to feed the UI of other engineering efforts, rather than be a manually communicated design dependency.

## Contained within this repository

This repository serves two purposes:

1. To maintain the single source of record of the distributed token files
1. Provide example pipelines of how to use Design Tokens in prod apps

### The src/ dir

Within the project's `src/` dir are the various token values stored in `.json` format.

Only these source files are included in the npm build for project reference. Example pipelines and documentation are **not**.

### The example/ dir

Contained within the `example/` directory are example `style.scss` and `config.json` files that illustrate how the Orion Design Tokens can be included with a production project.

### Example config.json file

The `config.json` file, contained within the `example/` directory will output multiple production consumable assets, but **you will not use ALL of them** on any one project. Examples for the following platforms are currently supported:

1. CSS
1. Sass
1. Android
1. iOS
1. Sketch (specifically color palette generation)

### The gulpfile

The `./gulpfile.js` file is an example build pipeline that will consume the Orion Design Tokens and create the necessary resources for a production project.

See code comments for information as to the Gulp tasks.

### Webpack

A Webpack pipeline is supported. See **Install w/Webpack** for more information.

### Run this example locally

To run locally, clone the resources and run the following commands:

```
$ npm i   // install all dependencies
$ gulp    // run example gulp build pipeline
```

Once all the dependencies are installed, the pipeline should output all the necessary build resources from the repo's example and output them within the `example/` dir.

## Install with your production project

To install ODT into your production project requires two steps:

1. npm install the [ODT package](https://itsals.visualstudio.com/Orion%20Design%20System/_packaging?feed=as.com-npm&package=%40alaskaair%2Falaskaair-design-tokens&version=0.1.1384816&protocolType=Npm&_a=package)
1. Build a processing pipeline

## Build ODT pipeline

The example pipeline contains all the steps you should consider when building your integrated ODT pipeline.

The example pipeline currently supports Sass and CSS examples. Native mobile platforms are supported, but not yet documented in this project.

### Project config.json install

To use Design Tokens with your project, it's suggested to create a `config.json` wherever makes sense for your build pipeline.

Referencing the example `config.json` file, look for the `"source"` key. Update the value to the path to where the npm packages are stored. Most likely you will use the following example.

```
"source": [ "./node_modules/@alaskaair/orion-design-tokens/**/*.json" ]
```

### Processing platform

The example `config.json` file covers a lot of possible outputs from the Design Tokens. When installing this into a production project you simply need to cover the platforms you intend to use.

Update the **buildPath** key to reference the directory where you want the generated file(s) to be placed.

```
"buildPath": "./[project dir path]/[empty dir]/"
```

Update the **destination** key if you prefer a different name other than `_TokenVariables.scss`

Your `config.json` file would most likely look like the following:

```
{
  "source": [ "./node_modules/@alaskaair/orion-design-tokens/**/*.json" ],
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

### Install w/Gulp

To install with Gulp, add the following example code to your gulpfile.js

```js
const StyleDictionary = require('style-dictionary').extend('./[dir]/tokenConfig.json')

// Gulp task to process Design Tokens to Sass variable file
// See config.json for Style Dictionary process settings
gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});
```

### Install w/Webpack

Working with Webpack, it's recommend that you use a `build.js` or `start.js` file to manage manual tasks so that the Sass resource is available just in time for the Webpack CSS processing.

```js
const StyleDictionary = require('style-dictionary').extend('./[dir]/tokensConfig.json');

// Style Dictionary
StyleDictionary.buildAllPlatforms();
```

### Config within pipeline

If preferred, you can bypass the `config.json` dependency and extend the configuration directly within the `extend()` function of your build pipeline.

```js
const StyleDictionary = require('style-dictionary').extend({
  "source": [ "./node_modules/@alaskaair/orion-design-tokens/**/*.json" ],
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

For processing of `.json` files to a usable Sass/CSS resources, the ODT project uses [Style Dictionary](https://www.npmjs.com/package/style-dictionary). Data formatting and build process are engineered to Style Dictionary's opinions.

For more information, see Style Dictionary's [documentation](https://amzn.github.io/style-dictionary/#/).


#### Install package dependency

```
$ npm i style-dictionary -D
```

## Sass or CSS Custom Properties?

Style Dictionary is able to output variable files in either Sass or CSS Custom Properties (variables) format. The example pipeline and the `style.scss` file has references to both Sass and CSS variables.

**Important:** CSS variables need to have their references available to them in the final output CSS. Whereas Sass will convert these values to static values in the output CSS.

The example build pipeline addresses this by concatenating the CSS variables with the final CSS output file.

## Native output support

Style Dictionary fully supports native platforms and is able to output resources that are usable in both iOS and Android native development.

## CSS Custom Properties browser support

CSS Custom Properties are new to CSS and thus do not have good legacy browser support. The term polyfill is used loosely in this scenario in that legacy browser support is best addressed in a PostCSS build pipeline.

In the example, the processed Sass is put through a PostCSS process that takes the variable value and creates a static property alongside the dynamic one. You have the option to preserve the custom property or remove it from the final output CSS. It is recommended that you **preserve** the dynamic value for browsers that support this convention.
