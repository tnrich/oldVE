/**
 * @class Teselagen.models.User
 * Class describing a User.
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.models.User", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Project','Teselagen.models.ApplicationPreferences'],
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "username",
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
        url: 'getUser.json',
        reader: {
            type: 'json',
            root: 'user'
        },
        buildUrl: function() {
            //console.log(sessionData.baseURL);
            //Ext.data.proxy.Ajax.prototype.buildUrl.apply(this, arguments);
            return sessionData.baseURL + 'getUser';
        }
    }
});