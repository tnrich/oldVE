/*global module*/

/**
 * User Manager
 * @module ./manager/UserManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param pDb database connection
     */
    function UserManager(pDb) {
        this.db = pDb;
    }

    /**
     * Delete all users
     */
    UserManager.prototype.deleteAll = function(pNext) {
        var User = this.db.model("User");
        User.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return UserManager;
};
