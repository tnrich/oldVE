/**
 * @class Teselagen.models.J5Run
 * Class describing a J5Run.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Run", {
    extend: "Ext.data.Model",
    requires: [
        "Teselagen.models.J5Parameters",
        "Teselagen.models.DownstreamAutomationParameters",
        "Teselagen.models.J5Results"
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
        {name: "id", type: "long"},
        {name: "j5parameters_id", type: "long"},
        {name: "automationparameters_id", type: "long"},
        {name: "j5results_id", type: "long"},
        {name: "deproject_id", type: "long"},
        {name: "name", type: "String", defaultValue: ""}

    ],

    validations: [
        /*{field: "j5Parameters",                     type: "presence"},
        {field: "downstreamAutomationParameters",   type: "presence"},
        {field: "j5Results",                        type: "presence"}
        */
    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Parameters",
            getterName: "getJ5Parameters",
            setterName: "setJ5Parameters",
            assocationKey: "j5Parameters",
            foreignKey: "j5parameters_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.DownstreamAutomationParameters",
            getterName: "getDownstreamAutomationParameters",
            setterName: "setDownstreamAutomationParameters",
            assocationKey: "downstreamAutomationParameters",
            foreignKey: "automationparameters_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results",
            foreignKey: "j5results_id"
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