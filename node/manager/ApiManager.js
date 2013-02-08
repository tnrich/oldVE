/*
 * @class ApiManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    var async = require("async");
    var DEProjectManager = require("./DEProjectManager")();
    var J5RunManager = require("./J5RunManager")();
    var PartManager = require("./PartManager")();
    var ProjectManager = require("./ProjectManager")();
    var SequenceManager = require("./SequenceManager")();
    var UserManager = require("./UserManager")();
    var VEProjectManager = require("./VEProjectManager")();

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

    ApiManager.prototype.resetdb = function(pNext) {
        async.parallel([me.deprojectManager.deleteAll(this.db)],
                        this.j5RunManager.deleteAll,
                        this.partManager.deleteAll,
                        this.projectManager.deleteAll,
                        this.sequenceManager.deleteAll,
                        this.userManager.deleteAll,
                        this.veprojectManager.deleteAll],
                        pNext);
    };

    return ApiManager;
};
