Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Part']
    ,fields: [
        { name: "ProjectName", type: "String", defaultValue: ""},
        { name: "DateCreated", type: "date"},
        { name: "DateModified", type: "date"},
        { name: "Path", type: "String", defaultValue: "Project"},
    ],
    associations: [
        { type: 'hasMany'
        , model: 'Teselagen.models.DeviceDesign'
        , name: 'DeviceEditorProjects'
        , defaultValue: [] 
    }],
    associations: [
        { type: 'hasMany'
        , model: 'Teselagen.models.Part'
        , name: 'parts'
        , associationKey: 'parts'
        , defaultValue: [] 
    }]

});