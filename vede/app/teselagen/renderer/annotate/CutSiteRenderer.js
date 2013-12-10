/**
 * @class Teselagen.renderer.annotate.CutSiteRenderer
 * Class which generates and renders SVG for a given cut site.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of CutSiteRenderer.as)
 */
Ext.define("Teselagen.renderer.annotate.CutSiteRenderer", {
    statics: {
        CURVY_LINE_COLOR: "#FF0000",
        CURVY_LINE_HEIGHT: 5,
        CUT_SITE_COLOR: "#625D5D",
        ONE_CUT_COLOR: "#E57676",
        MULTIPLE_CUT_COLOR: "#888888",
        CUTSITE_HEIGHT_OFFSET: 25
    },

    config: {
        sequenceAnnotator: null,
        cutSite: []
    },

    sequenceAnnotationManager: null,

    cutSiteSVG: null,

    constructor: function(inData) {
        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator.sequenceAnnotator;
    },

    render: function() {
        this.cutSiteSVG = this.sequenceAnnotator.annotateSVG.append("svg:g")
                               .attr("class", "cutSiteSVG");

        this.cutSiteSVG.append("svg:pattern")
            .attr("id", "curvyLine")
            .attr("width", 5)
            .attr("height", 5)
            .attr("patternUnits", "userSpaceOnUse")
            .append("svg:path")
            .attr("d", "M 0 0 L 2.5 5 L 5 0")
            .attr("stroke", this.self.CURVY_LINE_COLOR)
            .attr("fill", "none");

        var cutSite = this.cutSite;

        var cutSiteHeight = this.self.CUTSITE_HEIGHT_OFFSET;
        var cutSiteRows = this.sequenceAnnotationManager.RowManager.getCutSiteToRowMap().get(cutSite);

        if(!cutSiteRows) {
            return;
        }

        var seqLen = this.sequenceAnnotationManager.sequenceManager.getSequence().toString().length;
        var rowIndex;
        var startBP;
        var endBP;
        var dsForwardPosition;
        var dsReversePosition;
        var cutSiteX;
        var cutSiteY;
        var currentWidth;
        var currentHeight;
        var addToEnd;

        // Iterate over every row the cut site is present in.
        Ext.each(cutSiteRows, function(rowNumber) {
            var row = this.sequenceAnnotationManager.RowManager.getRows()[rowNumber];
            alignmentRowIndex = row.rowData.cutSitesAlignment.get(cutSite);


            startBP = 0;
            endBP = 0;
            addToEnd = false;

            if(cutSite.getStart() < cutSite.getEnd()) { // non-circular
                if(cutSite.getStart() < row.rowData.getStart() &&
                   cutSite.getEnd() <= row.rowData.getStart()) {
                    return true;
                } else if(cutSite.getStart() > row.rowData.getEnd() &&
                          cutSite.getEnd() > row.rowData.getEnd()) {
                    return true;
                } else {
                    if(cutSite.getStart() < row.rowData.getStart()) {
                        startBP = row.rowData.getStart();
                    } else {
                        startBP = cutSite.getStart();
                    }

                    if(cutSite.getEnd() - 1 < row.rowData.getEnd()) {
                        endBP = cutSite.getEnd();
                    } else {
                        endBP = row.rowData.getEnd();
                        addToEnd = true;
                    }
                }
            } else { // circular
                /* |----------------------------------------------------------|
                    *  FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|           */
                if(cutSite.getEnd() >= row.rowData.getStart() &&
                   cutSite.getEnd() <= row.rowData.getEnd()) {
                    endBP = cutSite.getEnd();
                }
                else if(row.rowData.getEnd() >= seqLen) {
                    endBP = seqLen;
                }
                /* |-------------------------------------------------------|
                *  FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
                else {
                    endBP = row.rowData.getEnd();
                }

                /* |-------------------------------------------------------|
                *                                    |FFFFFFFFFFFFFFFFFFFFF  */
                if(cutSite.getStart() >= row.rowData.getStart() &&
                   cutSite.getStart() <= row.rowData.getEnd()) {
                    startBP = cutSite.getStart();
                }
                /* |-------------------------------------------------------|
                *   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
                else {
                    startBP = row.rowData.getStart();
                }
            }

            if(cutSite.getStrand() == 1) {
                dsForwardPosition = cutSite.getStart() +
                    cutSite.getRestrictionEnzyme().getDsForward();
                dsReversePosition = cutSite.getStart() +
                    cutSite.getRestrictionEnzyme().getDsReverse();
            } else {
                dsForwardPosition = cutSite.getEnd() -
                    cutSite.getRestrictionEnzyme().getDsForward();
                dsReversePosition = cutSite.getEnd() -
                    cutSite.getRestrictionEnzyme().getDsReverse();
            }

            if(dsForwardPosition >= seqLen) {
                dsForwardPosition -= seqLen;
            }

            if(dsReversePosition >= seqLen) {
                dsReversePosition -= seqLen;
            }

            if(dsForwardPosition < 0) {
                dsForwardPosition += seqLen;
            }

            if(dsReversePosition < 0) {
                dsReversePosition += seqLen;
            }

            if(dsForwardPosition <= row.rowData.getStart() ||
               dsForwardPosition >= row.rowData.getEnd()) {
                dsForwardPosition = -1;
            }

            if(dsReversePosition <= row.rowData.getStart() ||
               dsReversePosition >= row.rowData.getEnd()) {
                dsReversePosition = -1;
            }

            cutSiteX = this.sequenceAnnotator.bpMetricsByIndex(startBP).x;
            cutSiteY = row.metrics.y + alignmentRowIndex * cutSiteHeight;

            currentWidth = this.sequenceAnnotator.bpMetricsByIndex(endBP).x -
                cutSiteX - 4;

            if(addToEnd) {
                currentWidth += this.sequenceAnnotator.self.CHAR_WIDTH;
            }

            currentHeight = cutSiteHeight;

            var oneCut = cutSite.getNumCuts() == 1;

            this.drawName(cutSiteX, cutSiteY + cutSiteHeight,
                          cutSite.getRestrictionEnzyme().getName(),
                          oneCut);

            if (startBP <= endBP) {
                this.drawCurvyLine(cutSiteX, cutSiteY + cutSiteHeight,
                                   currentWidth - 2);
            } else if (endBP >= row.rowData.getStart()){
                //this.drawCurvyLine(cutSiteX + 2, cutSiteY, currentWidth - 2);
                /* Case when start and end are in the same row
                * |----------------------------------------------------|
                *  FFFFFFFFFFF|                     |FFFFFFFFFFFFFFFFFF  */
                var bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.rowData.getStart());

                var bpEndMetrics1 =
                    this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, seqLen));

                var bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(
                    Math.min(row.rowData.end, seqLen - 1));

                var cutSiteX1 = bpStartMetrics1.x;
                var cutSiteY1 = row.metrics.y + alignmentRowIndex * cutSiteHeight;

                var cutSiteX2 = bpStartMetrics2.x;
                var cutSiteY2 = cutSiteY1;

                var currentWidth1 = bpEndMetrics1.x - bpStartMetrics1.x +
                    this.sequenceAnnotator.self.CHAR_WIDTH;
                var currentWidth2 = bpEndMetrics2.x - bpStartMetrics2.x +
                    this.sequenceAnnotator.self.CHAR_WIDTH;

                this.drawCurvyLine(cutSiteX1 + 2, cutSiteY1,
                                   currentWidth1 - 2);
                this.drawCurvyLine(cutSiteX2 + 2, cutSiteY2,
                                   currentWidth2 - 2);

                dsReversePosition = cutSite.getEnd() - cutSite.getRestrictionEnzyme().getDsReverse() + 
                    Math.min(row.rowData.end, seqLen) - row.rowData.start;
            }

            if(cutSite.getStrand() !== 1) {
                var temp = dsForwardPosition;

                dsForwardPosition = dsReversePosition;
                dsReversePosition = temp;
            }

            if(dsForwardPosition != -1) {
                var dsForwardMetrics = this.sequenceAnnotator.bpMetricsByIndex(dsForwardPosition);

                var ds1X = dsForwardMetrics.x - 2;
                var ds1Y = cutSiteY + cutSiteHeight;
                this.drawDsForwardPosition(ds1X, ds1Y);
            }

            if(dsReversePosition != -1) {
                var dsReverseMetrics = this.sequenceAnnotator.bpMetricsByIndex(dsReversePosition);

                var ds2X = dsReverseMetrics.x - 2;
                var ds2Y = cutSiteY + cutSiteHeight + 6;
                this.drawDsReversePosition(ds2X, ds2Y);
            }

            this.addToolTip(cutSite);
            this.addClickListener(cutSite);
        }, this);
    },

    drawName: function(x, y, name, oneCut) {
        var color;
        if(oneCut) {
            color = this.self.ONE_CUT_COLOR;
        } else {
            color = this.self.MULTIPLE_CUT_COLOR;
        }

        this.cutSiteSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y - 4) // -4 to move it off the curvy line a bit.
            .style("fill", color)
            .text(name);
    },

    drawCurvyLine: function(x, y, width) {
        this.cutSiteSVG.append("svg:rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", this.self.CURVY_LINE_HEIGHT)
            .attr("fill", "url(#curvyLine)");
    },

    drawDsForwardPosition: function(x, y) {
        this.cutSiteSVG.append("svg:path")
            .attr("d", "M" + x + " " + y + "L" + (x - 3) + " " + (y - 4) +
                  "L" + (x + 3) + " " + (y - 4))
            .attr("fill", this.self.CUT_SITE_COLOR);
    },

    drawDsReversePosition: function(x, y) {
        this.cutSiteSVG.append("svg:path")
            .attr("d", "M" + x + " " + y + "L" + (x - 3) + " " + (y + 4) +
                  "L" + (x + 3) + " " + (y + 4))
            .attr("fill", this.self.CUT_SITE_COLOR);
    },

    addToolTip: function(cutSite) {
        var complement = ", complement";
        if(cutSite.getStrand() == 1) {
            complement = "";
        }

        var toolTip = cutSite.getRestrictionEnzyme().getName() + ": " +
                      (cutSite.getStart() + 1) + ".." + (cutSite.getEnd()) +
                      complement + ", cuts " + cutSite.getNumCuts() + " times";

        this.cutSiteSVG.append("svg:title")
            .text(toolTip);
    },

    addClickListener: function(cutSite) {
        this.cutSiteSVG.on("mousedown", function() {
            Vede.application.fireEvent("AnnotatePanelAnnotationClicked",
                                       cutSite.getStart(), cutSite.getEnd());
        });
    }
});
