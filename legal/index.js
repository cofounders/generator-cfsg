'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var _ = require('underscore');

var LegalGenerator = module.exports = function LegalGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('license', { type: String, required: false });
};

util.inherits(LegalGenerator, yeoman.generators.Base);

LegalGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [];

  var licenses = [
    {value: 'gpl2', name: 'GNU Public License version 2'},
    {value: 'gpl3', name: 'GNU Public License version 3'},
    {value: 'mit', name: 'MIT License'},
    {value: 'isc', name: 'ISC License'},
    {value: 'evil', name: 'All rights reserved'},
    {value: 'none', name: 'Not specified'}
  ];

  if (this.options.license) {
    this.license = this.options.license;
  }

  if (!this.license || !_.findWhere(licenses, {value: this.license})) {
    prompts.push({
        type: 'list',
        name: 'license',
        message: 'Which license is this project published under?',
        default: _.reduce(licenses, function (memo, choice, index) {
          return this.license && choice.value === this.license ? index : memo;
        }, licenses.length - 1, this),
        choices: licenses
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

LegalGenerator.prototype.files = function files() {
  this.template('LICENSE_' + this.license.toUpperCase(), 'LICENSE');
};
