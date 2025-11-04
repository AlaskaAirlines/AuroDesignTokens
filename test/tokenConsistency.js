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

// Main test function
async function runTest() {
  console.log('\nRunning Token Consistency Test...\n');
  
  if (!THEME_DEFINITIONS || THEME_DEFINITIONS.length === 0) {
    console.error('No themes found in THEME_DEFINITIONS');
    process.exit(1);
  }
  
  // Map to store all keys for each theme
  /** @type {Record<string, string[]>} */
  const themeKeys = {};
  
  // Process each theme
  for (const theme of THEME_DEFINITIONS) {
    const themeDir = path.join(process.cwd(), PATHS.TOKENS_DEFS, '/semantics/web/', theme.dir);
    
    if (!fs.existsSync(themeDir)) {
      console.error(`Theme directory not found: ${themeDir}`);
      continue;
    }
    
    console.log(`Processing theme: ${theme.name} (${theme.dir})`);
    
    // Get all JSON files for the theme
    const jsonFiles = getJsonFiles(themeDir);
    const keys = new Set();
    
    // Extract keys from each JSON file
    for (const file of jsonFiles) {
      const fileKeys = extractKeysFromJsonFile(file);
      fileKeys.forEach(key => keys.add(key));
    }
    
    themeKeys[theme.dir] = Array.from(keys).sort();
    console.log(`  Found ${keys.size} unique token keys\n`);
  }
  
  // Compare keys across themes
  const themes = Object.keys(themeKeys);
  let hasInconsistencies = false;
  
  if (themes.length < 2) {
    console.error('Not enough themes to compare');
    process.exit(1);
  }
  
  // Get all unique keys across all themes
  const allUniqueKeys = new Set();
  for (const theme of themes) {
    themeKeys[theme].forEach((key) => allUniqueKeys.add(key));
  }
  
  // Detect renamed tokens and inconsistencies
  // Maps base token names to lists of themes
  const allBaseTokens = new Map();
  
  // Group tokens by base name for each theme
  for (const theme of themes) {
    const baseTokens = groupKeysByBaseToken(themeKeys[theme]);
    
    // Record which themes have which base tokens
    for (const [baseToken, keys] of Object.entries(baseTokens)) {
      if (!allBaseTokens.has(baseToken)) {
        allBaseTokens.set(baseToken, { themes: new Set(), keys });
      }
      
      allBaseTokens.get(baseToken).themes.add(theme);
    }
  }
  
  // Find inconsistencies
  const inconsistentTokens = [];
  
  for (const [baseToken, data] of allBaseTokens.entries()) {
    if (data.themes.size < themes.length) {

      // This token doesn't appear in all themes
      const missingInThemes = themes.filter(theme => !data.themes.has(theme));
      const presentInThemes = Array.from(data.themes);
      
      inconsistentTokens.push({
        token: baseToken,
        presentIn: presentInThemes,
        missingFrom: missingInThemes,
        fullKeys: data.keys
      });
    }
  }
  
  // Sort by token path/name for readability
  inconsistentTokens.sort((a, b) => a.token.localeCompare(b.token));
  
  // Display inconsistencies
  if (inconsistentTokens.length > 0) {
    hasInconsistencies = true;
    console.error('\n===== INCONSISTENT TOKENS DETECTED =====\n');
    
    for (const inconsistency of inconsistentTokens) {
      const {token} = inconsistency;
      
      // Print inconsistency information
      console.error(`Token: ${token}`);
      console.error(`  ✓ Present in: ${inconsistency.presentIn.join(', ')}`);
      console.error(`  ✗ Missing from: ${inconsistency.missingFrom.join(', ')}`);
      
      // Empty line for readability
      console.error('');
    }
    
    // Summary of inconsistencies
    const uniqueInconsistentBaseTokens = new Set(inconsistentTokens.map(i => i.token));
    console.error(`Found ${uniqueInconsistentBaseTokens.size} inconsistent tokens across all themes.`);
    console.error('\nTest FAILED: Token names are inconsistent across themes\n');
  } else {
    console.log('\nTest PASSED: All themes have consistent tokens\n');
    console.log(`Total number of consistent tokens across all themes: ${allUniqueKeys.size}\n`);
  }
  
  if (hasInconsistencies) {
    process.exit(1);
  }
}

runTest().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
