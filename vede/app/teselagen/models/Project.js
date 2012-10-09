Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",

    requires: []
    ,fields: [
        { name: "ProjectName", type: "String", defaultValue: ""},
        { name: "DateCreated", type: "date"},
        { name: "DateModified", type: "date"}
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
        , defaultValue: [] 
    }]

});