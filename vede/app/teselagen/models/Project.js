Ext.define("Teselagen.models.Project", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.constants.Constants",
               "Teselagen.manager.SessionManager",
               "Teselagen.models.DeviceEditorProject",
               "Teselagen.models.VectorEditorProject"],

    fields: [{
        name: "id",
        type: "int"
    }, {
        name: "user_id",
        type: "int"
    }, {
        name: "name",
        type: "String",
        defaultValue: ""
    }, {
        name: "DateCreated",
        type: "date"
    }, {
        name: "DateModified",
        type: "date"
    }],
    
    associations: [{
        type: "hasMany",
        model: "Teselagen.models.DeviceEditorProject",
        name: "deprojects",
        associationKey: "deprojects",
        autoLoad: true,
        foreignKey: "project_id"
    }, {
        type: "hasMany",
        model: "Teselagen.models.VectorEditorProject",
        name: "veprojects",
        foreignKey: "project_id",
        associationKey: "veprojects",
        autoLoad: true
    }],
    
    proxy: {
        type: "ajax",
//        url: "/vede/test/data/json/getProjects.json",
        url: "/vede/test/data/json/projects.json",
        reader: {
            type: "json",
            root: "projects"
        },
        buildUrl: function() {
            var sm = Teselagen.manager.SessionManager;
            var constants = Teselagen.constants.Constants;
            var url = sm.baseURL + "getProjects";
            if (sm.getEnv() === constants.ENV_TEST) {
                url = this.url;
            }
            return url;
        }
            
    }
});