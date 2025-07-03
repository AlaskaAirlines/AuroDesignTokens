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
    
    // Regular CSS custom properties in :root
    output += `${CSS.ROOT_SELECTOR} {\n`;
    
    allProperties.forEach(token => {
      const prefix = platform.prefix || '';
      const cssVarName = `--${prefix ? prefix + '-' : ''}${token.name}`;
      
      // Add comment if available
      if (token.comment) {
        output += `  /* ${token.comment} */\n`;
      }
      
      output += `  ${cssVarName}: ${token.value};\n`;
    });
    
    output += '}\n';
    
    // Filter tokens that have onDark variant properties (e.g., valueOnDark)
    const onDarkTokens = allProperties.filter(token => 
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
          try {
            // Use StyleDictionary's built-in reference resolution
            transformedValue = dictionary.usesReference(darkValue) 
              ? dictionary.getReferences(darkValue)[0].value
              : darkValue;
          } catch (e) {
            // If that fails, try manual resolution by looking up in allTokens
            const refMatch = darkValue.match(/\{([^}]+)\}/);
            if (refMatch) {
              const refPath = refMatch[1];
              const referencedToken = dictionary.allTokens.find(t => t.path.join('.') === refPath);
              if (referencedToken) {
                transformedValue = referencedToken.value;
              }
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
