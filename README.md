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
| Alaska Classic | Transition theme with `v6.x` token names but Auro Classic values | For migration scenarios only |
| Hawaiian | Hawaiian Airlines theme | Hawaiian Airlines branded interfaces |
| Auro Classic | Legacy theme (deprecated) | Only for backward compatibility |

## Theme Scoping

### Alaska Air Group Exclusive

> ⚠️ The following link is only intended for Alaska Air Group employees and is protected by SSO.

- [Prepare your pages for multi-brand theming](https://wiki.devtools.teamaag.com/guides/multibrand)

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
