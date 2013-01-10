/*
 * @class ApiManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function ApiManager() {
    }

    ApiManager.prototype.resetdb = function(pNext) {
        var deprojectManager = new pApp.DEProjectManager();
        var j5RunManager = new pApp.J5RunManager();
        var partManager = new pApp.PartManager();
        var projectManager = new pApp.ProjectManager();
        var sequenceManager = new pApp.SequenceManager();
        var userManager = new pApp.UserManager();
        var veprojectManager = new pApp.VEProjectManager();
        pApp.async.parallel([deprojectManager.deleteAll,
                             j5RunManager.deleteAll,
                             partManager.deleteAll,
                             projectManager.deleteAll,
                             sequenceManager.deleteAll,
                             userManager.deleteAll,
                             veprojectManager.deleteAll],
                             pNext);
    };

    return ApiManager;
};
