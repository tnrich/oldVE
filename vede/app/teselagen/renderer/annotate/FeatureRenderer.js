Ext.define("Teselagen.renderer.annotate.FeatureRenderer", {

    config: {
        feature: null,
        sequenceAnnotator: null,
        topBarY: 20,
        featureGroupSVG: null,
    },

    statics: {
        DEFAULT_FEATURE_HEIGHT: 6,
        DEFAULT_FEATURES_SEQUENCE_GAP: 3,
        DEFAULT_FEATURES_GAP: 2,
    },

    constructor: function(inData){

        this.initConfig(inData);
    },

    update: function(){
    },


    render: function(){
        //console.log("Trying to render feature renderer");
        this.featureGroupSVG = this.sequenceAnnotator.featuresSVG.append("svg:g")
                .attr("id", "feature-" +this.feature.getName());

        //console.log("Retrieving feature rows with this name: " + this.feature.getName());
        var featureRows = this.sequenceAnnotator.getSequenceAnnotator().getRowManager().getFeatureToRowMap()[this.feature.getName()];
        if (!featureRows){
            return;
        }
        
        for (var i = 0; i < featureRows.length; i++){
            var row = this.sequenceAnnotator.getSequenceAnnotator().getRowManager().getRows()[featureRows[i]];


            var alignmentRowIndex = -1;

            //row.getRowData().getFeaturesAlignment().each(this.findFeatureRowIndex, this);

            var startBP;
            var endBP;

            if( this.feature.getStart() > this.feature.getEnd()){
                if (this.feature.getEnd() >= row.getRowData().getStart() && this.feature.getEnd() <= row.getRowData().getEnd()){
                    endBP = this.feature.getEnd() - 1;
                } else if (row.getRowData().getEnd() >= this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length){
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

            /*
            if (startBP > endBP){
                var bpStartMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(row.getRowData().getStart());
                var bpEndMetrics1 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(endBP, this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length - 1));

                var bpStartMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(startBP);
                var bpEndMetrics2 = this.sequenceAnnotator.bpMetricsByIndex(Math.min(row.getRowData().getEnd(), this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length - 1));

                var featureX1 = bpStartMetrics1.getX() + 2;
                var featureX2 = bpStartMetrics2.getX() + 2;
                var featureYCommon = bpStartMetrics1.getY() + row.getSequenceMetrics().getTextHeight() + alignmentRowIndex * (this.self.DEFAULT_FEATURE_HEIGHT + this.self.DEFAULT_FEATURES_GAP) + this.self.DEFAULT_FEATURES_SEQUENCE_GAP;

                if(this.sequenceAnnotator.getShowAminoAcidsRevCom()){
                    //Add AminoAcidsTextRenderer
                    featureYCommon += 3 * 20;
                }

                var featureRowWidth1 = bpEndMetrics1.getX() - bpStartMetrics1.getX() + 20;
                var featureRowWidth2 = bpEndMetrics2.getX() - bpStartMetrics2.getX() + 20;

                var featureRowHeightCommon = this.self.DEFAULT_FEATURE_HEIGHT;

                //Add functionality for drawing arrow directions
                if (this.feature.getStrand() === 0){
                    drawFeatureRect("", featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureRect("", featureX2, featureYCommon, featureRowWidth2, featureRowHeightCommon);
                } else if (this.feature.getStrand() === 1){
                    drawFeatureForwardArrow("", featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureForwardRect("", featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                } else if(this.feature.getStrand() === -1){
                    drawFeatureBackwardRect("", featureX1, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                    drawFeatureBackwardArrow("", featureX2, featureYCommon, featureRowWidth1, featureRowHeightCommon);
                }
            }else{

            }*/

        }
    },

    findFeatureRowIndex: function(key, value, item){
       // console.log("Value for findFeatureRowIndex: " + value);

    },

});

