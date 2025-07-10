/**
 * StyleDictionary custom format for generating CSS custom properties
 * that includes both default (onLight) and theme variant values (onDark, etc.) in a single file
 */

import { CSS } from '../../src/config/constants.js';

/**
 * Custom CSS format that includes theme variant tokens (onLight, onDark, etc.) in the same file
 * @param {Object} options - Format options
 * @param {Object} options.dictionary - The dictionary object containing all tokens
 * @param {Object} options.platform - Platform configuration
 * @param {Array} options.allProperties - Array of all filtered properties
 * @returns {string} - Formatted CSS string
 */
export const cssWithThemeVariantsFormat = {
  name: 'css/variables-with-theme-variants',
  formatter: function(options) {
    const { dictionary, platform, allProperties } = options;
    
    let output = '';
    
    // Add file header
    output += '/**\n';
    output += ' * Do not edit directly\n';
    output += ` * Generated on ${new Date().toUTCString()}\n`;
    output += ' */\n\n';
    
    // Filter out primitive tokens for output - we only want semantic tokens
    const semanticTokens = allProperties.filter(token => 
      token.type === 'semantic'
    );
    
    // Regular CSS custom properties in :root
    output += `${CSS.ROOT_SELECTOR} {\n`;
    
    semanticTokens.forEach(token => {
      // Note: token.name already includes the prefix from Style Dictionary's built-in transforms
      // So we don't need to add the prefix again here
      const cssVarName = `--${token.name}`;
      
      // Add comment if available
      if (token.comment) {
        output += `  /* ${token.comment} */\n`;
      }
      
      output += `  ${cssVarName}: ${token.value};\n`;
    });
    
    output += '}\n';
    
    // Filter tokens that have onDark variant properties (e.g., valueOnDark)
    const onDarkTokens = semanticTokens.filter(token => 
      token.original && token.original.valueOnDark
    );
    
    // Add theme variant sections if there are any variant tokens
    if (onDarkTokens.length > 0) {
      output += '\n';
      output += `${CSS.ROOT_SELECTOR_ONDARK} {\n`;
      
      onDarkTokens.forEach(token => {
        const prefix = platform.prefix || '';
        const cssVarName = `--${prefix ? prefix + '-' : ''}${token.name}`;
        const darkValue = token.original.valueOnDark;
        
        // Add comment if available
        if (token.comment) {
          output += `  /* ${token.comment} (onDark variant) */\n`;
        }
        
        // Transform the dark value if it's a reference
        let transformedValue = darkValue;
        if (typeof darkValue === 'string' && darkValue.includes('{') && darkValue.includes('}')) {
          // Manual resolution using StyleDictionary's reference methods
          const refMatch = darkValue.match(/\{([^}]+)\.value\}/);
          if (refMatch) {
            const refPath = refMatch[1];
            
            // Now that primitives are included in allTokens, we can find them there
            let referencedToken = dictionary.allTokens.find(t => t.path.join('.') === refPath);
            
            if (referencedToken) {
              transformedValue = referencedToken.value;
            } else {
              // Keep the original reference if not found
              transformedValue = darkValue;
            }
          }
        }
        
        output += `  ${cssVarName}: ${transformedValue};\n`;
      });
      
      output += '}\n';
    }
    
    return output;
  }
};
