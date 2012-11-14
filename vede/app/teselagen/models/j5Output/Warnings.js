/**
 * @class Teselagen.models.j5Output.Warnings
 * Class describing a Warnings.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Warnings", {
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
        {name: "warnings_id",   type: "long"}
    ],

    validations: [

    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.Assembly",
            getterName: "getAssembly",
            setterName: "setAssembly",
            assocationKey: "assembly",
            foreignKey: "assembly_id"
        }
    ]

});