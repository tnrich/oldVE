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
        {name: "warnings_id",   type: "long"},
        {name: "type",          type: "string"},
        {name: "message",       type: "string"}
    ],

    validations: [

    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.Assembly",
            getterName: "getAssembly",
            setterName: "setAssembly",
            associationKey: "assembly",
            foreignKey: "assembly_id"
        }
    ]

});