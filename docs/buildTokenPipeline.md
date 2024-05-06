# Style Dictionary Build Pipeline

The implementation of this process is necessary if the team needs to transform raw JSON data into platform-specific outputs. All tokens are pre-processed, and the available file types are listed in the README.md.

## Installation

```
$ npm i style-dictionary
```

The provided example pipeline outlines the essential steps to consider when setting up your integrated Auro Design Tokens pipeline.

Currently, the example pipeline supports Sass and CSS. Although native mobile platforms are supported, they are not yet documented in this project.

### Project `config.json` Installation

To integrate Design Tokens into your project, it is recommended to create a `config.json` file wherever it fits best within your build pipeline.

In the example `config.json` file, locate the `"source"` key. Update the value to specify the path where the npm packages are stored. Most likely, you will use a similar example to the following:

```json
"source": [ "./node_modules/@aurodesignsystem/design-tokens/**/*.json" ]
```

### Processing

The example `config.json` file covers various potential outputs from the Design Tokens. When deploying this into a production project, ensure to only include the platforms you intend to use.

Modify the **buildPath** key to specify the directory where you want the generated file(s) to be placed.

```json
"buildPath": "./[project dir path]/[empty dir]/"
```

Update the **destination** key if you prefer a different name other than `_SCSSTokenVariables.scss`.

Here's an example `config.json` file:

```json
{
  "source": [ "./node_modules/@aurodesignsystem/design-tokens/**/*.json" ],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "./assets/src/sass/global/tokens/",
      "files": [
        {
          "destination": "_SCSSTokenVariables.scss",
          "format": "scss/variables"
        }
      ]
    }
  }
}
```

### Running Style Dictionary (Options)

To execute Style Dictionary, simply require the dependency and call the function. This can be done in any Node.js instance.

```js
// Required dependency
const StyleDictionary = require('style-dictionary').extend('./[dir]/tokensConfig.json');

// Style Dictionary build function
StyleDictionary.buildAllPlatforms();
```

#### Using `./scripts/styleDictionary.js`

The simplest way to integrate the Style Dictionary step is to create a `styleDictionary.js` file using the JavaScript API example provided above.

To execute the file, concatenate calls in your `package.json` build step, for instance:

```js
"scripts": {
  "build": "node scripts/styleDictionary.js || webpack"
},
```

For an example, refer to `./example/scripts/styleDictionary.js`. To run, use the following command:

```
$ npm run buildTokens
```

#### Webpack Shell Plugin

This third option combines the previous two. In your project, place the required dependency call and function in `./src/scripts/styleDictionary.js`. Then, in your Webpack config file, require the Webpack Shell Plugin.

```js
const WebpackShellPlugin = require('webpack-shell-plugin');
```

Further down in the same file, add the following plugin option:

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

This plugin executes the necessary Style Dictionary command before executing Webpack.

#### Webpack and `build.js` (ejected create-react-app)

If you are using Webpack and a `build.js` or `start.js`, simply require the dependency and call the function. The only requirement is that the Style Dictionary function must run before running Webpack.

#### Config within Pipeline

Alternatively, you can bypass the `config.json` dependency and extend the configuration directly within the `extend()` function of your build pipeline.

```js
const StyleDictionary = require('style-dictionary').extend({
  "source": [ "./node_modules/@aurodesignsystem/design-tokens/**/*.json" ],
  platforms: {
    scss: {
      transformGroup: 'scss',
      "buildPath": "./assets/src/sass/global/tokens/",
      files: [{
        destination: '_SCSSTokenVariables.scss',
        format: 'scss/variables'
      }]
    }
  }
});

StyleDictionary.buildAllPlatforms();
```

### Style Dictionary (Dependency)

For processing `.json` files into usable Sass/CSS resources, the Orion Design Tokens project relies on [Style Dictionary](https://www.npmjs.com/package/style-dictionary). The data formatting and build process are tailored to conform with Style Dictionary's conventions.

For more information, refer to Style Dictionary's [documentation](https://amzn.github.io/style-dictionary/#/).
