Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.DeviceEditorProject', 'Teselagen.models.VectorEditorProject'],
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "user_id",
        type: "long"
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
        associationKey: 'deprojects'
    }, {
        type: 'hasMany',
        model: 'Teselagen.models.VectorEditorProject',
        name: 'veprojects',
        associationKey: 'veprojects'
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'projects'
        }
    }
});