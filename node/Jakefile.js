/*global complete, fail, jake, process, task*/

var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
var JakeUtil = require("../jakelib/JakeUtil");
var dbManager = new DbManager();
var apiManager;

// Jake 'complete' event listener
jake.addListener("complete", function () {
    dbManager.closeMongoose();
    process.exit();
});

/*
 * Node tasks
 */

task("startNode", function() {
    var cmd = "forever start -w --watchDirectory routes/ -a -l forever.log -o out.log -e err.log app.js";
    JakeUtil.exec(cmd);
});

task("stopNode", function() {
    var cmd = "forever stop app.js";
    JakeUtil.exec(cmd);
});

task("restartNode", function() {
    var cmd = "forever restart app.js";
    JakeUtil.exec(cmd);
});

/*
 *  Database tasks
 */

task("connectdb", function() {
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

task("resetdb", ["connectdb"], function() {
    apiManager.resetdb(function(pErr) {
        if (pErr) {
            fail(pErr);
        }
        complete();
    });
}, {async:true});


