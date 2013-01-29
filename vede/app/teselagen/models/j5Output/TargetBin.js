/**
 * @class Teselagen.models.j5Output.TargetBin
 * Class describing a TargetBin.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.TargetBin", {
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
        {name: "name",      type: "string",     defaultValue: ""}
    ]
});