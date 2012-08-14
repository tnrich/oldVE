Ext.define("Teselagen.renderer.annotate.ORFRenderer", {
    statics: {
        ORF_COLOR: ["#FF0000", "#31B440", "#3366CC"],
        ORF_STROKE_WIDTH: 2
    },

    config: {
        sequenceAnnotator: null,
        orf: null,
    },

    constructor: function(inData) {
        this.initConfig(inData);
    },

    render: function() {
        this.orfSVG = this.sequenceAnnotator.annotateSVG.append("svg:g")
                           .attr("id", "orfSVG");

        var orf = this.orf;
        var orfRows = this.sequenceAnnotator.sequenceAnnotator.RowManager.getOrfToRowMap().get(orf);

        if(!orfRows) {
            return;
        }

        var seqLen = this.sequenceAnnotator.sequenceAnnotator.sequenceManager.getSequence().toString().length;

        var alignmentRowIndex;
        var startBP;
        var endBP;
        var upShift;
        Ext.each(orfRows, function(row) {
            alignmentRowIndex = -1;
            var row = this.sequenceAnnotator.sequenceAnnotator.RowManager.getRows()[row];

            Ext.each(row.getRowData().orfAlignment.getKeys(), function(rowOrfs, index) {
                Ext.each(rowOrfs, function(rowOrf) {
                    if(rowOrf == orf) {
                        alignmentRowIndex = index;
                        return false;
                    }
                });

                if(alignmentRowIndex != -1) {
                    return false;
                }
            });

            if(orf.getStart() > orf.getEnd()) { // circular case
					/* |---------------------------------------------------|
					*  FFFFFFFFFFFFFFFFFFFFFFF|                              */
					if(orf.getEnd() >= row.rowData.getStart() && 
                       orf.getEnd() <= row.rowData.getEnd()) {
						endBP = orf.getEnd() - 1;
					}
					else if(row.rowData.getEnd() >= seqLen) {
						endBP = seqLen - 1;
					}
					/* |---------------------------------------------------|
					*  FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
					else {
						endBP = row.rowData.getEnd();
					} 
					
					/* |---------------------------------------------------|
					*                    |FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
					if(orf.getStart() >= row.rowData.getStart() && 
                       orf.getStart() <= row.rowData.getEnd()) {
						startBP = orf.getStart();
					}
					/* |---------------------------------------------------|
					*   FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF  */
					else {
						startBP = row.rowData.getStart();
					}
				} else {
                    if(orf.getStart() < row.rowData.getStart()) {
                        startBP = row.rowData.getStart();
                    } else {
                        startBP = orf.getStart();
                    }

                    if(orf.getEnd() < row.rowData.getEnd()) {
                        endBP = orf.getEnd() - 1;
                    } else {
                        endBP = row.rowData.getEnd();
                    }
				}

				var bpStartPoint = this.sequenceAnnotator.bpMetricsByIndex(startBP);
				var bpEndPoint = this.sequenceAnnotator.bpMetricsByIndex(endBP);
				
				var upShift = 2 + alignmentRowIndex * 6;
				
				var color = this.self.ORF_COLOR[orf.getFrame()];
				
				var orfY = bpStartPoint.y - upShift;
				var currentHeight = 6;
                var textWidth = 16;
				
				if(startBP > endBP) { // case when start and end are in the same row
					var rowStartPoint = this.sequenceAnnotator.bpMetricsByIndex(row.rowData.getStart());
					var rowEndPoint = this.sequenceAnnotator.bpMetricsByIndex(row.rowData.end);

                    this.orfSVG.append("svg:path")
                        .attr("d", "M" + (rowStartPoint.x + 2) + " " + orfY +
                                   "L" + (bpEndPoint.x + bpEndPoint.width) + 
                                   " " + orfY +
                                   "M" + (bpStartPoint.x + 2) + " " + orfY +
                                   "L" + (rowEndPoint.x + rowEndPoint.width) +
                                   " " + orfY)
                        .attr("stroke", color)
                        .attr("stroke-width", this.self.ORF_STROKE_WIDTH);
				} else {
                    this.orfSVG.append("svg:path")
                        .attr("d", "M" + (bpStartPoint.x + 2) + " " + orfY +
                                   "L" + (bpEndPoint.x + textWidth) + 
                                   " " + orfY)
                        .attr("stroke", color)
                        .attr("stroke-width", this.self.ORF_STROKE_WIDTH);
				}
				
                Ext.each(orf.getStartCodons(), function(startCodonIndex) {
                    if(startCodonIndex >= row.rowData.getStart() && 
                       startCodonIndex <= row.rowData.end) {
                        var codonStartMetrics = this.sequenceAnnotator.bpMetricsByIndex(startCodonIndex);
                        
                        var codonStartPointX = codonStartMetrics.x;
                        var codonStartPointY = codonStartMetrics.y - upShift;
                        
                        if(orf.getStrand() == -1) {
                            this.orfSVG.append("svg:circle")
                                .attr("cx", codonStartPointX + textWidth - 2)
                                .attr("cy", codonStartPointY)
                                .attr("r", 3)
                                .attr("fill", color);
                        } else {
                            this.orfSVG.append("svg:circle")
                                .attr("cx", codonStartPointX + textWidth - 5)
                                .attr("cy", codonStartPointY)
                                .attr("r", 3)
                                .attr("fill", color);
                        }
                    }
                }, this);
				
				if(orf.getStrand() == 1 && endBP == orf.getEnd() - 1) {
					var codonEndPoint1 = this.sequenceAnnotator.bpMetricsByIndex(endBP);
					var codonEndPointX1 = codonEndPoint1.x + textWidth;
					var codonEndPointY1 = codonEndPoint1.y - upShift;
                    //draw arrow ends					
                    this.orfSVG.append("svg:path")
                        .attr("d", "M" + (codonEndPointX1 - 10) + " " + 
                                   (codonEndPointY1 - 4) + 
                                   "L" + codonEndPointX1 + " " + codonEndPointY1 +
                                   "L" + (codonEndPointX1 - 10) + " " + 
                                   (codonEndPointY1 + 4) + 
                                   "L" + (codonEndPointX1 - 10) + " " +
                                   (codonEndPointY1 - 4))
                        .attr("fill", color);
				} else if(orf.getStrand() == -1 && startBP == orf.getStart()) {
					var codonEndPoint2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
					var codonEndPointX2 = codonEndPoint2.x;
					var codonEndPointY2 = codonEndPoint2.y - upShift;
                    //draw arrow ends
                    this.orfSVG.append("svg:path")
                        .attr("d", "M" + codonEndPointX2 + " " + codonEndPointY2 + 
                                   "L" + (codonEndPointX2 + 10) + " " + 
                                   (codonEndPointY2 - 4) +
                                   "L" + (codonEndPointX2 + 10) + " " + 
                                   (codonEndPointY2 + 4) + 
                                   "L" + codonEndPointX2 + " " + codonEndPointY2)
                        .attr("fill", color);
				}
        }, this);
    }
});
