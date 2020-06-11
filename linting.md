# How-To: Linting
## 1. Setup
What your file structure will look like after inserting all the files below:
```
step
│   *other things   
│
└───.github
│   │
│   └───workflows
|       │
│       └───lint.yml
|
└───.eslintrc.json
└───.htmlvalidate.json
└───.prettierrc.json
└───.gitignore
└───makefile

```

Example terminal commands: `make pretty` and `make validate`. 
`make pretty` modifies your html / css / js / java code in the specified directories.
`make validate` tests your html / css / js in the specified directories against the linters. 

makefile
```
CLANG_FORMAT=node_modules/clang-format/bin/linux_x64/clang-format --style=Google
CSS_VALIDATOR=node_modules/css-validator/bin/css-validator
ESLINT=node_modules/eslint/bin/eslint.js
HTML_VALIDATE=node_modules/html-validate/bin/html-validate.js
PRETTIER=node_modules/prettier/bin-prettier.js

node_modules:
	npm install clang-format prettier css-validator html-validate eslint eslint-config-google

pretty: node_modules
	$(PRETTIER) --write portfolio/src/main/webapp/*.{html,css}
	find portfolio/src/main/java -iname *.java | xargs $(CLANG_FORMAT) -i
	find portfolio/src/main/webapp -iname *.js | xargs $(CLANG_FORMAT) -i

validate: node_modules
	$(HTML_VALIDATE) portfolio/src/main/webapp/*.html
	$(CSS_VALIDATOR) portfolio/src/main/webapp/*.css
	$(ESLINT) portfolio/src/main/webapp/*.js

package:
	mvn package
```

Add whatever settings you would like for prettifying code or linting. 

.prettierrc.json
```
{
  "semi": false,
  "overrides": [
    {
      "files": ["*.html"],
      "options": {
        "printWidth": 120,
        "tabWidth": 2,
        "singleQuote": false,
        "useTabs": false
      }
    },
    {
      "files": ["*.css"],
      "options": {
        "tabWidth": 2,
        "singleQuote": true,
        "useTabs": false
      }
    }
  ]
}
```
.htmlvalidate.json
```
{
  "elements": [
    "html5"
  ],
  "extends": [
    "html-validate:recommended"
  ],
  "rules": {
    "void-style": "off"
  }
}
```
.eslintrc.json
```
{
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "google"],
  "rules": {
    "no-multi-spaces": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off"
  }
}
```

Configure the `.gitignore` to ignore certain folders otherwise it's going 
to download/upload hundreds of random packages to github every time you work with the remote.

.gitignore
```
# Ignore generated NPM files
# These are sometimes included but not necessary for this project
package-lock.json
node_modules/

# Ignore generated Maven build files
target/

# Ignore editor config
.idea
```
Whenever you push to any branch it will run the commands in `lint.yml` (eg linting html, css, js, java). 
Keep in mind github will send you emails when you set it like this, so if any of the linting fails you will get emails.

.github/workflows/lint.yml
```
name: CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Maven compile
      run: cd portfolio; mvn package
    - name: install node dependencies
      if: always()
      run: make node_modules
    - name: Validate HTML
      if: always()
      run: node_modules/html-validate/bin/html-validate.js portfolio/src/main/webapp/*.html
    - name: Validate CSS
      if: always()
      run: node_modules/css-validator/bin/css-validator portfolio/src/main/webapp/*.css
    - name: Validate JavaScript
      if: always()
      run: node_modules/eslint/bin/eslint.js portfolio/src/main/webapp/*.js
    - name: Check HTML Formatting
      if: always()
      run: node_modules/prettier/bin-prettier.js -c portfolio/src/main/webapp/*.html
    - name: Check CSS Formatting
      if: always()
      run: node_modules/prettier/bin-prettier.js -c portfolio/src/main/webapp/*.css
    - name: Check JavaScript Formatting
      if: always()
      run: diff -u <(cat portfolio/src/main/webapp/*.js) <(node_modules/clang-format/bin/linux_x64/clang-format --style=Google portfolio/src/main/webapp/*.js)
    - name: Check Java Formatting
      if: always()
      run: diff -u <(cat portfolio/src/main/java/com/google/sps/servlets/*.java) <(node_modules/clang-format/bin/linux_x64/clang-format --style=Google portfolio/src/main/java/com/google/sps/servlets/*.java)
    - name: Notify on failure
      if: failure()
      run: echo 'run "make validate" and "make pretty" to see/fix errors locally'
```
## 2. Ignoring Lint Errors
* [html-validate](https://html-validate.org/usage/index.html)
Thereoretically you could do `<!-- [html-validate-disable deprecated] -->`, but I couldn't get it to work. 
Alternative: modify `.htmlvalidate.json.`
```
  "[rules](https://html-validate.org/rules/index.html)": {
    "[rule you don't care about]": "off",
    "[rule you sort of care about]": "warn"
  }
```
* [eslint](https://eslint.org/docs/2.13.1/user-guide/configuring)
```
/* eslint-disable */
[code to ignore]
/* eslint-enable */
```