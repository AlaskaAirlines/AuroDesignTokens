const StyleDictionary = require('style-dictionary');
const _ = require('lodash');
const fs = require('fs');
const join = require('path').join;

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

StyleDictionary.registerFormat({
  name: 'custom/scss/map-flat',
  formatter:  _.template( fs.readFileSync(join(__dirname,'../templates/map-flat.template')) )
});

// Required dependency
const tokensConfig = StyleDictionary.extend('./scripts/config.json');

// Style Dictionary build function
tokensConfig.buildAllPlatforms();

const darkTokensConfig = StyleDictionary.extend('./scripts/config-darkmode.json');

darkTokensConfig.buildAllPlatforms();

// Themes

const baseConfig = StyleDictionary.extend('./scripts/config-base.json');

baseConfig.buildAllPlatforms();

const excursionConfig = StyleDictionary.extend('./scripts/config-excursion.json');

excursionConfig.buildAllPlatforms();

const hawaiianConfig = StyleDictionary.extend('./scripts/config-hawaiian.json');

hawaiianConfig.buildAllPlatforms();

const transparentConfig = StyleDictionary.extend('./scripts/config-transparent.json');

transparentConfig.buildAllPlatforms();
