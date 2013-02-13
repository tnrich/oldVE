/*global complete, fail, jake, process, task*/

var DbManager = require("./manager/DbManager")();
var ApiManager = require("./manager/ApiManager")();
var dbManager = new DbManager();
var apiManager;

jake.addListener("complete", function () {
    dbManager.closeMongoose();
    process.exit();
});

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
