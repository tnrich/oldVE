function requestMessageProcessor(request, success) {

    if(!success)
    {
        Ext.Msg.show({
            title: 'Error',
            msg: request.operation.error.statusText,
            width: 300,
            buttons: Ext.Msg.OKCANCEL,
            buttonText: ['Reconnect'],
            fn: function(buttonId){
                if(buttonId==='ok')
                {
                    Ext.MessageBox.hide();
                    Teselagen.manager.AuthenticationManager.Login(function(opSuccess,statusText){
                        if(opSuccess) Ext.MessageBox.alert('Status', 'Reconnected successfully.');
                        else
                        {
                            Ext.Msg.show({
                                title: 'Reconnect failed',
                                msg: statusText,
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        }
                    });
                }
            },
            icon: Ext.MessageBox.ERROR
        });
    }
}

/**
 * A Device Editor project.
 * @class Teselagen.models.DeviceEditorProject
 * @author
 */
Ext.define("Teselagen.models.DeviceEditorProject", {
    extend: "Ext.data.Model",
    requires: ["Teselagen.manager.SessionManager", "Teselagen.models.DeviceDesign", "Teselagen.models.J5Run"],


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
    }, {
        name: "dateCreated",
        type: "date"
    }, {
        name: "dateModified",
        type: "date"
    }],
    /*
    validations: [
        {field: "id", type: "presence"},
        {field: "project_id", type: "presence"},
        {field: "name", type: "presence"}
    ],
    */
    associations: [{
        type: "hasOne",
        model: "Teselagen.models.DeviceDesign",
        associationKey: "design",
        getterName: "getDesign",
        setterName: "setDesign",
        foreignKey: "id"
        //            name: "design" // PLEASE DONT DELETE
    }, {
        type: "hasMany",
        model: "Teselagen.models.J5Run",
        name: "j5runs",
        associationKey: "j5runs",
        autoload: true,
        foreignKey: "deproject_id"
    }, {
        type: "belongsTo",
        model: "Teselagen.models.Project",
        getterName: "getProject",
        setterName: "setProject",
        associationKey: "project",
        foreignKey: "deproject_id"
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
        buildUrl: function () {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects", this.url);
        },
        afterRequest: function (request, success) {
            requestMessageProcessor(request, success);
        }
    }
});