# Auro Design Tokens

[![Build Status](https://img.shields.io/github/actions/workflow/status/AlaskaAirlines/AuroDesignTokens/testPublish.yml?branch=master&style=for-the-badge)](https://github.com/AlaskaAirlines/AuroDesignTokens/actions/workflows/testPublish.yml)
[![See it on NPM!](https://img.shields.io/npm/v/@aurodesignsystem/design-tokens.svg?style=for-the-badge&color=orange)](https://www.npmjs.com/package/@aurodesignsystem/design-tokens)
[![License](https://img.shields.io/npm/l/@aurodesignsystem/design-tokens.svg?color=blue&style=for-the-badge)](https://www.apache.org/licenses/LICENSE-2.0)

## Overview

Auro Design Tokens are the foundation of the Auro Design System, providing consistent design values across different platforms and implementations. These tokens define colors, typography, spacing, and other visual attributes for Alaska Airlines and Hawaiian Airlines brands.

## Installation

```bash
npm install @aurodesignsystem/design-tokens
```

## Quick Start

### CSS Custom Properties

For most web applications, using CSS Custom Properties is recommended:

```js
// In a React or similar application
import "@aurodesignsystem/design-tokens/dist/themes/alaska/CSSCustomProperties--alaska.css"
```

```html
<!-- In an HTML file -->
<link rel="stylesheet" href="node_modules/@aurodesignsystem/design-tokens/dist/themes/alaska/CSSCustomProperties--alaska.css">
```

### With Sass

When working with Sass:

```scss
@import "~@aurodesignsystem/design-tokens/dist/themes/alaska/primitives--alaska.scss";
```

### JavaScript Usage

```js
import { AuroColorAlertNotificationOnLight } from '@aurodesignsystem/design-tokens/dist/legacy/auro-classic/JSVariables--color.js';
```

## Available Themes

Auro Design Tokens support multiple themes:

| Theme | Description | Usage |
|-------|-------------|-------|
| Alaska | Current Alaska Airlines theme | Alaska Airlines branded interfaces |
| Alaska Classic | Transition theme with the latest token names but Auro Classic values | For migration scenarios only |
| Atmos | Current Atmos theme | Atmos branded interfaces |
| Hawaiian | Hawaiian Airlines theme | Hawaiian Airlines branded interfaces |
| Auro Classic | Legacy theme (deprecated) | Only for backward compatibility |

## Applying a Theme

Apply a theme to any element using the `data-aag-theme` attribute. All child elements will inherit the theme's design tokens.

```html
<html data-aag-theme="aag-theme-as">
  <!-- All content uses Alaska theme tokens -->
</html>
```

Available theme codes:

| Theme | Attribute Value |
| ----- | --------------- |
| Alaska | `aag-theme-as` |
| Alaska Classic | `aag-theme-asc` |
| Hawaiian | `aag-theme-ha` |
| Atmos | `aag-theme-atm` |

## Nested Themes

You can nest themes by applying a different `data-aag-theme` value to a child element. The child and its descendants will use the nested theme's tokens, while the rest of the page retains the parent theme.

```html
<html data-aag-theme="aag-theme-as">
  <!-- Alaska theme -->
  <header>...</header>

  <section data-aag-theme="aag-theme-ha">
    <!-- Hawaiian theme within this section only -->
    <p>This content uses Hawaiian tokens.</p>
  </section>

  <!-- Back to Alaska theme -->
  <footer>...</footer>
</html>
```

## Partial Theme Overrides (Color or Typography Only)

Themes are split into **color** and **typography** token groups. You can apply just one aspect of a theme without affecting the other by appending `-color` or `-type` to the attribute value.

### Color-only override

Apply a theme's color tokens while keeping the parent theme's typography:

```html
<html data-aag-theme="aag-theme-as">
  <!-- Alaska color + Alaska typography -->

  <section data-aag-theme="aag-theme-ha-color">
    <!-- Hawaiian colors, but still Alaska typography -->
    <p>Hawaiian color palette with Alaska fonts.</p>
  </section>
</html>
```

### Typography-only override

Apply a theme's typography tokens while keeping the parent theme's colors:

```html
<html data-aag-theme="aag-theme-as">
  <!-- Alaska color + Alaska typography -->

  <section data-aag-theme="aag-theme-ha-type">
    <!-- Hawaiian typography, but still Alaska colors -->
    <p>Hawaiian fonts with Alaska color palette.</p>
  </section>
</html>
```

### Combining partial overrides

You can stack both partial selectors on the same element to mix color from one theme and typography from another:

```html
<html data-aag-theme="aag-theme-as">
  <section data-aag-theme="aag-theme-ha-color">
    <div data-aag-theme="aag-theme-atm-type">
      <!-- Hawaiian colors + Atmos typography -->
    </div>
  </section>
</html>
```

## Documentation

For comprehensive documentation, please see our:

- [Architecture Guide](https://auro.alaskaair.com/getting-started/developers/design-tokens/docs/architecture)
- [Theme Guide](https://auro.alaskaair.com/getting-started/developers/design-tokens/docs/themes)
- [Migration Guide](https://auro.alaskaair.com/getting-started/developers/design-tokens/docs/migration)
- [API Reference](https://auro.alaskaair.com/getting-started/developers/design-tokens/docs/api-reference)
- [Complete Documentation - Auro Docs](https://auro.alaskaair.com/getting-started/developers/design-tokens)

## Package Structure

The npm package provides pre-processed resources in the `./dist/` directory organized by theme.

## Contributing

Please read our [contributing guidelines](.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE) file for details.
