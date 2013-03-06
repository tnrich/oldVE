/*global after, API_URL, before, dbManager, expect, request */

expect = require("chai").expect;
request = require("request");
var DbManager = require("../manager/DbManager")();
dbManager = new DbManager();
API_URL =  "http://teselagen.local/api/";

before(function(pDone) {
    dbManager.connectMongoose(function(pErr) {
        if (pErr) {
            throw pErr;
        }
        else {
            require("../schemas/DBSchemas")(dbManager.mongoose);
            pDone();
        }
    });
});

after(function() {
    dbManager.closeMongoose();
});
