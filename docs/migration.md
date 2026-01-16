# Migrating from v4

This guide provides instructions for migrating from Auro Design Tokens `v4`.

## Key Changes

The `v5` release introduced significant changes, including new themes, renamed tokens, and a restructured package.

- **Restructured `./dist/themes` Directory**: All file import paths will need to be updated
- **New Theme Names**: 
  - The `v4.x` default theme is now called `Auro Classic` (located in `./dist/legacy/auro-classic`) and is deprecated
  - **NEW** Alaska theme in `./dist/themes/alaska`
  - **NEW** Alaska Classic theme in `./dist/themes/alaska-classic`
  - **NEW** Hawaiian theme in `./dist/themes/hawaiian`
  - **NEW** Auro1 theme in `./dist/themes/auro-1`
  - **NEW** Auro2 theme in `./dist/themes/auro-2`
- **Unique Token Names**: Starting with `v5`, token names are distinct from those in `v4`, allowing both `v4` and later versions to coexist without conflict
- **Theme Scoping**: Alaska and Hawaiian themes should not be used simultaneously within the same DOM scope
- **Deprecated Tokens**: Some tokens have been completely removed beginning in `v5`.

## File Naming and Import Paths

The `v4` filename conventions remain the same, but for Auro Classic (the deprecated theme that matches `v4`), file path imports will need to be updated to:

```scss
@import "@aurodesignsystem/design-tokens/dist/legacy/auro-classic/*.*";
```
