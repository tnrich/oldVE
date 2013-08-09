/*global task*/

var JakeUtil = require("../../../jakelib/JakeUtil");

task("testCasper", function() {
    JakeUtil.spawn("casperjs", ["test", "./specs/login.t.js"]);
});

task("testCasperRemote", function() {
    JakeUtil.spawn("casperjs", ["test", "./specs/login.t.js", "--url=http://dev.teselagen.com"]);
});

task("testMocha", function() {
    JakeUtil.spawn("./run-mocha.js", ["./mspecs/login.t.js"]);
});
