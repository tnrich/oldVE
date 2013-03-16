/*global complete, fail, jake, process, task*/

var util = require("util");
var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
var JakeUtil = require("../jakelib/JakeUtil");
var apiManager;
var dbManager;
var dbname = "teselagenDev";
var nodeApp = "app.js";
var nodePort = 3000;
var nodeOpts = "";
var env = process.env.env;

if (env == "test") {
    nodeApp = "appTest.js";
    nodeOpts = "-t -r 3001";
    dbname = "teselagenTest";
}

// Jake 'complete' event listener
jake.addListener("complete", function () {
    if (dbManager) {
        dbManager.closeMongoose();
    }
    process.exit();
});

/*
 * Node tasks
 */

// Patch node_modules
task("patchNode", function() {
    var cmd = "cd resources/utils; ./patchDependencies.sh";
    JakeUtil.exec(cmd);
});

task("startNode", function() {
    var cmd = util.format("forever start --plain -w --watchDirectory routes " +
            "-a -l forever.log -o out.log -e err.log %s %s",
            nodeApp, nodeOpts);
    JakeUtil.exec(cmd);
});

task("stopNode", function() {
    var cmd = "forever stop --plain " + nodeApp;
    JakeUtil.exec(cmd);
});

task("restartNode", function() {
    var cmd = "forever restart --plain " + nodeApp;
    JakeUtil.exec(cmd);
});

/*
 *  Database tasks
 */

task("connectdb", function() {
    dbManager = new DbManager(dbname);
    dbManager.connectMongoose(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        else {
            require("./schemas/DBSchemas")(dbManager.mongoose);
            apiManager = new ApiManager(dbManager.mongoose);
            complete();
        }
    });
}, {async:true});

task("dropdb", function() {
    var cmd = util.format("mongo --eval 'db.dropDatabase()' %s", dbname);
    JakeUtil.exec(cmd);
})

task("resetdb", ["connectdb"], function() {
    apiManager.resetdb(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        complete();
    });
}, {async:true});

task("dummy", function() {
    JakeUtil.exec('ls app.js');
})

