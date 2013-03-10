/**
 * @class Teselagen.models.J5Run
 * Class describing a J5Run.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Run", {
    extend: "Ext.data.Model",
    requires: [
        // will be moved to J5Input
        "Teselagen.models.J5Parameters",
        "Teselagen.models.DownstreamAutomationParameters",
        "Teselagen.models.J5Input",
        "Teselagen.models.j5Output.*",
        "Teselagen.models.J5Results",
        "Teselagen.constants.Constants",
        "Teselagen.manager.SessionManager"
    ],

    proxy: {
        type: "rest",
        url: "/vede/test/data/json/j5Runs.json",
        reader: {
            type: "json",
            root: "j5runs"
        },
        buildUrl: function() {
            return Teselagen.manager.SessionManager.buildUrl("user/projects/deprojects/j5runs", this.url);
        }
    },

    statics: {
    },

    fields: [
        {name: "id",            type: "long"},
        {name: "file_id",            type: "long"},
        {name: "comment",          type: "String", defaultValue: ""},

        // meta info
        {name: "status",        type: "String",     defaultValue: ""},
        {name: "date",          type: "Date",     defaultValue: "",
            convert: function(v, record) {
                var date = new Date(v);
                return date;
            }
        },
        {name: "assemblyType",  type: "String",     defaultValue: ""}, // Combinatorial or Not
        {name: "assemblyMethod",  type: "String",     defaultValue: ""}, // Combinatorial or Not
        {name: "status",        type: "String",     defaultValue: ""}, // Thread execution Status flag (Pending, Finished)

        // IDs
        {name: "deproject_id",  type: "long"}
    ],

    getItemTitle: function(){
        return Ext.Date.format( this.get('date') , 'F j, Y, g:i a') + " | " + this.get('assemblyMethod');
    },

    /*
    validations: [
        
        {field: "assemblyType", type: "presence"},
        {
            field: "assemblyType",
            type: "inclusion"
            list: Teselagen.constants.Constants.ASSEMBLYTYPE_LIST
        },

        {field: "status", type: "presence"},
        {
            field: "status",
            type: "inclusion",
            list: Teselagen.constants.Constants.RUN_STATUS_LIST
        }
    ],
    */

    associations: [
        {
            // j5Parameters and Assembly files sent
            type: "hasOne",
            model: "Teselagen.models.J5Input",
            getterName: "getJ5Input",
            setterName: "setJ5Input",
            associationKey: "j5Input"
        },
        {
            // Processed j5 Output
            type: "hasOne",
            model: "Teselagen.models.J5Results",
            getterName: "getJ5Results",
            setterName: "setJ5Results",
            associationKey: "j5Results"
        }
    ]

});