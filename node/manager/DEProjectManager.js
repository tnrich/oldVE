/*
 * @class DEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function DEProjectManager() {
    }

    DEProjectManager.prototype.deleteAll = function(pNext) {
        console.log("In DEProjectManager.deleteProjects");
        var DEProject = pApp.db.model("deproject");
        DEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return DEProjectManager;
};
