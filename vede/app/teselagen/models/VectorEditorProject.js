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
        type: 'hasOne',
        model: 'Teselagen.models.Part',
        name: 'part',
        associationKey: 'part',
        getterName: 'getPart',
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