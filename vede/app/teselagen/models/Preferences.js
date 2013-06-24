/**
 * User preferences.
 * @class Teselagen.models.Preferences
 */
Ext.define("Teselagen.models.Preferences", {
    extend: "Ext.data.Model",
    fields: [
        { name: "user_id", type: "long"},
        { name: "testPreference", type: "String"}
    ],
    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.User",
            getterName: "getUser",
            setterName: "setUser",
            associationKey: "user",
            foreignKey: "user_id"
        }
    ]
});