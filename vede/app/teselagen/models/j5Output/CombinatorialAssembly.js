/**
 * @class Teselagen.models.j5Output.CobinatorialAssembly
 * Class describing a CobinatorialAssembly.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.CombinatorialAssembly", {
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

        // fields that may go under J5Run
        {name: "type",          type: "String",     defaultValue: ""},
        {name: "date",          type: "String",     defaultValue: ""},

        // Tables to be stored as strings, not as models
        {name: "nonDegenerativeParts",  type: "String",     defaultValue: ""},


        // IDs
        {name: "combinatorialAssembly_id",   type: "long"}
    ],

    validations: [
        { // or leave this in J5Run
            field: "type",
            type: "inclusion",
            list: Teselagen.constants.Constants.NONMOCKTYPE_LIST
        }

    ],

    associations: [
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