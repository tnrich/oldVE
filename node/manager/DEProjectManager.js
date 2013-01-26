/*
 * @class DEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function DEProjectManager() {
    }

    DEProjectManager.prototype.deleteAll = function(pNext) {
        var DEProject = pDb.model("deproject");
        DEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DEProjectManager;
};
