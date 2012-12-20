/*
 * @class ApiManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function ApiManager() {
    }

    ApiManager.prototype.resetdb = function(pNext) {
        var projectManager = new pApp.ProjectManager; 
        projectManager.deleteProjects(function(pErr) {
            pNext(pErr);
        });
    };

    return ApiManager;
};
