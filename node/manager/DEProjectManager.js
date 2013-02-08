/*
 * @class DEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function DEProjectManager(pDb) {
        this.db = pDb;
    }

    DEProjectManager.prototype.deleteAll = function(pNext) {
        var DEProject = this.db.model("deproject");
        DEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DEProjectManager;
};
