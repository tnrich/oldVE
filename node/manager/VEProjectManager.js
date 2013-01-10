/*
 * @class VEProjectManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pApp) {
    function VEProjectManager() {
    }

    VEProjectManager.prototype.deleteAll = function(pNext) {
        console.log("In VEProjectManager.deleteProjects");
        var VEProject = pApp.db.model("veproject");
        VEProject.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return VEProjectManager;
};
