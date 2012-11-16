/**
 * @class Teselagen.models.j5Output.NonMockAssembly
 * Class describing a NonMockAssembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.NonMockAssembly", {
    extend: "Teselagen.models.j5Output.Assembly",

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
        /*{
            type: "hasOne",
            model: "Teselagen.models.Incompatibilities",
            getterName: "getIncompatibilities",
            setterName: "setIncompatibilities",
            assocationKey: "incompatibilities",
            foreignKey: "incompatibilities_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.SuggestedAssembly",
            getterName: "getSuggestedAssembly",
            setterName: "setSuggestedAssembly",
            assocationKey: "suggestedAssembly",
            foreignKey: "suggestedAssembly_id"
        },
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
        },*/
        {
            type: "belongsTo",
            model: "Teselagen.models.AssembledSequenceFile",
            getterName: "getAssembledSequenceFile",
            setterName: "setAssembledSequenceFile",
            assocationKey: "assembledSequenceFile",
            foreignKey: "assembledSequenceFile_id"
        }
    ]

});