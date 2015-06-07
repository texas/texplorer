module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    browserify:
      options:
        transform: ['babelify']
      app:
        files:
          'app.js': 'src/app.js'
    watch:
      scripts:
        files: ['src/**/*.js']
        tasks: ['browserify']
        options:
          spawn: false
      livereload:
        files: ['index.html', 'app.css', 'app.js']
        options:
          livereload: true
    connect:
      server:
        options:
          livereload: true

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask('default', ['build'])
  grunt.registerTask('build', ['browserify'])
  grunt.registerTask('dev', ['connect', 'build', 'watch'])
