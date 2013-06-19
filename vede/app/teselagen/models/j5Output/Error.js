/**
 * @class Teselagen.models.j5Output.Error
 * Class describing a Error.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.j5Output.Error", {
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
        {name: "faultString",       type: "string"}
    ]

});