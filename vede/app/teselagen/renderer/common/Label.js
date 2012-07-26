/**
 * @class Teselagen.renderer.common.Label
 * Parent class for label classes. Label classes generate labels in the form of
 * text sprites with associated tooltips for a given sequence annotation.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.common.Label", {
    requires: ["Teselagen.bio.util.StringUtil"],

    config: {
        needsMeasurement: true,
        annotation: null,
        includeInView: true,
    },

    StringUtil: null,

    /**
     * @param {Teselagen.bio.sequence.common.Annotation} annotation The
     * annotation to generate a label for.
     * @param {Boolean} includeInView Whether to show the label. Defaults to
     * true. 
     */
    constructor: function(inData) {
        this.initConfig(inData);

        this.StringUtil = Teselagen.bio.util.StringUtil;
    },

    tipText: function() {
        return "";
    },

    labelText: function() {
        return "";
    },

    /**
     * Returns a text sprite holding the annotation label and a tooltip with
     * more information.
     * @return {Ext.draw.Sprite} The text sprite (without any position data).
     */
    getSprite: function() {
        var sprite = Ext.create("Ext.draw.Sprite", {
            type: "text",
            text: this.labelText(),
            toolTip: this.tipText(),
            listeners: {
                render: function(me) {
                    Ext.QuickTip.register({
                        target: me.el,
                        text: me.toolTip
                    });
                }
            }
        });

        return sprite;
    }
});
