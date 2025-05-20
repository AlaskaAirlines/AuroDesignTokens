# Migrating from v4.x to v6.x

This guide provides instructions for migrating from Auro Design Tokens `v4.x` to `v6.x`.

The `v6.x` release introduces significant changes, including new themes, renamed tokens, and a restructured package.

## Key Changes

The `v6.x` release introduced several key changes:

- **Restructured `./dist/` Directory**: All file import paths will need to be updated
- **New Theme Names**: 
  - The v4.x default theme is now called `Auro Classic` (located in `./dist/auro-classic`) and is deprecated
  - **NEW** Alaska theme in `./dist/alaska`
  - **NEW** Alaska Classic theme in `./dist/alaska-classic`
  - **NEW** Hawaiian theme in `./dist/hawaiian`
- **Unique Token Names**: `v4.x` and `v6.x` token names are distinct, allowing both versions to coexist
- **Theme Scoping**: Alaska and Hawaiian themes should not be used simultaneously within the same DOM scope
- **Deprecated Tokens**: Some tokens have been completely removed in `v6.x`.

## File Naming and Import Paths

The `v4.x` filename conventions remain the same, but for Auro Classic (the deprecated theme that matches `v4.x`), file path imports will need to be updated to:

```scss
@import "@aurodesignsystem/design-tokens/dist/auro-classic/*.*";
```

### Compatible Components

For a list of deployed `v6.x`-compatible components, refer to the [Alaska Air Group Frontend Guild Wiki](https://wiki.devtools.teamaag.com/guides/multibrand/components/update-auro).

Auro Component Themability Prioritization schedule here: [Component Themability Prioritization](https://www.figma.com/design/IDtAQx3blORSzvfK4Vh3X6/Release-Schedules%3A-News%2C-Updates%2C-%26-Previews?node-id=29-280&p=f&m=dev).
