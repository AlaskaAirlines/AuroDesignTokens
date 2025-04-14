# Auro Design Tokens API Reference

This document provides a detailed reference for all the available tokens, formats, and distribution resources in the Auro Design Tokens package.

## Package Structure

The npm package provides pre-processed resources in the `./dist/` directory:

```
└── dist
   ├── alaska
   │   └── CSSCustomProperties--alaska.css
   │   └── JSObject--allTokens.js
   │   └── JSONVariablesNested--alaska.json
   │   └── primitives--alaska.scss
   │   └── SCSSVariables--alaska.scss
   │   └── SCSSVariablesMapFlat--alaska.scss
   ├── alaska-classic
   │   ├── CSSCustomProperties--alaskaClassic.css
   │   ├── JSObject--allTokens.js
   │   ├── JSONVariablesNested--alaskaClassic.json
   │   ├── primitives--alaskaClassic.scss
   │   ├── SCSSVariables--alaskaClassic.scss
   │   └── SCSSVariablesMapFlat--alaskaClassic.scss
   ├── auro-classic
   │   ├── CSSCustomProperties.css
   │   ├── CSSSizeCustomProperties.css
   │   ├── JSData--color.js
   │   ├── JSObject--allTokens.js
   │   ├── JSObject--deprecated.js
   │   ├── JSONVariablesFlat.json
   │   ├── JSONVariablesNested.json
   │   ├── JSVariables--color.js
   │   ├── SassCustomProperties.scss
   │   ├── SassSizeCustomProperties.scss
   │   ├── SCSSVariableMap.scss
   │   ├── SCSSVariables.scss
   │   └── SCSSVariablesMapFlat.scss
   ├── hawaiian
   │   ├── CSSCustomProperties--hawaiian.css
   │   ├── JSObject--allTokens.js
   │   ├── JSONVariablesNested--hawaiian.json
   │   ├── primitives--hawaiian.scss
   │   ├── SCSSVariables--hawaiian.scss
   │   └── SCSSVariablesMapFlat--hawaiian.scss
   ├── transparent
   │   └── CSSCustomProperties--transparent.css
   └── CSSCustomProperties--bundled.css
```

## JavaScript API

### ES Module Import

```js
// Import specific tokens
import { 
  DsColorBrandPrimary, 
  DsColorTextPrimary 
} from '@aurodesignsystem/design-tokens/dist/alaska/JSObject--allTokens.js';

// Or import all tokens
import * as AlaskaTokens from '@aurodesignsystem/design-tokens/dist/alaska/JSObject--allTokens.js';
```

## File Format Reference

### CSS Custom Properties

The CSS custom properties files use the following format:

```css
:root {
  --ds-color-brand-primary: #01426a;
  --ds-color-brand-primary-hover: #012a43;
  /* ... other tokens ... */
}
```

### Sass Variables

The Sass variables files use the following format:

```scss
$ds-color-brand-primary: #01426a;
$ds-color-brand-primary-hover: #012a43;
// ... other tokens ...
```

For a complete list of all available tokens in each theme, refer to the [Auro Design System documentation](https://auro.alaskaair.com/getting-started/developers/design-tokens).
