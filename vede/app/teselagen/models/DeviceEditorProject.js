Ext.define("Teselagen.models.DeviceEditorProject", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.DeviceDesign', "Teselagen.models.J5Run"],
    fields: [{
        name: "id",
        type: "int"
    }, {
        name: "project_id",
        type: "int"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }],
    associations: [{
        type: 'hasOne',
        model: 'Teselagen.models.DeviceDesign',
        associationKey: 'design',
        getterName: 'getDesign'
    }, {
        type: 'hasMany',
        model: "Teselagen.models.J5Run",
        name: 'j5runs',
        associationKey: 'j5runs'
    }],
    proxy: {
        type: 'ajax',
        url: '/vede/test/data/getDEProjects.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});