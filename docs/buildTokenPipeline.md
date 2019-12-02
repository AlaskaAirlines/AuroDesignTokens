<img src="https://resource.alaskaair.net/-/media/2C1969F8FB244C919205CD48429C13AC" alt="Orion Design System Logo" title="Be the change you want to see" width="125" align="right" />

[![Build Status](https://travis-ci.org/AlaskaAirlines/OrionDesignTokens.svg?branch=master)](https://travis-ci.org/AlaskaAirlines/OrionDesignTokens)
![npm (scoped)](https://img.shields.io/npm/v/@alaskaairux/orion-design-tokens.svg?color=orange)
![NPM](https://img.shields.io/npm/l/@alaskaairux/orion-design-tokens.svg?color=blue)

# Build Orion Design Tokens pipeline

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

##

<footer>
Alaska Airlines Orion Design System<br>
Copyright 2019 Alaska Airlines, Inc. or its affiliates. All Rights Reserved.
</footer>
