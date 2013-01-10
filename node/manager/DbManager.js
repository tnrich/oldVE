/*
 * @class DbManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    var mongodb = require("mongodb");
    var mongoose = require("mongoose");
    
    function DbManager() {
        this.dbname = "TestingTeselagen";
        this.host = "localhost";
        this.mongo = null;
        this.mongoose = null;
        this.port = 27017;
        this.url = "mongodb://" + this.host + ":" + this.port + "/" + this.dbname;
    }

    DbManager.prototype.closeMongo = function() {
        if (this.mongo) {
            this.mongo.close();
        }
    };
    
    DbManager.prototype.closeMongoose = function() {
        if (this.mongoose) {
            this.mongoose.close();
        }
    };

    DbManager.prototype.connectMongo = function(pNext) {
        var me = this;
        mongodb.MongoClient.connect(this.url, function (pErr, pDb) {
            if (!pErr) {
                me.mongo = pDb;
            }
            pNext(pErr);
        });
    };

    DbManager.prototype.connectMongoose = function(pNext) {
        var err = null;
        this.mongoose = mongoose.createConnection(this.url);
        if (!this.mongoose) {
            err = new Error("Unable to connect");
        }
        pNext(err);
    };

    return DbManager;
};
