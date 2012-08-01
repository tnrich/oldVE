Ext.define("Teselagen.renderer.common.AnnotationRenderer", {
    requires: ["Teselagen.renderer.common.Alignment"],

    config: {
        needsMeasurement: true
    },

    Alignment: null,

    constructor: function(inData) {
        this.initConfig(inData);
        this.Alignment = Teselagen.renderer.common.Alignment;
    },

    addToolTip: function(sprite, tooltip) {
        sprite.tooltip = tooltip;
        sprite.on("render", function(me) {
            Ext.tip.QuickTipManager.register({
                target: me.el,
                text: me.tooltip
            });
        });
    }
});
