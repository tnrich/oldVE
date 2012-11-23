/**
 * @class Teselagen.models.j5Output.Assembly
 * Class describing a Assembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Assembly", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.j5Output.Warning"//,
        //"Teselagen.models.j5Output.TargetPart"
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
        //{name: "nonDegenerativeParts",  type: "String",     defaultValue: ""},
        //{name: "finalAssembledVector",  type: "String",     defaultValue: ""},


        // IDs
        {name: "assembly_id",   type: "long"}
    ],

    validations: [
        { // or leave this in J5Run
            field: "type",
            type: "inclusion",
            list: Teselagen.constants.Constants.ASSEMBLYTYPE_LIST
        }

    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Warning",
            name: "warnings",
            //getterName: "getWarnings",
            //setterName: "setWarnings",
            //assocationKey: "warnings",
            foreignKey: "warnings_id"
        },/*
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.TargetPart",
            name: "targetParts"
            //getterName: "getTargetPart",
            //setterName: "setTargetPart",
            //assocationKey: "targetPart",
            foreignKey: "targetPart_id"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.FinalAssembledVector",
            name: "final"
            //getterName: "getTargetPart",
            //setterName: "setTargetPart",
            //assocationKey: "targetPart",
            foreignKey: "targetPart_id"
        },*/
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.AssembledSequenceFile",
            getterName: "getAssembledSequenceFile",
            setterName: "setAssembledSequenceFile",
            assocationKey: "assembledSequenceFile",
            foreignKey: "assembledSequenceFile_id"
        }
    ]

});