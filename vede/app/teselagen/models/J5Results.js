/**
 * @class Teselagen.models.J5Results
 * Class describing a J5Results.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Results", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager",
        "Teselagen.models.j5Output.CombinatorialAssembly",
        "Teselagen.models.j5Output.AssembledSequenceFile"
    ],

    proxy: {
        type: "memory"
    },

    associations: [
        {
            type: "hasMany",
            model: "Teselagen.models.j5Output.AssembledSequenceFile",
            name: "assemblies"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.j5Output.CombinatorialAssembly",
            associationKey: "combinatorialAssembly",
            getterName: "getCombinatorialAssembly",
            setterName: "setCombinatorialAssembly"
        }
    ]

});