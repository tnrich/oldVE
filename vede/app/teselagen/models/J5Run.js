/**
 * @class Teselagen.models.J5Run
 * Class describing a J5Run.
 * @author Diana Wong
 */
Ext.define("Teselagen.models.J5Run", {
    extend: "Ext.data.Model",

    requires: [
    ],

    statics: {
    },

    /**
     * Input parameters.
     * @param {Teselagen.models.J5Collection[]} binsVector
     * @param {Boolean} j5Ready
     * @param {Boolean} combinatorial
     * @param {Boolean} isCircular
     */
    fields: [
        {
            name: "j5Parameters",
            convert: function(v, record) {
                if (v === undefined || v === null || v === "") {
                    return Ext.create("Teselagen.models.J5Parameters");
                } else {
                    return v;
                }
            }
        },
        {
            name: "downstreamAutomationParameters",
            convert: function(v, record) {
                if (v === undefined || v === null || v === "") {
                    return Ext.create("Teselagen.models.DownstreamAutomationParameters");
                } else {
                    return v;
                }
            }
        },
        {
            name: "j5Results",
            convert: function(v, record) {
                return v || null;
            }
        }
    ],

    associations: [
        {type: "belongsTo", model: "Teselagen.models.DeviceDesign"}
    ],

    init: function() {
    }

});