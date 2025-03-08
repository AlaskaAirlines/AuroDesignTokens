# Contributing

Please be sure to follow current Design Token patterns and follow the [CTI Structure](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item). Any submissions to this project that does not follow these guidelines will be considered non-compliant and your submission will be rejected.

Also, please see this repo's [contributing guidelines](https://github.com/AlaskaAirlines/OrionDesignTokens/blob/master/CONTRIBUTING.md).

Before submitting a pull request, please ensure that your JSON is formatted correctly. Testing is easy, you can build out resource files that are not added to the repo's version control.

To mimic a CI Build and ensure a successful build with a merge, please run the following command to test the build pipeline:

```bash
$ npm run ciBuild
```

**All tests will run with the automated build, but it's a good idea to run tests locally to ensure stability of pull request**
