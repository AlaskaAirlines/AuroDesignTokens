# Auro Design Tokens Architecture

This document explains the architecture and design principles behind the Auro Design Tokens system.

## Key Concepts

The Auro Design System is built on a structured hierarchy of design tokens organized around three key concepts:

- **Primitives**: Low-level, foundational values (colors, sizes, etc.)
- **Basic Tokens**: Semantic tokens that reference primitives with meaningful, usage-based names
- **Advanced Tokens**: Semantic tokens that reference Basic tokens, specifically designed for UI component styling

## Multi-Level Token Architecture

### 1. Primitives

#### Base Primitives: Shared Foundation

Base primitives (`src/primitives/base/`) define foundational values shared across the system:
- Common color scales (gray, neutral, status colors, etc.)
- Basic visual elements (black, white)
- Transparency values
- And more...

These base primitives are shared resources that theme-specific primitives can reference, providing consistency across the entire design system.

#### Theme-Specific Primitives

Each supported theme (Alaska, Hawaiian, etc.) has its own primitives folder (`src/primitives/[themeName]/`) containing brand-specific token primitives such as color, typography, etc.

These theme-specific primitives work alongside the shared `base` primitives to create a complete primitive value set for each brand.

### 2. Basic Tokens

#### Usage-Based References

Basic tokens are found in `src/themes/[themeName]/basic/` and are semantic tokens that:
- Reference primitive values using paths like `{color.atlas.600.value}`
- Have meaningful names based on their function (e.g., `color.brand.primary`) 
- Provide usage descriptions explaining their intended context
- Are marked as `"public": true` for use in components

### 3. Advanced Tokens

#### UI Element Styling

Advanced tokens, prefixed with `--ds-advanced-` in the CSS custom properties files and found in `src/themes/[themeName]/advanced/` for each theme, define the visual characteristics of UI components.

Advanced tokens reference semantic tokens and create a higher-level abstraction specifically for UI components.

### 4. Multi-level Semantic References

Basic tokens may often reference other Basic tokens, not just primitives.

### 5. Shared Semantic Tokens

In addition to shared primitives, the system also includes shared semantic token definitions for values that are common across multiple themes:

- **Shared Basic Tokens** (`src/shared/basic/`): Common semantic tokens that are identical across themes

This centralized approach reduces duplication and simplifies maintenance while preserving theme-specific customization options. See [Shared Semantic Tokens](./shared-semantic-tokens.md) for more details.

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
