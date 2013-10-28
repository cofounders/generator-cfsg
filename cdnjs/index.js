'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var path = require('path');
var _ = require('underscore');
_.mixin(require('underscore.string').exports());
var GitHubApi = require('github');
var semver = require('semver');

var github = new GitHubApi({
  version: '3.0.0'
});

var CdnjsGenerator = module.exports = function CdnjsGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('query', { type: String, required: false });
  this.argument('library', { type: String, required: false });
};

util.inherits(CdnjsGenerator, yeoman.generators.Base);

CdnjsGenerator.prototype.search = function search() {
  var cb = this.async();

  var prompts = [];

  if (!this.query) {
    prompts.push({
      name: 'query',
      message: 'Search CDNJS:',
      default: 'backbone.layoutmanager'
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

CdnjsGenerator.prototype.chooseLibrary = function chooseLibrary() {
  var cb = this.async();

  github.repos.getContent({
    user: 'cdnjs',
    repo: 'cdnjs',
    path: 'ajax/libs'
  }, function (error, result) {
    var libraries = _.chain(result)
      .filter(function (content) {
        return content.type === 'dir';
      })
      .filter(function (content) {
        var name = content.name.toLowerCase();
        var query = (this.query || '').toLowerCase();
        return name.indexOf(query) > -1;
      }.bind(this))
      .map(function (content) {
        return {
          name: content.name,
          value: content.path
        };
      })
      .sortBy(function (content) {
        return content.name
          .toLowerCase()
          .replace(/[^a-z\d]/i, '');
      })
      .value();

    var prompts = [];

    prompts.push({
      type: 'list',
      name: 'library',
      message: 'Choose a library:',
      choices: libraries
    });

    this.prompt(prompts, function (props) {
      _.extend(this, props);

      cb();
    }.bind(this));
  }.bind(this));
};

CdnjsGenerator.prototype.chooseVersion = function chooseVersion() {
  var cb = this.async();

  github.repos.getContent({
    user: 'cdnjs',
    repo: 'cdnjs',
    path: this.library
  }, function (error, result) {
    var versions = result
      .filter(function (content) {
        return content.type === 'dir';
      })
      .map(function (content) {
        return {
          name: content.name,
          value: content.path
        };
      })
      .sort(function (a, b) {
        if (semver.valid(a.name) && semver.valid(b.name)) {
          return semver.rcompare(a.name, b.name);
        } else {
          return a.name < b.name;
        }
      });

    var prompts = [];

    prompts.push({
      type: 'list',
      name: 'version',
      message: 'Choose a version:',
      choices: versions
    });

    this.prompt(prompts, function (props) {
      _.extend(this, props);

      cb();
    }.bind(this));
  }.bind(this));
};

CdnjsGenerator.prototype.fetchIncludes = function fetchIncludes() {
  var cb = this.async();

  github.repos.getContent({
    user: 'cdnjs',
    repo: 'cdnjs',
    path: this.version
  }, function (error, result) {
    this.includes = {};

    var files = result
      .filter(function (content) {
        return content.type === 'file';
      })
      .map(function (content) {
        return {
          name: content.name,
          value: content.path
        };
      });

    this.includes.js = files
      .filter(function (include) {
        return /\.js($|\?)/.test(include.value);
      });

    this.includes.css = files
      .filter(function (include) {
        return /\.css($|\?)/.test(include.value);
      });

    cb();
  }.bind(this));
};

CdnjsGenerator.prototype.chooseJavascript = function chooseJavascript() {
  if (this.includes.js.length > 0) {
    var cb = this.async();

    var prompts = [];

    prompts.push({
      type: 'list',
      name: 'js',
      message: 'Choose a JavaScript file to reference:',
      choices: this.includes.js
    });

    this.prompt(prompts, function (props) {
      _.extend(this, props);

      cb();
    }.bind(this));
  }
};

CdnjsGenerator.prototype.chooseCSS = function chooseCSS() {
  if (this.includes.css.length > 0) {
    var cb = this.async();

    var prompts = [];

    prompts.push({
      type: 'checkbox',
      name: 'css',
      message: 'Choose one or more CSS files to import:',
      choices: this.includes.css
    });

    this.prompt(prompts, function (props) {
      _.extend(this, props);

      cb();
    }.bind(this));
  }
};

CdnjsGenerator.prototype.jsImports = function jsImports() {
  if (this.js.length) {
    var destination = path.join(
      this.destinationRoot(),
      'source/js/loader.js'
    );
    var lines = _.lines(this.read(path.resolve(destination)));

    var name = this.library
      .replace(/^ajax\/libs\/(.*)/i, '$1')
      .replace(/(.+)\.(js|css)$/i, '$1')
      .replace(/[^\w\.]/g, '');
    if (/[^\w]/i.test(name)) {
      name = _.quote(name, '\'');
    }

    var header = [];
    while (lines[header.length].indexOf('paths:') === -1) {
      header.push(lines[header.length]);
    }
    header.push(lines[header.length]);

    var libs = [];
    while (lines[header.length + libs.length].indexOf('}') === -1) {
      libs.push(lines[header.length + libs.length]);
    }

    var footer = lines.slice(header.length + libs.length);

    libs = libs.filter(function (line) {
      return _.ltrim(line).substr(0, name.length) !== name;
    });

    if (libs.length) {
      var lastLib = _.rtrim(libs[libs.length - 1]);
      if (lastLib.charAt(lastLib.length - 1) !== ',') {
        var suffix = libs[libs.length - 1].substr(lastLib.length);
        libs[libs.length - 1] = lastLib + ',' + suffix;
      }
    }

    var cdnjs = '//cdnjs.cloudflare.com/' + this.js;
    libs.push('\t\t' + name + ': ' + _.quote(cdnjs, '\''));

    var output = [].concat(header, libs, footer).join('\n');
    this.write(destination, output);
  }
};

CdnjsGenerator.prototype.cssImports = function cssImports() {
  if (this.css && this.css.length) {
    var destination = path.join(
      this.destinationRoot(),
      'source/styles/imports.styl'
    );
    var lines = _.lines(this.read(path.resolve(destination)));
    if (lines.length && lines[0].trim() === '//') {
      lines.shift();
    }
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }
    this.css
      .filter(function (url) {
        return lines.every(function (line) {
          return line.toLowerCase().indexOf(url.toLowerCase()) === -1;
        });
      })
      .forEach(function (url) {
        var cdnjs = '//cdnjs.cloudflare.com/' + url;
        lines.push('@import url(' + _.quote(cdnjs, '\'') + ')');
      });
    var output = lines.join('\n') + '\n';
    this.write(destination, output);
  }
};
