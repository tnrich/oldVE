/**
 * @class Teselagen.models.j5Output.NonMockAssembly
 * Class describing a NonMockAssembly that is of the "type": SLIC or GOLDENGATE only.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.NonMockAssembly", {
    extend: "Teselagen.models.j5Output.Assembly",

    requires: [
        "Teselagen.models.j5Output.Incompatibility",
        "Teselagen.models.j5Output.SuggestedAssembly",
        "Teselagen.models.j5Output.Synthesis",
        "Teselagen.models.j5Output.PCRReaction"
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
        //{name: "type",          type: "String",     defaultValue: ""},
        //{name: "date",          type: "String",     defaultValue: ""},

        // Tables to be stored as strings, not as models
        {name: "directSynthesis",           type: "String",     defaultValue: ""},
        {name: "annealedOligoSynthesis",    type: "String",     defaultValue: ""},


        // IDs
        {name: "assembly_id",   type: "long"}
        
    ],

    validations: [
        /*{ // or leave this in J5Run
            field: "type",
            type: "inclusion",
            list: Teselagen.constants.Constants.NONMOCKTYPE_LIST
        }*/

    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Incompatibility",
            name: "comp",
            //getterName: "getIncompatibilities",
            //setterName: "setIncompatibilities",
            //associationKey: "incompatibilities",
            foreignKey: "incompatibilities_id"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.SuggestedAssembly",
            name: "suggestedAssembly",
            //getterName: "getSuggestedAssembly",
            //setterName: "setSuggestedAssembly",
            //associationKey: "suggestedAssembly",
            foreignKey: "suggestedAssembly_id"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Synthesis",
            name: "directSynthesis",
            //getterName: "getDirectSynthesis",
            //setterName: "setDirectynthesis",
            //associationKey: "directSynthesis",
            foreignKey: "directSynthesis_id"
        },

        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Synthesis",
            name: "oligoSynthesis",
            //getterName: "getOligoSynthesis",
            //setterName: "setOligoSynthesis",
            //associationKey: "oligoSynthesis",
            foreignKey: "oligoSynthesis_id"
        },

        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Synthesis",
            name: "annealedOligoSynthesis",
            //getterName: "getAnnealedOligoSynthesis",
            //setterName: "setAnnealedOligoSynthesis",
            //associationKey: "annealedOligoSynthesis",
            foreignKey: "annealedOligoSynthesis_id"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.PCRReaction",
            name: "pcrReaction",
            //getterName: "getPCRReaction",
            //setterName: "setPCRReaction",
            //associationKey: "pcrReaction",
            foreignKey: "pcrReaction_id"
        }
    ]

});