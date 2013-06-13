/**
 * @class Teselagen.renderer.annotate.FeatureRenderer
 * Class which generates and renders SVG for a given feature.
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author of FeatureRenderer.as)
 */
Ext.define("Teselagen.renderer.annotate.FeatureRenderer", {

    config: {
        feature: null,
        sequenceAnnotationManager: null,
        sequenceAnnotator: null,
        topBarY: 20,
        featureGroupSVG: null,
        featureColor: null
    },

    statics: {
        DEFAULT_FEATURE_HEIGHT: 8,
        DEFAULT_FEATURES_SEQUENCE_GAP: 6,
        DEFAULT_FEATURES_GAP: 2
    },

    constructor: function(inData){

        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator.sequenceAnnotator;
        this.sequenceAnnotator = this.sequenceAnnotator;
    },

    update: function(){
    },


    render: function(){
        this.featureGroupSVG = this.sequenceAnnotator.featuresSVG.append("svg:g")
                .attr("id", "feature-" + this.feature.getName());

        this.featureColor = this.colorByType(this.feature.getType().toLowerCase());
        var g = this.featureGroupSVG;

        var feature = this.feature;
        var featureStart = this.feature.getStart();
        var featureEnd = this.feature.getEnd();

        g.attr("fill", this.featureColor);

        var featureRows = this.sequenceAnnotationManager.getRowManager().getFeatureToRowMap().get(feature.getName());
        if (!featureRows){
            return;
        }
        
        for (var i = 0; i < featureRows.length; i++){
            var row = this.sequenceAnnotationManager.getRowManager().getRows()[featureRows[i]];

            var alignmentRowIndex = row.rowData.getFeaturesAlignment().get(feature);
            var fromSameFeatureIndex = 0;

            //for each row, get the features alignment
            var featuresAlignment = row.getRowData().getFeaturesAlignment();

            var startBP;
            var endBP;
            //downShift calculates the adjustedYPosition
            var downShift = 2 + alignmentRowIndex * (this.self.DEFAULT_FEATURE_HEIGHT + this.self.DEFAULT_FEATURES_GAP);
            if(this.sequenceAnnotationManager.showComplementarySequence) {
                downShift += 4 + 
                    this.sequenceAnnotator.sequenceRenderer.self.COMPLEMENTARY_VERTICAL_OFFSET;
            }

            if( featureStart > featureEnd){
                if (featureEnd >= row.getRowData().getStart() && featureEnd <= row.getRowData().getEnd()){
                    endBP = featureEnd - 1;
                } else if (row.getRowData().getEnd() >= this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length){
                //
                } else {
                    endBP = row.getRowData().getEnd();
                }

                if (featureStart >= row.getRowData().getStart() && featureStart < row.getRowData().getEnd()){
                    startBP = featureStart;
                } else{
                    startBP = row.getRowData().getStart();
                }
            } else{
                if(featureStart < row.getRowData().getStart() && featureEnd < row.getRowData().getStart()){
                    continue;
                } else if (featureStart > row.getRowData().getEnd() && featureEnd > row.getRowData().getEnd()){
                    continue;
                } else{
                    startBP = (featureStart < row.getRowData().getStart()) ? row.getRowData().getStart() : featureStart;
                    endBP = ((featureEnd - 1) < row.getRowData().getEnd()) ? (featureEnd - 1) : row.getRowData().getEnd();
                }
            }

            if(startBP < 0 || endBP < 0) {
                console.warn("Invalid feature: name " + feature.getName() + 
                             ", starting at " + featureStart + ", ending at " + 
                             featureEnd + ", ignoring.");
                return;
            }

            if (startBP > endBP && this.feature.getType() != "misc_feature"){
                var bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.getRowData().getStart());
                var bpEndMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                var bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(row.getRowData().getEnd(), this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                var featureX1 = bpStartMetrics1.x + 2;
                var featureX2 = bpStartMetrics2.x + 2;
                var featureYCommon = bpStartMetrics1.y + this.self.DEFAULT_FEATURES_SEQUENCE_GAP + downShift;

                /*if(this.sequenceAnnotationManager.showAminoAcids){
                    //Add AminoAcidsTextRenderer
                    featureYCommon += 20;
                }*/

                if(this.sequenceAnnotationManager.showAminoAcidsRevCom){
                    //Add AminoAcidsTextRenderer
                    featureYCommon += 3 * 20;
                }

                var featureRowWidth1 = (bpEndMetrics1.x - bpStartMetrics1.x) * 16;
                var featureRowWidth2 = (bpEndMetrics2.x - bpStartMetrics2.x) * 16;

                var featureRowHeightCommon = this.self.DEFAULT_FEATURE_HEIGHT;

                //Add functionality for drawing arrow directions
                if (this.feature.getStrand() === 0){
                    drawFeatureRect(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureRect(g, featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                } else if (this.feature.getStrand() === 1){
                    drawFeatureForwardArrow(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureForwardRect(g, featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                } else if(this.feature.getStrand() === -1){
                    drawFeatureBackwardRect(g, (featureX1-8), featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureBackwardArrow(g, featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                }
            }else{
                var bpStartMetrics = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));
                
                var featureX = bpStartMetrics.x + 2;
                var featureY = bpStartMetrics.y  + downShift;

                /*if(this.sequenceAnnotationManager.showAminoAcids){
                    //Add AminoAcidsTextRenderer
                    featureY += 20;
                }*/
                if (this.sequenceAnnotationManager.showAminoAcidsRevCom){
                    featureY += (3 * 20);
                }

                var featureRowWidth = bpEndMetrics.x - bpStartMetrics.x + 3;
                var featureRowHeight = 6;

                if (this.feature.getStrand() == 0){
                    drawFeatureRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                } else if ( this.feature.getStrand() == 1){
                    if(featureEnd >= row.getRowData().getStart() && featureEnd <= row.getRowData().getEnd()){
                        drawFeatureForwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else{
                        drawFeatureForwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    }
                } else if( this.feature.getStrand() == -1){
                    if(featureStart >= row.getRowData().getStart() && featureStart <= row.getRowData().getEnd()){
                        drawFeatureBackwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else{
                        drawFeatureBackwardRect(g, (featureX-8), featureY, featureRowWidth, featureRowHeight);
                    }
                }

            }
            
            for (var j = 0; j < this.feature.getLocations().length; j++){

                var location = this.feature.getLocations()[j];
                if (location.getStart() > location.getEnd()){
                    if (location.getStart() > row.getRowData().getEnd() && location.getEnd() <= row.getRowData().getStart()){
                        continue;
                    } 

                    if(location.getEnd() >= row.getRowData().getStart() && location.getEnd() <= row.getRowData().getEnd()){
                        endBp = location.getEnd() - 1;

                    } else if (row.getRowData().getEnd() >= this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length){
                        endBP = this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1;
                    } else{
                        endBP = row.getRowData().getEnd();
                    }

                    if(location.getStart() >= row.getRowData().getStart() && location.getStart() <= row.getRowData().getEnd()){
                        startBP = location.getStart();
                    } else{
                        startBP = row.getRowData().getStart();
                    }
                } else{
                    if(location.getStart() < row.getRowData().getStart() && location.getEnd() <= row.getRowData().getStart()){
                        continue;
                    } else if( location.getStart() > row.getRowData().getEnd() && location.getEnd() > row.getRowData().getEnd()){
                        continue;
                    } else {
                        startBP = (location.getStart() <  row.getRowData().getStart()) ? row.getRowData().getStart() : location.getStart();
                        endBP = (location.getEnd() - 1 < row.getRowData().getEnd()) ? location.getEnd() - 1 : row.getRowData().getEnd();
                    }
                }

                if (startBP > endBP && this.feature.getType() != "misc_feature"){
                    bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.getRowData().getStart());
                    bpEndMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                    bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                    bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(row.getRowData().getEnd(), this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));
                    
                    featureX1 = bpStartMetrics1.x  + 2;
                    featureX2 = bpStartMetrics2.x + 2;
                    
                    featureYCommon = bpStartMetrics1.y + downShift;

                /*if(this.sequenceAnnotationManager.showAminoAcids){
                    //Add AminoAcidsTextRenderer
                    featureY += 20;
                }*/
                    if(this.sequenceAnnotationManager.showAminoAcidsRevCom){
                        featureYCommon += (3*20);
                    }

                    featureRowWidth1 = (bpEndMetrics1.x - bpStartMetrics1.x) * 16
                    featureRowWidth2 = (bpEndMetrics2.x - bpStartMetrics2.x) * 16;
                    var featureRowHeightCommon = 6;

                    if(this.feature.getStrand() == 0){
                        drawFeatureRect(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                        drawFeatureRect(g, featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                    } else if( this.feature.getStrand() == 1){
                        drawFeatureForwardArrow(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                        drawFeatureForwardRect(g, featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                    } else if(this.feature.getStrand() == -1){
                        drawFeatureBackwardRect(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                        drawFeatureBackwardArrow(g, featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                    }
                } else{
                    bpStartMetrics = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                    bpEndMetrics = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                    featureX = bpStartMetrics.x + 2;
                    featureY = bpStartMetrics.y + downShift;
                    
                /*if(this.sequenceAnnotationManager.showAminoAcids){
                    //Add AminoAcidsTextRenderer
                    featureY +=  20;
                }*/
                    if(this.sequenceAnnotationManager.showAminoAcidsRevCom){
                        featureY += (3* 20);
                    }

                    featureRowWidth = bpEndMetrics.x - bpStartMetrics.x + 10;
                    featureRowHeight = 6;

                    if(this.feature.getStrand() == 0){
                        drawFeatureRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else if( this.feature.getStrand() == 1){
                        if(location.getEnd() >= row.getRowData().getStart() && location.getEnd() < row.getRowData().getEnd() + 1){
                            if(featureEnd == location.getEnd()){

                                drawFeatureForwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            } else {
                                drawFeatureForwardCurved(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            }
                        } else{
                            drawFeatureForwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                        }
                    } else if (this.feature.getStrand() == -1){

                        if (location.getStart() >= row.getRowData().getStart() && location.getStart() <= row.getRowData().getEnd()){
                            if (featureStart == location.getStart()){
                                drawFeatureBackwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            } else{
                                drawFeatureBackwardCurved(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            }
                        } else{
                            drawFeatureBackwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                        }
                    }
                }
            }

            this.addToolTip(this.feature);
            this.addClickListener(this.feature);
        

        }


        function drawFeatureRect(pGraphics, pX, pY, pWidth, pHeight){
            pGraphics.append("svg:rect")
                .attr("x", pX)
                .attr("y", pY + 20)
                .attr("stroke", this.featureColor)
                .attr("width", pWidth)
                .attr("height", 6);
        }
        function drawFeatureForwardRect(pGraphics, pX, pY, pWidth, pHeight){
            pY += 20;
            pGraphics.append("svg:path")
                .attr("d", " M " + (pX) + " " + (pY) + 
                           " S " + (pX + 3) + " " + (pY + pHeight / 2) + " " + (pX) + " " + (pY + pHeight) + 
                           " L " + (pX + pWidth) + " " + (pY + pHeight) +
                           " L " + (pX + pWidth) + " " + (pY) + 
                           " L " + (pX) + " " + (pY));
        }
        function drawFeatureBackwardRect(pGraphics, pX, pY, pWidth, pHeight){
            pY += 20;
            pGraphics.append("svg:path")
                .attr("d", " M " + (pX) + " " + (pY) + 
                           " L " + (pX) + " " + (pY + pHeight) +
                           " L " + (pX + pWidth) + " " + (pY + pHeight) + 
                           " S " + (pX + pWidth - 3) + " " + (pY + pHeight / 2) + " " + (pX + pWidth) + " " + (pY) + 
                           " L " + (pX) + " " + (pY));
        }
        function drawFeatureForwardArrow(pGraphics, pX, pY, pWidth, pHeight){
            pY += 20;
            if(pWidth ){
                
                pGraphics.append("svg:path")
                    .attr("d", " M " + (pX) + " " + (pY) + 
                               " L " + (pX + pWidth - 8) + " " + (pY) +
                               " L " + (pX + pWidth) + " " + (pY + pHeight / 2) + 
                               " L " + (pX + pWidth - 8) + " " + (pY + pHeight) +
                               " L " + (pX) + " " + (pY + pHeight) +
                               " S " + (pX + 3) + " " + (pY + pHeight / 2) + " " + (pX) + " " + pY);
            } else{

                pGraphics.append("svg:path")
                    .attr("d", " M " + (pX) + " " + (pY) + 
                               " L " + (pX + pWidth) + " " + (pY + pHeight / 2) +
                               " L " + (pX) + " " + (pY + pHeight) + 
                               " L " + (pX) + " " + (pY));
            }
        /*
            pGraphics.append("svg:line")
                .attr("x", pX + 5)
                .attr("y", pY +10)
                .attr("stroke", this.featureColor)
                .attr("stroke-width", 10)
                .attr("height", pHeight);
                */
        }
        function drawFeatureBackwardArrow(pGraphics, pX, pY, pWidth, pHeight){
            //drawFeatureRect(pGraphics, pX, pY, pWidth, pHeight);
            pY += 20;
            if(pWidth){
                
                pGraphics.append("svg:path")
                    .attr("d", " M " + (pX + 8) + " " + (pY) + 
                               " L " + (pX + pWidth) + " " + (pY) +
                               " S " + (pX + pWidth - 3) + " " + (pY + pHeight / 2) + " " + (pX + pWidth) + " " + (pY + pHeight) + 
                               " L " + (pX + 8) + " " + (pY + pHeight) + 
                               " L " + (pX) + " " + (pY + pHeight / 2) + 
                               " L " + (pX + 8) + " " + (pY));
            } else{

                pGraphics.append("svg:path")
                    .attr("d", " M " + (pX) + " " + (pY + pHeight / 2) + 
                               " L " + (pX + pWidth) + " " + (pY) +
                               " L " + (pX + pWidth) + " " + (pY + pHeight) + 
                               " L " + (pX) + " " + (pY + pHeight / 2));
            }
        }

        function drawFeatureForwardCurved(pGraphics, pX, pY, pWidth, pHeight){
            //drawFeatureRect(pGraphics, pX, pY, pWidth, pHeight);
            /*
             pGraphics.append("svg:line")
                .attr("x", pX + 5)
                .attr("y", pY + 10)
                .attr("stroke", this.featureColor)
                .attr("stroke-width", 10)
                
                .attr("height", pHeight);
                */
        }
        function drawFeatureBackwardCurved(pGraphics, pX, pY, pWidth, pHeight){
            //drawFeatureRect(pGraphics, pX, pY, pWidth, pHeight);
            /*pGraphics.append("svg:line")
                .attr("x", pX + 5)
                .attr("y", pY + 10)
                .attr("stroke", this.featureColor)
                .attr("stroke-width", 10)
                .attr("height", pHeight);
                */
        }
    },

    

    colorByType: function(type) {
        var switchObj = {
            promoter: "#31B440",
            terminator: "#F51600",
            cds: "#EF6500",
            m_rna: "#FFFF00",
            misc_binding: "#006FEF",
            misc_feature: "#006FEF",
            misc_marker: "#8DCEB1",
            rep_origin: "#878787"
        };

        var color = switchObj[type] || "#CCCCCC";
        return color;
    },

    addToolTip: function(feature){
        var featureToolTip = this.featureGroupSVG.append("svg:title");
        var toolTip = feature.getType() + " - " + feature.getName() + ": " + feature.getStart() + ".." + feature.getEnd();
        featureToolTip.text(toolTip);
    },


    addClickListener: function(feature){
        this.featureGroupSVG.on("mousedown", function(){
            Vede.application.fireEvent("AnnotatePanelAnnotationClicked", feature.getStart(), feature.getEnd());
        });
    },
});

