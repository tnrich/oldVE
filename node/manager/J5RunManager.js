/*
 * @class J5RunManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function J5RunManager(pDb) {
        this.db = pDb;
    }

    J5RunManager.prototype.deleteAll = function(pNext) {
        var J5Run = this.db.model("j5run");
        J5Run.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return J5RunManager;
};
