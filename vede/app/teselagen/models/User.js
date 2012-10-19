Ext.define("Teselagen.models.User", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Project','Teselagen.models.ApplicationPreferences'],
    fields: [{
        name: "id",
        type: "int"
    }, {
        name: "name",
        type: "String"
    }],
    associations: [{
        type: 'hasMany',
        model: 'Teselagen.models.Project',
        name: 'projects',
        associationKey: 'projects',
        autoLoad: true,
        foreignKey: 'user_id'
    }, {
        type: 'hasOne',
        model: 'Teselagen.models.ApplicationPreferences',
        associationKey: 'preferences',
        getterName: 'getPreferences'
    }],
    proxy: {
        type: 'rest',
        url: sessionData.baseURL+'getUser',
        reader: {
            type: 'json',
            root: 'user'
        }
    }
});