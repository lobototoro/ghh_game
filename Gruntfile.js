'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  var path = {
    app:
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([]);
    }

    grunt.task.run([

    ]);
  });
}