/**
 * @class Teselagen.models.J5Results
 * Class describing a J5Results.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Results", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager"
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
        {name: "name",              type: "String",     defaultValue: ""},

        //



        {name: "eugeneruleslist",   type: "string",     defaultValue: ""}, //.eug
        {name: "j5parameters",      type: "string",     defaultValue: ""}, //.csv
        {name: "masterplasmidlist", type: "string",     defaultValue: ""}, //.csv
        {name: "mastersequences",   type: "string",     defaultValue: ""}, //.csv
        {name: "masterzippedsequences",   type: "auto", defaultValue: ""}, //array of .gb .fas .seq files
        {name: "partslist",         type: "string",     defaultValue: ""}, //.csv
        {name: "combinatorial",     type: "string",     defaultValue: ""}, //.csv
        {name: "plamids",           type: "auto"}  //. <--- these are the RESULTS: .gb/.csv files
    ],

    validations: [
    ],

    associations: [
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5Run",
            setterName: "setJ5Run",
            assocationKey: "j5run"
        }
    ]

})
