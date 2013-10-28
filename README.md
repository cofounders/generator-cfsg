# generator-cfsg [![Build Status](https://secure.travis-ci.org/cofounders/generator-cfsg.png?branch=master)](https://travis-ci.org/cofounders/generator-cfsg)

The Cofounders frontend stack generator for [Yeoman](http://yeoman.io).


## Usage

Install `generator-cfsg`:
```
npm install -g generator-cfsg
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo cfsg`, optionally passing an app name:
```
yo cfsg [app-name]
```

## Generators

Available generators:

* [cfsg](#app) (aka [cfsg:app](#app))
* [cfsg:module](#module)
* [cfsg:mvc](#mvc)
* [cfsg:cdnjs](#cdnjs)
* [cfsg:legal](#legal)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new app based on the Cofounders frontend stack, generating all the boilerplate you need to get started.

Once done, run `npm start` to build and launch your brand new app.

See [README.md](app/templates/_README.md) to learn the Cofounders frontend stack.

Example:
```bash
yo cfsg
```

See: [app/USAGE](app/USAGE) or run `yo cfsg --help`

### Module
Adds a new module to the app by setting up a sensible directory structure.

Modules try to balance between an unwieldy number of tiny snippets and huge monolithic files. They work best on mid- to large-scale projects.

Example:
```bash
yo cfsg:module
```

See: [module/USAGE](module/USAGE) or run `yo cfsg:module --help`

### MVC
Adds a Backbone Model, View, or Controller to an app module. Injects code snippets and creates placeholders.

Example:
```bash
yo cfsg:mvc
```

See: [mvc/USAGE](mvc/USAGE) or run `yo cfsg:mvc --help`

### CDNJS
Adds external dependencies to the app for resources hosted on [CDNJS](http://cdnjs.com/).

Using external dependencies has several benefits:
- Parallel client-side downloads
- Shared caching across websites
- Reduce hosting requirements (bandwidth) for the app
- Faster builds by skipping external code

Example:
```bash
yo cfsg:cdnjs
```

See: [cdnjs/USAGE](cdnjs/USAGE) or run `yo cfsg:cdnjs --help`

### Legal
Changes the license under which the app is published.

Choose from a set of common open source licenses.

Example:
```bash
yo cfsg:legal
```

See: [legal/USAGE](legal/USAGE) or run `yo cfsg:legal --help`

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
