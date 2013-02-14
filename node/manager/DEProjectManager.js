/*global module*/

/**
 * Device Editor Project Manager   
 * @module ./manager/DEProjectManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function DEProjectManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all Device Editor projects
     */
    DEProjectManager.prototype.deleteAll = function(pNext) {
        var DEProject = this.db.model("deproject");
        DEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DEProjectManager;
};
