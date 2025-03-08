# Auro Design Tokens Architecture

This document explains the architecture and design principles behind the Auro Design Tokens system.

## Key Concepts

The Auro Design System is built on a structured hierarchy of design tokens organized around two key concepts:

- **Primitives**: Low-level, foundational values (colors, sizes, etc.)
- **Themes**: Semantic tokens that reference primitives with meaningful, usage-based names

## Source Directory Structure

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
    │   ├── components.json
    │   └── ...
    ├── hawaiian/
    │   ├── color.json
    │   ├── typography.json
    │   ├── components.json
    │   └── ...
    └── ...
```

## Multi-Level Token Architecture

### 1. Base Primitives: Shared Foundation

Base primitives (`src/primitives/base/`) define foundational values shared across the system:
- Common color scales (gray, neutral, status colors)
- Basic visual elements (black, white)
- Transparency values
- And more...

These base primitives are shared resources that theme-specific primitives can reference, providing consistency across the entire design system.

### 2. Theme-Specific Primitives: Brand Identity

Each supported theme (Alaska, Hawaiian, etc.) has its own primitives folder (`src/primitives/alaska/`, `src/primitives/hawaiian/`) containing:
- Brand-specific color palettes
- Typography definitions unique to each brand
- And more...

These theme-specific primitives work alongside the shared `base` primitives to create a complete palette for each brand.

### 3. Semantic Theme Tokens: Usage-Based References

The tokens in the `themes` directory (`src/themes/alaska/`, `src/themes/hawaiian/`) are semantic tokens that:
- Reference primitive values using paths like `{color.atlas.600.value}`
- Have meaningful names based on their function (e.g., `color.brand.primary`) 
- Provide usage descriptions explaining their intended context
- Are marked as `"public": true` for use in components

### 4. Component Tokens: UI Element Styling

Component tokens, prefixed with `--ds-component-` in the CSS custom properties files and found in `component.json` for each theme, define the visual characteristics of UI components.

These component tokens reference semantic tokens and create a higher-level abstraction specifically for UI components.

### 5. Multi-level Semantic References

Semantic tokens can reference other semantic tokens, not just primitives:
- For example, `font.weight.heading.heading1` can reference `{font.weight.book.value}`
- This creates multiple layers of abstraction and flexibility
- These reference chains ultimately resolve to primitive values

## Best Practices

**Never Use Primitives Directly in UI**

UI components should never directly use primitives (either `base` or theme-specific). Instead, always use semantic tokens that reference these primitives. This ensures:

1. Consistent application of design values
2. Easy theme switching
3. Future-proofing against primitive value changes

## Benefits of This Architecture

This multi-tiered approach provides several advantages:

1. **Theme Flexibility**: Components can seamlessly switch between themes without code changes
2. **Abstraction of Intent**: Semantic naming communicates the purpose of each token
3. **Centralized Updates**: Changes to primitive values automatically propagate to all semantic tokens
4. **Design Consistency**: Related UI elements share the same semantic tokens across different contexts
5. **Clear Migration Path**: Supports multiple versions during transition periods
