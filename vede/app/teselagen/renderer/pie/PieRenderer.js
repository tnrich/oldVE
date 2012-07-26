Ext.define("Teselagen.renderer.pie.PieRenderer", {
    extend: "Teselagen.renderer.common.AnnotationRenderer",

    statics: {
        FRAME_COLOR: "#606060"
    },

    config: {
        sequenceManager: null,
        center: 0,
        railRadius: 0,
        needsMeasurement: true
    },

    GraphicUtils: null,
    StrandType: null,

    constructor: function(inData) {
        this.callParent(arguments);
        this.initConfig(inData);

        this.GraphicUtils = Teselagen.utils.GraphicUtils;
        this.StrandType = Teselagen.bio.sequence.common.StrandType;
    },

    applySequenceManager: function(pSeqMan) {
        this.setNeedsMeasurement(true);

        return pSeqMan;
    },

    applyCenter: function(pCenter) {
        this.setNeedsMeasurement(true);

        return pCenter;
    },

    applyRailRadius: function(pRailRadius) {
        this.setNeedsMeasurement(true);

        return pRailRadius;
    }
});
