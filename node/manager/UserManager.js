/*
 * @class UserManager
 * @author Yuri Bendana
 */

/*global module*/

module.exports = function(pDb) {
    function UserManager() {
    }

    UserManager.prototype.deleteAll = function(pNext) {
        var User = pDb.model("User");
        User.remove(function(pErr) {
            pNext(pErr);
        });
    };

    return UserManager;
};
