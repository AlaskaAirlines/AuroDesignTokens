import StyleDictionary from 'style-dictionary';

console.log('');
console.log('Test started...');
console.log('');

// Style Dictionary config
const testConfig = StyleDictionary.extend('./scripts/config-auroClassic.json');

// Style Dictionary build function
testConfig.buildPlatform('JSONtest');

console.log('');
console.log('Test completed...');
console.log('');