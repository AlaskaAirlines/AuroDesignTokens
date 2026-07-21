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
import { THEME_DEFINITIONS } from '../src/config/themes.js';
import { PATHS, CSS, WEB_THEME_DEFINITIONS } from '../src/config/constants.js';
import cssnanoConfig from '../src/config/cssnano.js';

// Find CSS files in a directory
/**
 * @param {string} baseDir
 * @param {string} targetDir
 * @returns {Promise<string[]>}
 */
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
    let combinedCSS = '';
    // Track files that need minification
    const filesToMinify = [];
    
    // Process each directory and its associated scope
    for (const { dir, code } of THEME_DEFINITIONS) {
      
      // Look first in the themes directory, then fall back to direct dist directory
      let cssFiles = await findCSSFiles(path.join(PATHS.DIST, 'themes'), dir);
      if (cssFiles.length === 0) {
        cssFiles = await findCSSFiles(PATHS.DIST, dir);
        if (cssFiles.length === 0) {
          console.log(`No CSS files found in ${PATHS.DIST}/themes/${dir} or ${PATHS.DIST}/${dir} directories`);
          continue;
        }
      }
      
      console.log(`Processing files in ${dir} theme:`, cssFiles);
      
      // Process each matching file
      for (const filePath of cssFiles) {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Use postcss to parse the CSS
        const result = await postcss().process(content, { from: filePath });
        
        // Extract custom properties from root, split into color and typography
        /** @type {string[]} */
        let colorProperties = [];
        /** @type {string[]} */
        let typographyProperties = [];
        /** @type {string[]} */
        let otherProperties = [];
        result.root.walkRules(rule => {
          if (rule.selector === CSS.ROOT_SELECTOR) {
            rule.walkDecls(decl => {
              if (decl.prop.startsWith('--')) {
                const propStr = `  ${decl.prop}: ${decl.value};`;
                if (decl.prop.includes('-type-')) {
                  typographyProperties.push(propStr);
                } else if (decl.prop.includes('-color-')) {
                  colorProperties.push(propStr);
                } else {
                  otherProperties.push(propStr);
                }
              }
            });
          }
        });
        
        const themeCode = `aag-theme-${code}`;
        if (colorProperties.length > 0) {
          const colorStr = colorProperties.join('\n');
          const colorSelector = `[data-aag-theme="${themeCode}"], [data-aag-theme="${themeCode}-color"]`;
          combinedCSS += `/* Color properties from ${path.basename(filePath)} */\n${colorSelector} {\n${colorStr}\n}\n\n`;
        }
        if (typographyProperties.length > 0) {
          const typeStr = typographyProperties.join('\n');
          const typeSelector = `[data-aag-theme="${themeCode}"], [data-aag-theme="${themeCode}-typography"]`;
          combinedCSS += `/* Typography properties from ${path.basename(filePath)} */\n${typeSelector} {\n${typeStr}\n}\n\n`;
        }
        if (otherProperties.length > 0) {
          const otherStr = otherProperties.join('\n');
          const otherSelector = `[data-aag-theme="${themeCode}"]`;
          combinedCSS += `/* Other properties from ${path.basename(filePath)} */\n${otherSelector} {\n${otherStr}\n}\n\n`;
        }
        
        // Add to minification queue
        filesToMinify.push(filePath);
      }
    }
    
    // Write bundle
    let bundlePath;
    if (combinedCSS) {
      // Create themes directory if it doesn't exist
      const themesDir = path.join(PATHS.DIST, 'themes');
      try {
        await fs.mkdir(themesDir, { recursive: true });
      } catch (err) {
        if (err instanceof Error) {
          // Only ignore EEXIST like behavior when code property present
          if (/** @type {{code?: string}} */(err).code !== 'EEXIST') {
            throw err;
          }
        } else {
          // Non-standard error objects -> rethrow
          throw err;
        }
      }
      
      bundlePath = path.join(themesDir, CSS.BUNDLED_FILE_NAME);
      await fs.writeFile(bundlePath, combinedCSS.trim());
      console.log(`Successfully created themes/${CSS.BUNDLED_FILE_NAME} with rescoped CSS properties`);
      
      // Add bundle file to minification queue
      filesToMinify.push(bundlePath);
    } else {
      console.log('No CSS properties found in any :root {} blocks');
    }
    
    // Rewrite dist/web CSS files with multi-theme selector blocks
    await transformWebCSSFiles();

    // Add CSS files from dist/web directory
    const webDir = path.join(PATHS.DIST, 'web');
    
    try {
      const entries = await fs.readdir(webDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() &&
            entry.name.endsWith('.css') &&
            !entry.name.endsWith('.min.css')) {
          const filePath = path.join(webDir, entry.name);
          filesToMinify.push(filePath);
          console.log(`Added web/${entry.name} to minification queue`);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.code === 'ENOENT') {
        console.log(`No CSS files found in ${PATHS.DIST}/web directory`);
      } else {
        console.error(`Error reading CSS files from ${PATHS.DIST}/web directory: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
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
 * Rewrites each dist/web CSS theme file to contain multi-theme selector blocks
 * split into color and typography groups.
 *
 * For the file's own theme:
 *   :root,
 *   [data-aag-theme="<code>"],
 *   [data-aag-theme-color="<code>"] { ...color vars... }
 *
 *   :root,
 *   [data-aag-theme="<code>"],
 *   [data-aag-theme-typography="<code>"] { ...type vars... }
 *
 * For every other web theme (in definition order):
 *   [data-aag-theme="<other-code>"],
 *   [data-aag-theme-color="<other-code>"] { ...color vars... }
 *
 *   [data-aag-theme="<other-code>"],
 *   [data-aag-theme-typography="<other-code>"] { ...type vars... }
 *
 * CSS custom properties are extracted from the :root block written by Style Dictionary.
 */
async function transformWebCSSFiles() {
  const webDir = path.join(PATHS.DIST, 'web');

  // Step 1: Read custom properties from each theme file, split into color, typography, and other
  /** @type {Record<string, {color: string[], typography: string[], other: string[]}>} */
  const themeVars = {};
  for (const theme of WEB_THEME_DEFINITIONS) {
    const filePath = path.join(webDir, theme.file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const result = await postcss().process(content, { from: filePath });
      /** @type {string[]} */
      const colorProps = [];
      /** @type {string[]} */
      const typeProps = [];
      /** @type {string[]} */
      const otherProps = [];
      result.root.walkRules(rule => {
        if (rule.selector === CSS.ROOT_SELECTOR) {
          rule.walkDecls(decl => {
            if (decl.prop.startsWith('--')) {
              const propStr = `  ${decl.prop}: ${decl.value};`;
              if (decl.prop.includes('-type-')) {
                typeProps.push(propStr);
              } else if (decl.prop.includes('-color-')) {
                colorProps.push(propStr);
              } else {
                otherProps.push(propStr);
              }
            }
          });
        }
      });
      themeVars[theme.code] = { color: colorProps, typography: typeProps, other: otherProps };
      console.log(`Read ${colorProps.length} color, ${typeProps.length} typography, and ${otherProps.length} other properties from web/${theme.file}`);
    } catch (error) {
      console.warn(`Warning: Could not read web/${theme.file}: ${error instanceof Error ? error.message : String(error)}`);
      themeVars[theme.code] = { color: [], typography: [], other: [] };
    }
  }

  // Step 2: Rewrite each theme file with ordered multi-theme selector blocks (color + typography)
  for (const theme of WEB_THEME_DEFINITIONS) {
    const filePath = path.join(webDir, theme.file);
    const ownVars = themeVars[theme.code];
    if ((!ownVars.color || ownVars.color.length === 0) && (!ownVars.typography || ownVars.typography.length === 0) && (!ownVars.other || ownVars.other.length === 0)) {
      console.warn(`Skipping web/${theme.file}: no custom properties found`);
      continue;
    }

    const blocks = [];

    // Own theme: :root combined with its attribute selectors, split by category
    if (ownVars.color.length > 0) {
      blocks.push(`:root,\n[data-aag-theme="${theme.code}"],\n[data-aag-theme="${theme.code}-color"] {\n${ownVars.color.join('\n')}\n}`);
    }
    if (ownVars.typography.length > 0) {
      blocks.push(`:root,\n[data-aag-theme="${theme.code}"],\n[data-aag-theme="${theme.code}-typography"] {\n${ownVars.typography.join('\n')}\n}`);
    }
    if (ownVars.other.length > 0) {
      blocks.push(`:root,\n[data-aag-theme="${theme.code}"] {\n${ownVars.other.join('\n')}\n}`);
    }

    // Remaining themes in definition order
    for (const other of WEB_THEME_DEFINITIONS) {
      if (other.code === theme.code) continue;
      const otherVars = themeVars[other.code];
      if (otherVars && otherVars.color.length > 0) {
        blocks.push(`[data-aag-theme="${other.code}"],\n[data-aag-theme="${other.code}-color"] {\n${otherVars.color.join('\n')}\n}`);
      }
      if (otherVars && otherVars.typography.length > 0) {
        blocks.push(`[data-aag-theme="${other.code}"],\n[data-aag-theme="${other.code}-typography"] {\n${otherVars.typography.join('\n')}\n}`);
      }
      if (otherVars && otherVars.other.length > 0) {
        blocks.push(`[data-aag-theme="${other.code}"] {\n${otherVars.other.join('\n')}\n}`);
      }
    }

    const composed = blocks.join('\n\n');
    await fs.writeFile(filePath, composed);
    console.log(`Rewrote web/${theme.file} with ${blocks.length}-block multi-theme selectors`);
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
    // Exit with error code to fail the build
    process.exit(1);
  }
}

// Run the transformation
transformCSSFiles();
