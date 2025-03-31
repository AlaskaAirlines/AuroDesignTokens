import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color transform configuration
const colorTransform = {
  name: 'custom/color/rgb',
  type: 'value',
  transitive: true,
  /** @param {Object} prop
   * @param {Object} prop.attributes
   * @param {string} prop.attributes.category
   * @returns {boolean}
   */
  matcher: (prop) => prop.attributes.category === 'color',
  /** @param {Object} prop
   * @param {string} prop.value
   * @returns {string}
   */
  transformer: (prop) => {
    const newColor = Color(prop.value).toRgbString();
    const matches = newColor.match(/\((.*)\)/);
    if (!matches || matches.length < 2) {
      throw new Error(`Invalid color format: ${prop.value}`);
    }
    return matches[1];
  }
};

// Custom SCSS format configuration
const scssFormat = {
  name: 'custom/scss/map-flat',
  formatter: _.template(
    readFileSync(join(__dirname, '../templates/map-flat.template'), 'utf8')
  )
};

// Register custom transformations and formats
StyleDictionary.registerTransform(/** @type {any} */ (colorTransform));
StyleDictionary.registerFormat(scssFormat);

/** @type {{
  auroClassic: string,
  alaskaClassic: string,
  alaska: string,
  hawaiian: string,
  transparent: string
}} */
const THEME_PATHS = {
  auroClassic: './scripts/config-auroClassic.json',
  alaskaClassic: './scripts/config-alaskaClassic.json',
  alaska: './scripts/config-alaska.json',
  hawaiian: './scripts/config-hawaiian.json',
  transparent: './scripts/config-transparent.json'
};

/**
 * Builds a Style Dictionary configuration for a specific theme
 * @param {string} configPath - Path to the theme configuration file
 * @returns {Object} The built Style Dictionary configuration
 */
const buildThemeConfig = (configPath) => {
  const config = StyleDictionary.extend(configPath);
  config.buildAllPlatforms();
  return config;
};

/**
 * Builds all theme configurations
 * @returns {void}
 */
const buildAllThemes = () => {
  Object.values(THEME_PATHS).forEach(buildThemeConfig);
};

/** @type {Object.<string, Object>} */
export const themes = {
  auroClassic: buildThemeConfig(THEME_PATHS.auroClassic),
  // alaskaClassic: buildThemeConfig(THEME_PATHS.alaskaClassic),
  // alaska: buildThemeConfig(THEME_PATHS.alaska),
  hawaiian: buildThemeConfig(THEME_PATHS.hawaiian),
  transparent: buildThemeConfig(THEME_PATHS.transparent)
};

export { buildAllThemes as default };
