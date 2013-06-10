/**
 * @class Teselagen.renderer.common.Label
 * Parent class for label classes. Label classes generate labels in the form of
 * text sprites with associated tooltips for a given sequence annotation.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.common.Label", {
    requires: ["Teselagen.bio.util.StringUtil"],

    statics: {
        FONT_SIZE: "6px"
    },

    config: {
        labelSVG: null,
        tooltip: "",
        click: null,
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

        /*
            Line 48 fix: this.StringUtil.trim fails because it used to receive this.labelText() of type Object
        */

        labelString = (typeof(this.labelText()) == "object") ? "" : this.labelText();

        if(!this.labelText() || !this.StringUtil.trim(labelString)) {
            this.setIncludeInView(false);
        }

        this.label = this.labelSVG.append("svg:text")
                     .attr("fill", inData.color || "black")
                     .attr("font-size", this.self.FONT_SIZE)
                     .attr("x", inData.x)
                     .attr("y", inData.y)
                     .text(this.labelText())
                     .on("mousedown", inData.click);


        this.label.append("svg:title")
                  .text(inData.tooltip);
    }
});
