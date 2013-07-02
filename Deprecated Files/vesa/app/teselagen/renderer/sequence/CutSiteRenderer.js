Ext.define("Teselagen.renderer.sequence.CutSiteRenderer", {
    statics: {
        CURVY_LINE_COLOR: "#FF0000",
        CUT_SITE_COLOR: "#625D5D",
        ONE_CUT_COLOR: "#E57676",
        MULTIPLE_CUT_COLOR: "#888888"
    },

    config: {
        contentHolder: null,
        cutSites: []
    },

    annotateSVG: null,
    cutSitesSVG: null,

    constructor: function(inData) {
        this.initConfig(inData);
        this.annotateSVG = d3.select("#AnnotatePanel-body").append("svg:svg");
        this.cutSitesSVG = this.annotateSVG.append("svg:g")
                               .attr("id", "cutSitesSVG");
    },

    update: function() {
        d3.select("#cutSitesSVG").remove();
        this.cutSitesSVG = this.annotateSVG.append("svg:g")
                               .attr("id", "cutSitesSVG");

        this.cutSitesSVG.append("svg:pattern")
            .attr("id", "curvyLine")
            .attr("width", 3)
            .attr("height", 4);

        Ext.each(this.cutSites, function(cutSite) {
            var cutSiteHeight = 8;//this.contentHolder.cutSiteTextRenderer.textHeight - 2 + 3;
            var cutSiteRows = this.contentHolder.RowManager.cutSiteToRowMap[cutSite];

            if(!cutSiteRows) {
                return;
            }

            var seqLen = this.contentHolder.sequenceManager.getSequence().length;
            var rowIndex;
            var startBP;
            var endBP;
            var dsForwardPosition;
            var dsReversePosition;
            var cutSiteX;
            var cutSiteY;
            var currentWidth;
            var currentHeight;

            Ext.each(cutSiteRows, function(row) {
                rowIndex = -1;
                
                Ext.each(row.rowData.cutSitesAlignment, function(rowCutSites, index) {
                    Ext.each(rowCutSites, function(site) {
                        if(site == cutSite) {
                            rowIndex = row.rowData.cutSitesAlignment.length - index - 1;
                            return false;
                        }
                    });

                    if(rowIndex != -1) {
                        return false;
                    }
                });

                startBP = 0;
                endBP = 0;

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
                        }
                    }
                } else { // circular
                    /* |----------------------------------------------------------|
                        *  FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF|           */
                    if(cutSite.getEnd() >= row.rowData.getStart() && 
                       cutSite.getEnd() <= row.rowData.getEnd()) {
                        endBP = cutSite.getEnd() - 1;
                    }
                    else if(row.rowData.getEnd() >= seqLen) {
                        endBP = seqLen - 1;
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
                    dsReversePosition = cutSite.getEnd() + 
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
                    dsReversePosition -= seqLen;
                }

                if(dsForwardPosition >= row.rowData.getStart() &&
                   dsForwardPosition <= row.rowData.getEnd()) {
                    dsForwardPosition = -1;
                }

                if(dsReversePosition >= row.rowData.getStart() &&
                   dsReversePosition <= row.rowData.getEnd()) {
                    dsReversePosition = -1;
                }

                cutSiteX = this.contentHolder.bpMetricsByIndex(startBP).x;
                cutSiteY = row.metrics.y + alignmentRowIndex * cutSiteHeight;

                currentWidth = this.contentHolder.bpMetricsByIndex(endBP).x - 
                    cutSiteX + this.contentHolder.sequenceSymbolRenderer.textWidth;
                currentHeight = cutSiteHeight;

                var matrix = {};
                matrix.tx += cutSiteX;
                matrix.ty += cutSiteY;

                var oneCut = cutSite.getNumCuts == 1;

                this.drawName(cutSiteX, cutSiteY, 
                              cutSite.getRestrictionEnzyme().getName(),
                              oneCut);

                if (startBP <= endBP) {
                    this.drawCurvyLine(cutSiteX + 2, cutSiteY + cutSiteHeight,
                                       currentWidth - 2);
                } else if (endBP >= row.rowData.getStart()){
                    this.drawCurvyLine(cutSiteX + 2, cutSiteY, currentWidth - 2,
                                       cutSiteHeight);
                    /* Case when start and end are in the same row
                    * |----------------------------------------------------|
                    *  FFFFFFFFFFF|                     |FFFFFFFFFFFFFFFFFF  */
                    var bpStartMetrics1 = this.contentHolder.bpMetricsByIndex(row.rowData.getStart());

                    var bpEndMetrics1 = 
                        this.contentHolder.bpMetricsByIndex(Math.min(endBP, 
                        this.contentHolder.sequenceManager.sequence.length - 1));

                    var bpStartMetrics2 = this.contentHolder.bpMetricsByIndex(startBP);
                    var bpEndMetrics2 = this.contentHolder.bpMetricsByIndex(
                        Math.min(row.rowData.end, 
                        this.contentHolder.sequenceManager.sequence.length - 1));

                    var cutSiteX1 = bpStartMetrics1.x;
                    var cutSiteY1 = row.metrics.y + alignmentRowIndex * cutSiteHeight;
                    
                    var cutSiteX2 = bpStartMetrics2.x;
                    var cutSiteY2 = cutSiteY1;
                    
                    var currentWidth1 = bpEndMetrics1.x - bpStartMetrics1.x + 
                        this.contentHolder.sequenceSymbolRenderer.textWidth;
                    var currentWidth2 = bpEndMetrics2.x - bpStartMetrics2.x + 
                        this.contentHolder.sequenceSymbolRenderer.textWidth;

                    this.drawCurvyLine(cutSiteX1 + 2, cutSiteY1,
                                       currentWidth1 - 2, cutSiteHeight);
                    this.drawCurvyLine(cutSiteX2 + 2, cutSiteY2,
                                       currentWidth2 - 2, cutSiteHeight);                   
               }
                
                if(dsForwardPosition != -1) {
                    var dsForwardMetrics = this.contentHolder.bpMetricsByIndex(dsForwardPosition);
                    
                    var ds1X = dsForwardMetrics.x + 2;
                    var ds1Y = cutSiteY + cutSiteBitMap.height;
                    this.drawDsForwardPosition(ds1X, ds1Y);
                } 
                
                if(dsReversePosition != -1) {
                    var dsReverseMetrics = this.contentHolder.bpMetricsByIndex(dsReversePosition);
                    
                    var ds2X = dsReverseMetrics.x + 2;
                    var ds2Y = cutSiteY + cutSiteBitMap.height + 3;
                    this.drawDsReversePosition(ds2X, ds2Y);
                } 
            }, this);
        }, this);
    },

    drawName: function(x, y, name, oneCut) {
        var color;
        if(oneCut) {
            color = this.self.ONE_CUT_COLOR;
        } else {
            color = this.self.MULTIPLE_CUT_COLOR;
        }

        this.cutSitesSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y)
            .attr("font-color", color)
            .text(name);
    },

    drawCurvyLine: function(x, y, width, height) {
        this.cutSitesSVG.append("svg:rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "url(#curvyLine)");
    },

    drawDsForwardPosition: function(x, y) {
        this.cutSitesSVG.append("svg:path")
            .attr("d", "M" + x + " " + y + "L" + (x - 3) + " " + (y - 4) + 
                  "L" + (x + 3) + " " + (y - 4))
            .attr("fill", this.self.CUT_SITE_COLOR);
    },

    drawDsReversePosition: function(x, y) {
        this.cutSitesSVG.append("svg:path")
            .attr("d", "M" + x + " " + y + "L" + (x - 3) + " " + (y + 4) + 
                  "L" + (x + 3) + " " + (y + 4))
            .attr("fill", this.self.CUT_SITE_COLOR);
    }
});
