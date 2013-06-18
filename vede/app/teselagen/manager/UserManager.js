/**
 * @singleton
 * @class Teselagen.manager.UserManager
 * Manages users.
 *
 * @author Yuri Bendana
 */
Ext.define("Teselagen.manager.UserManager", {
    requires:["Teselagen.models.User", "Teselagen.store.UserStore"],
    singleton: true,
    config: {
        user: null
    },

    /**
     * Get user that logged in
     * @param {String} username
     * @param {Function} next Callback
     */
    getLoggedInUser: function(pNext) {
        Teselagen.models.User.load(null, {
            callback: function(pUser, pOp){
                var success = pOp.wasSuccessful();
                if (!success) {
                    console.error("Error getting user.");
                }
                pNext(success, pUser);
            }
        });
    },

    /**
     * Set user from JSON response
     * @param {Object} user
     */
    setUserFromJson: function(pUser) {
        var userStore = Ext.create("Teselagen.store.UserStore", {
            data: pUser,
            proxy: {
                type: "memory",
                reader: {type:"json"}
            }
        });
        var user = userStore.first();
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
     * Update an existing user
     * @param {Teselagen.model.User} user
     * @param {Function} [next] Callback
     */
    update: function(pUser, pNext) {
        pUser.save({
            callback: function(pUser, pOp){
                var success = pOp.wasSuccessful();
                if (!success) {
                    console.error("Error saving user:", pUser);
                }
                if (pNext) {
                    pNext(success, pUser);
                }
            }
        });
    }
    
});