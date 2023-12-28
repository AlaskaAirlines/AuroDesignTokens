# Config filter API

The following table illustrated the different JSON options currently being used to filter the data output.

By default, no tokens are exposed in an output file unless specifically designated by a config filter option. See the table below for the different types of filters currently in use.

| filter | type | description |
|---|---|---|
| attributes {category/type/option} | string | Follow the pattern of the [CTI Structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item) to determine the value of a category, type or option in the JSON |
| classic | boolean | Token filter for `classic` theme values |
| deprecated | boolean | Tokens marked as `deprecated:false` will be included into the AllTokens data file. Ones marked `deprecated:true` will only appear in the deprecated data. This should be used in conjunction with the redirect and reference JSON options in order to properly deprecate the token and reference it's replacement (or n/a). |
| legacy | boolean | Token filter for legacy values |
| opacity | boolean | Token filter for base colors with an alpha transparency |
| public | boolean | Token filter for publicly exposed Design System tokens per the most recent spec |
| redirect | boolean | Token filter for legacy values that have a new reference |

**Classic:** Tokens that reference Alaska CLASSIC themes
<br>**Legacy:** Tokens established prior to v2.8 release
<br>**Public:** Currently approved for use Orion Design Tokens


Additional content options are made available within the token data. See the table below for these options and their descriptions.

| option | type | description |
|---|---|---|
| comment | string | Comment that will appear in CSS/Sass output |
| reference | string | New token redirect reference |
| usage | string | Description of token use |
| wcag | string | WCAG accessibility rating if applicable |
| value | string / number | The value of the token |
