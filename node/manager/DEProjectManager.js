/*
 * @class DEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function DEProjectManager(pDb) {
        console.log("DEProjectManager", typeof pDb)
        this.db = pDb;
    }

    DEProjectManager.prototype.deleteAll = function(pNext) {
        console.log("DEProjectManager.deleteAll", typeof this.db);
        var DEProject = this.db.model("deproject");
        DEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DEProjectManager;
};
