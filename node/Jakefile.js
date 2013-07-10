/*global complete, fail, jake, process, task*/

var util = require("util");
var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
var JakeUtil = require("../jakelib/JakeUtil");
var apiManager;
var dbManager;
var dbname = "teselagenDev";
var env = process.env.env;

if (env === "test") {
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

//directory("log");

task("startNode", function() {
    var startNodeCmd = "pm2 start processes.json";
    JakeUtil.exec(startNodeCmd);
});

task("stopNode", function() {
    var stopNodeCmd = "pm2 kill";
    JakeUtil.exec(stopNodeCmd);
});

task("restartNode", function() {
    var restartNodeCmd = "pm2 restart processes.json";
    JakeUtil.exec(restartNodeCmd);
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

task("cleardb", function() {
    var cmd = util.format("mongo %s clear.js", dbname);
    JakeUtil.exec(cmd);
});

task("dropdb", function() {
    var cmd = util.format("mongo --eval 'db.dropDatabase()' %s", dbname);
    JakeUtil.exec(cmd);
});

task("resetdb", ["connectdb"], function() {
    apiManager.resetdb(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        complete();
    });
}, {async:true});


