/**
 * CSS Transformation Script
 *
 * Processes CSS custom property files in theme directories
 * and generates a bundled CSS file with rescoped theme variations.
 *
 * Functionality:
 * - Searches specified theme directories (e.g., 'alaska', 'hawaiian') in the 'dist' folder
 * - Finds CSS files containing a specific pattern in their filename
 * - Extracts CSS custom properties from ':root {}' blocks
 * - Rescopes the properties under theme-specific selectors
 * - Combines all themed properties into a single bundled output file
 *
 * @example
 * // Input: dist/alaska/CSSCustomProperties--alaska.css with ':root { --color: blue; }'
 * // Output: '[data-aag-theme="aag-theme-as"] { --color: blue; }'
 *
 */
import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import { THEME_DIRECTORIES, getThemeAttribute } from '../src/config/themes.js';
import { PATHS, CSS } from '../src/config/constants.js';

// Find CSS files in a directory
async function findCSSFiles(baseDir, targetDir) {
  const files = [];
  const fullPath = path.join(baseDir, targetDir);
  
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(fullPath, entry.name);
      if (entry.isFile() && entry.name.includes(CSS.TARGET_FILE_PATTERN)) {
        files.push(entryPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Directory ${fullPath} not found or not accessible`);
  }
  
  return files;
}

// Process CSS files
async function transformCSSFiles() {
  try {
    const buildDate = new Date().toUTCString();
    let combinedCSS = `/**\n  Do not edit directly\n  Generated on ${buildDate}\n */\n\n`;
    
    // Process each directory and its associated scope
    for (const { dir, code } of THEME_DIRECTORIES) {
      const scope = getThemeAttribute(code);
      
      const cssFiles = await findCSSFiles(PATHS.DIST, dir);
      if (cssFiles.length === 0) {
        console.log(`No CSS files found in ${PATHS.DIST}/${dir} directory`);
        continue;
      }
      
      console.log(`Processing files in ${PATHS.DIST}/${dir}:`, cssFiles);
      
      // Process each matching file
      for (const filePath of cssFiles) {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Use postcss to parse the CSS
        const result = await postcss().process(content, { from: filePath });
        
        // Extract custom properties from root
        let customProperties = [];
        result.root.walkRules(rule => {
          if (rule.selector === CSS.ROOT_SELECTOR) {
            rule.walkDecls(decl => {
              if (decl.prop.startsWith('--')) {
                customProperties.push(`  ${decl.prop}: ${decl.value};`);
              }
            });
          }
        });
        
        if (customProperties.length > 0) {
          const propertiesStr = customProperties.join('\n');
          const rescopedCSS = `[${scope}] {\n${propertiesStr}\n}`;
          combinedCSS += `/* Properties from ${path.basename(filePath)} */\n${rescopedCSS}\n\n`;
        }
      }
    }
    
    // Write bundle
    if (combinedCSS) {
      await fs.writeFile(path.join(PATHS.DIST, CSS.BUNDLED_FILE_NAME), combinedCSS.trim());
      console.log(`Successfully created ${CSS.BUNDLED_FILE_NAME} with rescoped CSS properties`);
    } else {
      console.log('No CSS properties found in any :root {} blocks');
    }
  } catch (error) {
    console.error('Error processing CSS files:', error);
    process.exit(1);
  }
}

// Run the transformation
transformCSSFiles();
