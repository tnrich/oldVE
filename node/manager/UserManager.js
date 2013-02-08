/*
 * @class UserManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function() {
    function UserManager(pDb) {
        this.db = pDb;
    }

    UserManager.prototype.deleteAll = function(pNext) {
        var User = this.db.model("User");
        User.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return UserManager;
};
