/*global module*/

/**
 * j5 run Manager
 * @module ./manager/J5RunManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function J5RunManager(pDb) {
        this.db = pDb;
    }
   
    /**
     * Delete all j5 runs
     */
    J5RunManager.prototype.deleteAll = function(pNext) {
        var J5Run = this.db.model("j5run");
        J5Run.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return J5RunManager;
};
