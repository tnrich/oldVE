Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.DeviceDesign', 'Teselagen.models.Part'],
    fields: [{
        name: "id",
        type: "int"
    }, {
        name: "user_id",
        type: "int"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }, {
        name: "DateCreated",
        type: "date"
    }, {
        name: "DateModified",
        type: "date"
    }],
    associations: [{
        type: 'hasMany',
        model: 'Teselagen.models.DeviceDesign',
        name: 'designs',
        associationKey: 'designs',
        autoLoad: true,
        foreignKey: 'project_id'
    }, {
        type: 'hasMany',
        model: 'Teselagen.models.Part',
        name: 'parts',
        associationKey: 'parts',
        autoLoad: true,
        foreignKey: 'project_id'
    }],
    proxy: {
        type: 'rest',
        url: 'getProjects.json',
        reader: {
            type: 'json',
            root: 'projects'
        }
    }
});