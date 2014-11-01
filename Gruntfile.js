/*jshint camelcase:false */

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    release: {
      options: {
        bump: true, //default: true
        file: 'package.json', //default: package.json
        add: true, //default: true
        commit: true, //default: true
        tag: true, //default: true
        push: true, //default: true
        pushTags: true, //default: true
        npm: true, //default: true
        tagName: 'v<%= version %>', //default: '<%= version %>'
        commitMessage: 'releasing v<%= version %>', //default: 'release <%= version %>'
        tagMessage: 'v<%= version %>' //default: 'Version <%= version %>'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
      },
      lib: ['lib/**/*.js'],
    },
    watch: {
      spec: {
        files: [
          'lib/**/*.js',
          'test/**/*.js',
        ],
        tasks: ['mochaTest:spec'],
      },
      unit: {
        files: [
          'lib/**/*.js',
          'test/**/*.js',
        ],
        tasks: ['mochaTest:unit'],
      },
    },
    mochaTest: {
      options: {
        reporter: 'spec',
      },
      spec: {
        src: ['test/spec/*.js']
      },
      unit: {
        src: ['test/unit/*.js']
      }
    },
  });

  grunt.registerTask('start', 'Start all required services', ['startRedis']);
  grunt.registerTask('stop', 'Stop all services', ['stopRedis']);

  // Default task.
  grunt.registerTask('default', []);
};
