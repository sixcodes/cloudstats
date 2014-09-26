module.exports = function(grunt) {
    var scripts = ['apps/controllers/*.js', 'apps/services/*.js'];
    var sheets = ['apps/**/*.scss', 'components/**/*.scss', 'jasmine/**/*.scss', 'style/**/*.scss'];
    var readJSON = function (filePath) {
        // Lê o arquivo JSON como um arquivo comum
        var str = grunt.file.read(filePath);

        // Remove comentarios
        str = str.replace(/\/\/.*/mg, '');

        // Retorna como um JSON válido (sem comentários)
        return JSON.parse(str);
    };

    // Project configuration.
    grunt.initConfig({
        /**
         * Tests
         */
        jasmine: {
            dist: {
                src: [
                    'app/controllers/*.js',
                    'app/services/*.js',
                    'app/app.js'
                ],
                options: {
                    specs: [
                        'test/controllers/*.js',
                        'test/services/*.js',
                        'test/app.js'
                    ],
                    helpers: [

                    ],
                    /*styles: [
                        'jasmine/runner/style.css',
                        'components/modal/style.css',
                        'style/sheets/buttons.css'
                    ],*/
                    vendor: [
                        'app/js/angular.min.js',
                        'app/js/angular-resource.min.js',
                        'app/js/angular-route.min.js',
                        'test/angular-mocks.js',
                        'app/js/angular-cookies.min.js'
                    ],
                    outfile: 'runner.html',
                    keepRunner: true
                    //template: 'test/runner.tmpl',
//                    junit: {
//                        path: '.reports/junit/'
//                    }
                }
            }
        }
    });

    /**
     * Carregando tasks
     */
    grunt.loadNpmTasks('grunt-contrib-jasmine');

};
