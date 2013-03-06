/*global module*/

/**
 * Sequence Manager
 * @module ./manager/SequenceManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function SequenceManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all sequences
     */
    SequenceManager.prototype.deleteAll = function(pNext) {
        var Sequence = this.db.model("sequence");
        Sequence.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return SequenceManager;
};
