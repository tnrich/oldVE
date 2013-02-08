/*
 * @class SequenceManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function SequenceManager(pDb) {
        this.db = pDb;
    }

    SequenceManager.prototype.deleteAll = function(pNext) {
        var Sequence = this.db.model("sequence");
        Sequence.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return SequenceManager;
};
