module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'server.js', 'config/**/*.js', 'server/**/*.js']
        },
        nodemon: {
            dev: {
                script: 'index.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false
                },
                src: ['test/**/*spec.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html'
                },
                src: ['test/**/*spec.js']
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'client/public',
                    dest: 'dist/public',
                    src: ['app/**/*.js', 'app/**/*.html',
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'components/**/*.js',
                        'bower_components/**/*',
                        'assets/images/{,*/}*.{webp}',
                        'assets/fonts/**/*',
                        'index.html'
                    ]
                }, {
                    expand: true,
                    dest: 'dist',
                    src: [
                        'package.json',
                        'server/**/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: 'client/public',
                dest: 'dist/public',
                src: ['{app,components}/**/*.css']
            }
        },
        wiredep: {
            target: {
                src: ['dist/public/**/*.html', 'dist/public/**/*.js'],
                ignorePath: '../../client/public/',
                exclude: ['bootstrap.js', '/json3/', '/es5-shim/']
            }
        },
        injector: {
            options: {},
            // Inject application script files into index.html (doesn't include bower)
            scripts: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/dist/public', '');
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    'dist/public/index.html': [
                        [
                            'dist/public/{app,components}/**/*.js',
                            '!dist/public/**/*.spec.js',
                            '!dist/public/**/*.mock.js'
                        ]
                    ]
                }
            },
        },
        watch: {
            files: ['client/public/**/*'],
            tasks: ['build']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-wiredep');

    // Default task(s).
    grunt.registerTask('build', ['jshint', 'copy', 'wiredep', 'injector']);
    grunt.registerTask('default', ['build', 'nodemon:dev', 'watch']);
    grunt.registerTask('serve', ['build', 'nodemon:dev']);

};