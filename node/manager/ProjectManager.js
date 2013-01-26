/*
 * @class ProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function ProjectManager() {
    }

    ProjectManager.prototype.deleteAll = function(pNext) {
        var Project = pDb.model("project");
        Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
