const StyleDictionary = require('style-dictionary');
const _ = require('lodash');

const Color = require('tinycolor2');

StyleDictionary.registerTransform({
  name: 'custom/color/rgb',
  type: 'value',
  matcher: function(prop) {
    return prop.attributes.category === 'color';
  },
  transformer: function(prop) {
    let newColor = Color(prop.value).toRgbString()
    let reg = /\((.*)\)/;

    return newColor.match(reg)[1];
  }
});

// Required dependency
const tokensConfig = StyleDictionary.extend('./scripts/config.json');

// Style Dictionary build function
tokensConfig.buildAllPlatforms();
