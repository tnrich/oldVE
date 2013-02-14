/*global module*/

/**
 * Database Manager
 * @module ./manager/DbManager
 * @author Yuri Bendana
 */

module.exports = function() {
    var mongodb = require("mongodb");
    var mongoose = require("mongoose");
    
    /**
     * @constructor
     */
    function DbManager() {
        this.dbname = "TestingTeselagen";
        this.host = "localhost";
        this.mongo = null;
        this.mongoose = null;
        this.port = 27017;
        this.url = "mongodb://" + this.host + ":" + this.port + "/" + this.dbname;
    }

    /**
     * Close Mongo connection
     */
    DbManager.prototype.closeMongo = function() {
        if (this.mongo) {
            this.mongo.close();
        }
    };
    
    /**
     * Close Mongoose connection
     */
    DbManager.prototype.closeMongoose = function() {
        if (this.mongoose) {
            this.mongoose.close();
        }
    };

    /**
     * Connect to Mongo
     */
    DbManager.prototype.connectMongo = function(pNext) {
        var me = this;
        mongodb.MongoClient.connect(this.url, function (pErr, pDb) {
            if (!pErr) {
                me.mongo = pDb;
            }
            pNext(pErr);
        });
    };

    /**
     * Connect to Mongoose
     */
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
