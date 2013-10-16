'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');

var CfsgGenerator = module.exports = function CfsgGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', { type: String, required: false });

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

  var prompts = [];

  if (!this.appname) {
    prompts.push({
      name: 'appname',
      message: 'What is the name of the project?',
      default: 'My App'
    });
  }

  this.prompt(prompts, function (props) {
    this.appname = props.appname || this.appname;

    cb();
  }.bind(this));
};

CfsgGenerator.prototype.app = function app() {
  var sourceRoot = this.sourceRoot();
  var sourceFiles = this.expand(path.join(sourceRoot, '**/*'));
  var templatePrefix = '_';
  sourceFiles.forEach(function (sourcePath) {
    var relativePath = path.relative(sourceRoot, sourcePath);
    var stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      this.mkdir(relativePath);
    } else {
      var fileName = path.basename(relativePath);
      if (fileName.charAt(0) === templatePrefix) {
        var destination = path.join(
          path.dirname(relativePath),
          path.basename(relativePath).substr(1)
        );
        this.template(relativePath, destination);
      } else {
        this.copy(relativePath, relativePath);
      }
    }
  }.bind(this));
};
