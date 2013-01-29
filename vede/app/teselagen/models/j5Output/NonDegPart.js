/**
 * @class Teselagen.models.j5Output.NonDegPart
 * Class describing a NonDegPart.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.NonDegPart", {
    extend: "Ext.data.Model",

    requires: [
    ],

    proxy: {
        type: "memory"
    },

    statics: {
    },
    
    fields: [
        {name: "id",      type: "string",     defaultValue: ""},
        {name: "name",      type: "string",     defaultValue: ""},
        {name: "source",      type: "string",     defaultValue: ""},
        {name: "revComp",      type: "string",     defaultValue: ""},
        {name: "startBP",      type: "string",     defaultValue: ""},
        {name: "stopBP",      type: "string",     defaultValue: ""},
        {name: "size",      type: "string",     defaultValue: ""},
        {name: "sequence",      type: "string",     defaultValue: ""}
    ]

});