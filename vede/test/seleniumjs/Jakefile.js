/*global task*/

var JakeUtil = require("../../../jakelib/JakeUtil");

task("startSel", function() {
    JakeUtil.spawn("java", ["-jar", "../../../lib/selenium-server-standalone-2.33.0.jar"]);
});

task("testWd", function() {
    JakeUtil.spawn("mocha", ["-b", "-R", "spec", "-t", "20s", "./wd"]);
});


