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
        console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());
        this.numRows = Number(Math.ceil(((this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length + 1) / this.sequenceAnnotator.getBpPerRow())))
        console.log(this.numRows);
        
        console.log(this.sequenceAnnotator.getSequenceManager().getSequence().seqString());


        var seqString = this.sequenceAnnotator.getSequenceManager().getSequence().seqString().toUpperCase();
        var complementSeqString = this.sequenceAnnotator.getSequenceManager().getComplementSequence().seqString().toUpperCase();

        for(var i = 0; i < this.numRows; i++) {
            var start = i * this.sequenceAnnotator.getBpPerRow();
            var end = (i + 1) * this.sequenceAnnotator.getBpPerRow() - 1;
            
            var sequence = seqString.substring(start, end + 1);
            var oppositeSequence = complementSeqString.substring(start, end + 1);
           
            var rowData = Ext.create("Teselagen.models.sequence.RowData", {
                    start: start,
                    end: end,
                    sequence: sequence,
                    oppositeSequence: oppositeSequence,
            });
 
            var row = Ext.create("Teselagen.models.sequence.Row", {
                index: i,
                rowData: rowData
            }); 
            console.log(row.getRowData().getSequence());
            this.rows.push(row);
        }
       
            
    },

    reloadFeatures: function(){},

    reloadCutSites: function(){},

    reloadORFs: function(){},
    rowAnnotations: function(){},
    pushInRow: function(){},



});

