Ext.define("Teselagen.manager.RowManager", {
    config: {
        sequenceAnnotator: null,

        rows: [],
        featureToRowMap: null,
        cutSiteToRowMap: null,
        showORFs: false,
        numRows: 10,
    },

    constructor: function(inData){
        this.initConfig(inData);
        this.sequenceAnnotator = inData.sequenceAnnotator;
        console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());
    },

    update: function(){
        //console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());
        
        console.log("Num rows: ");
        //console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());
        this.numRows = Number(Math.ceil(((this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length + 1) / this.sequenceAnnotator.getBpPerRow())))
        //console.log(this.numRows);
        
        //console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());


        var seqString = this.sequenceAnnotator.getSequenceManager().getSequence().seqString().toUpperCase();
        var complementSeqString = this.sequenceAnnotator.getSequenceManager().getComplementSequence().seqString().toUpperCase();

        for(var i = 0; i < this.numRows; i++) {
            var start = i * this.sequenceAnnotator.getBpPerRow();
            var end = (i + 1) * this.sequenceAnnotator.getBpPerRow() - 1;
            
            var sequence = seqString.substring(start, end + 1);
            var oppositeSequence = complementSeqString.substring(start, end + 1);
           
            var rowData = Ext.create("Teselagen.models.sequence.RowData", {
                    start: (start + 1),
                    end: (end + 1),
                    sequence: sequence,
                    oppositeSequence: oppositeSequence,
            });
 
            console.log("Row Data: \n Start: " + (start + 1) + " End: " + (end + 1)+ "\n Sequence Length: " + sequence.length);
            var row = Ext.create("Teselagen.models.sequence.Row", {
                index: i,
                rowData: rowData
            }); 
            //console.log(row.getRowData().getSequence());
            this.rows.push(row);
        }
       
           this.reloadFeatures(); 
           this.reloadORFs();
           this.reloadCutSites();
    },

    reloadFeatures: function(){
        if (!this.sequenceAnnotator.getSequenceManager().getFeatures()){
            return;
        }

        var rowsFeatures = this.rowAnnotations(this.sequenceAnnotator.getSequenceManager().getFeatures());
        console.log("rowsFeatures: " + rowsFeatures);
        this.featureToRowMap = [];

        for (var k = 0; k < this.sequenceAnnotator.getSequenceManager().getFeatures().length; k++){
            var feature = this.sequenceAnnotator.getSequenceManager().getFeatures()[k];
            console.log("Retrieved feature name: " + feature.getName());
            this.featureToRowMap[feature.getName()] = null;
        }

        for (var i = 0; i < this.numRows; i++){
            var start = i * this.sequenceAnnotator.getBpPerRow();
            var end = (i + 1) * this.sequenceAnnotator.getBpPerRow() - 1;
            
            console.log(rowsFeatures[i])
            var featuresAlignment = Teselagen.renderer.common.Alignment.buildAlignmentMap(rowsFeatures[i], this.sequenceAnnotator.getSequenceManager());
            console.log(this.rows[i].getRowData().getFeaturesAlignment());
            this.rows[i].getRowData().setFeaturesAlignment(featuresAlignment.clone());
            console.log(this.rows[i].getRowData().getFeaturesAlignment());
            /*console.log("# Rows in featuresAlignment: " + featuresAlignment.getValues());
            console.log("# Rows in this.rows[i]: " + this.rows[i].getRowData().getFeaturesAlignment().getValues());
            console.log("Row start #: " + start);
            console.log("Row end #: " + end);*/
            var rowOwnedFeatures = rowsFeatures[i];

            if (rowOwnedFeatures == null){ continue; }

            for (var j = 0; j < rowOwnedFeatures.length; j++){
                var rowFeature = rowOwnedFeatures[j];

                console.log("Row feature name: " + rowFeature.getName());
                if(!this.featureToRowMap[rowFeature.getName()]){
                    this.featureToRowMap[rowFeature.getName()] = [];
                }

                this.featureToRowMap[rowFeature.getName()].push(i);
            }
        }


    },

    reloadCutSites: function(){},

    reloadORFs: function(){},
    rowAnnotations: function(pAnnotations){
        var rows = [];
        console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length);

        var numRows = Math.round((this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length / this.sequenceAnnotator.getBpPerRow()));
        console.log("rowAnnotations, numRows: " + numRows);

        if (pAnnotations != null){
            for (var j = 0; j < numRows; j++){
                rows.push([]);
            }

            var numberOfItems = pAnnotations.length;
            for (var i = 0; i < numberOfItems; ++i){
                var annotation = pAnnotations[i];

                var itemStart = annotation.getStart();
                var itemEnd = annotation.getEnd();

                //if (annotation.getClassName()Teselagen.bio.enzymes.RestrictionCutSite){},
                this.pushInRow(itemStart, itemEnd, annotation, rows);
            }
        }
        console.log("Row annotations: " + rows);
        return rows;
    },
    pushInRow: function(pItemStart, pItemEnd, pAnnotation, pRows){
        console.log("Push in Row annotations before: " + pRows);
        if (pItemStart > pItemEnd){
            var rowStartIndex = Math.round(pItemStart/this.sequenceAnnotator.getBpPerRow());
            var rowEndIndex = Math.round((this.sequenceAnnotator.getSequenceManager().getSequence().length - 1)/this.sequenceAnnotator.getBpPerRow());

            var rowStartIndex2 = 0;
            var rowEndIndex = Math.round(pItemEnd/this.sequenceAnnotator.getSequenceManager().getBpPerRow());

            for (var z1 = rowStartIndex1; z1 < rowEndIndex1 + 1; z1++){
                pRows[z1].push(pAnnotation);
            }
            for (var z2 = rowStartIndex2; z2 < rowEndIndex2 + 1; z2++){
                pRows[z2].push(pAnnotation);
            }
        } else {
            var rowStartIndex = Math.round(pItemStart/this.sequenceAnnotator.getBpPerRow());
            var rowEndIndex = Math.round(pItemEnd/this.sequenceAnnotator.getBpPerRow());
            console.log("rowStartIndex: " + rowStartIndex);
            console.log("rowEndIndex: " + rowEndIndex);

            for (var z = rowStartIndex; z < rowEndIndex + 1; z++){
                pRows[z].push(pAnnotation);
            }
        }
        console.log("Push in Row annotations after: " + pRows);

        return pRows;
    },



});

