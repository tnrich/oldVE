/**
 * @class Teselagen.models.j5Output.CombinatorialAssembly
 * Class describing a CombinatorialAssembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.CombinatorialAssembly", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.j5Output.Warning",
        "Teselagen.models.j5Output.CombinationPart",
        "Teselagen.models.j5Output.TargetBin",
        "Teselagen.models.j5Output.NonDegPart"
    ],
    
    proxy: {
        type: "memory"
    },
    
    fields: [
        {name: "cite", type: "String"},
        {name: "date", type: "String"},
        {name: "note", type: "String"},
        {name: "assemblyParameters", type: "String"}
    ],

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.Warning",
            name: "warnings"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.CombinationPart",
            name: "combinationParts"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.TargetBin",
            name: "targetBins"
        },
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.NonDegPart",
            name: "nonDegParts"
        }
    ]
    

});