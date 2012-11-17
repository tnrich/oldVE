/**
 * @class Teselagen.models.j5Output.Warning
 * Class describing a Warning.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Warning", {
    extend: "Ext.data.Model",

    requires: [
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },

    /**
     * Input parameters.
     */
    fields: [
        // IDs
        {name: "warning_id",    type: "long"},

        // Fields
        {name: "type",          type: "string",     defaultValue: ""},
        {name: "message",       type: "string",     defaultValue: ""}
    ],

    validations: [

    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.Assembly",
            getterName: "getAssembly",
            setterName: "setAssembly",
            assocationKey: "assembly",
            foreignKey: "assembly_id"
        }
    ]

});