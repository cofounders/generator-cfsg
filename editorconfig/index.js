'use strict';
var util = require('util');
var fs = require('fs');
var os = require('os');
var yeoman = require('yeoman-generator');
var Ignore = require('fstream-ignore');
var detectIndent = require('detect-indent');
var editorconfig = require('editorconfig');
var fstream = require('fstream');

var EditorconfigGenerator = module.exports = function EditorconfigGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(EditorconfigGenerator, yeoman.generators.Base);

EditorconfigGenerator.prototype.fix = function fix() {
  var repeat = function (string, times) {
    return new Array(+times + 1).join(string);
  };

  console.log('Updating files according to Editor Config settings...');

  Ignore({
    path: '.',
    ignoreFiles: ['.gitignore'],
    flags: 'w'
  })
  .on('child', function (child) {
    var stats = fs.statSync(child.path);
    if (stats.isDirectory()) {
      return;
    }

    var file = fs.readFileSync(child.path, 'utf8');
    var indent = detectIndent(file);
    if (!indent) {
      return;
    }

    var config = editorconfig.parse(child.path);
    var replacement = config.indent_style === 'tab' ? '\t' :
      config.indent_style === 'space' ? repeat(' ', config.indent_size || 2) :
      indent;
    var lineSeparator = config.end_of_line === 'lf' ? '\n' :
      config.end_of_line === 'cr' ? '\r' :
      config.end_of_line === 'crlf' ? '\r\n' :
      os.EOL;

    var lines = file.split(/\r\n|\n|\r/);
    var fixed = lines.map(function (line) {
      var depth = 0;
      while (line.substr(depth * indent.length, indent.length) === indent) {
        depth++;
      }
      var result = repeat(replacement, depth) + line.substr(depth * indent.length);
      if (config.trim_trailing_whitespace === true) {
        result = result.replace(/\s+$/gm, '');
      }
      return result;
    });

    while (fixed[fixed.length - 1] === '') {
      fixed.pop();
    }

    if (config.insert_final_newline === true) {
      fixed.push('');
    }

    var relativePath = child.path.substr(child.root.path.length + 1);
    console.log('[', relativePath, ']');

    fstream.Writer({
      path: child.path
    })
    .write(fixed.join(lineSeparator));
  });
};
