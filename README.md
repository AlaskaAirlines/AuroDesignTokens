# Auro Design Tokens

[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/AuroDesignTokens/testPublish.yml?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/AuroDesignTokens/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@aurodesignsystem/design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@aurodesignsystem/design-tokens)
[![License](https://img.shields.io/npm/l/@aurodesignsystem/design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

## Introduction

Auro Design Tokens are the foundation of the Auro Design System, providing consistent design values across different platforms and implementations.

These tokens define colors, typography, spacing, and other visual attributes for Alaska Airlines and Hawaiian Airlines brands.

## Installation

```
$ npm i @aurodesignsystem/design-tokens
```

### Package Structure

The npm package provides pre-processed resources in the `./dist/` directory:

```
└── dist
   ├── alaska
   │   └── CSSCustomProperties--alaska.css
   │   └── primitives--alaska.scss
   ├── alaska-classic
   │   ├── CSSCustomProperties--alaskaClassic.css
   │   ├── JSObject--allTokens.js
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
   │   └── CSSCustomProperties--hawaiian.css
   │   └── primitives--hawaiian.scss
   ├── transparent
   │   └── CSSCustomProperties--transparent.css
   └── CSSCustomProperties--bundled.css
```

## Usage Guide

### Install with Sass

When working with Sass, import the SCSS file for your theme:

```scss
@import "~@aurodesignsystem/design-tokens/dist/alaska/primitives--alaska.scss";
```

**NOTE:** When developing new UI code in Sass, it's still advisable to leverage CSS custom properties over Sass variables.

### Install with CSS

For React or similar frameworks, import the CSS file directly:

```js
import "@aurodesignsystem/design-tokens/dist/alaska/CSSCustomProperties--alaska.css"
```

For other frameworks, you'll need to copy the CSS file from the npm resource into your project using a build scenario.

### Install ESModules

_Note: ESModules are not yet available for the v5.x tokens._

In a webpack-supported application or a `type="module"` script:

```js
import { AuroColorAlertNotificationOnLight, AuroColorBorderErrorOnLight } from '@aurodesignsystem/design-tokens/dist/auro-classic/JSVariables--color.js';
```

### Install from CDN

Using the `https://cdn.jsdelivr.net/npm/` CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm//@aurodesignsystem/design-tokens@latest/dist/alaska/CSSCustomProperties--alaska.css">
```

**Note:** Exercise caution when using this CDN solution. The Auro team is NOT responsible for the maintenance of the CDN `https://cdn.jsdelivr.net/` [uptime](https://www.isitupdown.com/jsdelivr) and are unable to effectively troubleshoot response issues. It is recommended to use the installed version of Auro Design Tokens for critical UIs.

## Available Themes & Resources

### Alaska

| File                        | Syntax | Type               | Description                                           |
|-----------------------------|--------|--------------------|-------------------------------------------------------|
| CSSCustomProperties--alaska | CSS    | Custom properties  | All v5.x semantic tokens         |
| primitives--alaska          | SCSS   | Sass variables     | All v5.x semantic token values   |

### Alaska Classic

The Alaska Classic theme uses the `v5.x` token names with the deprecated Auro Classic values.

It serves as a gateway to the `v5.x` tokens, facilitating a smooth transition for Auro components, leading to an eventual switch to the new "Alaska" theme.

| File                                   | Syntax    | Type               | Description                                          |
|----------------------------------------|-----------|--------------------|------------------------------------------------------|
| CSSCustomProperties--alaskaClassic     | CSS       | Custom properties  | All v5.x semantic tokens     |
| JSObject--allTokens.js                 | JS module | All data           | All v5.x token data          |
| primitives--alaskaClassic              | SCSS      | Sass variables     | All v5.x semantic token values |
| SCSSVariables--alaskaClassic           | SCSS      | Sass variables     | All v5.x semantic tokens     |
| SCSSVariablesMapFlat--alaskaClassic    | SCSS      | Sass variable map  | All v5.x semantic tokens as flat map |

### Hawaiian

| File                          | Syntax | Type               | Description                                           |
|-------------------------------|--------|--------------------|-------------------------------------------------------|
| CSSCustomProperties--hawaiian | CSS    | Custom properties  | All v5.x release tokens        |
| primitives--hawaiian          | SCSS   | Sass variables     | All v5.x semantic token values |

### Auro Classic (Deprecated)

| File                     | Syntax    | Type               | Filter Type / Description       |
|--------------------------|-----------|--------------------|----------------------------------|
| CSSCustomProperties      | CSS       | Custom properties  | All v4.x release tokens         |
| CSSSizeCustomProperties  | CSS       | Custom properties  | Filter v4.x: size, public       |
| JSData--color            | JS module | Color data         | Filter v4.x: color, Deprecated  |
| JSONVariablesFlat        | JSON Data | All data           | All v4.x release tokens         |
| JSONVariablesNested      | JSON Data | All data           | All v4.x release tokens         |
| JSObject--deprecated     | JS module | Deprecated tokens  | Filter v4.x: deprecated, public |
| JSObject--allTokens.js   | JS module | All data           | All v4.x release tokens         |
| JSVariables--color       | JS ES6    | Color data         | Filter v4.x: color              |
| SCSSVariableMap          | Sass      | Sass variable map  | Filter v4.x: size, public       |
| SCSSVariables            | SCSS      | Sass variables     | All v4.x release tokens         |
| SCSSVariablesMapFlat     | SCSS      | Sass variable map  | All v4.x release tokens         |
| SassCustomProperties     | SCSS      | Custom properties  | All v4.x release tokens         |
| SassSizeCustomProperties | Sass      | Custom properties  | Filter v4.x: size, public       |

### Transparent (Deprecated)

| File                                | Syntax    | Type               | Filter Type / Description |
|-------------------------------------|-----------|--------------------|---------------------------|
| CSSCustomProperties--transparent    | CSS       | Custom properties  | All v4.0x release tokens  |

### Bundled File

| File                            | Syntax | Type              | Description                             |
|---------------------------------|--------|-------------------|-----------------------------------------|
| CSSCustomProperties--bundled.css | CSS    | Custom properties | Combined v5.x `semantic` CSS custom properties from all supported themes |

**NOTE: Bundled file is not intended for general use.**

## Understanding the Architecture

### Key Concepts

The Auro Design System is built on a structured hierarchy of design tokens organized around two key concepts:

- **Primitives**: Low-level, foundational values (colors, sizes, etc.)
- **Themes**: Semantic tokens that reference primitives with meaningful, usage-based names

### Source Directory Structure

```
src/
├── primitives/
│   ├── alaska/
│   │   ├── color.json
│   │   ├── typography.json
│   │   └── ...
│   ├── base/
│   │   ├── color.json
│   │   ├── transparency.json
│   │   └── ...
│   ├── hawaiian/
│   │   ├── color.json
│   │   ├── typography.json
│   │   └── ...
│   └── ...
└── themes/
    ├── alaska/
    │   ├── color.json
    │   ├── typography.json
    │   └── ...
    ├── hawaiian/
    │   ├── color.json
    │   ├── typography.json
    │   └── ...
    └── ...
```

### Multi-Level Token Architecture

#### 1. Base Primitives: Shared Foundation

Base primitives (`src/primitives/base/`) define foundational values shared across the system:
- Common color scales (gray, neutral, status colors)
- Basic visual elements (black, white)
- Transparency values
- And more...

These base primitives are shared resources that theme-specific primitives can reference, providing consistency across the entire design system.

#### 2. Theme-Specific Primitives: Brand Identity

Each supported theme (Alaska, Hawaiian, etc.) has its own primitives folder (`src/primitives/alaska/`, `src/primitives/hawaiian/`) containing:
- Brand-specific color palettes
- Typography definitions unique to each brand
- And more...

These theme-specific primitives work alongside the shared `base` primitives to create a complete palette for each brand.

#### 3. Semantic Theme Tokens: Usage-Based References

The tokens in the `themes` directory (`src/themes/alaska/`, `src/themes/hawaiian/`) are semantic tokens that:
- Reference primitive values using paths like `{color.atlas.600.value}`
- Have meaningful names based on their function (e.g., `color.brand.primary`) 
- Provide usage descriptions explaining their intended context
- Are marked as `"public": true` for use in components

#### 4. Multi-level Semantic References

Semantic tokens can reference other semantic tokens, not just primitives:
- For example, `font.weight.heading.heading1` can reference `{font.weight.book.value}`
- This creates multiple layers of abstraction and flexibility
- These reference chains ultimately resolve to primitive values

### Best Practices

**Never Use Primitives Directly in UI**

UI components should never directly use primitives (either `base` or theme-specific).

Instead, always use semantic theme tokens:

```css
/* ❌ Incorrect: Using primitives directly */
.element {
  color: var(--ds-color-atlas-600);           /* Theme-specific primitive */
  background-color: var(--ds-color-gray-100); /* Base primitive */
}

/* ✅ Correct: Using semantic theme tokens */
.element {
  color: var(--ds-color-brand-primary);
  background-color: var(--ds-color-surface-neutralSubtle);
}
```

### Benefits of This Architecture

This three-tiered approach provides several advantages:

1. **Theme Flexibility**: Components can seamlessly switch between themes without code changes
2. **Abstraction of Intent**: Semantic naming communicates the purpose of each token
3. **Centralized Updates**: Changes to primitive values automatically propagate to all semantic tokens
4. **Design Consistency**: Related UI elements share the same semantic tokens across different contexts
5. **Clear Migration Path**: Supports multiple versions during transition periods



## Migration from v4.x to v5.x

With the release of Auro Design Tokens 5.x significant changes have occurred:

- `./dist/` directory has been restructured. All file imports will need to have their paths updated.
- The v4.x default theme is now called `Auro Classic`. The files for this theme may be found in `./dist/auro-classic`. This theme is now deprecated.
- **NEW** Alaska theme found in `./dist/alaska`.
- **NEW** Hawaiian theme found in `./dist/hawaiian`.
- The Alaska theme and Hawaiian theme are intended to be used one at a time within a given DOM `scope`. It is not supported to load both themes into the same `scope` of the document.
- v4.x and v5.x token names are unique to each version. As such, the `./dist/auro-classic` theme can be loaded with any of the other themes to support old Auro component versions that do not yet run on the v5.x tokens.
- Review the [Deprecated tokens list](https://auro.alaskaair.com/getting-started/developers/design-tokens/deprecated) for a matrix of changes. Some tokens have been removed from the project and need to be updated.

By supporting both the legacy and new Auro design tokens in your project, you ensure a smooth transition until all Auro components have been updated and your project has also updated local SCSS/CSS files with the new references.