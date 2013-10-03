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
        this.position = pConfig.position || 0;
        this.height = pConfig.height || 38;
        this.initConfig(pConfig);
    },

    applyPosition: function(pPosition) {
        if(this.getSequenceAnnotator().getSequenceAnnotator().getSequenceManager()) {
            var location = this.getSequenceAnnotator().bpMetricsByIndex(pPosition);
            var path = "M" + (location.x - 1) + " " + (location.y + 8) + 
                       "L" + (location.x - 1) + " " + (location.y + this.height + 2);

            if(!this.caretSVG) {
                this.caretSVG = this.sequenceAnnotator.annotateSVG.append("svg:path")
                                    .attr("class", "caretSVG")
                                    .attr("d", path)
                                    .attr("stroke", this.self.CARET_COLOR)
                                    .attr("stroke-width", this.self.CARET_WIDTH)
                                    .style("pointer-events", "none");

                if(!Ext.isGecko) {
                    this.caretSVG.append("svg:animate")
                                        .attr("attributeName", "visibility")
                                        .attr("from", "hidden")
                                        .attr("to", "visible")
                                        .attr("dur", this.self.TIMER_REFRESH_SPEED)
                                        .attr("repeatCount", "indefinite")
                                        .style("pointer-events", "none");
                }
            } else {
                this.caretSVG.attr("d", path);
            }
        }
        return pPosition;
    },

    applyHeight: function(pHeight) {
        if(this.getSequenceAnnotator().getSequenceAnnotator().getSequenceManager()) {
            var location = this.getSequenceAnnotator().bpMetricsByIndex(this.position);
            var path = "M" + (location.x - 1) + " " + (location.y + 8) + 
                       "L" + (location.x - 1) + " " + (location.y + pHeight + 2);

            if(!this.caretSVG) {
                this.caretSVG = this.sequenceAnnotator.annotateSVG.append("svg:path")
                                    .attr("class", "caretSVG")
                                    .style("pointer-events", "none")
                                    .attr("d", path)
                                    .attr("stroke", this.self.CARET_COLOR)
                                    .attr("stroke-width", this.self.CARET_WIDTH);

                if(!Ext.isGecko) {
                    this.caretSVG.append("svg:animate")
                                        .attr("attributeName", "visibility")
                                        .attr("from", "hidden")
                                        .attr("to", "visible")
                                        .attr("dur", this.self.TIMER_REFRESH_SPEED)
                                        .attr("repeatCount", "indefinite")
                                        .style("pointer-events", "none");
                }
            } else {
                this.caretSVG.attr("d", path);
            }
        }

        return pHeight;
    }
 });
