/**
 * @class Vede.view.annotate.Caret
 * Selection line for the annotate panel.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of Caret.as)
 */
Ext.define("Vede.view.annotate.Caret", {
    statics: {
        CARET_COLOR: "#000000",
        CARET_WIDTH: 2,
        TIMER_REFRESH_SPEED: "1s", // blink time of the caret, in seconds
        SINGLE_HEIGHT: 20,
        DOUBLE_HEIGHT: 40
    },

    config: {
        position: 0,
        height: 38,
        sequenceAnnotator: null
    },

    caretSVG: null,

    constructor: function(pConfig) {
        this.initConfig(pConfig);
    },

    render: function() {
        d3.selectAll("#caretSVG").remove();
        this.caretSVG = this.sequenceAnnotator.annotateSVG.append("svg:g")
                            .attr("id", "caretSVG");

        var location = this.sequenceAnnotator.bpMetricsByIndex(this.position);
        if(location)
        {
            this.caretSVG.append("svg:path")
                .attr("d", "M" + (location.x - 1) + " " + (location.y + 8) + 
                           "L" + (location.x - 1) + " " + (location.y + this.height + 2))
                .attr("stroke", this.self.CARET_COLOR)
                .attr("stroke-width", this.self.CARET_WIDTH)
                .append("svg:animate")
                .attr("attributeName", "visibility")
                .attr("from", "hidden")
                .attr("to", "visible")
                .attr("dur", this.self.TIMER_REFRESH_SPEED)
                .attr("repeatCount", "indefinite");
        }
    },
 });
