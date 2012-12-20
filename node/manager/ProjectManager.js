/*
 * @class ProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function ProjectManager() {
    }

    ProjectManager.prototype.deleteProjects = function(pNext) {
        var Project = pApp.db.model("project");
        Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
