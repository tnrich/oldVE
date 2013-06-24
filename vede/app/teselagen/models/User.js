/**
 * @class Teselagen.models.User
 * Class describing a User.
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.models.User", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager", "Teselagen.models.Preferences", "Teselagen.models.Project", "Teselagen.models.UserRestrictionEnzymeGroup"],
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "preferences_id",
        type: "long"
    }, {
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
        model: "Teselagen.models.Preferences",
        associationKey: "preferences",
        getterName: "getPreferences",
        setterName: "setPreferences",
        foreignKey: "preferences_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.UserRestrictionEnzymeGroup",
        name: "userRestrictionEnzymeGroups",
        associationKey: "userRestrictionEnzymeGroups",
        autoLoad: true,
        foreignKey: "user_id"
    }],
    proxy: {
        type: "rest",
        reader: {
            type: "json",
            root: "user"
        },
        writer: {
            type: "json",
            getRecordData: function(record) {
                var data = record.getData();
                var associatedData = record.getAssociatedData();
//                console.log(data, associatedData);
                data.userRestrictionEnzymeGroups = associatedData.userRestrictionEnzymeGroups;
                return data;
            }
        },
        buildUrl: function () {
            var url = Teselagen.manager.SessionManager.buildUserResUrl("", this.url);
            return url;
        },
        appendId: true,
        noCache: false,
        filterParam: undefined,
        groupParam: undefined,
        pageParam: undefined,
        startParam: undefined,
        sortParam: undefined,
        limitParam: undefined
    }
});