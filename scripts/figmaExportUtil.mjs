import fs from "fs";
import _ from "lodash";
import path from "path";

export default class ExportUtil {
  static processedJson = {};
  static baseJson = undefined;

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
    const basicTokens = {
      "basic": {
        "color": {
          // If the Design team changes any basic token name groups this section must be updated to match those new names
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
    }
    let importTokens = {};

    // extract the complete token set based on platform
    if (platform === 'app') {
      const appAdvancedTokens = {
        "uiTokens": exportJson.uiTokens
      }

      // combine all basic and advanced tokens
      importTokens = {
        ...appAdvancedTokens,
        ...basicTokens
      }
    } else if (platform === 'web') {
      const webAdvancedTokens = {
        "advanced": {
          "color": exportJson.advanced
        }
      }

      const manualJson = JSON.parse(this.fetchFile(manualImportDir, fileName));

      // combine basic and advanced web tokens
      importTokens = {
        ...webAdvancedTokens,
        ...basicTokens
      }

      importTokens = _.merge(importTokens, manualJson);
    }
    
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
   * Processes a value, handling strings and objects with hex and alpha properties.
   * The resolves all values to a final string representation.
   * @param {Object|String} data - The value to process
   * @returns {String} - The processed value
   */
  static processValueKey(data) {
    const hexAlphas = {
      100: "FF",
      99: "FC",
      98: "FA",
      97: "F7",
      96: "F5",
      95: "F2",
      94: "F0",
      93: "ED",
      92: "EB",
      91: "E8",
      90: "E6",
      89: "E3",
      88: "E0",
      87: "DE",
      86: "DB",
      85: "D9",
      84: "D6",
      83: "D4",
      82: "D1",
      81: "CF",
      80: "CC",
      79: "C9",
      78: "C7",
      77: "C4",
      76: "C2",
      75: "BF",
      74: "BD",
      73: "BA",
      72: "B8",
      71: "B5",
      70: "B3",
      69: "B0",
      68: "AD",
      67: "AB",
      66: "A8",
      65: "A6",
      64: "A3",
      63: "A1",
      62: "9E",
      61: "9C",
      60: "99",
      59: "96",
      58: "94",
      57: "91",
      56: "8F",
      55: "8C",
      54: "8A",
      53: "87",
      52: "85",
      51: "82",
      50: "80",
      49: "7D",
      48: "7A",
      47: "78",
      46: "75",
      45: "73",
      44: "70",
      43: "6E",
      42: "6B",
      41: "69",
      40: "66",
      39: "63",
      38: "61",
      37: "5E",
      36: "5C",
      35: "59",
      34: "57",
      33: "54",
      32: "52",
      31: "4F",
      30: "4D",
      29: "4A",
      28: "47",
      27: "45",
      26: "42",
      25: "40",
      24: "3D",
      23: "3B",
      22: "38",
      21: "36",
      20: "33",
      19: "30",
      18: "2E",
      17: "2B",
      16: "29",
      15: "26",
      14: "24",
      13: "21",
      12: "1F",
      11: "1C",
      10: "1A",
      9: "17",
      8: "14",
      7: "12",
      6: "0F",
      5: "0D",
      4: "0A",
      3: "08",
      2: "05",
      1: "03",
      0: "00"
    }

    let newValue = undefined;

    if (typeof data === 'string') {
      // remove ' & ' from strings due to Figma export oddity
      newValue = data.split(' & ').join('');
    } else if (typeof data === 'object' && data !== null) {
      // process color object with hex
      if (data.hasOwnProperty('hex')) {
        newValue = data.hex;
      }

      // if we were able to get a hex code and analpha property exists and is a number, append corresponding hex alpha
      if (newValue && data.hasOwnProperty('alpha') && typeof data.alpha === 'number') {
        const hexAlpha = hexAlphas[parseInt(data.alpha * 100)];
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
        obj[i] = ExportUtil.processValueKey(obj[i]);
      }
      // If the property is an object or an array, recurse
      if (typeof obj[i] === 'object' && obj[i] !== null) {
        this.processAllValueKeys(obj[i]);
      }
    }
  }
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
  static convertKebabToCamel(obj) {
    if (obj !== null && typeof obj === 'object') {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = this.kebabToCamel(key);
        acc[camelKey] = this.convertKebabToCamel(value);
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

    if (!this.baseJson) {
      this.baseJson = data;
    }

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    const currJson = data;

      const keyToFind = 'value';
      keys = keys || {};

      // Iterate over properties of the current object
      for (const i in currJson) {
        if (currJson.hasOwnProperty(i)) {
          if (i === keyToFind) {
            let newValue = currJson[i];

            const valueIsKey = typeof newValue === 'string' && newValue.startsWith('{') && newValue.endsWith('}');

            if (valueIsKey) {
              const keyName = currJson[i];
              let keyValue;
              // split string into parts by dot notation
              let keyPath = newValue.slice(1, -1).split('.');

              let currentLevel;

              if (keyPath[0] === 'advanced') {
                currentLevel = this.baseJson.advanced.color;
              } else {
                currentLevel = this.baseJson.basic.color;
              }
              
              for (let i = 0; i < keyPath.length; i++) {
                if (keyPath[i] === 'advanced') {
                  currentLevel = this.baseJson.advanced.color;
                } else {
                  currentLevel = currentLevel[keyPath[i]];

                  if (currentLevel.hasOwnProperty('value')) {
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
    const tokensToReplace = this.processTokenRefs();

    // as long as there are value keys that are objects, keep processing
    if (allValueKeys > 0) {
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

    let result = JSON.parse(JSON.stringify(data).replaceAll('$value', 'value').toLowerCase());

    if (platform === 'app') {
      result = this.convertKebabToCamel(result);
    } 

    this.processedJson = result;

    this.processAllTokenRefs(this.processedJson);
    this.sortKeysRecursive(this.processedJson);

    return result;
  }

  /**
   * Processes tokens from the specified file.
   * @param {String} fileName - Name of the file containing token JSON to process.
   * @param {String} platform - Target platform ('app' or 'web').
   */
  static processTokenConfiguration(fileName, platform) {
    const importTokens = this.fetchImportTokens(fileName, platform);

    // ensure we start from a clean slate for every call
    ExportUtil.resetState();

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
