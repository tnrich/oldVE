Ext.define("Teselagen.renderer.AnnotationRenderer", {
    extend: "Teselagen.renderer.common.AnnotationRenderer",

    statics: {
        FRAME_COLOR: "#606060"
    },

    config: {
        sequenceManager: null,
        center: 0,
        railRadius: 0
    },

    GraphicUtils: null,

    constructor: function(inData) {
        this.initConfig(inData);

        this.GraphicUtils = Teselagen.utils.GraphicUtils;
    },

    applySequenceManager: function(pSeqMan) {
        this.setNeedsMeasurement(true);
        this.invalidateDisplayList();

        return pSeqMan;
    },

    applyCenter: function(pCenter) {
        this.setNeedsMeasurement(true);
        this.invalidateDisplayList();

        return pCenter;
    },

    applyRailRadius: function(pRailRadius) {
        this.setNeedsMeasurement(true);
        this.invalidateDisplaylist();

        return pRailRadius;
    }
});
