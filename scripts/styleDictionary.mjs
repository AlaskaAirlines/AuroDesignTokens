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

// Font family transform configuration
const fontFamilyTransform = {
  name: 'custom/fontFamily/quote',
  type: 'value',
  transitive: true,
  /** @param {Object} prop
   * @returns {boolean}
   */
  matcher: (prop) => 
    prop.attributes && 
    prop.attributes.category === 'font' && 
    prop.attributes.type === 'family',
  /** @param {Object} prop
   * @param {string} prop.value
   * @returns {string}
   */
  transformer: (prop) => {
    // Add quotes around font family name if it doesn't already have them
    if (!prop.value.startsWith("'") && !prop.value.startsWith('"')) {
      return `'${prop.value}'`;
    }
    return prop.value;
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
StyleDictionary.registerTransform(/** @type {any} */ (fontFamilyTransform));
StyleDictionary.registerFormat(scssFormat);

// Extend existing transform groups to include font family transform
StyleDictionary.registerTransformGroup({
  name: 'scss-with-fonts',
  transforms: StyleDictionary.transformGroup.scss.concat(['custom/fontFamily/quote'])
});

StyleDictionary.registerTransformGroup({
  name: 'css-with-fonts',
  transforms: StyleDictionary.transformGroup.css.concat(['custom/fontFamily/quote'])
});

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
  // Read the config file
  let rawConfig;
  
  try {
    rawConfig = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error('Error parsing JSON config file:', error);
    process.exit(1);
  }
  
  // Update transform groups to use the ones with font handling
  Object.keys(rawConfig.platforms).forEach(platform => {
    if (rawConfig.platforms[platform].transformGroup === 'scss') {
      rawConfig.platforms[platform].transformGroup = 'scss-with-fonts';
    } else if (rawConfig.platforms[platform].transformGroup === 'css') {
      rawConfig.platforms[platform].transformGroup = 'css-with-fonts';
    }
  });
  
  const config = StyleDictionary.extend(rawConfig);
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
  alaskaClassic: buildThemeConfig(THEME_PATHS.alaskaClassic),
  alaska: buildThemeConfig(THEME_PATHS.alaska),
  hawaiian: buildThemeConfig(THEME_PATHS.hawaiian),
  transparent: buildThemeConfig(THEME_PATHS.transparent)
};

export { buildAllThemes as default };
