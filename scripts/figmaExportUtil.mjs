import fs from "fs";
import _ from "lodash";
import path from "path";

export default class ExportUtil {
  static resetState() {
    this.processedJson = {};
  }

  /**
   * Fetches and prepares the import tokens from the specified file and platform
   * @param {String} fileName - Name of the file containing token JSON to process.
   * @param {String} platform - Target platform to process the tokens for ('app' or 'web').
   * @returns {Object}
   */
  static fetchImportTokens(fileName, platform) {
    const figmaImportDir = path.join(process.cwd(), 'tokenDefinitions', 'figmaExports');
    const manualImportDir = path.join(process.cwd(), 'tokenDefinitions', 'manualTokens', platform);
    let exportStr = this.fetchFile(figmaImportDir, fileName);
    exportStr = exportStr.replace(/[\u200B-\u200D\uFEFF]/g, ''); // remove zero-width characters that Figma sometimes adds
    let exportJson = JSON.parse(exportStr);

    const basicColorTokens = {
      "color": {
        ['brand']: exportJson['Brand'],
        ['texticon']: exportJson['Text & Icon'],
        ['page-background']: exportJson['Page-Background'],
        ['surface']: exportJson['Surface'],
        ['border']: exportJson['Border'],
        ['status']: exportJson['Status'],
        ['tier-program']: exportJson['Tier-Program'],
        ['fare']: exportJson['Fare'],
      }
    }
    let importTokens = {};

    // extract the complete token set based on platform
    if (platform === 'app') {
      const appAdvancedTokens = {
        "uiTokens": exportJson.uiTokens
      }

      const basicAppTokens = {
        "basicTokens": basicColorTokens
      }

      // combine all basic and advanced tokens
      importTokens = {
        ...appAdvancedTokens,
        ...basicAppTokens
      }
    } else if (platform === 'web') {
      const webAdvancedTokens = {
        "advanced": {
          "color": exportJson.advanced
        }
      }

      const basicWebTokens = {
        "basic": basicColorTokens
      }

      // combine basic and advanced web tokens
      importTokens = {
        ...webAdvancedTokens,
        ...basicWebTokens
      }
    }

    const manualJson = JSON.parse(this.fetchFile(manualImportDir, fileName));

    importTokens = _.merge(importTokens, manualJson);
    
    return importTokens;
  }

  /**
   * Fetches the file content from the specified root directory and file name
   * @returns {String}
   */
  static fetchFile(rootDir, fileName) {
    const srcFilePath = path.join(rootDir, fileName);

    if (!fs.existsSync(srcFilePath)) {
      console.error(`. Error: Source file not found at path: ${srcFilePath}`);
      process.exit(1);
    }
    
    return fs.readFileSync(srcFilePath, "utf8");
  }

  /**
   * Remove key within a JSON object recursively
   * @param {Object} obj - JSON Object to remove keys from
   * @param {String} keyToRemove - Key name to remove
   * @returns {Object} - JSON Object with specified keys removed
   */
  static recursivelyRemoveKey(obj, keyToRemove) {
    // Check if obj is a non-null object or array
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // If the current key matches the one to remove, delete it
          if (key === keyToRemove) {
            delete obj[key];
          } else {
            // Otherwise, recurse on the value
            this.recursivelyRemoveKey(obj[key], keyToRemove);
          }
        }
      }
    }

    return obj;
  }

  /**
   * Converts an alpha percentage (0-100) to a two-character hex string.
   * Returns empty string for 100% (fully opaque).
   * @param {Number} percent - Alpha percentage (0-100), can be floating point
   * @returns {String} - Two-character hex string (e.g., "80" for 50%) or empty string for 100%
   */
  static percentToHexAlpha(percent) {
    if (percent >= 100) {
      return "";
    }
    // Truncate to integer percentage first to match legacy behavior,
    // then convert to hex (0-255 range)
    const intPercent = Math.trunc(percent);
    const alphaValue = Math.round(intPercent / 100 * 255);
    return alphaValue.toString(16).toUpperCase().padStart(2, '0');
  }

  /**
   * Processes a value, handling strings and objects with hex and alpha properties.
   * The resolves all values to a final string representation.
   * @param {Object|String} data - The value to process
   * @returns {String} - The processed value
   */
  static processValueKey(data) {
    let newValue = undefined;

    if (typeof data === 'string') {
      // remove ' & ' from strings due to Figma export oddity
      newValue = data.split(' & ').join('');
    } else if (typeof data === 'object' && data !== null) {
      // process color object with hex
      if (data.hasOwnProperty('hex')) {
        newValue = data.hex;
      }

      // if we were able to get a hex code and an alpha property exists and is a number, append corresponding hex alpha
      if (newValue && data.hasOwnProperty('alpha') && typeof data.alpha === 'number') {
        const hexAlpha = this.percentToHexAlpha(data.alpha * 100);
        newValue = newValue + hexAlpha;
      }
    }

    return newValue;
  }

  /**
   * Finds all `value` keys in an object, and requesting each to be processed.
   * @param {Object} obj - Source object to find value keys in
   */
  static processAllValueKeys(obj) {
    const keyToFind = '$value';

    // Iterate over properties of the current object
    for (const i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        if (i === keyToFind) {
          obj[i] = this.processValueKey(obj[i]);
        }
        // If the property is an object or an array, recurse
        if (typeof obj[i] === 'object' && obj[i] !== null) {
          this.processAllValueKeys(obj[i]);
        }
      }
    }
  }

  /**
   * Finds all `value` keys in an object, and requesting each to be processed.
   * @param {Object} obj - Source object to find value keys in
   */
  static findAndReplaceAllKeyNames(obj, oldKeyName, newKeyName) {
    // Iterate over properties of the current object
    for (const i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        if (i === oldKeyName) {
          obj[newKeyName] = obj[i];
          delete obj[i];
        }
        // If the property is an object or an array, recurse
        if (typeof obj[i] === 'object' && obj[i] !== null) {
          this.findAndReplaceAllKeyNames(obj[i], oldKeyName, newKeyName);
        }
      }
    }
    return obj;
  }

  /**
   * Converts a kebab-case string to camelCase.
   * @param {String} str - Kebab-case string
   * @returns {String} - CamelCase string
   */
  static kebabToCamel(str) {
    let result = str;
    
    result = result.replace(/-([a-z0-9])/g, (match, group1) => {
      return group1.toUpperCase();
    });

    return result;
  };

  /**
   * Renames all keys in an object from kebab-case to camelCase.
   * This is done because the app platform can not process kebab case key names.
   * @param {Object} obj - Object to process
   * @returns 
   */
  static convertAllKebabToCamel(obj) {
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = this.kebabToCamel(key);
        acc[camelKey] = this.convertAllKebabToCamel(value);
        return acc;
      }, {});
    }

    return obj;
  }

  /**
   * Recursively sorts the keys of a JSON object alphabetically
   * @param {Object} obj - JSON object to sort
   * @returns {Object} - JSON object with sorted keys
   */
  static sortKeysRecursive(obj) {
    // If the input is not an object (or is null), return it as is.
    // This also handles arrays by returning them, but their elements' keys
    // will be processed if they contain objects (see comment below).
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    // Handle arrays: map over elements and recursively sort if they are objects.
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortKeysRecursive(item));
    }

    // For objects: get sorted keys
    const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));

    // Create a new object with sorted keys
    const sortedObject = {};
    sortedKeys.forEach(key => {
      // Recursively sort the value for the current key
      sortedObject[key] = this.sortKeysRecursive(obj[key]);
    });

    this.processedJson = sortedObject;

    return sortedObject;
  }

  /**
   * 
   * @param {Object} data - JSON to find and convert token refs in, used only in recursive calls
   * @param {*} keys 
   * @returns 
   */
  static processTokenRefs(data, keys) {
    const isRootCall = !data;

    if (isRootCall) {
      // New processing run; reset to avoid leaking state across runs.
      data = this.processedJson;
    }

    // If there is still no data, nothing to process.
    if (!data) {
      return;
    }

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    const currJson = data;

    keys = keys || {};

    // Iterate over properties of the current object
    for (const i in currJson) {
      if (currJson.hasOwnProperty(i)) {
        if (i === 'value') {
          let newValue = currJson[i];

          const valueIsKey = typeof newValue === 'string' && newValue.startsWith('{') && newValue.endsWith('}');

          if (valueIsKey) {
            const keyName = currJson[i];
            let keyValue;
            // split string into parts by dot notation
            let keyPath = newValue.toLowerCase().slice(1, -1).split('.');
            let currentLevel;

            if (keyPath[0] === 'advanced') {
              currentLevel = this.referenceJson.advanced.color;
            } else {
              if( this.platform === 'app') {
                currentLevel = this.referenceJson.basictokens.color;
              } else { 
                currentLevel = this.referenceJson.basic.color;
              }
            }
            
            for (let i = 0; i < keyPath.length; i++) {
              if (keyPath[i] === 'advanced') {
                currentLevel = this.referenceJson.advanced.color;
              } else {
                currentLevel = currentLevel[keyPath[i]];

                if (currentLevel && currentLevel.hasOwnProperty('value')) {
                  keyValue = currentLevel.value;
                }
              }
            }

            keys[keyName] = keyValue;
          }
        }
        // If the property is an object or an array, recurse
        if (typeof currJson[i] === 'object' && currJson[i] !== null) {
          this.processTokenRefs(JSON.stringify(currJson[i]), keys);
        }
      }
    }

    return keys;
  }

  /**
   * Finds all `value` keys in an object that contain object values.
   * @param {Object} obj - Source object to find value keys in
   * @returns {Array} - Array of value keys that contain object values
   */
  static getAllValueKeysWithObject(obj) {
    const keyToFind = 'value';
    let keys = [];

    // Iterate over properties of the current object
    for (const i in obj) {
      
      if (obj.hasOwnProperty(i)) {
        if (i === keyToFind) {
          // console.log('Checking key:', obj[i]);
          const valueIsObj = typeof obj[i] === 'string' && obj[i].startsWith('{') && obj[i].endsWith('}');

          if (valueIsObj) {
            keys.push(obj[i]);
          }
        }
        // If the property is an object or an array, recurse
        if (typeof obj[i] === 'object' && obj[i] !== null) {
          keys = keys.concat(this.getAllValueKeysWithObject(obj[i]));
        }
      }
    }
    return keys;
  }

  /**
   * Processes all token references in the JSON data until none remain.
   */
  static processAllTokenRefs() {
    const allValueKeys = this.getAllValueKeysWithObject(this.processedJson).length;

    // as long as there are value keys that are objects, keep processing
    if (allValueKeys > 0) {
      const tokensToReplace = this.processTokenRefs();
      this.processedJson = JSON.parse(this.replaceTokenRefs(JSON.stringify(this.processedJson), tokensToReplace));

      this.processAllTokenRefs();
    }
  }

  /**
   * Replaces token references in the data string with their corresponding values.
   * Figma exported JSON will refer to other tokens in limited cases, this replaces those references with the correct values.
   * @param {String} data - The data string containing token references
   * @param {Object} tokens - An object mapping token references to their values
   * @returns {String} - The data string with token references replaced
   */
  static replaceTokenRefs(data, tokens) {
    let replacedData = data;

    Object.keys(tokens).forEach((key) => {
      const value = tokens[key];
      const tokenRef = `${key}`;
      replacedData = replacedData.replaceAll(tokenRef, value);
    });

    return replacedData;
  }

  /**
   * Recursively converts all keys of an object to lowercase.
   * @param {object | array} obj - The input object or array.
   * @returns {object | array} - A new object/array with lowercase keys.
   */
  static keysToLowerCase(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj; // Return non-object types (e.g., null, strings, numbers) as is.
    }

    // Handle arrays by mapping over their elements and recursively calling the function
    if (Array.isArray(obj)) {
      return obj.map(item => this.keysToLowerCase(item));
    }

    // Handle objects by creating a new object with lowercase keys
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const lowerCaseKey = key.toLowerCase();
        // Recursively process the value if it's an object or an array
        newObj[lowerCaseKey] = this.keysToLowerCase(obj[key]);
      }
    }

    return newObj;
  }

  /**
   * Recursively renames keys in an object from lowercase to camelCase using a provided mapping.
   * @param {Object} obj - Object to process
   * @param {Object} keyMappings - Object mapping lowercase keys to camelCase keys
   * @returns {Object} - Object with renamed keys
   */
  static renameToCamelCase(obj, keyMappings) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.renameToCamelCase(item, keyMappings));
    }

    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Check if this key needs to be renamed
        const newKey = keyMappings[key] || key;
        // Recursively process the value
        newObj[newKey] = this.renameToCamelCase(obj[key], keyMappings);
      }
    }
    return newObj;
  }

  /**
   * Cleans up the token data by removing unnecessary keys and processing values.
   * @param {Object} data - Token data to clean
   * @returns
   */
  static cleanData(data, platform) {
    this.recursivelyRemoveKey(data, '$type');
    this.recursivelyRemoveKey(data, '$extensions');
    this.recursivelyRemoveKey(data, 'colorSpace');
    this.recursivelyRemoveKey(data, 'components');
    this.processAllValueKeys(data);

    this.processedJson = JSON.parse(JSON.stringify(data).replaceAll('$value', 'value'));
    this.processedJson = this.keysToLowerCase(this.processedJson);
    this.referenceJson = this.processedJson;

    this.processAllTokenRefs(this.processedJson);

    if(platform === 'app') {
      this.processedJson = this.findAndReplaceAllKeyNames(this.processedJson, 'default', 'standard');
      this.processedJson = this.convertAllKebabToCamel(this.processedJson);

      // Rename keys from lowercase to camelCase throughout the entire object
      const camelCaseKeyMappings = {
        'thememetadata': 'themeMetadata',
        'basictokens': 'basicTokens',
        'uitokens': 'uiTokens',
        'fontfamily': 'fontFamily',
        'fontsize': 'fontSize',
        'fontweight': 'fontWeight',
        'letterspacing': 'letterSpacing',
        'lineheight': 'lineHeight',
        'displayname': 'displayName',
        'iconurl': 'iconUrl',
        'webviewcode': 'webviewCode'
      };

      this.processedJson = this.renameToCamelCase(this.processedJson, camelCaseKeyMappings);
    }

    this.sortKeysRecursive(this.processedJson);
  }

  /**
   * Processes tokens from the specified file.
   * @param {String} fileName - Name of the file containing token JSON to process.
   * @param {String} platform - Target platform ('app' or 'web').
   */
  static processTokenConfiguration(fileName, platform) {
    this.platform = platform;

    const importTokens = this.fetchImportTokens(fileName, platform);

    // ensure we start from a clean slate for every call
    this.resetState();

    this.cleanData(importTokens, platform);
    this.writeToFile(fileName, platform, this.processedJson);
  }

  /**
   * Writes the processed data to a file.
   * @param {String} fileName - Name of the output file.
   * @param {String} platform - Target platform ('app' or 'web').
   * @param {Object} data - Processed data to write.
   */
  static writeToFile(fileName, platform, data) {
    try {
      let outDir = path.join('.', 'processed');

      if (!fs.existsSync(outDir)) {
        try {
          fs.mkdirSync(path.join(process.cwd(), outDir), { recursive: true });
        } catch (err) {
          console.error('Unable to create output directory:', err);
        }
      }

      if (platform) {
        const platformDir = path.join(process.cwd(), outDir, platform);

        if (!fs.existsSync(platformDir)) {
          try {
            fs.mkdirSync(platformDir, { recursive: true });
          } catch (err) {
            console.error('Unable to create output directory:', err);
          }
        }

        outDir = path.join(outDir, platform);
      }

      console.warn(`  Writing processed file to ${path.join(outDir, fileName)}...`);

      const outputFilePath = path.join(outDir, fileName);

      fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2) + "\n", "utf8");

      console.log("  Done");
    } catch (error) {
      console.error(`. Error writing processing file:`, error.message);
      process.exit(1);
    }
  }
}
