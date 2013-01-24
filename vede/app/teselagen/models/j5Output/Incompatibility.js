/**
 * @class Teselagen.models.j5Output.Incompatibility
 * Class describing a Incompatibility.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Incompatibility", {
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
        {name: "incompatibilty_id",     type: "long"},

        // Fields
        {name: "assemblyPiece",         type: "int",        defaultValue: 0},
        {name: "leftEnd",               type: "string",     defaultValue: "NONE"},
        {name: "rightEnd",              type: "string",     defaultValue: "NONE"}
    ],

    validations: [
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.NonMockAssembly",
            getterName: "getNonMockAssembly",
            setterName: "setNonMockAssembly",
            associationKey: "nonMockAssembly",
            foreignKey: "nonMockAssembly_id"
        }
    ]

});