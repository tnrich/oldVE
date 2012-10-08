/**
 * @class Teselagen.models.J5Results
 * Class describing a J5Results.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Results", {
    extend: "Ext.data.Model",

    requires: [
    ],

    statics: {
    },

    /**
     * Input parameters.
     */
    fields: [
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.J5Run"}
    ],

    init: function() {
    }

});