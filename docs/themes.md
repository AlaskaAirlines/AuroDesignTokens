# Auro Design Tokens Theme Guide

Detailed information about token formats, file types, and implementation patterns to support your development workflow.

## Theme Scoping

### Alaska Air Group Exclusive

> ⚠️ The following link is only intended for Alaska Air Group employees and is protected by SSO.

- [Prepare your pages for multi-brand theming](https://wiki.devtools.teamaag.com/guides/multibrand)

## Theme Resources

### [Alaska](https://auro.alaskaair.com/getting-started/developers/design-tokens/alaska)

Latest Alaska Airlines brand theme with `v5.x` tokens.

### [Alaska Classic](https://auro.alaskaair.com/getting-started/developers/design-tokens/alaska-classic)

The Alaska Classic theme uses the `v5.x` token names with the deprecated Auro Classic values. It serves as a transition theme, facilitating a smooth migration for Auro components to the new "Alaska" theme.

### [Hawaiian](https://auro.alaskaair.com/getting-started/developers/design-tokens/hawaiian)

Hawaiian Airlines brand theme with v5.x tokens:

### [Auro Classic](https://auro.alaskaair.com/getting-started/developers/design-tokens/auro-classic) (Deprecated)

Legacy v4.x tokens, maintained for backward compatibility:

| File | Syntax | Type | Filter Type / Description |
|------|--------|------|---------------------------|
| CSSCustomProperties | CSS | Custom properties | All v4.x release tokens |
| CSSSizeCustomProperties | CSS | Custom properties | Filter v4.x: size, public |
| JSData--color | JS module | Color data | Filter v4.x: color, Deprecated |
| JSONVariablesFlat | JSON Data | All data | All v4.x release tokens |
| JSONVariablesNested | JSON Data | All data | All v4.x release tokens |
| JSObject--deprecated | JS module | Deprecated tokens | Filter v4.x: deprecated, public |
| JSObject--allTokens.js | JS module | All data | All v4.x release tokens |
| JSVariables--color | JS ES6 | Color data | Filter v4.x: color |
| SCSSVariableMap | Sass | Sass variable map | Filter v4.x: size, public |
| SCSSVariables | SCSS | Sass variables | All v4.x release tokens |
| SCSSVariablesMapFlat | SCSS | Sass variable map | All v4.x release tokens |
| SassCustomProperties | SCSS | Custom properties | All v4.x release tokens |
| SassSizeCustomProperties | Sass | Custom properties | Filter v4.x: size, public |

### Transparent (Deprecated)

Special-purpose transparent theme (v4.x):

| File | Syntax | Type | Filter Type / Description |
|------|--------|------|---------------------------|
| CSSCustomProperties--transparent | CSS | Custom properties | All v4.0x release tokens |

## Bundled File

| File | Syntax | Type | Description |
|------|--------|------|-------------|
| CSSCustomProperties--bundled.css | CSS | Custom properties | Combined v5.x `semantic` CSS custom properties from all supported themes, scoped to a `data-aag-theme` attribute |

**NOTE: The bundled file is not intended for general use.**
