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
        value: module,
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
  var module = this.read(path.resolve(this.module));
  var snippet = this.read(this.type.toLowerCase() + '.js');
  var rendered = _.template(snippet, this);
  var marker = module.lastIndexOf('\treturn');
  var output = _.insert(module, marker, rendered);
  this.write(this.module, output);
};
