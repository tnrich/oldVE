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
    UserManager.prototype.getById = function(pId, pNext) {
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
    UserManager.prototype.getByName = function(pName, pNext) {
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
     * @param user user
     */
    UserManager.prototype.update = function(pUser, pNext) {
        this.getById(pUser._id, function(pErr, user) {
            if (!pErr) {
                user.username = pUser.username || user.username;
                user.firstName = pUser.firstName || user.firstName;
                user.lastName = pUser.lastName || user.lastName;
                user.email = pUser.email || user.email;
                user.preferences = pUser.preferences || user.preferences;
                user.groupName = pUser.groupName || user.groupName;
                user.groupType = pUser.groupType || user.groupType;
                user.userRestrictionEnzymeGroups = pUser.userRestrictionEnzymeGroups || 
                    user.userRestrictionEnzymeGroups;
                user.projects = pUser.projects || user.projects;
                user.sequences = pUser.sequences || user.sequences;
                user.parts = pUser.parts || user.parts;
                user.designs = pUser.designs || user.designs;
                user.save(function(pErr, pUser) {
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
