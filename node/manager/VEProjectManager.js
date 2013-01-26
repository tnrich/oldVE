/*
 * @class VEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function VEProjectManager() {
    }

    VEProjectManager.prototype.deleteAll = function(pNext) {
        var VEProject = pDb.model("veproject");
        VEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return VEProjectManager;
};
