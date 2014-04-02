/* global module */

module.exports = function(grunt) {

    var tasks_in_order = ['copy', 'sass', 'uglify', 'cssmin'];

    /*******************
     *  WATCH OPTIONS  *
     *******************/

    var watch_options = {
        tasks: tasks_in_order,
        //tasks: ['copy', 'traceur'],
        files:  'app/**/*',
        grunt: {
            // auto-reload Gruntfile if it changes
            files: ['Gruntfile.js']
        }
    };

    /*********************
     *  TRACEUR OPTIONS  *
     *********************/

    //var traceur_options = {
        //options: {
            //experimental: true,
            //blockBinding: true,
        //},
        //custom: {
            //files: [{
                //expand : true,
                //cwd    : 'app/js',
                //src    : '**/*.js',
                //dest   : 'build/app/js',
                //ext    : '.js',
            //}]
        //},
    //};

    /******************
     *  COPY OPTIONS  *
     ******************/

    var copy_options = {
        main: {
            files: [{
                expand: true,
                src: ['app/**/*'],
                dest: 'build/',
                filter: 'isFile'
            }]
        }
    };

    /******************
     *  SASS OPTIONS  *
     ******************/

    var sass_options = {
        dist: {
            options: {
                lineNumbers: true,
                precision: 20
            },
            files: {
                'build/app/css/app.css': 'build/app/css/app.scss'
            }
        }
    };

    /********************
     *  UGLIFY OPTIONS  *
     ********************/

    var uglify_options = {
        my_target: {
            files: {
                'build/app/js/app.min.js': [
                    //'app/lib/angular/angular.js',
                    //'app/lib/angular/angular-resource.js',
                    //'app/lib/angular/angular-route.js',
                    //'app/lib/angular/angular-touch.js',
                    //'app/lib/angular/angular-animate.js',
                    'app/js/app.js',
                    'app/js/services.js',
                    'app/js/controllers.js',
                    'app/js/filters.js',
                    'app/js/directives.js',
                    'app/js/animations.js'
                ]
            }
        },
        options: {
            mangle: false
        }
    };

    /********************
     *  CSSMIN OPTIONS  *
     ********************/

    var cssmin_options = {
        minify: {
            expand : true,
            cwd    : 'build/app/css/',
            src    : 'app.css',
            dest   : 'build/app/css/',
            ext    : '.min.css',
        },
        options: {
            report: 'gzip'
        }
    };

    /**************************
     *  GITHUB-PAGES OPTIONS  *
     **************************/

    var github_pages_options = {
        target: {
            options: {
                commitMessage: 'latest changes from master'
            },
            src: 'build'
        }
    };


    grunt.initConfig({
        //traceur : traceur_options,
        watch       : watch_options,
        copy        : copy_options,
        sass        : sass_options,
        uglify      : uglify_options,
        cssmin      : cssmin_options,
        githubPages : github_pages_options
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-github-pages');

    grunt.registerTask('default', tasks_in_order);
    grunt.registerTask('github', ['githubPages:target']);
};
