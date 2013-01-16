/**
 * Vector Editor project.
 * @class Teselagen.models.VectorEditorProject
 */
Ext.define("Teselagen.models.VectorEditorProject", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager", "Teselagen.models.Part"],
    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "project_id",
        type: "long"
    }, {
        name: "sequencefile_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }],
    associations: [{
        type: "hasOne",
        model: "Teselagen.models.SequenceFile",
        getterName: "getSequenceFile",
        setterName: "setSequenceFile",
        foreignKey: "sequencefile_id"
    },
    {
        type: "hasMany",
        model: "Teselagen.models.Part",
        name: "parts",
        foreignKey: "veproject_id" // dont change please
    }, {
        type: "belongsTo",
        model: "Teselagen.models.Project",
        getterName: "getProject",
        setterName: "setProject",
        associationKey: "project",
        foreignKey: "project_id"
    }],
    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getVEProjects.json",
        reader: {
            type: "json",
            root: "projects"
        },
        writer: {
            type: "json",
            //This method should resolve associations and prepare data before saving design
            getRecordData: function (record) {
                var data = record.getData();
                var associatedData = record.getAssociatedData();
                var partsData = associatedData["parts"];
                var parts = [];
                partsData.forEach(function(part){
                    parts.push(part.id);
                });
                data.parts = parts;
                return data;
            }
        },
        buildUrl: function () {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/veprojects", this.url);
        }
    }
});