/*global module*/

/**
 * User Manager
 * @module ./manager/UserManager
 * @author Yuri Bendana
 */

module.exports = function() {

    /**
     * @constructor
     * @param db database connection
     */
    function UserManager(pDb) {
        this.db = pDb;
        this.User = this.db.model("User");
    }

   /**
     * Create user
     */
    UserManager.prototype.create = function(pUser, pNext) {
        this.User.create(pUser, function(pErr, user) {
            pNext(pErr, user);
        });
    };

    /**
     * Delete all users
     */
    UserManager.prototype.deleteAll = function(pNext) {
        this.User.remove(function(pErr) {
            pNext(pErr);
        });
    };

    /**
     * Get user by id
     * @param id User id
     */
    UserManager.prototype.getUserById = function(pId, pNext) {
        this.User.findById(pId).populate("projects").exec(function(pErr, pUser) {
            if (!pErr) {
                if (pUser && pUser.projects) {
                    pUser.projects.forEach(function(pProj) {
                        pProj.deprojects = undefined;
                        pProj.veprojects = undefined;
                    });
                }
            }
            pNext(pErr, pUser);
        });
   };

    /**
     * Get user by name
     * @param name username
     */
    UserManager.prototype.getUserByName = function(pName, pNext) {
        this.User.findOne({username:pName}).populate("projects").exec(function(pErr, pUser) {
            if (!pErr) {
                if (pUser && pUser.projects) {
                    pUser.projects.forEach(function(pProj) {
                        pProj.deprojects = undefined;
                        pProj.veprojects = undefined;
                    });
                }
            }
            pNext(pErr, pUser);
        });
   };

    /**
     * Update user
     * @param name username
     */
    UserManager.prototype.update = function(pReqUser, pNext) {
        this.getUserById(pReqUser._id, function(pErr, pUser) {
            if (!pErr) {
                pUser.username = pReqUser.username;
                pUser.firstName = pReqUser.firstName;
                pUser.lastName = pReqUser.lastName;
                pUser.email = pReqUser.email;
                pUser.preferences = pReqUser.preferences;
                pUser.groupName = pReqUser.groupName;
                pUser.groupType = pReqUser.groupType;
                pUser.userRestrictionEnzymeGroups = pReqUser.userRestrictionEnzymeGroups;
                pUser.save(function(pErr, pUser) {
                    pNext(pErr, pUser);
                });
            }
            else {
                pNext(pErr);
            }
        });
   };

   return UserManager;
};
