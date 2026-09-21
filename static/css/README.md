# Static CSS

Hand-maintained CSS that is **not** produced by Style Dictionary.

During `npm run transform:css` (part of `npm run build`), every `.css` file in this
directory is copied verbatim into `dist/static/` and minified alongside the generated
output, producing a `.css` and a `.min.css` pair.

To add a new static stylesheet, drop it in this directory — no build changes required.

## typographyBandaid.css

Backward-compatibility shim that redeclares typography custom properties removed or
renamed in earlier major versions, so consumers pinned to older token names keep
resolving. It is organized as a series of `:root` blocks, each commented with the
release the block supports (`v5.15.0` through `v8.2.1`), in ascending order.

**Ordering is significant.** Several properties are declared in more than one block and
rely on last-declaration-wins, so append new blocks at the end rather than inserting
them.

Its header comment (`Do not edit directly / Generated on …`) is a leftover from the
original Style Dictionary export. This copy is now the source of truth and is edited by
hand; the header is preserved only so the file diffs cleanly against the deployed asset.

Imported from:
<https://resource.alaskaair.net/assets/css/global/typographyBandaid.css?v=1.0.6>
