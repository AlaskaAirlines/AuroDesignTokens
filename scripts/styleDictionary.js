console.log('')
console.log('Build started...');

console.log('')
console.log('         .         . ')
console.log('               *       *')
console.log('')
console.log('                 * * *')
console.log('                    !')
console.log('               *       * ')
console.log('')
console.log(" ██████╗ ██████╗ ██╗ ██████╗ ███╗   ██╗")
console.log("██╔═══██╗██╔══██╗██║██╔═══██╗████╗  ██║")
console.log("██║   ██║██████╔╝██║██║   ██║██╔██╗ ██║")
console.log("██║   ██║██╔══██╗██║██║   ██║██║╚██╗██║")
console.log("╚██████╔╝██║  ██║██║╚██████╔╝██║ ╚████║")
console.log(" ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝")
console.log('')
console.log("██████╗ ███████╗███████╗██╗ ██████╗ ███╗   ██╗")
console.log("██╔══██╗██╔════╝██╔════╝██║██╔════╝ ████╗  ██║")
console.log("██║  ██║█████╗  ███████╗██║██║  ███╗██╔██╗ ██║")
console.log("██║  ██║██╔══╝  ╚════██║██║██║   ██║██║╚██╗██║")
console.log("██████╔╝███████╗███████║██║╚██████╔╝██║ ╚████║")
console.log("╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝")
console.log('')
console.log("███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗")
console.log("██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║")
console.log("███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║")
console.log("╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║")
console.log("███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║")
console.log("╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝")
console.log('')

// Required dependency
const StyleDictionary = require('style-dictionary').extend('./scripts/config.json');

// Style Dictionary build function
StyleDictionary.buildPlatform('JavaScript');
StyleDictionary.buildPlatform('SassVariables');
StyleDictionary.buildPlatform('CSSCustomElements');
StyleDictionary.buildPlatform('CSSCustomElements_SassFiletype');
