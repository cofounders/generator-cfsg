'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var _ = require('underscore');
_.mixin(require('underscore.string').exports());
var path = require('path');
var fs = require('fs');

var ViewGenerator = module.exports = function ViewGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('module', { type: String, required: false });
  this.argument('view', { type: String, required: false });
};

util.inherits(ViewGenerator, yeoman.generators.Base);

ViewGenerator.prototype.askFor = function askFor() {
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
      message: 'To which module do you want to add a view?',
      default: 'My Module',
      choices: modules
    });
  }

  if (!this.name) {
    prompts.push({
      name: 'view',
      message: 'What is the name of this view?',
      default: 'My View'
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

ViewGenerator.prototype.inject = function inject() {
  var module = this.read(path.resolve(this.module));
  var view = this.read('view.js');
  var rendered = _.template(view, this);
  var marker = module.lastIndexOf('\treturn');
  var output = _.insert(module, marker, rendered);
  this.write(this.module, output);
};
