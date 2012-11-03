Ext.define("Teselagen.models.VectorEditorProject", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager",
               "Teselagen.models.Part"],
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
        foreignKey: "id"
    },
    {
        type: "hasOne",
        model: "Teselagen.models.Part",
        name: "part",
        associationKey: "part",
        getterName: "getPart",
        setterName: "setPart",
        foreignKey: "id"
    }],
    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getVEProjects.json",
        reader: {
            type: "json",
            root: "projects"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/veprojects", this.url);
        }
    }
});