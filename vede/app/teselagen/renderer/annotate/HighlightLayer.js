/**
 * @class Teselagen.renderer.annotate.HighlightLayer
 * Class which handles generating and rendering highlighted search matches.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.renderer.annotate.HighlightLayer", {
    statics: {
        HIGHLIGHT_COLOR: "#009900",
        HIGHLIGHT_TRANSPARENCY: 0.3,
    },

    config: {
        sequenceManager: null,
        sequenceAnnotator: null
    },

    highlightSVG: null,

    sequenceAnnotationManager: null,

    constructor: function(inData) {
        this.initConfig(inData);

        this.sequenceAnnotationManager = this.sequenceAnnotator.sequenceAnnotator;
    },

    addHighlight: function(fromIndex, toIndex) {
        if(fromIndex < 0 || toIndex < 0) {
            return;
        }

        if(!this.highlightSVG) {
            this.highlightSVG = d3.select("#annotateSVG").append("svg:g")
                .attr("id", "highlightSVG");
        }

        if(fromIndex > toIndex) {
            this.drawHighlight(0, toIndex);
            this.drawHighlight(fromIndex,
                               this.sequenceManager.getSequence().toString().length);
        } else {
            this.drawHighlight(fromIndex, toIndex);
        }
    },

    addAllHighlights: function(indices) {
        Ext.each(indices, function(index) {
            this.addHighlight(index.start, index.end);
        }, this);
    },

    clearHighlights: function() {
        if(this.highlightSVG) {
            d3.selectAll("#highlightSVG").remove();
            this.highlightSVG = null;
        }
    },

    drawHighlight: function(fromIndex, toIndex) {
        var startRow = this.sequenceAnnotator.rowByBpIndex(fromIndex);
        var endRow = this.sequenceAnnotator.rowByBpIndex(toIndex);

        if(startRow.getIndex() === endRow.getIndex()) {
            this.createHighlightSVG(fromIndex, toIndex);
        } else if(startRow.getIndex() + 1 <= endRow.getIndex()) {
            this.createHighlightSVG(fromIndex, startRow.rowData.getEnd(), true);

            for(var i = startRow.getIndex() + 1; i < endRow.getIndex(); i++) {
                var rowData =
                    this.sequenceAnnotationManager.RowManager.rows[i].rowData;

                this.createHighlightSVG(rowData.getStart(), rowData.getEnd(), true);
            }

            this.createHighlightSVG(endRow.rowData.getStart(), toIndex);
        }
    },

    createHighlightSVG: function(startIndex, endIndex, lastBaseInRow) {
        var row = this.sequenceAnnotator.rowByBpIndex(startIndex);

        var startMetrics = this.sequenceAnnotator.bpMetricsByIndex(startIndex);
        var endMetrics = this.sequenceAnnotator.bpMetricsByIndex(endIndex);

        // We need to add a character's width in order to highlight the last base.
        if(lastBaseInRow) {
            endMetrics.x += this.sequenceAnnotator.self.CHAR_WIDTH;
        }

        d3.select("#highlightSVG").append("svg:rect")
            .attr("x", startMetrics.x)
            .attr("y", startMetrics.y + 4)
            .attr("width", endMetrics.x - startMetrics.x)
            .attr("height", this.sequenceAnnotationManager.caret.height - 4)
            .attr("fill", this.self.HIGHLIGHT_COLOR)
            .attr("fill-opacity", this.self.HIGHLIGHT_TRANSPARENCY);
    }
});
