module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      build: {
        cwd: 'src',
        src: [ '!**/*.styl', '!**/*.pug' ],
        dest: 'build',
        expand: true
      },
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/<%= pkg.namespace %>.css','!build/<%= pkg.namespace %>.min.css' ]
      },
    },

    stylus: {
      build: {
        options: {
          'include css' : true,
          banner: '/*! <%= pkg.name %> Version: <%= pkg.version %> */\n',
          compress: false
        },
        files : {
          'build/<%= pkg.namespace %>.css': 'src/**/*.styl'
        }
      }
    },

    postcss: {
      build: {
        files: {
          'build/<%= pkg.namespace %>.css': 'build/**/*.css'
        }
      }
    },

    cssmin: {
      build: {
        files: {
          'build/<%= pkg.namespace %>.min.css': 'build/**/*.css'
        }
      }
    },
    
    pug: {
      compile: {
        options: {
          pretty: true,
          data: {name: '<%= pkg.name %>', namespace: '<%= pkg.namespace %>', version: '<%= pkg.version %>'}
        },
        files: {
          'build/<%= pkg.namespace %>_demo.html': 'src/**/*.pug'
        }
      }
    },

    watch: {
      stylesheets: {
        files: 'src/**/*.styl',
        tasks: [ 'stylesheets' ]
      },
      pug: {
        files: 'src/**/*.pug',
        tasks: [ 'pug' ]
      },
      copy: {
        files: [ 'src/**', '!src/**/*.styl', '!src/**/*.pug' ],
        tasks: [ 'copy' ]
      }
    },

    connect: {
      server: {
        options: {
          port: 4999,
          base: 'build',
          hostname: 'localhost'
        }
      }
    }

  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // define the tasks
  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'stylus', 'postcss', 'cssmin', 'clean:stylesheets' ]
  );

  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean:build', 'copy', 'stylesheets', 'pug' ]
  );

  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'connect', 'watch' ]
  );
};
