import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { THEME_DIRECTORIES } from '../src/config/themes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Map between theme directory names and config file names
const dirToConfigName = {
  'alaska': 'alaska',
  'alaska-classic': 'alaskaClassic',
  'auro-1': 'auro1',
  'auro-2': 'auro2',
  'hawaiian': 'hawaiian',
};

// Legacy themes
const additionalThemes = [
  { configName: 'auroClassic', configPath: './scripts/config-auroClassic.json' },
  { configName: 'transparent', configPath: './scripts/config-transparent.json' },
];

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

// Generate THEME_PATHS dynamically from THEME_DIRECTORIES
/** @type {Object.<string, string>} */
const THEME_PATHS = {};

// Add paths from THEME_DIRECTORIES
THEME_DIRECTORIES.forEach(({ dir }) => {
  const configName = dirToConfigName[dir] || dir.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  THEME_PATHS[configName] = `./scripts/config-${configName}.json`;
});

// Add legacy themes not in THEME_DIRECTORIES
additionalThemes.forEach(({ configName, configPath }) => {
  THEME_PATHS[configName] = configPath;
});

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
export const themes = {};

// Build all themes and add to themes object
Object.entries(THEME_PATHS).forEach(([themeName, configPath]) => {
  themes[themeName] = buildThemeConfig(configPath);
});

export { buildAllThemes as default };
