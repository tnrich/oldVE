var ProjectStore = new Ext.data.Store({
model: 'Project',
storeId: 'userNoteCodeStore',
remoteSort: false,
autoLoad: false,
proxy: {
type: 'localstorage',
id: 'ingenix-ic9expert.usernotecodes',
} 
});

Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.DeviceEditorProject",
        "Teselagen.models.VectorEditorProject",
    ], 

    fields: [
        { name: "ProjectName", type: "String", defaultValue: ""},
        { name: "DateCreated", type: "date"},
        { name: "DateModified", type: "date"}
    ],
    proxy: ProjectStore.proxy,
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