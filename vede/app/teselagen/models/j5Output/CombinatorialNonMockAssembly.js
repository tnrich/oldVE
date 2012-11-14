/**
 * @class Teselagen.models.j5Output.CombinatorialNonMockAssembly
 * Class describing a CombinatorialNonMockAssembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.CombinatorialNonMockAssembly", {
    extend: [
        "Ext.data.Model",
        "Teselagen.models.j5Output.CombinatorialAssembly"
    ],

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

        // fields that may go under J5Run
        {name: "type",          type: "String",     defaultValue: ""},
        {name: "date",          type: "String",     defaultValue: ""},

        // Tables to be stored as strings, not as models
        //{name: "targetBin",                 type: "String",     defaultValue: ""},
        {name: "annealedOligoSynthesis",    type: "String",     defaultValue: ""},
        {name: "assemblyPieces",            type: "String",     defaultValue: ""},
        //{name: "combinationsAssemblyPieces", type: "String",     defaultValue: ""},
        //{name: "suggestedAssemblyPieces",    type: "String",     defaultValue: ""},

        // IDs
        {name: "assembly_id",   type: "long"}
    ],

    validations: [
        { // or leave this in J5Run
            field: type,
            type: "inclusion",
            list: Teselagen.constants.Constants.ASSEMBLYTYPE_LIST
        }

    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.OligoSynthesis",
            getterName: "getOligoSynthesis",
            setterName: "setOligoSynthesis",
            assocationKey: "oligoSynthesis",
            foreignKey: "oligoSynthesis_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.PCRReactions",
            getterName: "getPCRReactions",
            setterName: "setPCRReactions",
            assocationKey: "pcrReactions",
            foreignKey: "pcrReactions_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            assocationKey: "j5Results",
            foreignKey: "j5results_id"
        }
    ]

});