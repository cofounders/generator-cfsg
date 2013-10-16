'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CfsgGenerator = module.exports = function CfsgGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CfsgGenerator, yeoman.generators.Base);

CfsgGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'projectName',
    message: 'What is the name of the project?',
    default: 'Hello World'
  }];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;

    cb();
  }.bind(this));
};

CfsgGenerator.prototype.app = function app() {
  this.directory('.', '.');
};
