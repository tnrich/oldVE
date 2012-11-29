/**
 * @class Teselagen.models.User
 * Class describing a User.
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.models.User", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager",
               "Teselagen.models.ApplicationPreferences",
               "Teselagen.models.Project"],
    fields: [{
        name: "id",
        type: "long"
    },
    {
        name: "username",
        type: "String"
    }],
    associations: [{
        type: "hasMany",
        model: "Teselagen.models.Project",
        name: "projects",
        associationKey: "projects",
        autoLoad: true,
        foreignKey: "user_id"
    }, {
        type: "hasOne",
        model: "Teselagen.models.ApplicationPreferences",
        associationKey: "applicationPreferences",
        getterName: "getApplicationPreferences",
        setterName: "setApplicationPreferences"
    }, {
        type: "hasMany",
        model: "Teselagen.models.UserRestrictionEnzymeGroup",
        name: "userRestrictionEnzymeGroups",
        associationKey: "userRestrictionEnzymeGroups",
        foreignKey: "user_id"
    }],
    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getUser.json",
        reader: {
            type: "json",
            root: "user"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user", this.url);
        }
    }
});
