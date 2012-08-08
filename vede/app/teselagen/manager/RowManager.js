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
    },

    reloadCutSites: function(){},

    reloadORFs: function(){},
    rowAnnotations: function(pAnnotations){
        var rows = [];

        var numRows = Math.ceil((this.sequenceAnnotator.getSequenceManager().getSequence().length / this.sequenceAnnotator.getBpPerRow()));

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
    },
    pushInRow: function(pItemStart, pItemEnd, pAnnotation, pRows){
    },



});

