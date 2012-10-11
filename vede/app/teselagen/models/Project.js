Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Part','Teselagen.models.DeviceDesign'],
    fields: [
        { name: "id", type: "int"},
        { name: "ProjectName", type: "String", defaultValue: ""},
        { name: "DateCreated", type: "date"},
        { name: "DateModified", type: "date"},
        { name: "Path", type: "String", defaultValue: "Project"},
    ],
    associations: [
        { 
            type: 'hasMany', 
            model: 'Teselagen.models.DeviceDesign', 
            name: 'designs', 
            associationKey: 'designs', 
            autoLoad: true
        },
        { 
            type: 'hasMany', 
            model: 'Teselagen.models.Part', 
            name: 'parts', 
            associationKey: 'parts', 
            autoLoad: true
        }
    ],
    proxy: {
        type: 'rest',
        url: 'getTree.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});