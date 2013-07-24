/**
 * @class Teselagen.models.j5Output.CombinationPart
 * Class describing a CombinationPart.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.CombinationPart", {
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
        // {name: "name",      type: "string",     defaultValue: ""},
        {name: "parts",      type: "string",     defaultValue: ""}
    ]
});