/*global module*/

/**
 * API Manager
 * @module ./manager/ApiManager
 * @author Yuri Bendana
 */

module.exports = function() {
    var async = require("async");
    var DeviceDesignManager = require("./DeviceDesignManager")();
    var J5RunManager = require("./J5RunManager")();
    var PartManager = require("./PartManager")();
    var ProjectManager = require("./ProjectManager")();
    var SequenceManager = require("./SequenceManager")();
    var UserManager = require("./UserManager")();

    /**
     * @constructor
     * @param pDb database connection
     */
    function ApiManager(pDb) {
        this.db = pDb;
        this.deviceDesignManager = new DeviceDesignManager(pDb);
        this.j5RunManager = new J5RunManager(pDb);
        this.partManager = new PartManager(pDb);
        this.projectManager = new ProjectManager(pDb);
        this.sequenceManager = new SequenceManager(pDb);
        this.userManager = new UserManager(pDb);
    }

    /**
     * Reset the database
     */
    ApiManager.prototype.resetdb = function(pNext) {
        async.parallel([this.deviceDesignManager.deleteAll.bind(this.deviceDesignManager),
                        this.j5RunManager.deleteAll.bind(this.j5RunManager),
                        this.partManager.deleteAll.bind(this.partManager),
                        this.projectManager.deleteAll.bind(this.projectManager),
                        this.sequenceManager.deleteAll.bind(this.sequenceManager),
                        this.userManager.deleteAll.bind(this.userManager)],
                        pNext);
    };

    return ApiManager;
};
