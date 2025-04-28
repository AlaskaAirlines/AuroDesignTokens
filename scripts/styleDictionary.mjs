import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import { readFileSync } from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Handlebars from 'handlebars';

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
StyleDictionary.registerFormat(scssFormat);
StyleDictionary.registerFormat(composeKotlinFormat);
StyleDictionary.registerFormat(swiftUIFormat);


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
  alaskaClassic: buildThemeConfig(THEME_PATHS.alaskaClassic),
  alaska: buildThemeConfig(THEME_PATHS.alaska),
  hawaiian: buildThemeConfig(THEME_PATHS.hawaiian),
  transparent: buildThemeConfig(THEME_PATHS.transparent)
};

export { buildAllThemes as default };
