/*
 |------------------------------------------------------------------------
 | Gruntfile
 |------------------------------------------------------------------------
 */

module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        clean: {
            js: {
                src: [ 'webroot/js/dist' ]
            }
        },
        
        concat: {
            js: {
                src: [
                    'webroot/js/src/app/app.js',
                    'webroot/js/src/app/model.js',
                    'webroot/js/src/app/collection.js',
                    'webroot/js/src/app/view.js',
                    'webroot/js/src/app/mixins.js',
                    'webroot/js/src/app/sync.js',
                    'webroot/js/src/app/alert.js',
                    'webroot/js/src/app/profile.js',
                    'webroot/js/src/app/form.js',
                    'webroot/js/src/app/modal.js',
                    'webroot/js/src/app/toolbar.js',
                    'webroot/js/src/app/searchbox.js',
                    'webroot/js/src/app/pagination.js',
                    'webroot/js/src/app/table.js',
                    'webroot/js/src/app/**/*.js',
                    'webroot/js/src/*/app.js',
                    'webroot/js/src/*/model.js',
                    'webroot/js/src/*/collection.js',
                    'webroot/js/src/*/view.js',
                    'webroot/js/src/*/alert.js',
                    'webroot/js/src/*/profile.js',
                    'webroot/js/src/*/form.js',
                    'webroot/js/src/*/modal.js',
                    'webroot/js/src/*/toolbar.js',
                    'webroot/js/src/*/searchbox.js',
                    'webroot/js/src/*/pagination.js',
                    'webroot/js/src/*/table.js',
                    'webroot/js/src/*/form/**/*.js',
                    'webroot/js/src/*/profile/**/*.js',
                    'webroot/js/src/*/modal/**/*.js',
                    'webroot/js/src/**/*.js',
                ],
                dest: 'webroot/js/dist/app.js',
            },
        },
        
        uglify: {
            js: {
                files: {
                    'webroot/js/dist/app.min.js': ['webroot/js/dist/app.js']
                }
            }
        },
        
        watch: {
            scripts: {
                files: 'webroot/js/src/**/*.js',
                tasks: ['js'],
                options: {
                    interrupt: true,
                },
            },
        },
        
    });

    // NPM tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // Tasks    
    grunt.registerTask('js', ['clean:js', 'concat', 'uglify']);
    grunt.registerTask('default', ['js']);
    
};
