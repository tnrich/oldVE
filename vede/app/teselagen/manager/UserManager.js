/**
 * @singleton
 * @class Teselagen.manager.UserManager
 * Manages users.
 *
 * @author Yuri Bendana
 */
Ext.define("Teselagen.manager.UserManager", {
    requires:["Teselagen.models.User"],
    singleton: true,
    config: {
        user: null
    },

    /**
     * Get user by username
     * @param {String} username
     * @param {Function} next Callback
     */
    getUserByName: function(pUsername, pNext) {
        Teselagen.models.User.load(null, {
            callback: function(pUser, pOp){
                pNext(pOp.wasSuccessful(), pUser);
            }
        });
    },

    /**
     * Set user from JSON response
     * @param {Object} user
     */
    setUserFromJson: function(pUser) {
        var user = Ext.create("Teselagen.models.User", pUser);
        this.setUser(user);
    },
    
    /**
     * @member Teselagen.manager.UserManager
     */
    constructor: function() {
    },

    /**
     * Create user
     */
    create: function() {
    },

    /**
     * Update existing user
     * @param {Teselagen.model.User} user
     * @param {Function} next Callback
     * @returns {Boolean} True if update was successful
     */
    update: function(pUser, pNext) {
        pUser.save({
            callback: function(pUser, pOp){
                pNext(pOp.wasSuccessful());
            }
        });
    }
});