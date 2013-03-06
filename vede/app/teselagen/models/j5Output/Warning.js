/**
 * @class Teselagen.models.j5Output.Warning
 * Class describing a Warning.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Warning", {
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
        {name: "message",       type: "string"}
    ]

});