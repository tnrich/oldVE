/*
 * @class ProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function ProjectManager() {
    }

    ProjectManager.prototype.deleteAll = function(pNext) {
        console.log("In ProjectManager.deleteProjects");
        var Project = pApp.db.model("project");
        Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
