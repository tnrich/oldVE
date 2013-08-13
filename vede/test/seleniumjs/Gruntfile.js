module.exports = function(grunt) {

    grunt.registerTask("startSel", function() {
        grunt.util.spawn({cmd:"java", args:["-Dwebdriver.chrome.driver=../../../chromedriver-2.1", "-jar",
            "../../../lib/selenium-server-standalone-2.33.0.jar"], opts:{stdio:"inherit"}});
    });
    
    grunt.registerTask("testSelWd", function() {
        grunt.util.spawn({cmd:"mocha", args:["-b", "-R", "spec", "-t", "20s", "./selwebdriver"], opts:{stdio:"inherit"}});
    });
    
};