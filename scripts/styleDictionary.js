import StyleDictionary from 'style-dictionary';
import _ from 'lodash';
import fs from 'fs';
import { join } from 'path';
import Color from 'tinycolor2';
import { makeSdTailwindConfig } from 'sd-tailwindcss-transformer';

// Register custom color transform
StyleDictionary.registerTransform({
  name: 'custom/color/rgb',
  type: 'value',
  matcher: (prop) => prop.attributes.category === 'color',
  transformer: (prop) => {
    const newColor = Color(prop.value).toRgbString();
    const reg = /\((.*)\)/;
    return newColor.match(reg)[1];
  }
});

// Register custom SCSS map-flat format
StyleDictionary.registerFormat({
  name: 'custom/scss/map-flat',
  formatter: _.template(fs.readFileSync(join(new URL(import.meta.url).pathname, './../../templates/map-flat.template')))
});

// Extend the default configuration for various themes
const tokensConfig = StyleDictionary.extend('./scripts/config.json');

// Style Dictionary build function
await tokensConfig.buildAllPlatforms();

const darkTokensConfig = StyleDictionary.extend('./scripts/config-darkmode.json');
await darkTokensConfig.buildAllPlatforms();

// Extend for excursion config
const excursionConfig = StyleDictionary.extend('./scripts/config-excursion.json');
await excursionConfig.buildAllPlatforms();

// Tailwind CSS configuration using the extend method
const tailwindConfig = makeSdTailwindConfig({
  type: 'all',
  source: [ 'src/**/*.json' ],
  isVariables: true,
  prefix: 'ds',
  buildPath: 'dist/tokens/',
});
const styleDictionaryTailwind = StyleDictionary.extend(tailwindConfig);

// Ensure the Tailwind configuration has initialized and build all platforms
await styleDictionaryTailwind.hasInitialized;
await styleDictionaryTailwind.buildAllPlatforms();


console.log(tailwindConfig)
