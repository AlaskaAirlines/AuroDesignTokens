# Migrating from v4.x to v5.x

This guide provides instructions for migrating from Auro Design Tokens `v4.x` to `v5.x`.

The `v5.x` release introduces significant changes, including new themes, renamed tokens, and a restructured package.

## Key Changes

The `v5.x` release introduced several key changes:

- **Restructured `./dist/` Directory**: All file import paths will need to be updated
- **New Theme Names**: 
  - The v4.x default theme is now called `Auro Classic` (located in `./dist/auro-classic`) and is deprecated
  - **NEW** Alaska theme in `./dist/alaska`
  - **NEW** Alaska Classic theme in `./dist/alaska-classic`
  - **NEW** Hawaiian theme in `./dist/hawaiian`
- **Unique Token Names**: `v4.x` and `v5.x` token names are distinct, allowing both versions to coexist
- **Theme Scoping**: Alaska and Hawaiian themes should not be used simultaneously within the same DOM scope

## Handling Deprecated Tokens

Some tokens have been completely removed in `v5.x`.

1. Check the [Deprecated tokens list](https://auro.alaskaair.com/getting-started/developers/design-tokens/deprecated).