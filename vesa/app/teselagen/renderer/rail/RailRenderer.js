/**
 * @class Teselagen.renderer.rail.RailRenderer
 * Parent class of all pie renderers. Stores the center and rail radius of the 
 * pie.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.renderer.rail.RailRenderer", {
    extend: "Teselagen.renderer.common.AnnotationRenderer",

    requires: "Teselagen.utils.GraphicUtils",

    config: {
        references: null,
        railWidth: 0,
    },

    GraphicUtils: null,
    StrandType: null,

    /**
     * @param {Teselagen.bio.util.Point} center The center point of the pie.
     * @param {Int} railRadius The radius of the pie.
     */
    constructor: function(inData) {
        this.callParent(arguments);
        this.initConfig(inData);

        this.GraphicUtils = Teselagen.utils.GraphicUtils;
    },

    applyRailRadius: function(pRailRadius) {
        this.setNeedsMeasurement(true);

        return pRailRadius;
    }
});
