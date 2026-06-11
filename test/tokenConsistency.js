/**
 * Token Consistency Test
 * 
 * This test ensures that all themes use the same design token keys.
 * It will fail if:
 * - Any theme is missing keys that exist in other themes
 * - Any theme contains misspelled keys
 */

import fs from 'fs';
import path from 'path';
import { THEME_DEFINITIONS } from '../src/config/themes.js';
import { PATHS } from '../src/config/constants.js';

// Common property suffixes in design tokens
const propertyNames = ['value', 'type', 'public', 'deprecated', 'usage'];

// Recursively get all JSON files in a directory
/**
 * @param {string} dir
 * @param {string[]} fileList
 * @returns {string[]}
 */
function getJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getJsonFiles(filePath, fileList);
    } else if (path.extname(file) === '.json') {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Extract all keys from JSON file
/**
 * @param {string} filePath
 * @returns {string[]}
 */
function extractKeysFromJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    return extractKeys(data);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// Recursively extract all keys from object
/**
 * @param {any} obj
 * @param {string} prefix
 * @param {string[]} result
 * @returns {string[]}
 */
function extractKeys(obj, prefix = '', result = []) {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Check if this token is marked as private (public: false)
      if (obj[key].hasOwnProperty('public') && obj[key].public === false) {
        // Skip private tokens - don't include them in consistency checking
        continue;
      }
      
      // Check if this is a token's value object - don't recurse into nested properties
      // within a token's value as these can be theme-specific implementation details
      if (key === 'value' && prefix && 
          obj.hasOwnProperty('type') && obj.hasOwnProperty('public')) {
        // This is a token's value object - don't extract nested properties
        result.push(fullKey);
        continue;
      }
      
      extractKeys(obj[key], fullKey, result);
    } else {
      result.push(fullKey);
    }
  }
  
  return result;
}

// Identify base token name (without properties)
/**
 * @param {string} fullKey
 * @returns {string}
 */
function getBaseTokenName(fullKey) {
  // Extract base token name by removing property suffixes like .value, .deprecated, etc.
  const parts = fullKey.split('.');
  const lastPart = parts[parts.length - 1];
  
  if (propertyNames.includes(lastPart)) {
    // Remove the last part if it's a property name
    return parts.slice(0, -1).join('.');
  }
  
  return fullKey;
}

// Group keys by their base token name
/**
 * @param {string[]} keys
 * @returns {Record<string, string[]>}
 */
function groupKeysByBaseToken(keys) {
  /** @type {Record<string, string[]>} */
  const grouped = {};
  
  for (const key of keys) {
    const baseToken = getBaseTokenName(key);
    if (!grouped[baseToken]) {
      grouped[baseToken] = [];
    }
    grouped[baseToken].push(key);
  }
  
  return grouped;
}

// Compare key sets across a group of variants (themes or files) and report
// missing tokens. Returns true if any inconsistencies were found.
/**
 * @param {string} label
 * @param {Record<string, string[]>} variantKeys
 * @returns {boolean}
 */
function reportInconsistencies(label, variantKeys) {
  const variants = Object.keys(variantKeys);

  if (variants.length < 2) {
    console.log(`  Skipping ${label}: fewer than 2 variants to compare\n`);
    return false;
  }

  const allBaseTokens = new Map();
  for (const variant of variants) {
    const baseTokens = groupKeysByBaseToken(variantKeys[variant]);
    for (const [baseToken, keys] of Object.entries(baseTokens)) {
      if (!allBaseTokens.has(baseToken)) {
        allBaseTokens.set(baseToken, { variants: new Set(), keys });
      }
      allBaseTokens.get(baseToken).variants.add(variant);
    }
  }

  const inconsistentTokens = [];
  for (const [baseToken, data] of allBaseTokens.entries()) {
    if (data.variants.size < variants.length) {
      inconsistentTokens.push({
        token: baseToken,
        presentIn: Array.from(data.variants),
        missingFrom: variants.filter(v => !data.variants.has(v)),
        fullKeys: data.keys
      });
    }
  }

  inconsistentTokens.sort((a, b) => a.token.localeCompare(b.token));

  if (inconsistentTokens.length === 0) {
    console.log(`\n${label}: PASSED — all variants have consistent tokens\n`);
    return false;
  }

  console.error(`\n===== ${label}: INCONSISTENT TOKENS DETECTED =====\n`);
  for (const inconsistency of inconsistentTokens) {
    console.error(`Token: ${inconsistency.token}`);
    console.error(`  ✓ Present in: ${inconsistency.presentIn.join(', ')}`);
    console.error(`  ✗ Missing from: ${inconsistency.missingFrom.join(', ')}`);
    console.error('');
  }
  const uniqueInconsistentBaseTokens = new Set(inconsistentTokens.map(i => i.token));
  console.error(`Found ${uniqueInconsistentBaseTokens.size} inconsistent tokens in ${label}.\n`);
  return true;
}

// Check semantic web tokens published in the auro-tokendefinitions package.
// Each theme has its own subdirectory; we union JSON keys per theme.
/**
 * @returns {boolean}
 */
function checkSemanticsWeb() {
  console.log('--- Checking semantics/web (auro-tokendefinitions) ---\n');

  /** @type {Record<string, string[]>} */
  const themeKeys = {};

  for (const theme of THEME_DEFINITIONS) {
    const themeDir = path.join(process.cwd(), PATHS.TOKENS_DEFS, '/semantics/web/', theme.dir);

    if (!fs.existsSync(themeDir)) {
      console.error(`Theme directory not found: ${themeDir}`);
      continue;
    }

    console.log(`Processing theme: ${theme.name} (${theme.dir})`);

    const jsonFiles = getJsonFiles(themeDir);
    const keys = new Set();
    for (const file of jsonFiles) {
      extractKeysFromJsonFile(file).forEach(k => keys.add(k));
    }
    themeKeys[theme.dir] = Array.from(keys).sort();
    console.log(`  Found ${keys.size} unique token keys\n`);
  }

  return reportInconsistencies('semantics/web', themeKeys);
}

// Check manual web tokens defined locally in this repo. Each theme is a single
// top-level JSON file (e.g., Alaska_theme.Light.json), so we treat the filename
// as the variant identifier.
/**
 * @returns {boolean}
 */
function checkManualTokensWeb() {
  console.log('--- Checking tokenDefinitions/manualTokens/web ---\n');

  const dir = path.join(process.cwd(), PATHS.MANUAL_TOKENS, 'web');

  if (!fs.existsSync(dir)) {
    console.log(`  Skipping: directory not found at ${dir}\n`);
    return false;
  }

  /** @type {Record<string, string[]>} */
  const variantKeys = {};

  const files = fs.readdirSync(dir)
    .filter(f => path.extname(f) === '.json')
    .sort();
  for (const file of files) {
    const variant = path.basename(file, '.json');
    console.log(`Processing file: ${file}`);
    const keys = new Set(extractKeysFromJsonFile(path.join(dir, file)));
    variantKeys[variant] = Array.from(keys).sort();
    console.log(`  Found ${keys.size} unique token keys\n`);
  }

  return reportInconsistencies('manualTokens/web', variantKeys);
}

// Main test function
async function runTest() {
  console.log('\nRunning Token Consistency Test...\n');

  if (!THEME_DEFINITIONS || THEME_DEFINITIONS.length === 0) {
    console.error('No themes found in THEME_DEFINITIONS');
    process.exit(1);
  }

  const semanticsHasInconsistencies = checkSemanticsWeb();
  const manualHasInconsistencies = checkManualTokensWeb();

  if (semanticsHasInconsistencies || manualHasInconsistencies) {
    console.error('Test FAILED: Token names are inconsistent across themes\n');
    process.exit(1);
  }

  console.log('Test PASSED: All themes have consistent tokens\n');
}

runTest().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
