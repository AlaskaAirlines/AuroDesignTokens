import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Handlebars from 'handlebars';
import { THEME_DIRECTORIES } from '../src/config/themes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Converts a directory name to the corresponding config name
 * @param {string} dirName - The directory name from THEME_DIRECTORIES
 * @returns {string} The config name for the config file
 */
const dirToConfigName = (dirName) => {
  // Convert dash-separated words to camelCase
  return dirName.replace(/-([a-z0-9])/g, (match, char) => char.toUpperCase());
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

StyleDictionary.registerTransform({
  name: 'color/kotlin',
  type: 'value',
  matcher: (prop) => prop.attributes.category === 'color',
  transformer: (prop) => {
    let value = prop.value.trim().toLowerCase();

    // Skip gradients
    if (value.startsWith('linear-gradient') || value.startsWith('radial-gradient')) {
      return null; // or throw new Error if you want to block the build
    }

    // rgba format
    const rgbaMatch = value.match(/^rgba\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)$/);
    if (rgbaMatch) {
      const [_, r, g, b, a] = rgbaMatch;
      const alpha = Math.round(parseFloat(a) * 255)
        .toString(16)
        .padStart(2, '0');
      const hex = [r, g, b]
        .map((n) => parseInt(n).toString(16).padStart(2, '0'))
        .join('');
      return `0x${alpha}${hex}`;
    }

    // hex or shorthand hex, no hash (e.g., '0074c8')
    const hexMatch = value.match(/^([a-f0-9]{6})$/i);
    if (hexMatch) {
      return `0xff${value}`;
    }

    // hex with hash
    const hexWithHash = value.match(/^#([a-f0-9]{6})$/i);
    if (hexWithHash) {
      return `0xff${hexWithHash[1]}`;
    }

    // Already valid Kotlin 0x format (like 0xffeeddcc)
    if (/^0x[a-f0-9]{8}$/.test(value)) {
      return value;
    }

    // If it's something else, log a warning or skip
    console.warn(`⚠️ Unrecognized color format for token "${prop.name}": ${value}`);
    return null; // or fallback
  }
});

// Register custom Handlebars helper
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

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

// Custom Compose-Kotlin format configuration
const composeKotlinFormat = {
  name: 'custom/formats/compose',
  formatter: function({ dictionary, file, options }) {
    const templateContent = readFileSync(join(__dirname, '../templates/compose-kotlin-colors.template'), 'utf8')
    const template = Handlebars.compile(templateContent);

    return template({
      file,
      options,
      properties: dictionary.allProperties.filter(p => !!p.value),
    });
  }
}

// Custom SwiftUI format configuration
const swiftUIFormat = {
  name: 'custom/formats/swiftui',
  formatter: function({ dictionary, file, options }) {
    const templateContent = readFileSync(join(__dirname, '../templates/swiftui-colors.template'), 'utf8')
    const template = Handlebars.compile(templateContent);

    return template({
      file,
      options,
      properties: dictionary.allProperties.filter(p => !!p.value),
    });
  }
};

// Register custom transformations and formats
StyleDictionary.registerTransform(/** @type {any} */ (colorTransform));
StyleDictionary.registerTransformGroup({
  name: 'custom/native-colors',
  transforms: ['attribute/cti', 'name/cti/camel', 'color/kotlin']
});
StyleDictionary.registerTransform(/** @type {any} */ (fontFamilyTransform));
StyleDictionary.registerFormat(scssFormat);
StyleDictionary.registerFormat(composeKotlinFormat);
StyleDictionary.registerFormat(swiftUIFormat);

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
  const configName = dirToConfigName(dir);
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
