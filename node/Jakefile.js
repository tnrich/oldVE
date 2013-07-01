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
var foreverLog = "forever.log";

if (env == "test") {
    nodeApp = "appTest.js";
    nodeOpts = "-t -r 3001";
    dbname = "teselagenTest";
    foreverLog="foreverTest.log";
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

directory("log");

task("startNode", ["log"], function() {
    //var cmd = util.format("forever start --plain -w --watchDirectory . " +
    //        "-a -p /var/log/forever -l %s -o ../log/out.log -e ../log/err.log %s %s", 
    //foreverLog, nodeApp, nodeOpts);
    var cmd = "pm2 start app.js -i max";
    JakeUtil.exec(cmd);
});

task("stopNode", function() {
    //var cmd = "forever stop -p /var/log/forever --plain " + nodeApp;
    var cmd = "pm2 kill";
    JakeUtil.exec(cmd);
});

task("restartNode", function() {
    //var cmd = "forever restart -p /var/log/forever --plain " + nodeApp;
    var cmd = "pm2 kill && pm2 start app.js -i max";
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

task("cleardb", function() {
    var cmd = util.format("mongo %s clear.js", dbname);
    JakeUtil.exec(cmd);
})

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

