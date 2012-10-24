Ext.define("Teselagen.models.VectorEditorProject", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Part'],
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "project_id",
        type: "int"
    },
    {
        name: "name",
        type: "String",
        defaultValue: ""
    }],
    associations: [{
        type: 'hasMany',
        model: 'Teselagen.models.Part',
        name: 'parts',
        autoLoad: true,
        foreignKey: 'veproject_id'
    }],
    proxy: {
        type: 'ajax',
        url: '/vede/test/data/json/getVEProjects.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});