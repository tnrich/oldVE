/**
 * @class Teselagen.models.J5Input
 * Class describing a J5Input.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Input", {
    extend: "Ext.data.Model",

    requires: [
        "Teselagen.models.J5Parameters",
        "Teselagen.models.DownstreamAutomationParameters"//,
        //"Teselagen.constants.Constants",
        //"Teselagen.manager.SessionManager"
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

        /*
        {name: "eugeneruleslist",   type: "string",     defaultValue: ""}, //.eug
        {name: "j5parameters",      type: "string",     defaultValue: ""}, //.csv
        {name: "masterplasmidlist", type: "string",     defaultValue: ""}, //.csv
        {name: "mastersequences",   type: "string",     defaultValue: ""}, //.csv
        {name: "masterzippedsequences",   type: "auto", defaultValue: ""}, //array of .gb .fas .seq files
        {name: "partslist",         type: "string",     defaultValue: ""}, //.csv
        {name: "combinatorial",     type: "string",     defaultValue: ""}, //.csv
        {name: "plasmids",           type: "auto"}  //. <--- these are the RESULTS: .gb/.csv files
        */

        {name: "j5parameters_id",           type: "long"},
        {name: "automationparameters_id",   type: "long"}
    ],

    validations: [

    ],

    associations: [
        {
            type: "hasOne",
            model: "Teselagen.models.J5Parameters",
            getterName: "getJ5Parameters",
            setterName: "setJ5Parameters",
            associationKey: "j5Parameters",
            foreignKey: "j5parameters_id"
        },
        {
            type: "hasOne",
            model: "Teselagen.models.DownstreamAutomationParameters",
            getterName: "getDownstreamAutomationParameters",
            setterName: "setDownstreamAutomationParameters",
            associationKey: "downstreamAutomationParameters",
            foreignKey: "automationparameters_id"
        },
        {
            type: "belongsTo",
            model: "Teselagen.models.J5Run",
            getterName: "getJ5Run",
            setterName: "setJ5Run",
            associationKey: "j5run",
            foreignKey: "j5run_id"
        }
    ]

});