module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var config = {
    pkg: grunt.file.readJSON('package.json')

  , watch: {
      scripts: {
        // Concat jshint.all
        files: [],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      }
    }

  , jshint: {
      // define the files to lint
      all: ['*.js', 'lib/*.js'],
      options: {
        ignores: ['node_modules', 'public/components/**/*.js'],
        laxcomma: true,
        sub: true,
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }
  };

  config.watch.scripts.files = config.watch.scripts.files.concat(
    config.jshint.all
  );

  grunt.initConfig( config );

  grunt.registerTask('default', [ 'jshint' ]);
};
