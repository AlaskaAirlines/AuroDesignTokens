# Shared Semantic Tokens

Shared semantic tokens are centralized design token definitions that are shared across all themes.

## Structure

```
src/
  shared/basic/       # Central location for shared semantic tokens
  themes/             # Theme-specific tokens 
```

## Usage

Shared semantic tokens are the same values across all themes.

**Example:** 

`src/shared/basic/type/size.json`

# Theme-Specific Tokens

Theme-specific tokens are defined in each respective theme's directory and can override shared files with the same name.

- Shared `type` tokens defined in `src/shared/basic/type/size.json`
- Theme-specific `type` font families defined in `src/themes/alaska/basic/type/family.json`

# Adding New Tokens

When adding new tokens:

1. If the token should be identical across all themes, add it to the appropriate shared file
2. If the token should vary by theme, add it directly to each theme's token files
