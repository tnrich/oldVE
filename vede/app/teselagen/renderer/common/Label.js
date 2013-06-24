/**
 * @class Teselagen.renderer.common.Label
 * Parent class for label classes. Label classes generate labels in the form of
 * text sprites with associated tooltips for a given sequence annotation.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.common.Label", {
    requires: ["Teselagen.bio.util.StringUtil"],

    inheritableStatics: {
        FONT_FAMILY: "Maven Pro",
        FONT_SIZE: "8px",
        FILL: "#DDDDDD"
    },

    config: {
        labelSVG: null,
        tooltip: "",
        click: null,
        rightClick: null,
        needsMeasurement: true,
        annotation: null,
        includeInView: true,
        x: 0,
        y: 0
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
                     .attr("fill", inData.color || "#333234")
                     .attr("x", inData.x)
                     .attr("y", inData.y)
                     .text(this.labelText())
                     .attr("font-family", this.self.FONT_FAMILY)
                     .attr("font-size", this.self.FONT_SIZE)
                     .on("mousedown", inData.click)
                     .on("contextmenu", inData.rightClick);


        this.label.append("svg:title")
                  .text(inData.tooltip);
    }
});
