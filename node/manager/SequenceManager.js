/*
 * @class SequenceManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function SequenceManager() {
    }

    SequenceManager.prototype.deleteAll = function(pNext) {
        var Sequence = pDb.model("sequence");
        Sequence.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return SequenceManager;
};
