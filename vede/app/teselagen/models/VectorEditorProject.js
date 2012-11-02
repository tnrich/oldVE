Ext.define("Teselagen.models.VectorEditorProject", {
    extend: "Ext.data.Model",
    requires: ['Teselagen.models.Part'],
    fields: [{
        name: "id",
        type: "long"
    },
    {
        name: "project_id",
        type: "long"
    },
    {
        name: "name",
        type: "String",
        defaultValue: ""
    }],
    associations: [
    {
        type: "hasOne",
        model: "Teselagen.models.SequenceFile",
        getterName: "getSequenceFile",
        setterName: "setSequenceFile",
        associationKey: "sequenceFile",
        name: "sequenceFile",
        foreignKey: 'id'
    },
    {
        type: 'hasOne',
        model: 'Teselagen.models.Part',
        name: 'part',
        associationKey: 'part',
        getterName: 'getPart',
        setterName: 'setPart',
        foreignKey: 'id'
    }],
    proxy: {
        type: 'rest',
        url: '/vede/test/data/json/getVEProjects.json', // For testing just create a file with this name and fill with data.
        reader: {
            type: 'json',
            root: 'projects'
        },
        writer: {
            type: 'json'
        },
        buildUrl: function() {
            return sessionData.baseURL + 'user/projects/veprojects'; // This method reBuild the URL for ajax requests from parents models
        }
    }

    /*
    ,
    proxy: {
        type: 'ajax',
        url: '/vede/test/data/json/getVEProjects.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
    */
});