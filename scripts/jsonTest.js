import StyleDictionary from 'style-dictionary';

console.log('');
console.log('Test started...');
console.log('');

// Extend the required dependency
const styleDictionary = StyleDictionary.extend('./scripts/config.json');

// Function to build the Style Dictionary platform
async function buildStyleDictionary() {
    await styleDictionary.buildPlatform('JSONtest');
}

// Execute the build function
await buildStyleDictionary();

console.log('');
console.log('Test completed...');
console.log('');
