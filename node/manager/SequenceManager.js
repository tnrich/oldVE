/*
 * @class SequenceManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function SequenceManager() {
    }

    SequenceManager.prototype.deleteAll = function(pNext) {
        var Sequence = pApp.db.model("sequence");
        Sequence.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return SequenceManager;
};
