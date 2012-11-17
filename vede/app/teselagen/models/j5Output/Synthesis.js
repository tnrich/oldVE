/**
 * @class Teselagen.models.j5Output.Synthesis
 * Class describing a Synthesis.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Synthesis", {
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
        {name: "synthesis_id",  type: "long"},

        // Type
        {name: "type",                  type: "string",     defaultValue: ""},
        // Fields common to Direct, Oligo, and Annealed Oligo Synthesis
        {name: "idNumber",              type: "int",        defaultValue: ""},
        {name: "name",                  type: "string",     defaultValue: ""},
        {name: "firstTargetPart",       type: "int",        defaultValue: ""},
        {name: "lastTargetPart",        type: "int",        defaultValue: ""},

        {name: "cost",                  type: "long",       defaultValue: ""},

        {name: "length",                type: "int",        defaultValue: ""},
        {name: "sequence",              type: "string",     defaultValue: ""},

        // OLIGO & ANNEALED OLIGO SYNTHESIS
        {name: "Tm",                    type: "long",       defaultValue: ""},

        // OLIGO SYNTHESIS ONLY
        {name: "Tm3prime",              type: "long",       defaultValue: ""},

        // ANNEALED OLIGO SYNTHESIS ONLY
        {name: "topOligo",              type: "int",        defaultValue: 0},
        {name: "bottomOligo",           type: "int",        defaultValue: 0}
    ],

    validations: [
        {
            field: "type",
            type: "inclusion",
            list: Teselagen.constants.Constants.SYNTHESISTYPE_LIST
        }
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.NonMockAssembly",
            getterName: "getNonMockAssembly",
            setterName: "setNonMockAssembly",
            assocationKey: "nonMockAssembly",
            foreignKey: "nonMockAssembly_id"
        }
    ],

    addAssemblyPiece: function(pPiece) {
        return this.get("assemblyPieces").push(pPiece);
    }

});