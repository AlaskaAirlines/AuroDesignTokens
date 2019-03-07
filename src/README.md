# Orion Design Tokens

Orion Design Tokens are abstract UI atomic values that make up the greater Orion Design System (ODS).

The goal of this project is to maintain these core values in such a way as to feed the UI of other engineering efforts, rather than be a manually communicated design dependency.

## Build Orion Design Tokens pipeline

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

Your `config.json` file would most likely look like the following:

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

#### Gulp

To run with Gulp, simply require the dependency and wrap the function in any Gulp task;

```js
gulp.task('buildTokens', function() {
  StyleDictionary.buildAllPlatforms();
});
```

#### Webpack and build.js (ejected create-react-app)

If you are using Webpack and a `build.js` or `start.js`, simply require the dependency and call the function. The only requirement is that the Style Dictionary function must run before running Webpack.

#### Webpack and styleDictionary.js

If your project is not using a `build.js` or `start.js` configuration, another way to use Style Dictionary is to place the function call in a separate `.js` file.

For example, in your project you could place the required dependency call and function in `./src/scripts/styleDictionary.js`.

To execute the file, you could concatenate calls in your `package.json` build step, for example;

```js
"scripts": {
  "build": "node scripts/styleDictionary.js && webpack"
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

#### Config within pipeline

If preferred, you can bypass the `config.json` dependency and extend the configuration directly within the `extend()` function of your build pipeline.

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

## Sass or CSS Custom Properties?

Style Dictionary is able to output variable files in either Sass or CSS Custom Properties (variables) format. The example pipeline and the `style.scss` file has references to both Sass and CSS variables.

**Important:** CSS variables need to have their references available to them in the final output CSS. Whereas Sass will convert these values to static values in the output CSS.

The example build pipeline addresses this by concatenating the CSS variables with the final CSS output file.

## Native output support

Style Dictionary fully supports native platforms and is able to output resources that are usable in both iOS and Android native development.

## CSS Custom Properties browser support

CSS Custom Properties are new to CSS and thus do not have good legacy browser support. The term polyfill is used loosely in this scenario in that legacy browser support is best addressed in a PostCSS build pipeline.

In the example, the processed Sass is put through a PostCSS process that takes the variable value and creates a static property alongside the dynamic one. You have the option to preserve the custom property or remove it from the final output CSS. It is recommended that you **preserve** the dynamic value for browsers that support this convention.
