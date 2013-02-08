/*
 * @class VEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function VEProjectManager(pDb) {
        this.db = pDb;
    }

    VEProjectManager.prototype.deleteAll = function(pNext) {
        var VEProject = this.db.model("veproject");
        VEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return VEProjectManager;
};
