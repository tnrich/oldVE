/**
 * @class Teselagen.models.J5Run
 * Class describing a J5Run.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Run", {
    extend: "Ext.data.Model",
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
        {name: "name", type: "String", defaultValue: ""}
        /*{
            name: "j5Parameters",
            convert: function(v, record) {
                if (v === undefined || v === null || v === "") {
                    return Ext.create("Teselagen.models.J5Parameters");
                } else {
                    return v;
                }
            }
        },
        {
            name: "downstreamAutomationParameters",
            convert: function(v, record) {
                if (v === undefined || v === null || v === "") {
                    return Ext.create("Teselagen.models.DownstreamAutomationParameters");
                } else {
                    return v;
                }
            }
        },
        {
            name: "j5Results",
            convert: function(v, record) {
                return v || null;
            }
        }*/
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
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results"
        },

        {
            type: "belongsTo",
            model: "Teselagen.models.DeviceDesign",
            getterName: "getDeviceDesign",
            setterName: "setDeviceDesign",
            associationKey: "deviceDesign"
        }
    ],

    init: function() {
    }

});