/*
 * @class PartManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function PartManager() {
    }

    PartManager.prototype.deleteAll = function(pNext) {
        var Part = pApp.db.model("part");
        Part.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return PartManager;
};
