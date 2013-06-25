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
     * Load the current user from database.
     * @param {Function} next Callback
     */
    loadUser: function(pNext) {
        Teselagen.models.User.load(null, {
            callback: function(pUser, pOp){
                var success = pOp.wasSuccessful();
                if (!success) {
                    console.error("Error loading user.");
                }
                pNext(success, pUser);
            }
        });
    },

    /**
     * Set current user from JSON response after login
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
     * Update the current user in the database.
     * @param {Function} [next] Callback
     */
    update: function(pNext) {
        this.getUser().save({
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