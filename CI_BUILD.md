# Permissions and CI build

In order to use internal npm packages, locally or CI build, you need to use a security token.

### User security

**DO NOT** add a `.npmrc` that contains the security token file in root of your project or track this in version control.

Place the `.npmrc` file with the security token in your **users** root directory.

### Project security

In the root of your project where your build pipeline is, create a new `.npmrc` file, place the following code and **commit to version control**.

```
registry=https://registry.npmjs.com
always-auth=false

@alaskaair:registry=https://itsals.pkgs.visualstudio.com/_packaging/as.com-npm/npm/registry/
@alaskaair:always-auth=true
```

### CI security

In order for the CI build to have permissions from VSTS, add the following script commands to your `package.json` files.

```
"install-vsts-npm-auth" : "npm install -g vsts-npm-auth",
"generate-vsts-token": "vsts-npm-auth -config .npmrc -T %userprofile%\\.npmrc"
```

These steps will install the `vsts-npm-auth` package and run the auth process.

#### VSTS WYSIWYG pipeline builder

If preferred, you can add these npm commands to the VSTS pipeline builder as well. But the `.npmrc` file needs to be committed to your project's version control.
