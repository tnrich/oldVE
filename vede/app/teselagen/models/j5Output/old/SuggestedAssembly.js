/**
 * @class Teselagen.models.j5Output.SuggestedAssembly
 * Class describing a SuggestedAssembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.SuggestedAssembly", {
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
        {name: "suggestedAssembly_id",  type: "long"},

        // Fields
        {name: "contig",                type: "int",        defaultValue: 0},
        {
            name: "assemblyPieces",
            convert: function(v, record) {
                return [];
            }
        }
    ],

    validations: [
        {
            field: "forward",
            type: "inclusion",
            list: [
                "forward",
                "reverse"
            ]
        }
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
    ],

    addAssemblyPiece: function(pPiece) {
        return this.get("assemblyPieces").push(pPiece);
    }

});