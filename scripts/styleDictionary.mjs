import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { THEME_DEFINITIONS } from '../src/config/themes.js';
import { PATHS } from '../src/config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * =============================
 * JSDoc Type Definitions
 * =============================
 */

/**
 * @typedef {Object} TokenProp
 * @property {{ category?: string }} [attributes]
 * @property {string[]} [path]
 * @property {string} [type]
 * @property {any} value
 */

/**
 * @typedef {Object} GradientStop
 * @property {string} color - Color value or token reference
 * @property {string} position - Position (e.g., '0%', '50%')
 * @property {number} [alpha] - Optional alpha channel 0-1
 */

/**
 * @typedef {Object} GradientLayerInline
 * @property {string} [kind] - linear (default) or radial, etc.
 * @property {string} [angle]
 * @property {string} [direction]
 * @property {GradientStop[]} stops
 */

/**
 * @typedef {Object} CompositeGradientValue
 * @property {'composite'} gradientType
 * @property {(string|GradientLayerInline)[]} layers
 */

/**
 * @typedef {Object} ThemeDefinition
 * @property {string} dir
 * @property {string} name
 * @property {string} code
 */

/**
 * Converts a directory name to a format without hyphens
 * For names with letters after hyphens (e.g., 'alaska-classic'), converts to camelCase ('alaskaClassic')
 * For names with numbers after hyphens (e.g., 'auro-1'), removes the hyphen ('auro1')
 * @param {string} dirName - The directory name
 * @returns {string} The processed directory name
 */
const removeHyphens = (dirName) => {
  return dirName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
                // Remove hyphen before numbers
               .replace(/-([0-9])/g, '$1');
};

// Legacy themes - uses individual config files
const legacyThemes = [
  { configName: 'auroClassic', configPath: './scripts/legacy/config-auroClassic.json' },
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

// Composite gradient transform
// Creates CSS gradient strings from composite gradient definitions
const compositeGradientTransform = {
  name: 'custom/gradient/composite',
  type: 'value',
  transitive: true,
  /**
   * @param {TokenProp} prop
   * @returns {boolean}
   */
  matcher: (prop) => {
    const value = /** @type {CompositeGradientValue | any} */ (prop.value);
    return prop.type === 'semantic' && value && typeof value === 'object' && value.gradientType === 'composite' && Array.isArray(value.layers);
  },
  /**
   * @param {TokenProp} prop
   * @returns {string}
   */
  transformer: (prop) => {
    const value = /** @type {CompositeGradientValue | any} */ (prop.value);
    // Handle composite gradients with referenced layers
    if ((/** @type {any[]} */ (value.layers)).every(layer => typeof layer === 'string' && layer.startsWith('{'))) {
      // This case handles references like "{advanced.color.expandedWidget.top}"
      // Style Dictionary will resolve these references automatically
      return `composite(${value.layers.join(', ')})`; // Explicit return
    }
    
    // Handle composite gradients with inline layer definitions
    return (/** @type {any[]} */ (value.layers))
      .map(layer => {
        if (typeof layer === 'string') return layer;
        
        const { kind = 'linear', angle, direction, stops } = layer;
        const gradientDirection = angle || direction || '0deg';
        
        // Build color stops
        const colorStops = /** @type {GradientStop[]} */ (stops).map((stop) => {
          let color = stop.color;
          
          // Handle alpha property
          if (stop.alpha !== undefined) {
            // If color is a token reference, we'll need to handle this differently
            if (typeof color === 'string' && color.startsWith('{')) {
              // For token references with alpha, create rgba notation
              color = `rgba(${color}, ${stop.alpha})`;
            } else {
              // For direct color values, apply alpha
              const colorObj = Color(color);
              color = colorObj.setAlpha(stop.alpha).toRgbString();
            }
          }
          
          return `${color} ${stop.position}`;
        }).join(', ');
        
        return `${kind}-gradient(${gradientDirection}, ${colorStops})`;
      })
      .join(', ');
  }
};

// Font family transform configuration
const fontFamilyTransform = {
  name: 'custom/fontFamily/quote',
  type: 'value',
  transitive: true,
  /** 
   * Matches type tokens that are related to font families.
   * 
   * 1. Checks if token is categorized as 'font'
   * 2. Checks if token is categorized as 'type' AND has 'family' in the path
   * 3. Checks token path for 'family' combined with 'font'/'type'
   * 
   * @param {Object} prop - The token property
   * @returns {boolean} - Returns true if the property matches the font-family criteria, otherwise false
   */
  /**
   * @param {TokenProp} prop
   * @returns {boolean}
   */
  matcher: (prop) => {
    // Check for font category (used in Auro Classic)
    const hasFontCategory = prop.attributes && prop.attributes.category === 'font';
    
    // Check for type category WITH family in path - avoids matching numerical values
    const hasTypeAndFamilyPath = prop.attributes && 
      prop.attributes.category === 'type' && 
      prop.path && 
      prop.path.includes('family');
    
    // Catches tokens that might not have explicit categories but follow naming conventions
    // Only matches 'family' when it appears alongside 'type' or 'font' in the path
    const isFontFamilyPath = prop.path && 
      prop.path.includes('family') && 
      prop.path.some(segment => segment === 'type' || segment === 'font');
      
    // Search for 'brand' in the path to catch brand-specific font families
    const isBrandFontFamily = prop.path && 
      prop.path.includes('brand') && 
      prop.path.some(segment => segment.toLowerCase().includes('family'));
    
    // Return true if any condition is met
    return !!(hasFontCategory || hasTypeAndFamilyPath || isFontFamilyPath || isBrandFontFamily);
  },
  /** 
   * @param {Object} prop
   * @param {string} prop.value
   * @returns {string}
   */
  /**
   * @param {TokenProp} prop
   * @returns {string}
   */
  transformer: (prop) => {
    /**
     * Font family handling - ensures consistent double quote formatting for CSS output
     * 
     * Critical for CSS/SCSS compatibility because:
     * 1. Font family names in CSS should be quoted when they contain spaces
     *    (e.g., "AS Circular" not AS Circular)
     * 2. CSS specifications prefer double quotes for consistency
     * 3. For font stacks, each font name with spaces should be individually quoted
     * 
     * Example transformations:
     * - "AS Circular" → "AS Circular" (already properly formatted)
     * - 'Good OT' → "Good OT" (single quotes converted to double)
     * - Helvetica Neue → "Helvetica Neue" (unquoted value gets quoted)
     * - 'Open Sans → "Open Sans" (handles malformed input with missing end quote)
     * - 'Circular', Helvetica Neue, Arial → "Circular", "Helvetica Neue", Arial
     */
    
    // Handle simple single font case
    if (!prop.value.includes(',')) {
      if (!prop.value.startsWith("'") && !prop.value.startsWith('"')) {
        // Only add quotes if the value contains spaces
        // Example: "AS Circular" but not Teodor
        if (prop.value.includes(' ')) {
          return `"${prop.value}"`;
        }
        return prop.value;
      }
      return prop.value;
    }
    
    // Handle font stacks with multiple fonts
    return (/** @type {string[]} */ (prop.value.split(',')))
      .map(font => {
        // Trim whitespace
        const fontName = font.trim();
        
        // Skip if already properly quoted with double quotes
        if (fontName.startsWith('"') && fontName.endsWith('"')) {
          return fontName;
        }
        
        // Convert single quotes to double quotes
        if (fontName.startsWith("'") && fontName.endsWith("'")) {
          return `"${fontName.slice(1, -1)}"`;
        }
        
        // Quote unquoted font names that contain spaces
        if (fontName.includes(' ')) {
          return `"${fontName}"`;
        }
        
        // Return generic font names as is
        return fontName;
      })
      .join(', ');
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
StyleDictionary.registerTransform(/** @type {any} */ (compositeGradientTransform));
StyleDictionary.registerTransform(/** @type {any} */ (fontFamilyTransform));
StyleDictionary.registerFormat(scssFormat);

// Extend existing transform groups to include font family and gradient transforms
StyleDictionary.registerTransformGroup({
  name: 'scss',
  transforms: StyleDictionary.transformGroup.scss.concat(['custom/fontFamily/quote', 'custom/gradient/composite'])
});

StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: StyleDictionary.transformGroup.css.concat(['custom/fontFamily/quote', 'custom/gradient/composite'])
});

// Cache the template content to avoid repeated file reads
const templatePath = join(__dirname, 'config-themes.json');
const templateContent = readFileSync(templatePath, 'utf8');

/**
 * Generates a theme config for the given theme
 * @param {Object} theme - Theme object from THEME_DEFINITIONS
 * @returns {Object} The config object
 */
/**
 * @param {ThemeDefinition} theme
 * @returns {Object}
 */
const generateThemeConfig = (theme) => {
  const { dir, code } = theme;
  
  // Replace template placeholders with theme-specific values
  let configContent = templateContent
    .replace(/{{themeDir}}/g, dir)
    .replace(/{{themeSourceDir}}/g, dir)
    .replace(/{{themeDirNoHyphens}}/g, removeHyphens(dir))
    .replace(/{{themeCode}}/g, code)
    // Replace placeholder with the constant value
    .replace(/\{\{PATHS\.TOKENS_DEFS\}\}/g, PATHS.TOKENS_DEFS);
  
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
/**
 * @param {string} themeName
 * @param {any} config
 */
const buildThemeConfig = (themeName, config) => {
  console.log(`Building theme: ${themeName}`);
  const dictConfig = StyleDictionary.extend(/** @type {any} */ (config));
  dictConfig.buildAllPlatforms();
  return dictConfig;
};

/**
 * Builds the base primitives
 * @returns {Object} The built Style Dictionary configuration for base primitives
 * @throws {Error} If there is an issue building the base primitives
 */
const buildBasePrimitives = () => {
  console.log('Building base primitives');
  try {
    const basePath = join(__dirname, 'config-primitives-base.json');
    let baseContent = readFileSync(basePath, 'utf8');
    // Replace placeholder with the constant value
    baseContent = baseContent.replace(/\{\{PATHS\.TOKENS_DEFS\}\}/g, PATHS.TOKENS_DEFS);
    const baseConfig = JSON.parse(baseContent);
    const dictConfig = StyleDictionary.extend(baseConfig);
    dictConfig.buildAllPlatforms();
    return dictConfig;
  } catch (error) {
    console.error('Error building base primitives:', error);
    // Rethrow the error to ensure it's not masked and fails fast
    if (error instanceof Error) {
      throw new Error(`Failed to build base primitives: ${error.message}`);
    }
    throw new Error('Failed to build base primitives: Unknown error');
  }
};

// Cache for base primitives to avoid redundant builds
/** @type {any | null} */
let _baseCache = null;

/**
 * Builds base primitives or returns cached result
 * @returns {Object} The built Style Dictionary configuration for base primitives
 * @throws {Error} If there is an issue building the base primitives
 */
const getBasePrimitives = () => {
  if (!_baseCache) {
    _baseCache = buildBasePrimitives();
  }
  return _baseCache;
};

/**
 * Builds all theme configurations
 * @returns {void}
 */
const buildAllThemes = () => {
  // Use cached base primitives
  getBasePrimitives();
  
  // Then build all themes
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

// Add base primitives using the cached version
export const basePrimitives = getBasePrimitives();

export { buildAllThemes as default };
