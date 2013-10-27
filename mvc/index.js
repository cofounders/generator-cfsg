'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var _ = require('underscore');
_.mixin(require('underscore.string').exports());
var path = require('path');
var fs = require('fs');

var MvcGenerator = module.exports = function MvcGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('type', { type: String, required: false });
  this.argument('module', { type: String, required: false });
  this.argument('name', { type: String, required: false });
};

util.inherits(MvcGenerator, yeoman.generators.Base);

MvcGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [];

  if (!this.module) {
    var paths = this.expand(path.join(
      this.destinationRoot(),
      'source/js/modules/*.js'
    ));

    var isFile = function (module) {
      var stats = fs.statSync(module);
      return stats.isFile();
    };

    var extractName = function (module) {
      var base = path.basename(module, '.js');
      return {
        value: base,
        name: _.titleize(_.humanize(base))
      };
    };

    var modules = paths
      .filter(isFile)
      .map(extractName);

    prompts.push({
      type: 'list',
      name: 'module',
      message: 'Which module do you want to extend?',
      default: 'My Module',
      choices: modules
    });
  }

  if (!this.type) {
    prompts.push({
      type: 'list',
      name: 'type',
      message: 'What do you want to create?',
      default: 0,
      choices: ['model', 'collection', 'view']
        .map(function (label) {
          return {
            name: _.titleize(label),
            value: label
          };
        })
    });
  }

  if (!this.name) {
    prompts.push({
      name: 'name',
      message: 'What is the name of this extension?',
      default: 'My Extension'
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

MvcGenerator.prototype.inject = function inject() {
  var destination = path.join(
    this.destinationRoot(),
    'source/js/modules',
    this.module + '.js'
  );
  var module = this.read(path.resolve(destination));
  var snippet = this.read(this.type + '.js');
  var rendered = _.template(snippet, this);
  var marker = module.lastIndexOf('\treturn');
  var output = _.insert(module, marker, rendered);
  this.write(destination, output);
};

MvcGenerator.prototype.setFilename = function setFilename() {
  this.filename = _.slugify(_.humanize(this.module)) + '/'
    + _.slugify(_.humanize(this.name));
};

MvcGenerator.prototype.handlebars = function handlebars() {
  if (this.type === 'view') {
    this.template(
      'view.html',
      'source/templates/' + this.filename + '.html'
    );
  }
};

MvcGenerator.prototype.stylus = function stylus() {
  if (this.type === 'view') {
    this.template(
      'view.styl',
      'source/styles/modules/' + this.filename + '.styl'
    );
  }
};

MvcGenerator.prototype.include = function include() {
  if (this.type === 'view') {
    var destination = path.join(
      this.destinationRoot(),
      'source/styles/app.styl'
    );

    var lines = _.lines(this.read(path.resolve(destination)));

    var isIncluded = function (line) {
      return line.toLowerCase().indexOf(this.filename.toLowerCase()) !== -1;
    }.bind(this);

    if (_.some(lines, isIncluded)) {
      return;
    }

    if (lines[lines.length - 1] === '') {
      lines.pop();
    }
    lines.push('@import ' + _.quote('modules/' + this.filename, '\''));
    var output = lines.join('\n') + '\n';
    this.write(destination, output);
  }
};
