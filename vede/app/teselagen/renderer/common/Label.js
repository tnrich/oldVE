/**
 * @class Teselagen.renderer.common.Label
 * Parent class for label classes. Label classes generate labels in the form of
 * text sprites with associated tooltips for a given sequence annotation.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.common.Label", {
    extend: "Ext.draw.Sprite",

    requires: ["Teselagen.bio.util.StringUtil"],

    config: {
        needsMeasurement: true,
        annotation: null,
        includeInView: true,
    },

    StringUtil: null,

    labelText: function() {
        return "";
    },

    /**
     * @param {Teselagen.bio.sequence.common.Annotation} annotation The
     * annotation to generate a label for.
     * @param {Boolean} includeInView Whether to show the label. Defaults to
     * true.
     */
    constructor: function(inData) {
        this.initConfig(inData);
        this.StringUtil = Teselagen.bio.util.StringUtil;

        this.callParent([Ext.create("Ext.draw.Sprite", {
            type: "text",
            text: this.labelText(),
            fill: inData.color || "black",
            "font-size": "6px",
            x: inData.x,
            y: inData.y
        })]);

        if(!this.labelText() || !this.StringUtil.trim("")) {
            this.setIncludeInView(false);
        }
/*
        if(!this.labelText() || !this.StringUtil.trim(this.labelText())) {
            this.setIncludeInView(false);
        }
*/

    }
});
