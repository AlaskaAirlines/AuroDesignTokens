# Orion Design Tokens (ODT)

Design Tokens are abstract UI sub-atomic values that make up the greater Orion Design System.

The goal of this project is to maintain these core values in such a way as to feed the UI of other engineering efforts rather than be looked upon as a manual dependency.

## Contained within this repository

This repository serves two purposes.

1. To maintain the single source of record for the distributed token files
1. Provide an example pipeline of how to use Design Tokens

### The src/ dir

Within the project's `src/` dir are the various token values stored in `.json` format.
It's only these source files that are included in the npm build process for project reference.

### The example/ dir

Contained within the `example/` directory is an example Sass file that can be used to illustrate how the Orion Design Tokens can be included with a production project.

### The gulpfile

this `gulpfile.js` file is an example build pipeline that will consume the Orion Design Tokens and create the necessary resources for a production project.

### Run locally

To run this project locally, simply clone down the resources to your personal computer and run the following commands:

```
$ npm i // install all dependencies
$ gulp // run default gulp task to process CSS from ODT
```

## Install with your production project

To install ODT into your production project requires two steps:

1. npm install the ODT package
1. Build processing pipeline

## Build ODT pipeline

The example `gulpfile.js` contains all the steps you should consider when building your integrated ODT pipeline.

### Style Dictionary

For base processing of `.json` files to a usable resource, it's suggested that you use [Style Dictionary](https://www.npmjs.com/package/style-dictionary). While you could possibly build your own, Style Dictionary has a fully developed API that fits our needs and the backing of community support.

All of the preferred development conventions are supported by Style Dictionary's [documentation](https://amzn.github.io/style-dictionary/#/).

### Sass or not to Sass?

Style Dictionary is able to output variable files in either Sass or CSS Custom Properties (variables) format. In the example pipeline the `style.scss` file has references to both Sass and CSS variables.

What's important to remember is that the CSS variables need to have their references available to them in the final output CSS while Sass will convert these values to static values in the output CSS.

The example addresses this by concatenating the CSS variables with the final CSS output file.

### CSS Custom Properties browser support

CSS Custom Properties are new to CSS and thus do not have good legacy browser support. The term polyfill is used loosly in this scenario in that legacy browser support is best addressed in a PostCSS build pipeline.

In the example the process Sass is put through a PostCSS process that take the variable value and create a static property along side the dynamic one. You have the option to preserve the custom property or remove it from the final output CSS. It is recommended that you do preserve the dynamic value for browser that support this convention.
