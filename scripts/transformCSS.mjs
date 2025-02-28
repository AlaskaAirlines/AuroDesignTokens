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
 * // Output: '[aag-theme="aag-theme-as"] { --color: blue; }'
 * 
 */

import fs from 'fs/promises';
import path from 'path';

const DIST_PATH = './dist';
const TARGET_FILE_PATTERN = 'CSSCustomProperties';
const BUNDLED_FILE_NAME = `${TARGET_FILE_PATTERN}--bundled.css`;

// Directory map
const DIRECTORY_SCOPES = [
  {
    dir: 'alaska',
    scope: '[aag-theme="aag-theme-as"]'
  },
  {
    dir: 'hawaiian',
    scope: '[aag-theme="aag-theme-ha"]'
  }
];

// Find CSS files in a directory
async function findCSSFiles(baseDir, targetDir) {
  const files = [];
  const fullPath = path.join(baseDir, targetDir);
  
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(fullPath, entry.name);
      
      if (entry.isFile() && entry.name.includes(TARGET_FILE_PATTERN)) {
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
    let combinedCSS = `/**\n * Do not edit directly\n * Generated on ${buildDate}\n */\n\n`;
    
    // Process each directory and its associated scope
    for (const { dir, scope } of DIRECTORY_SCOPES) {
      const cssFiles = await findCSSFiles(DIST_PATH, dir);
      
      if (cssFiles.length === 0) {
        console.log(`No CSS files found in ${DIST_PATH}/${dir} directory`);
        continue;
      }
      
      console.log(`Processing files in ${DIST_PATH}/${dir}:`, cssFiles);
      
      // Process each matching file
      for (const filePath of cssFiles) {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Extract content from :root {} and rescope it
        const rootMatch = content.match(/:root\s*{([^}]*)}/);
        if (rootMatch) {
          const properties = rootMatch[1].trim();
          const rescopedCSS = `${scope} {\n  ${properties} \n}`;
          combinedCSS += `/* Properties from ${path.basename(filePath)} */\n${rescopedCSS}\n\n`;
        }
      }
    }
    
    // Write bundle
    if (combinedCSS) {
      await fs.writeFile(path.join(DIST_PATH, BUNDLED_FILE_NAME), combinedCSS.trim());
      console.log(`Successfully created ${BUNDLED_FILE_NAME} with rescoped CSS properties`);
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
