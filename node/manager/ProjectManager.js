/*global module*/

/**
 * Project Manager
 * @module ./manager/ProjectManager
 * @author Yuri Bendana
 */

module.exports = function() {
    var UserManager = require("./UserManager")();

    /**
     * @constructor
     * @param pDb database connection
     */
    function ProjectManager(pDb) {
        this.db = pDb;
        this.Project = this.db.model("project");
        this.userManager = new UserManager(pDb);
    }

   /**
     * Create project
     */
    ProjectManager.prototype.create = function(pConfig, pNext) {
        var me = this;
        this.Project.create(pConfig, function(pErr, pProject) {
            if (!pErr) {
                me.userManager.getById(pConfig.user_id, function(pErr, pUser) {
                    if (!pErr) {
                        pUser.projects.push(pProject);
                        pUser.save(function(pErr) {
                            pNext(pErr, pProject);
                        });
                    }
                    else {
                        pNext(pErr, pProject)
                    }
                });
            }
            else {
                pNext(pErr);
            }
        });
    };

    /**
     * Delete all projects 
     */
    ProjectManager.prototype.deleteAll = function(pNext) {
        this.Project.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return ProjectManager;
};
