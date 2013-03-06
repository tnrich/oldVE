/*global module*/

/**
 * API Manager
 * @module ./manager/ApiManager
 * @author Yuri Bendana
 */

module.exports = function() {
    var async = require("async");
    var DEProjectManager = require("./DEProjectManager")();
    var J5RunManager = require("./J5RunManager")();
    var PartManager = require("./PartManager")();
    var ProjectManager = require("./ProjectManager")();
    var SequenceManager = require("./SequenceManager")();
    var UserManager = require("./UserManager")();
    var VEProjectManager = require("./VEProjectManager")();

    /**
     * @constructor
     * @param pDb database connection
     */
    function ApiManager(pDb) {
        this.db = pDb;
        this.deprojectManager = new DEProjectManager(pDb);
        this.j5RunManager = new J5RunManager(pDb);
        this.partManager = new PartManager(pDb);
        this.projectManager = new ProjectManager(pDb);
        this.sequenceManager = new SequenceManager(pDb);
        this.userManager = new UserManager(pDb);
        this.veprojectManager = new VEProjectManager(pDb);
    }

    /**
     * Reset the database
     */
    ApiManager.prototype.resetdb = function(pNext) {
        async.parallel([this.deprojectManager.deleteAll.bind(this.deprojectManager),
                        this.j5RunManager.deleteAll.bind(this.j5RunManager),
                        this.partManager.deleteAll.bind(this.partManager),
                        this.projectManager.deleteAll.bind(this.projectManager),
                        this.sequenceManager.deleteAll.bind(this.sequenceManager),
                        this.userManager.deleteAll.bind(this.userManager),
                        this.veprojectManager.deleteAll.bind(this.veprojectManager)],
                        pNext);
    };

    return ApiManager;
};
