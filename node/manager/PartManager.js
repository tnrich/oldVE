/*
 * @class PartManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function PartManager(pDb) {
        this.db = pDb;
    }

    PartManager.prototype.deleteAll = function(pNext) {
        var Part = this.db.model("part");
        Part.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return PartManager;
};
