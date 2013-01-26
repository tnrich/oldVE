/*
 * @class J5RunManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function J5RunManager() {
    }

    J5RunManager.prototype.deleteAll = function(pNext) {
        var J5Run = pDb.model("j5run");
        J5Run.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return J5RunManager;
};
