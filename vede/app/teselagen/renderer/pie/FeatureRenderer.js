/**
 * @class Teselagen.renderer.pie.FeatureRenderer
 * Class which creates sprites to draw all given features.
 */
Ext.define("Teselagen.renderer.pie.FeatureRenderer", {
    extend: "Teselagen.renderer.pie.FeatureRenderer", 

    statics: {
        DEFAULT_FEATURE_HEIGHT: 10,
        DEFAULT_FEATURES_GAP: 5
    },

    config: {
        features: [],
    },

    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    render: function() {
    },

    applyFeatures: function(pFeatures) {
        this.setNeedsMeasurement(true);
        this.invalidateDisplayList();
    }
});
