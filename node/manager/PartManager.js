/*
 * @class PartManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function PartManager() {
    }

    PartManager.prototype.deleteAll = function(pNext) {
        var Part = pDb.model("part");
        Part.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return PartManager;
};
