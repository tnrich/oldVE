/*global module*/

/**
 * Vector Editor Project Manager
 * @module ./manager/VEProjectManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function VEProjectManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all Vector Editor projects
     */
    VEProjectManager.prototype.deleteAll = function(pNext) {
        var VEProject = this.db.model("veproject");
        VEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return VEProjectManager;
};
