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
 * - Compresses all CSS files in the dist directory
 *
 * @example
 * // Input: dist/alaska/CSSCustomProperties--alaska.css with ':root { --color: blue; }'
 * // Output: '[data-aag-theme="aag-theme-as"] { --color: blue; }'
 *
 */
import fs from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import cssnano from 'cssnano';
import { THEME_DIRECTORIES, getThemeAttribute } from '../src/config/themes.js';
import { PATHS, CSS } from '../src/config/constants.js';
import cssnanoConfig from '../src/config/cssnano.js';

// Find CSS files in a directory
async function findCSSFiles(baseDir, targetDir) {
  const files = [];
  const fullPath = path.join(baseDir, targetDir);
  
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(fullPath, entry.name);
      if (entry.isFile() && 
          entry.name.includes(CSS.TARGET_FILE_PATTERN) && 
          !entry.name.endsWith('.min.css')) {
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
    // Track files that need minification
    const filesToMinify = [];
    
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
        
        // Add to minification queue
        filesToMinify.push(filePath);
      }
    }
    
    // Write bundle
    let bundlePath;
    if (combinedCSS) {
      bundlePath = path.join(PATHS.DIST, CSS.BUNDLED_FILE_NAME);
      await fs.writeFile(bundlePath, combinedCSS.trim());
      console.log(`Successfully created ${CSS.BUNDLED_FILE_NAME} with rescoped CSS properties`);
      
      // Add bundle file to minification queue
      filesToMinify.push(bundlePath);
    } else {
      console.log('No CSS properties found in any :root {} blocks');
    }
    
    // Batch process all CSS files for minification
    if (filesToMinify.length > 0) {
      console.log(`Minifying ${filesToMinify.length} CSS files...`);
      await Promise.all(filesToMinify.map(compressCSSFile));
      console.log('All CSS files have been minified');
    }
  } catch (error) {
    console.error('Error processing CSS files:', error);
    process.exit(1);
  }
}

/**
 * Compress CSS file using cssnano
 * @param {string} filePath - Path to the original CSS file
 */
async function compressCSSFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const filename = path.basename(filePath);
    const dirPath = path.dirname(filePath);
    
    // Generate minified filename (e.g., file.css -> file.min.css)
    const extname = path.extname(filename);
    const basename = filename.substring(0, filename.length - extname.length);
    const minFilename = `${basename}.min${extname}`;
    const minFilePath = path.join(dirPath, minFilename);
    
    // Process with cssnano to minify
    const result = await postcss([cssnano(cssnanoConfig)]).process(content, { from: filePath, to: minFilePath });
    
    // Write minified CSS to file
    await fs.writeFile(minFilePath, result.css);
    console.log(`Minified CSS created: ${minFilePath}`);
  } catch (error) {
    console.error(`Error compressing CSS file ${filePath}:`, error);
  }
}

// Run the transformation
transformCSSFiles();
