var JakeUtil = require("../../../jakelib/JakeUtil");

task("testCasper", function() {
    JakeUtil.spawn("casperjs", ["test", "./specs/login.t.js"]);
});

task("testMocha", function() {
    JakeUtil.spawn("./run-mocha.js", ["./mspecs/login.t.js"]);
});
