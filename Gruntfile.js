module.exports = function( grunt ) {

   "use strict";

   require('load-grunt-config')(grunt);

   var readOptionalJSON = function( filepath ) {
      var data = {};
      try {
         data = grunt.file.readJSON( filepath );
      } catch(e) {}

      return data;
   },
   srcHintOptions = readOptionalJSON( ".jshintrc" );

   grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      concat: {
         scandiojs: {
            options: {
                separator: "",
                process: true
            },
            src: [
               "js/intro.js",
               "js/compatibility.js",
               "js/dom.js",
               "js/string.js",
               "js/logger.js",
               "js/util.js",
               "js/is.js",
               "js/json.js",
               "js/bridge.js",
               "js/timing.js",
               "js/ajax.js",
               "js/core.js",
               "js/device.js",
               "js/responsive.js",
               "js/outro.js"
            ],
               dest: "dist/scandio-<%= pkg.version %>.js"
            },
         scandiocss: {
             options: {
                separator: ""
             },
             src: [
                "assets/css/common.css",
                "assets/css/logger.css"
            ],
            dest: "dist/scandio-<%= pkg.version %>.css"
         }
      },
      jsonlint: {
         pkg: {
            src: [ "package.json" ]
         },
         bower: {
            src: [ "bower.json" ]
         }
      },
      jshint: {
         dist: {
            src: [ "dist/scandio-<%= pkg.version %>.js" ],
            options: srcHintOptions
         },
         grunt: {
            src: [ "Gruntfile.js" ],
            options: {
               jshintrc: ".jshintrc"
            }
         }
      },
      uglify: {
         all: {
            files: {
               "dist/scandio-<%= pkg.version %>.min.js": [ "dist/scandio-<%= pkg.version %>.js" ]
            },
            options: {
               preserveComments: "some",
               sourceMap: "dist/scandio-<%= pkg.version %>.min.map",
               sourceMappingURL: "scandio-<%= pkg.version %>.min.map",
               beautify: {
                  ascii_only: true
               },
               compress: {
                  hoist_funs: false,
                  join_vars: false,
                  loops: false,
                  unused: false
               },
               mangle: {
                  except: [ "undefined" ]
               }
            }
         }
      },
      copy: {
         scandiojs: {
            files: [
               {src: "dist/scandio-<%= pkg.version %>.js", dest: "dist/scandio.js"},
               {src: "dist/scandio-<%= pkg.version %>.min.js", dest: "dist/scandio.min.js"},
               {src: "dist/scandio-<%= pkg.version %>.min.map", dest: "dist/scandio.min.map"}
            ]
         },
         scandiocss: {
            files: [
               {src: "dist/scandio-<%= pkg.version %>.css", dest: "dist/scandio.css"},
               {src: "dist/scandio-<%= pkg.version %>.min.css", dest: "dist/scandio.min.css"}
            ]
         }
      },
      docco: {
         docs: {
            src: ['js/*js', 'dist/scandio-<%= pkg.version %>.js', '!js/intro.js'],
            options: {
               output: 'docs'
            }
         }
      },
      clean: {
         docco: ['docs'],
      },
      'gh-pages': {
         options: {
            base: 'docs'
         },
         src: ['**']
      },
      rename: {
         docco: {
            files: [
               {src: ['docs/scandio-<%= pkg.version %>.html'], dest: 'docs/index.html'},
            ]
         }
      },
      cssmin: {
         minify: {
            src: [
               'dist/scandio-<%= pkg.version %>.css'
            ],
            dest: 'dist/scandio-<%= pkg.version %>.min.css'
         }
      },
      testem: {
         options : {
            launch_in_ci : [
               'chrome',
               'safari',
               'firefox'
            ]
         },
         main : {
            src: ['testem.json'],
            dest: 'test/testem.tap'
         }
      },
      jasmine: {
         components: {
            src: [
               'dist/scandio.js'
            ],
            options: {
               specs: 'test/specs/*.js',
               keepRunner : true,
               vendor: [
                  'libs/jquery/dist/jquery.js',
                  'libs/requirejs/require.js'
               ]
            }
         }
      }
   });

   grunt.registerTask( "test-em", ["jsonlint", "concat", "jshint", "uglify", "cssmin", "copy", "testem"] );
   grunt.registerTask( "travis", ["jsonlint", "jshint", "jasmine"] );
   grunt.registerTask( "dist", ["jsonlint", "concat", "jshint", "uglify", "cssmin", "copy"] );
   grunt.registerTask( "docs", ["clean:docco", "docco", "rename:docco"] );
   grunt.registerTask( "gh-docs", ["clean:docco", "docco", "rename:docco", "gh-pages"] );
};
