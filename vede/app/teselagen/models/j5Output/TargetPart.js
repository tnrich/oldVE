/**
 * @class Teselagen.models.j5Output.TargetPart
 * Class describing a TargetPart.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.TargetPart", {
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
        {name: "target_id",     type: "long"},

        // Fields
        {name: "order",         type: "int",        defaultValue: 0},
        {name: "idNumber",      type: "int",        defaultValue: 0},
        {name: "name",          type: "string",     defaultValue: ""},
        {name: "direction",     type: "string",     defaultValue: "forward"},
        {name: "strategy",      type: "string",     defaultValue: ""}
    ],

    validations: [
        {
            field: "forward",
            type: "inclusion",
            list: [
                "forward",
                "reverse"
            ]
        },
        {
            field: "strategy",
            type: "inclusion",
            list: Teselagen.constants.Constants.FAS_LIST
        }

    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.j5Output.Assembly",
            getterName: "getAssembly",
            setterName: "setAssembly",
            associationKey: "assembly",
            foreignKey: "assembly_id"
        }
    ]

});