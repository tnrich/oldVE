Ext.define("Teselagen.models.ApplicationPreferences", {
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