Ext.define("Teselagen.renderer.annotate.FeatureRenderer", {

    config: {
        feature: null,
        sequenceAnnotationManager: null,
        sequenceAnnotator: null,
        topBarY: 20,
        featureGroupSVG: null,
        featureColor: null,
    },

    statics: {
        DEFAULT_FEATURE_HEIGHT: 6,
        DEFAULT_FEATURES_SEQUENCE_GAP: 3,
        DEFAULT_FEATURES_GAP: 2,
    },

    constructor: function(inData){

        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator.sequenceAnnotator;
        this.sequenceAnnotator = this.sequenceAnnotator;
    },

    update: function(){
    },


    render: function(){
        //console.log("Trying to render feature renderer");
        this.featureGroupSVG = this.sequenceAnnotator.featuresSVG.append("svg:g")
                .attr("id", "feature-" +this.feature.getName());

        this.featureColor = this.colorByType(this.feature.getType().toLowerCase());
        var g = this.featureGroupSVG;

        var feature = this.feature;
        g.attr("fill", this.featureColor);

        //console.log("Retrieving feature rows with this name: " + this.feature.getName());
        var featureRows = this.sequenceAnnotationManager.getRowManager().getFeatureToRowMap().get(feature.getName());
        console.log("Feature to Row Map: " + featureRows);
        if (!featureRows){
            return;
        }
        
        for (var i = 0; i < featureRows.length; i++){
            var row = this.sequenceAnnotationManager.getRowManager().getRows()[featureRows[i]];

            var alignmentRowIndex = -1;
            var fromSameFeatureIndex = 0;

            //for each row, get the features alignment
            var featuresAlignment = row.getRowData().getFeaturesAlignment();
            //console.log("New set of feature rows");
            console.log(featuresAlignment.getKeys());
            Ext.each(featuresAlignment.getKeys(), function(rowFeatures, index){
               Ext.each(rowFeatures, function(rowFeature){
                   console.log("rowFeature: " + rowFeature + " feature name: " + feature.toString());
                   if (rowFeature.indexOf(feature.toString()) != -1){
                       console.log(alignmentRowIndex);
                       alignmentRowIndex = index + fromSameFeatureIndex;
                       return false;
                   }
               });

               if(alignmentRowIndex != -1){
                   return false;
               }
                
            });
            console.log("Alignment index: " + alignmentRowIndex);

            var startBP;
            var endBP;
            var downShift = 2 + alignmentRowIndex * (this.self.DEFAULT_FEATURE_HEIGHT + this.self.DEFAULT_FEATURES_GAP);
            if( this.feature.getStart() > this.feature.getEnd()){
                if (this.feature.getEnd() >= row.getRowData().getStart() && this.feature.getEnd() <= row.getRowData().getEnd()){
                    endBP = this.feature.getEnd() - 1;
                } else if (row.getRowData().getEnd() >= this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length){
                //
                } else {
                    endBP = row.getRowData().getEnd();
                }

                if (this.feature.getStart() >= row.getRowData().getStart() && this.feature.getStart() < row.getRowData().getEnd()){
                    startBP = this.feature.getStart();
                } else{
                    startBP = row.getRowData().getStart();
                }
            } else{
                if(this.feature.getStart() < row.getRowData().getStart() && this.feature.getEnd() < row.getRowData().getStart()){
                    continue;
                } else if (this.feature.getStart() > row.getRowData().getEnd() && this.feature.getEnd() > row.getRowData().getEnd()){
                    continue;
                } else{
                    startBP = (this.feature.getStart() < row.getRowData().getStart()) ? row.getRowData().getStart() : this.feature.getStart();
                    endBP = ((this.feature.getEnd() - 1) < row.getRowData().getEnd()) ? (this.feature.getEnd() - 1) : row.getRowData().getEnd();
                }
            }
            /*console.log("line? : " + row.getRowData().getFeaturesAlignment().getKeys());
            console.log("Row keys? : " + row.getRowData().getFeaturesAlignment().getKeys());
            console.log("StartBP: " + startBP + " EndBP: " + endBP);*/

            if (startBP > endBP){
                var bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.getRowData().getStart());
                console.log("Min!");
                var bpEndMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                var bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(row.getRowData().getEnd(), this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                var featureX1 = bpStartMetrics1.getX() + 2;
                var featureX2 = bpStartMetrics2.getX() + 2;
                var featureYCommon = bpStartMetrics1.getY() + this.self.DEFAULT_FEATURES_SEQUENCE_GAP + downShift;

                if(this.sequenceAnnotationManager.showAminoAcidsRevCom){
                    //Add AminoAcidsTextRenderer
                    featureYCommon += 3 * 20;
                }

                var featureRowWidth1 = (bpEndMetrics1.getX() - bpStartMetrics1.getX()) * 16;
                var featureRowWidth2 = (bpEndMetrics2.getX() - bpStartMetrics2.getX()) * 16;

                var featureRowHeightCommon = this.self.DEFAULT_FEATURE_HEIGHT;

                //Add functionality for drawing arrow directions
                if (this.feature.getStrand() === 0){
                    drawFeatureRect(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureRect(g, featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                } else if (this.feature.getStrand() === 1){
                    drawFeatureForwardArrow(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureForwardRect(g, featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                } else if(this.feature.getStrand() === -1){
                    drawFeatureBackwardRect(g, featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureBackwardArrow(g, featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                }
            }else{
                var bpStartMetrics = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));
                
                var featureX = bpStartMetrics.x + 2;
                var featureY = bpStartMetrics.y  + downShift;

                if (this.sequenceAnnotator.showAminoAcids1RevCom){
                    featureY += (3 * 20);
                }

                var featureRowWidth = bpEndMetrics.x - bpStartMetrics.x + 3;
                var featureRowHeight = 6;

                if (this.feature.getStrand() == 0){
                    drawFeatureRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                } else if ( this.feature.getStrand() == 1){
                    if(this.feature.getEnd() >= row.getRowData().getStart() && this.feature.getEnd() <= row.getRowData().getEnd()){
                        drawFeatureForwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else{
                        drawFeatureForwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    }
                } else if( this.feature.getStrand() == -1){
                    if(this.feature.getStart() >= row.getRowData().getStart() && this.feature.getStart() <= row.getRowData().getEnd()){
                        drawFeatureBackwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else{
                        drawFeatureBackwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
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

                if (startBP > endBP){
                    bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.getRowData().getStart());
                    bpEndMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));

                    bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                    bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(row.getRowData().getEnd(), this.sequenceAnnotationManager.getSequenceManager().getSequence().seqString().length - 1));
                    
                    featureX1 = bpStartMetrics1.x  + 2;
                    featureX2 = bpStartMetrics2.x + 2;
                    
                    featureYCommon = bpStartMetrics1.y + downShift;

                    if(this.sequenceAnnotationManager.showAminoAcids1RevCom){
                        featureY += (3*20);
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
                    
                    if(this.sequenceAnnotationManager.showAminoAcids1RevCom){
                        featureY += (3* 20);
                    }

                    featureRowWidth = bpEndMetrics.x - bpStartMetrics.x + 17;
                    featureRowHeight = 6;

                    if(this.feature.getStrand() == 0){
                        drawFeatureRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                    } else if( this.feature.getStrand() == 1){
                        if(location.getEnd() >= row.getRowData().getStart() && location.getEnd() < row.getRowData().getEnd() + 1){
                            if(this.feature.getEnd() == location.getEnd()){

                                drawFeatureForwardArrow(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            } else {
                                drawFeatureForwardCurved(g, featureX, featureY, featureRowWidth, featureRowHeight);
                            }
                        } else{
                            drawFeatureForwardRect(g, featureX, featureY, featureRowWidth, featureRowHeight);
                        }
                    } else if (this.feature.getStrand() == -1){

                        if (location.getStart() >= row.getRowData().getStart() && location.getStart() <= row.getRowData().getEnd()){
                            if (this.feature.getStart() == location.getStart()){
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
        

        }


        function drawFeatureRect(pGraphics, pX, pY, pWidth, pHeight){
            console.log("Drew rect!!!");
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
            console.log(pGraphics);
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
    findFeatureRowIndex: function(key, value, item){
       // console.log("Value for findFeatureRowIndex: " + value);

    },

});

