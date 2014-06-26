/*global module:false*/
module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: [
                ['<%= my_js_files %>'],
                'package.json',
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            html: {
                files: ['<%= my_html_files %>'],
                tasks: ["jsbeautifier"],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= my_css_files %>'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['<%= my_js_files %>'],
                tasks: ["jsbeautifier", "jshint"],
                options: {
                    livereload: true
                }
            }
        },
        jsbeautifier: {
            files: ['<%= my_js_files %>', '<%= my_html_files %>'],
            options: {
                config: ".jsbeautifyrc"
            }
        },
        my_js_files : ["public/*.js","public/javascripts/*.js", "models/**/*.js", "routes/**/*.js", "app.js"],
        my_html_files : ['public/**/*.html'],
        my_css_files : ['public/**/*.css']
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    // Default task.
    grunt.registerTask('default', ['watch']);

};