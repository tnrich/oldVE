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
        var me = this;
        Teselagen.models.User.load(null, {
            callback: function(pUser, pOp){
                var success = pOp.wasSuccessful();
                if (success) {
                    me.setUser(pUser);
                }
                else {
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

        var parts = user.parts().getRange();
        var sequenceId;

        debugger;

        // When the user's parts store is loaded, the parts have sequencefile_id
        // fields, but the getSequenceFile method returns null. We iterate through
        // the parts and call each one's setSequenceFile method as a fix.
        for(var i = 0; i < parts.length; i++) {
            sequenceId = parts[i].get("sequencefile_id");

            if(sequenceId && !part.getSequenceFile()) {
                part.setSequenceFile(user.sequences().getById(sequenceId));
            }
        }
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
