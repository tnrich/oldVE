/**
 * @class Teselagen.models.J5Run
 * Class describing a J5Run.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Run", {
    extend: "Ext.data.Model",
    requires: [
        // will be moved to J5Input
        "Teselagen.models.J5Parameters",
        "Teselagen.models.DownstreamAutomationParameters",

        "Teselagen.models.J5Input",
        "Teselagen.models.J5Results",
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager"
    ],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/getj5Runs.json",
        reader: {
            type: "json",
            root: "j5runs"
        },
        writer: {
            type: "json"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects/j5runs", this.url);
        }
    },

    statics: {
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.J5Collection[]} binsVector
     * @param {Boolean} j5Ready
     * @param {Boolean} combinatorial
     * @param {Boolean} isCircular
     */
    fields: [
        {name: "id",            type: "long"},
        {name: "file_id",            type: "long"},
        {name: "name",          type: "String", defaultValue: ""},

        // meta info
        {name: "status",        type: "String",     defaultValue: ""},
        {name: "date",          type: "String",     defaultValue: ""},
        {name: "assemblyType",  type: "String",     defaultValue: ""},
        {name: "status",        type: "String",     defaultValue: ""},


        // IDs
        {name: "deproject_id",  type: "long"},
        {name: "j5results_id",  type: "long"},
        {name: "j5input_id",    type: "long"},

        // TO BE MOVED TO J5INPUT
        {name: "j5parameters_id", type: "long"},
        {name: "automationparameters_id", type: "long"}

    ],

    validations: [
        //{field: "assemblyType", type: "presence"},
        {
            field: "assemblyType",
            type: "inclusion",
            //list: Teselagen.constants.Constants.ASSEMBLYTYPE_LIST
        },

        //{field: "status", type: "presence"},
        {
            field: "status",
            type: "inclusion",
            list: Teselagen.constants.Constants.RUN_STATUS_LIST
        }
    ],

    associations: [
        /*{ // Move this to J5Input
            type: "hasOne",
            model: "Teselagen.models.J5Parameters",
            getterName: "getJ5Parameters",
            setterName: "setJ5Parameters",
            assocationKey: "j5Parameters",
            foreignKey: "j5parameters_id"
        },
        { // Move this to J5Input
            type: "hasOne",
            model: "Teselagen.models.DownstreamAutomationParameters",
            getterName: "getDownstreamAutomationParameters",
            setterName: "setDownstreamAutomationParameters",
            assocationKey: "downstreamAutomationParameters",
            foreignKey: "automationparameters_id"
        },*/
        {
            type: "hasOne",
            model: "Teselagen.models.J5Input",
            getterName: "getJ5Input",
            setterName: "setJ5Input",
            associationKey: "j5Input",
            foreignKey: "j5Input_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results",
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceEditorProject",
            getterName: "getDeviceEditorProject",
            setterName: "setDeviceEditorProject",
            associationKey: "deviceEditorProject",
            foreignKey: "deproject_id"
        }
    ]

});
