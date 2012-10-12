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
            autoLoad: true,
            foreignKey: 'design_id'
        },
        { 
            type: 'hasMany', 
            model: 'Teselagen.models.Part', 
            name: 'parts', 
            associationKey: 'parts', 
            autoLoad: true,
            foreignKey: 'part_id'
        }
    ],
    proxy: {
        type: 'rest',
        url: 'getProjects.json',
        reader: {
            type: 'json',
            root: 'projects',
            model: "Teselagen.models.Project"
        }
    }
});