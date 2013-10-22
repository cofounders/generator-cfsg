'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var _ = require('underscore');
_.mixin(require('underscore.string').exports());

var ModuleGenerator = module.exports = function ModuleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', { type: String, required: false });
};

util.inherits(ModuleGenerator, yeoman.generators.Base);

ModuleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [];

  if (!this.name) {
    prompts.push({
      name: 'name',
      message: 'What is the name of this module?',
      default: 'My Module'
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

ModuleGenerator.prototype.files = function files() {
  this.copy('mvc.js', 'source/js/modules/' + _.classify(this.name) + '.js');
  this.mkdir('source/styles/modules/' + _.underscored(this.name));
  this.mkdir('source/templates/' + _.underscored(this.name));
};
