console.log('')
console.log('Test started...');
console.log('')


// Required dependency
const StyleDictionary = require('style-dictionary').extend('./scripts/config.json');

// Style Dictionary build function
StyleDictionary.buildPlatform('JSONtest');

console.log('')
console.log('Test completed...');
console.log('')
