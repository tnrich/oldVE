/**
 * @class Teselagen.models.DeviceEditorProject
 * @author
 */
Ext.define("Teselagen.models.DeviceEditorProject", {
    extend: "Ext.data.Model",
    requires: [
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
    }, {
        name: "project_id",
        type: "long"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }],

    validations: [
        {field: "id", type: "presence"},
        {field: "project_id", type: "presence"},
        {field: "name", type: "presence"}
    ],


    associations: [{
        type: "hasOne",
        model: "Teselagen.models.DeviceDesign",
        associationKey: "design",
        getterName: "getDesign"
    }, {
        type: "hasMany",
        model: "Teselagen.models.J5Run",
        name: "j5runs",
        associationKey: "j5runs"
    }],
    proxy: {
        type: "ajax",
        url: "/vede/test/data/json/getDEProjects.json",
        reader: {
            type: "json",
            root: "data"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("getProjects", this.url);
        }
    }
});
