/**
 * Project model.
 * @class Teselagen.models.Project
 */
Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager",
        "Teselagen.models.DeviceDesign",
        "Teselagen.models.SequenceFile",
        "Teselagen.models.Part"],

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
        model: "Teselagen.models.DeviceDesign",
        name: "designs",
        associationKey: "designs",
        foreignKey: "project_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.SequenceFile",
        name: "designs",
        associationKey: "designs",
        foreignKey: "project_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.Part",
        name: "designs",
        associationKey: "designs",
        foreignKey: "project_id"
    }, {
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