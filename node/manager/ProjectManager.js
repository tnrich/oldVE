/*
 * @class ProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function ProjectManager(pDb) {
        this.db = pDb;
    }

    ProjectManager.prototype.deleteAll = function(pNext) {
        var Project = this.db.model("project");
        Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
