/**
 * @class Teselagen.models.DeviceEditorProject
 * @author
 */
Ext.define("Teselagen.models.DeviceEditorProject", {
    extend: "Ext.data.Model",
    requires: [
        "Teselagen.manager.SessionManager",
        "Teselagen.models.DeviceDesign",
        "Teselagen.models.J5Run"
    ],


    /**
     * Input parameters.
     * @param {int} id
     * @param {in} project_id
     * @param {String} name
     */
    fields: [{
        name: "id",
        type: "long"
    },
    //{ name: "devicedesign_id", type: "long"},
    {
        name: "project_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    },
    {
        name: "dateCreated",
        type: "date"
    },
    {
        name: "dateModified",
        type: "date"
    }
    ],
    /*
    validations: [
        {field: "id", type: "presence"},
        {field: "project_id", type: "presence"},
        {field: "name", type: "presence"}
    ],
    */
    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.DeviceDesign",
            associationKey: "design",
            getterName: "getDesign",
            setterName: "setDesign",
            foreignKey: "id",
            name: "design" // PLEASE DONT DELETE
        },
        {
            type: "hasMany",
            model: "Teselagen.models.J5Run",
            name: "j5runs",
            associationKey: "j5runs",
            foreignKey: "id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.Project",
            getterName: "getProject",
            setterName: "setProject",
            associationKey: "project",
            foreignKey: "project_id"
        }
    ],
    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getDEProjects.json",
        reader: {
            type: "json",
            root: "projects"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects", this.url);
        }
    }
});
