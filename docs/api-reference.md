# Auro Design Tokens API Reference

This document provides a detailed reference for all the available tokens, formats, and distribution resources in the Auro Design Tokens package.

## Package Structure

The npm package provides pre-processed resources in the `./dist/` directory, organized by themes (alaska, hawaiian, auro-classic, etc.).

Each theme directory contains multiple file formats including CSS Custom Properties, JavaScript objects, JSON files, and SCSS/Sass variables in different structures (flat, nested, maps).

## JavaScript API

### ES Module Import

```js
// Import specific tokens
import tokens from '@aurodesignsystem/design-tokens/dist/themes/alaska/JSObject--allTokens.js';
const { basic, advanced } = tokens;

// Or import all tokens
import * as AlaskaTokens from '@aurodesignsystem/design-tokens/dist/themes/alaska/JSObject--allTokens.js';
```

## File Format Reference

### CSS Custom Properties

The CSS custom properties files use the following format:

```css
:root {
  --ds-advanced-color-button-flat-text: #676767;
  --ds-advanced-color-button-flat-text-hover: #525252;
  /* ... other tokens ... */
}
```

### Sass Variables

The Sass variables files use the following format:

```scss
$as-color-gray-700: #676767;
$as-color-gray-800: #525252;
// ... other tokens ...
```

For a complete list of all available tokens in each theme, refer to the [Auro Design System documentation](https://auro.alaskaair.com/getting-started/developers/design-tokens).
