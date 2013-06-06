        /**
 * @class Teselagen.renderer.annotate.SelectionLayer
 * Class which handles generating and rendering the blue selection area.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SelectionLayer.as)
 */
Ext.define("Teselagen.renderer.annotate.SelectionLayer", {
    requires: ["Teselagen.event.SelectionLayerEvent"],

    statics: {
        SELECTION_COLOR: "#0099FF",
        SELECTION_TRANSPARENCY: 0.3,
        HANDLE_WIDTH: 9,
        HANDLE_HEIGHT: 16
    },

    config: {
        sequenceManager: null,
        sequenceAnnotator: null,
    },

    SelectionLayerEvent: null,

    sequenceAnnotationManager: null,

    start: -1,
    end: -1,

    selected: false,
    selecting: false,

    selectionSVG: null,
    leftHandleSVG: null,
    rightHandleSVG: null,

    constructor: function(inData) {
        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator.sequenceAnnotator;

        this.SelectionLayerEvent = Teselagen.event.SelectionLayerEvent;
    },

    select: function(fromIndex, toIndex) {
        if(fromIndex === this.start && toIndex === this.end &&
           this.start !== -1 && this.end !== -1 || fromIndex == toIndex) {
            return;
        }

        this.selected = false;

        d3.selectAll("#selectionSVG").remove();
        this.selectionSVG = d3.select("#annotateSVG").append("svg:g")
            .attr("id", "selectionSVG");

        if(fromIndex > toIndex) {
            this.drawSelection(0, toIndex);
            this.drawSelection(fromIndex, 
                               this.sequenceManager.getSequence().toString().length);
        } else {
            this.drawSelection(fromIndex, toIndex);
        }

        this.start = fromIndex;
        this.end = toIndex;

        this.selected = true;
    },

    deselect: function() {
        this.start = -1;
        this.end = -1;
        this.selected = false;
        this.selecting = false;

        d3.selectAll("#selectionSVG").remove();

        this.hideHandles();
    },

    refresh: function() {
        var selectionStart;
        var selectionEnd;

        if(this.start > -1 && this.end > -1) {
            selectionStart = this.start;
            selectionEnd = this.end;

            this.deselect();
            this.select(selectionStart, selectionEnd);
        }
    },

    startSelecting: function() {
        this.selecting = true;
        this.hideHandles();
    },

    endSelecting: function() {
        this.selecting = false;
    },

    onMouseover: function() {
        if(!this.selecting && this.selected) {
            //this.showHandles();
        }
    },

    onMouseout: function(event) {
        if(!this.selecting && this.selected) {
            //this.hideHandles();
        }
    },

    /**
     * Shows handles. At the moment I've decided not to use handles as the event
     * handling was glitchy with them, but I'll leave this function in case we
     * re-enable them at some point.
     * 
     * Currently the selection can be altered by dragging its edges.
     */
    showHandles: function() {
        var leftMetrics = this.sequenceAnnotator.bpMetricsByIndex(this.start);
        var rightMetrics = this.sequenceAnnotator.bpMetricsByIndex(this.end);
        var startRow = this.sequenceAnnotator.rowByBpIndex(this.start);
        var endRow = this.sequenceAnnotator.rowByBpIndex(this.end);

        var that = this;

        this.leftHandleSVG = d3.select("#selectionSVG").append("svg:image")
            .attr("id", "leftHandleSVG")
            .attr("xlink:href", 
                  "app/teselagen/renderer/annotate/assets/handle.png")
            .attr("width", this.self.HANDLE_WIDTH)
            .attr("height", this.self.HANDLE_HEIGHT)
            .attr("x", leftMetrics.x - this.self.HANDLE_WIDTH / 2)
            .attr("y", leftMetrics.y + startRow.sequenceMetrics.height / 2 - 
                  this.self.HANDLE_HEIGHT / 2);

        this.rightHandleSVG = d3.select("#selectionSVG").append("svg:image")
            .attr("id", "rightHandleSVG")
            .attr("xlink:href", 
                  "app/teselagen/renderer/annotate/assets/handle.png")
            .attr("width", this.self.HANDLE_WIDTH)
            .attr("height", this.self.HANDLE_HEIGHT)
            .attr("x", rightMetrics.x - this.self.HANDLE_WIDTH / 2)
            .attr("y", rightMetrics.y + endRow.sequenceMetrics.height / 2 -
                  this.self.HANDLE_HEIGHT / 2);
    },

    hideHandles: function() {
        d3.selectAll("#leftHandleSVG").remove();
        d3.selectAll("#rightHandleSVG").remove();
    },

    drawSelection: function(fromIndex, toIndex) {
        var startRow = this.sequenceAnnotator.rowByBpIndex(fromIndex);
        var endRow = this.sequenceAnnotator.rowByBpIndex(toIndex);

        if(!startRow || !endRow) {
            this.deselect();
            return;
        }

        if(startRow.getIndex() === endRow.getIndex()) {
            this.drawRowSelectionRect(fromIndex, toIndex);
        } else if(startRow.getIndex() + 1 <= endRow.getIndex()) {
            this.drawRowSelectionRect(fromIndex, startRow.rowData.getEnd(),
                                      true);

            for(var i = startRow.getIndex() + 1; i < endRow.getIndex(); i++) {
                var rowData = 
                    this.sequenceAnnotationManager.RowManager.rows[i].rowData;

                this.drawRowSelectionRect(rowData.getStart(), rowData.getEnd(),
                                          true);
            }

            this.drawRowSelectionRect(endRow.rowData.getStart(), toIndex);
        }

        // Create handles to adjust selection. Instead of using the image SVGs,
        // which disappear when mouseover'd, we add invisible rectangles to the
        // ends of the selection box.
        var that = this;
        var startMetrics = this.sequenceAnnotator.bpMetricsByIndex(fromIndex);
        d3.select("#selectionSVG").append("svg:rect")
            .attr("id", "selectionRectangle")
            .attr("x", startMetrics.x - 10)
            .attr("y", startMetrics.y)
            .attr("width", 20)
            .attr("height", this.sequenceAnnotationManager.caret.height)
            .attr("fill-opacity", 0)
            .on("mousedown", function(e) {
                // For some reason, changing the cursor is extremely slow.
                //Ext.getBody().setStyle("cursor", "col-resize");
                
                Vede.application.fireEvent(
                    that.SelectionLayerEvent.HANDLE_CLICKED, "left");
            });

        var endMetrics = this.sequenceAnnotator.bpMetricsByIndex(toIndex);
        d3.select("#selectionSVG").append("svg:rect")
            .attr("id", "selectionRectangle")
            .attr("x", endMetrics.x - 10)
            .attr("y", endMetrics.y)
            .attr("width", 20)
            .attr("height", this.sequenceAnnotationManager.caret.height)
            .attr("fill-opacity", 0)
            .on("mousedown", function(e) {
                // For some reason, changing the cursor is extremely slow.
                //Ext.getBody().setStyle("cursor", "col-resize");

                Vede.application.fireEvent(
                    that.SelectionLayerEvent.HANDLE_CLICKED, "right");
            });
    },

    drawRowSelectionRect: function(startIndex, endIndex, lastBaseInRow) {
        var row = this.sequenceAnnotator.rowByBpIndex(startIndex);

        var startMetrics = this.sequenceAnnotator.bpMetricsByIndex(startIndex);
        var endMetrics = this.sequenceAnnotator.bpMetricsByIndex(endIndex);

        // We need to add a character's width in order to highlight the last base.
        if(lastBaseInRow) {
            endMetrics.x += this.sequenceAnnotator.self.CHAR_WIDTH;
        }

        d3.select("#selectionSVG").append("svg:rect")
            .attr("x", startMetrics.x)
            .attr("y", startMetrics.y + 4)
            .attr("width", endMetrics.x - startMetrics.x)
            .attr("height", this.sequenceAnnotationManager.caret.height - 4)
            .attr("fill", this.self.SELECTION_COLOR)
            .attr("fill-opacity", this.self.SELECTION_TRANSPARENCY);

    }
});
