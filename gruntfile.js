module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    /*
      Copy clean sources to /build
    */
    copy: {
      build: {
        cwd: 'src',
        src: ['!**/*.styl', '!**/*.pug'],
        dest: 'build',
        expand: true
      },
    },

    /*
      Remove leftover sources from /build
    */
    clean: {
      build: {
        src: ['build']
      },
      stylesheets: {
        src: ['build/**/*.css']
      },
    },

    /*
      Compile Stylus-files
    */
    stylus: {
      build: {
        options: {
          compress: false
        },
        files : {
          'build/<%= pkg.namespace %>.css': 'src/**/<%= pkg.namespace %>.styl'
        }
      }
    },

    /*
      Run PostCSS to handle autoprefixing etc.
    */
    postcss: {
      build: {
        files: {
          'build/<%= pkg.namespace %>.css': 'build/**/*.css'
        }
      }
    },

    /*
      Compile a minified version of base CSS-file
    */
    cssmin: {
      build: {
        files: {
          'build/<%= pkg.namespace %>.min.css': 'build/**/*.css'
        }
      }
    },
    
    /*
      Compile .pug to .html
    */
    pug: {
      compile: {
        options: {
          pretty: true,
          data: {name: '<%= pkg.name %>', namespace: '<%= pkg.namespace %>', version: '<%= pkg.version %>'}
        },
        files: [{
          expand: true,
          cwd: 'src/pug/',
          src: ['**/*.pug'],
          dest: 'build/demo/',
          ext: '.html'
        }]
      }
    },

    /*
      Watch for changes in stylesheets, pugs and copies
    */
    watch: {
      stylesheets: {
        files: 'src/**/*.styl',
        tasks: ['stylesheets'],
        options: {
          livereload: true,
        },
      },
      pug: {
        files: 'src/**/*.pug',
        tasks: ['pug'],
        options: {
          livereload: true,
        },
      },
      copy: {
        files: ['src/**', '!src/**/*.styl', '!src/**/*.pug'],
        tasks: ['copy']
      }
    },

    /*
      Set up local server
    */
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

  /*
    Load tasks
  */
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  
  /*
    Register stylesheet task. Handles all Stylus/CSS tasks
  */
  grunt.registerTask(
    'stylesheets', 
    'Compile stylesheets', 
    ['clean:stylesheets','stylus', 'postcss', 'cssmin']
  );

  /*
    Register build task 
  */
  grunt.registerTask(
    'build', 
    'Compile assets and copy files to /build', 
    ['clean:build', 'copy', 'stylesheets', 'pug']
  );

  /*
    Register default task.
  */
  var default_tasks = grunt.option('target') == 'develop' ? ['build', 'connect', 'watch'] : ['build'];
  
  grunt.registerTask(
    'default', 
    'Build, serve and watch. Woff.', 
    default_tasks
  );
};
