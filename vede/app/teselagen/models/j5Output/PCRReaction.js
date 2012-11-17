/**
 * @class Teselagen.models.j5Output.PCRReaction
 * Class describing a PCRReaction.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.PCRReaction", {
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
        {name: "pcr_id",  type: "long"},

        // Type
        {name: "combinatorial",         type: "Boolean",    defaultValue: false},

        // Fields
        {name: "idNumber",              type: "int",        defaultValue: ""},
        {name: "primaryTemplate",       type: "string",     defaultValue: ""},
        {name: "alternateTemplate",     type: "string",     defaultValue: ""},

        {name: "forwardOligoIDNumber",  type: "int",        defaultValue: ""},
        {name: "forwardOligoName",      type: "string",     defaultValue: ""},

        {name: "reverseOligoIDNumber",  type: "int",        defaultValue: ""},
        {name: "reverseOligoName",      type: "string",     defaultValue: ""},

        // NON COMBINATORIAL ONLY
        {name: "firstTargetPart",       type: "int",        defaultValue: ""},
        {name: "lastTargetPart",        type: "int",        defaultValue: ""},
        // END NON-COMBINATORIAL

        {name: "note",                  type: "string",     defaultValue: ""},

        {name: "meanOligoTm",           type: "long",       defaultValue: ""},
        {name: "deltaOligoTm",          type: "long",       defaultValue: ""},

        {name: "meanOligoTm3prime",     type: "long",       defaultValue: ""},
        {name: "deltaOligoTm3prime",    type: "long",       defaultValue: ""},

        {name: "length",                type: "int",        defaultValue: ""},
        {name: "sequence",              type: "string",     defaultValue: ""}
    ],

    validations: [
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.NonMockAssembly",
            getterName: "getNonMockAssembly",
            setterName: "setNonMockAssembly",
            assocationKey: "nonMockAssembly",
            foreignKey: "nonMockAssembly_id"
        }/*,
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.CombinatorialNonMockAssembly",
            getterName: "getCombinatorialNonMockAssembly",
            setterName: "setCombinatorialNonMockAssembly",
            assocationKey: "combinatorialnonMockAssembly",
            foreignKey: "combinatorialnonMockAssembly_id"
        }
        */
    ]

});