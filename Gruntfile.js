module.exports = function( grunt ) {

   "use strict";

   var readOptionalJSON = function( filepath ) {
      var data = {};
      try {
         data = grunt.file.readJSON( filepath );
      } catch(e) {}
      return data;
   },
   srcHintOptions = readOptionalJSON( "src/.jshintrc" );

   grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      concat: {
        scandiojs: {
          options: {
            separator: ""
          },
          src: [
            "src/intro.js",
            "src/logger.js",
            "src/util.js",
            "src/is.js",
            "src/ajax.js",
            "src/core.js",
            "src/outro.js"
          ],
          dest: "dist/scandiojs-<%= pkg.version %>.js"
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
            src: [ "dist/scandiojs2-<%= pkg.version %>.js" ],
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
               "dist/scandiojs-<%= pkg.version %>.min.js": [ "dist/scandiojs-<%= pkg.version %>.js" ]
            },
            options: {
               preserveComments: "some",
               sourceMap: "dist/scandiojs-<%= pkg.version %>.min.map",
               sourceMappingURL: "scandiojs-<%= pkg.version %>.min.map",
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
      }
   });

   grunt.loadNpmTasks("grunt-contrib-jshint");
   grunt.loadNpmTasks("grunt-jsonlint");
   grunt.loadNpmTasks("grunt-contrib-concat");
   grunt.loadNpmTasks("grunt-contrib-uglify");

   grunt.registerTask( "dist", ["jshint", "jsonlint", "concat", "uglify"] );
};