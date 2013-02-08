/*global console, task*/
var request = require("request");
var DbManager = require("./manager/DbManager")();
var dbManager = new DbManager();
ApiManager = require("../manager/ApiManager")(dbManager.mongoose);
apiManager = new ApiManager();
var API_URL =  "http://teselagen.local/api/";

task("connectdb", function() {
    dbManager.connectMongoose(function(pErr) {
        if (pErr) {
            throw pErr;
        }
        else {
            require("./schemas/DBSchemas")(dbManager.mongoose);
        }
    });
});
task("resetdb", function() {
    apiManager.resetdb(function(err));
});
