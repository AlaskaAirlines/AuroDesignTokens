import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { THEME_DEFINITIONS } from '../src/config/themes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Converts a directory name to a format without hyphens
 * @param {string} dirName - The directory name
 * @returns {string} The directory name without hyphens
 */
const removeHyphens = (dirName) => {
  return dirName.replace(/-/g, '');
};

// Legacy themes - uses individual config files
const legacyThemes = [
  { configName: 'auroClassic', configPath: './scripts/legacy/config-auroClassic.json' },
  { configName: 'transparent', configPath: './scripts/legacy/config-transparent.json' },
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
  matcher: (prop) => {
    // Check if the path or name includes 'family' to catch all font family tokens
    // This is more inclusive than checking only attributes
    return (prop.path && prop.path.includes('family')) || 
           (prop.name && prop.name.includes('family'));
  },
  /** @param {Object} prop
   * @param {string} prop.value
   * @returns {string}
   */
  transformer: (prop) => {
    // Add double quotes around font family name if it doesn't already have quotes
    if (!prop.value.startsWith("'") && !prop.value.startsWith('"')) {
      return `"${prop.value}"`;
    } else if (prop.value.startsWith("'")) {
      // Convert single quotes to double quotes
      return `"${prop.value.substring(1, prop.value.length - 1)}"`;
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
  name: 'scss',
  transforms: StyleDictionary.transformGroup.scss.concat(['custom/fontFamily/quote'])
});

StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: StyleDictionary.transformGroup.css.concat(['custom/fontFamily/quote'])
});

/**
 * Generates a theme config for the given theme
 * @param {Object} theme - Theme object from THEME_DEFINITIONS
 * @returns {Object} The config object
 */
const generateThemeConfig = (theme) => {
  const { dir, code } = theme;
  const templatePath = join(__dirname, 'config-template.json');
  const templateContent = readFileSync(templatePath, 'utf8');
  
  // Replace template placeholders with theme-specific values
  let configContent = templateContent
    .replace(/{{themeDir}}/g, dir)
    .replace(/{{themeSourceDir}}/g, dir)
    .replace(/{{themeDirNoHyphens}}/g, removeHyphens(dir))
    .replace(/{{themeCode}}/g, code);
  
  return JSON.parse(configContent);
};

/**
 * Reads a legacy config file
 * @param {string} configPath - Path to the legacy config file
 * @returns {Object} The config object
 */
const readLegacyConfig = (configPath) => {
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.error(`Error reading legacy config ${configPath}:`, error);
    process.exit(1);
  }
};

// Theme configs object to store all configs
/** @type {Object.<string, Object>} */
const THEME_CONFIGS = {};

// Generate configs
THEME_DEFINITIONS.forEach((theme) => {
  const themeName = removeHyphens(theme.dir);
  THEME_CONFIGS[themeName] = generateThemeConfig(theme);
});

// Add legacy themes
legacyThemes.forEach(({ configName, configPath }) => {
  THEME_CONFIGS[configName] = readLegacyConfig(configPath);
});

/**
 * Builds a Style Dictionary using the provided configuration
 * @param {string} themeName - The name of the theme
 * @param {Object} config - The configuration object
 * @returns {Object} The built Style Dictionary configuration
 */
const buildThemeConfig = (themeName, config) => {
  console.log(`Building theme: ${themeName}`);
  const dictConfig = StyleDictionary.extend(config);
  dictConfig.buildAllPlatforms();
  return dictConfig;
};

/**
 * Builds all theme configurations
 * @returns {void}
 */
const buildAllThemes = () => {
  Object.entries(THEME_CONFIGS).forEach(([themeName, config]) => {
    buildThemeConfig(themeName, config);
  });
};

/** @type {Object.<string, Object>} */
export const themes = {};

// Build all themes and add to themes object
Object.entries(THEME_CONFIGS).forEach(([themeName, config]) => {
  themes[themeName] = buildThemeConfig(themeName, config);
});

export { buildAllThemes as default };
