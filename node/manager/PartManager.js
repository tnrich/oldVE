/*global module*/

/**
 * Part Manager
 * @module ./manager/PartManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function PartManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all parts
     */
    PartManager.prototype.deleteAll = function(pNext) {
        var Part = this.db.model("part");
        Part.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return PartManager;
};
