# Auro Design Tokens Theme Guide

Detailed information about token formats, file types, and implementation patterns to support your development workflow.

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
| Atmos | `aag-theme-atm` |
| Hawaiian | `aag-theme-ha` |

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

## Theme Resources

### [Alaska](https://auro.alaskaair.com/getting-started/developers/design-tokens/alaska)

Latest Alaska Airlines brand theme with latest tokens.

### [Atmos](https://auro.alaskaair.com/getting-started/developers/design-tokens/atmos)

Latest Atmos brand theme with latest tokens.

### [Hawaiian](https://auro.alaskaair.com/getting-started/developers/design-tokens/hawaiian)

Hawaiian Airlines brand theme with latest tokens:

### [Alaska Classic](https://auro.alaskaair.com/getting-started/developers/design-tokens/alaska-classic)

The Alaska Classic theme uses the latest token names with the deprecated Auro Classic values. It serves as a transition theme, facilitating a smooth migration for Auro components to the new "Alaska" theme.

### [Auro Classic](https://auro.alaskaair.com/getting-started/developers/design-tokens/auro-classic) (Deprecated)

Legacy v4.x tokens, maintained for backward compatibility:

| File | Syntax | Type | Filter Type / Description |
| ---- | ------ | ---- | ------------------------- |
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
| ---- | ------ | ---- | ------------------------- |
| CSSCustomProperties--transparent | CSS | Custom properties | All v4.0x release tokens |

## Bundled File

| File | Syntax | Type | Description |
| ---- | ------ | ---- | ----------- |
| themes/CSSCustomProperties--bundled.css | CSS | Custom properties | Combined v6.x `semantic` CSS custom properties from all supported themes, scoped to a `data-aag-theme` attribute |

**NOTE: The bundled file is not intended for general use.**
