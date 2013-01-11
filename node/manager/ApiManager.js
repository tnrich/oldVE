/*
 * @class ApiManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    var async = require("async");
    var DEProjectManager = require("./DEProjectManager")(pDb);
    var J5RunManager = require("./J5RunManager")(pDb);
    var PartManager = require("./PartManager")(pDb);
    var ProjectManager = require("./ProjectManager")(pDb);
    var SequenceManager = require("./SequenceManager")(pDb);
    var UserManager = require("./UserManager")(pDb);
    var VEProjectManager = require("./VEProjectManager")(pDb);

    function ApiManager() {
        this.deprojectManager = new DEProjectManager();
        this.j5RunManager = new J5RunManager();
        this.partManager = new PartManager();
        this.projectManager = new ProjectManager();
        this.sequenceManager = new SequenceManager();
        this.userManager = new UserManager();
        this.veprojectManager = new VEProjectManager();
    }

    ApiManager.prototype.resetdb = function(pNext) {
        async.parallel([this.deprojectManager.deleteAll,
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
