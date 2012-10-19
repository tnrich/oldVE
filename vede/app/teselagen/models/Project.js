Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.DeviceEditorProject', 'Teselagen.models.VectorEditorProject'],
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
        model: 'Teselagen.models.DeviceEditorProject',
        name: 'deprojects',
        associationKey: 'deprojects',
        autoLoad: true,
        foreignKey: 'project_id'
    }, {
        type: 'hasMany',
        model: 'Teselagen.models.VectorEditorProject',
        name: 'veprojects',
        associationKey: 'veprojects'
    }],
    proxy: {
        type: 'rest',
        url: sessionData.baseURL+'getProjects',
        reader: {
            type: 'json',
            root: 'projects'
        }
    }
});