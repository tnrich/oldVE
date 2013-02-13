/*global complete, fail, jake, process, task*/

var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
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
    exec(cmd);
});

task("stopNode", function() {
    var cmd = "forever stop app.js";
    exec(cmd);
});

task("restartNode", function() {
    var cmd = "forever restart app.js";
    exec(cmd);
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

function exec(pCmd) {
    console.log(pCmd);
    jake.exec([pCmd], {printStdout:true, printStderr:true});
}
