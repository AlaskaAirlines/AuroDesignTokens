import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { THEME_DIRECTORIES } from '../src/config/themes.js';

// Shared file path
const SHARED_FILES_GLOB = "./src/shared/**/*.json";

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
  
  // Include shared files - add shared directory to sources
  if (!rawConfig.include) {
    rawConfig.include = [];
  }
  
  // Extract the theme directory name from the config path
  let themeDir = '';
  if (configPath) {
    const configFileName = configPath.split('/').pop() || '';
    const themeDirMatch = configFileName.match(/config-([a-zA-Z0-9]+)\.json/);
    
    if (themeDirMatch && themeDirMatch[1]) {
      // Convert from camelCase to kebab-case for directory names
      themeDir = themeDirMatch[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      
      // Always include shared files first, then theme-specific files
      // Theme files naturally override shared files with the same name
      
      // Add all shared files 
      if (!rawConfig.include.includes(SHARED_FILES_GLOB)) {
        rawConfig.include.unshift(SHARED_FILES_GLOB);
      }
      
      // Theme-specific files will naturally override shared files with the same name
    }
  } else {
    // Fallback for paths without a theme directory - just include all shared files
    if (!rawConfig.include.includes(SHARED_FILES_GLOB)) {
      rawConfig.include.unshift(SHARED_FILES_GLOB);
    }
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
