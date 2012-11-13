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
        //"Teselagen.models.J5Input",
        "Teselagen.models.J5Results",
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager"
    ],
    proxy: {
        type: "memory"
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
        {name: "name",          type: "String", defaultValue: ""},
        {name: "status",        type: "String",     defaultValue: ""},
        {name: "date",          type: "String",     defaultValue: ""},
        {name: "assemblyType",  type: "String",     defaultValue: ""},
        {name: "status",        type: "String",     defaultValue: ""}
    ],

    validations: [
        //{field: "assemblyType", type: "presence"},
        {
            field: "assemblyType",
            type: "inclusion",
            list: Teselagen.constants.Constants.ASSEMBLYTYPE_LIST
        },

        //{field: "status", type: "presence"},
        {
            field: "status",
            type: "inclusion",
            list: Teselagen.constants.Constants.RUN_STATUS_LIST
        }
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Parameters",
            getterName: "getJ5Parameters",
            setterName: "setJ5Parameters",
            assocationKey: "j5Parameters"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.DownstreamAutomationParameters",
            getterName: "getDownstreamAutomationParameters",
            setterName: "setDownstreamAutomationParameters",
            assocationKey: "downstreamAutomationParameters"
        },
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
            associationKey: "j5Results"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceEditorProject",
            getterName: "getDeviceEditorProject",
            setterName: "setDeviceEditorProject",
            associationKey: "deviceEditorProject"
        }
    ]

});
