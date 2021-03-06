'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var _ = require('underscore');
_.mixin(require('underscore.string').exports());
var path = require('path');
var fs = require('fs');

var CfsgGenerator = module.exports = function CfsgGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', { type: String, required: false });

  this.on('end', function () {
    this.installDependencies({
      bower: true,
      npm: true,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CfsgGenerator, yeoman.generators.Base);

CfsgGenerator.prototype.chooseLicense = function chooseLicense() {
  var cb = this.async();

  this.invoke('cfsg:legal', {
    options: this.options
  }, cb);
};

CfsgGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [];

  if (!this.appname) {
    prompts.push({
      name: 'appname',
      message: 'What is the name of the project?',
      default: 'My App'
    });
  }

  this.prompt(prompts, function (props) {
    _.extend(this, props);

    cb();
  }.bind(this));
};

CfsgGenerator.prototype.app = function app() {
  var sourceRoot = this.sourceRoot();
  var sourceFiles = this.expand(path.join(sourceRoot, '**/*'), {dot: true});
  var templatePrefix = '_';
  sourceFiles.forEach(function (sourcePath) {
    var destination;
    var relativePath = path.relative(sourceRoot, sourcePath);
    var stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      this.mkdir(relativePath);
    } else {
      var fileName = path.basename(relativePath);
      if (fileName.charAt(0) === templatePrefix) {
        destination = path.join(
          path.dirname(relativePath),
          path.basename(relativePath).substr(1)
        );
        this.template(relativePath, destination);
      } else {
        if (relativePath === '.sublime-project') {
          destination = _.classify(this.appname) + relativePath;
        } else {
          destination = relativePath;
        }
        this.copy(relativePath, destination);
      }
    }
  }.bind(this));
};
