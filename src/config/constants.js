/**
 * Build Constants
 */

export const PATHS = {
  TOKENS_DEFS: './tokenDefinitions/coreTokens',
  MANUAL_TOKENS: './tokenDefinitions/manualTokens',
  FIGMA_EXPORTS: './tokenDefinitions/figmaExports',
  DIST: './dist',
  SRC: './src'
};

export const CSS = {
  TARGET_FILE_PATTERN: 'CSSCustomProperties',
  BUNDLED_FILE_NAME: 'CSSCustomProperties--bundled.css',
  ROOT_SELECTOR: ':root'
};

/**
 * Hand-maintained CSS that is not produced by Style Dictionary.
 * Every .css file in SRC_DIR is copied verbatim into OUT_DIR during the build
 * and minified alongside the generated output.
 */
export const STATIC_CSS = {
  SRC_DIR: './static/css',
  OUT_DIR: './dist/static'
};

/**
 * Web theme definitions for multi-theme selector rewriting in dist/web.
 * Each entry maps a generated CSS filename to its data-aag-theme attribute code.
 * These codes are intentionally separate from THEME_DEFINITIONS codes used in dist/themes.
 * Add an entry here whenever a new web theme is added to outputConfigs/web/.
 */
export const WEB_THEME_DEFINITIONS = [
  { file: 'alaska.css', code: 'aag-theme-as' },
  { file: 'atmos.css', code: 'aag-theme-atm' },
  { file: 'hawaiian.css', code: 'aag-theme-ha' },
];
