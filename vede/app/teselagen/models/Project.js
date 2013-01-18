/**
 * Project model.
 * @class Teselagen.models.Project
 */
Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager",
               "Teselagen.models.DeviceEditorProject",
               "Teselagen.models.VectorEditorProject"],

    fields: [{
        name: "id",
        type: "long"
    }, {
        name: "user_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }, {
        name: "dateCreated",
        type: "date"
    }, {
        name: "dateModified",
        type: "date"
    }],
    
    associations: [{
        type: "hasMany",
        model: "Teselagen.models.DeviceEditorProject",
        name: "deprojects",
        associationKey: "deprojects",
        foreignKey: "project_id",
        autoLoad: true
    }, {
        type: "hasMany",
        model: "Teselagen.models.VectorEditorProject",
        name: "veprojects",
        associationKey: "veprojects",
        foreignKey: "project_id",
        autoLoad: true
    },
    {
        type: "belongsTo",
        model: "Teselagen.models.User",
        getterName: "getUser",
        setterName: "setUser",
        associationKey: "user",
        foreignKey: "user_id"
    }],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/projects.json",
        reader: {
            type: "json",
            root: "projects"
        },
        writer: {
            type: "json",
            //This method should resolve associations and prepare data before saving design
            getRecordData: function(record) {
                var data = record.getData();
                var associatedData = record.getAssociatedData();
                data.deprojects = associatedData["deprojects"];
                return data;
            }
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects", this.url);
        }
    }

});