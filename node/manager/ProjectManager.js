/*global module*/

/**
 * Project Manager
 * @module ./manager/ProjectManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function ProjectManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all projects 
     */
    ProjectManager.prototype.deleteAll = function(pNext) {
        var Project = this.db.model("project");
        Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
