Ext.define("Teselagen.renderer.annotate.SequenceRenderer", {

    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
               "Teselagen.bio.orf.ORF",
               "Teselagen.bio.sequence.common.Annotation"],
    config: {
        sequenceAnnotator: null,

        rows: null,
        featureToRowMap: null,
        orfToRowMap: null,
        cutSiteToRowMap: null,
        showORfs: false,
        numRows: 0,
        totalHeight: 0,
        totalWidth: 0,
        drawingPanel: null,
        sequenceAnnotationManager: null,

        needsMeasurement: false,
    },

    constructor: function(inData){
        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator;
        this.sequenceAnnotator = this.sequenceAnnotator.sequenceAnnotator;
    },

    update: function(){
        this.rows = [];

        this.numRows = int (Math.ceil(((contentHolder.sequenceProvider.sequence.length + 1) / 50)));
    },

    render: function(){
       // this.sequenceAnnotator.sequenceSVG.remove();
        var newRows = [];

        this.totalWidth = 0;
        this.totalHeight = 0;
        var sequenceX = 6*3;
        var sequenceY = 0;
        var sequence = this.sequenceAnnotator.getSequenceManager().getSequence().seqString();
        //console.log(sequence);
        var rows = this.sequenceAnnotator.getRowManager().getRows();
        var sequenceNucleotideMatrix = [];

        //console.log(rows.length);
        for (var i = 0; i < rows.length; i++){
            var row = rows[i];

            var rowX = 0;
            var rowY = this.totalHeight;

            var sequenceString = "";
            //sequenceString += this.renderIndexString(row.getRowData().getStart() + 1) + " ";


            if(this.sequenceAnnotator.getShowSpaceEvery10Bp()){
                sequenceString += this.splitWithSpaces(row.getRowData().getSequence(), 0, false);
            } else {
                sequenceString += row.getRowData().getSequence();
            }

            var sequenceStringLength = sequenceString.length;

            if(this.sequenceAnnotator.getShowCutSites() &&
               row.getRowData().getCutSitesAlignment()){
                if(row.getRowData().getCutSitesAlignment().getCount() > 0){
                    this.totalHeight += (Math.max.apply(null, 
                        row.getRowData().getCutSitesAlignment().getValues()) + 1) * 20 * 3;
                }
            }

            if(this.sequenceAnnotator.getShowAminoAcids3()){
                //console.log("show amino acids 3!");
                //this.renderAA(row);
            }
            if(this.sequenceAnnotator.getShowAminoAcids2()){
                //console.log("show amino acids 2!");
                //this.renderAA(row);
            }
            if(this.sequenceAnnotator.getShowAminoAcids1()){
                //console.log("show amino acids 1!");
                //this.renderAA(row);
            }

            if (this.sequenceAnnotator.getShowOrfs() && row.getRowData().getOrfAlignment()){
                //console.log("show orfs");
                this.totalHeight += (row.getRowData().getOrfAlignment().getCount() * 6);
            }

            var sequenceX = 6 * 16;
            var sequenceY = this.totalHeight;

            if(this.totalWidth < (16 * sequenceStringLength)){
                this.totalWidth = (16 * sequenceStringLength);
            }

            this.totalHeight += 20;

            var sequenceWidth = sequenceStringLength * 16 - sequenceX;
            var sequenceHeight = this.totalHeight - sequenceY;

            console.log("Show comp sequence: " + this.sequenceAnnotator.getShowComplementarySequence());
            if(this.sequenceAnnotator.getShowComplementarySequence()){

                //this.renderComplementarySequence(row);
                sequenceHeight = this.totalHeight - sequenceY;
            }

            if(this.sequenceAnnotator.showAminoAcids1RevCom){
                //this.renderAARevCom(row);
            }

            if(this.sequenceAnnotator.showFeatures){
                if(row.getRowData().getFeaturesAlignment() && row.getRowData().getFeaturesAlignment().getCount() > 0){
                    this.totalHeight += row.getRowData().getFeaturesAlignment().getCount() * (6*3) + 2;
                }
            }


            this.totalHeight += 3;

            var rowWidth = this.totalWidth;
            var rowHeight = this.totalHeight - rowY;
            //sequenceY += 20;

            var rowSequence = row.getRowData().getSequence();
            var complementarySequence = row.getRowData().getOppositeSequence();
            for(var j = 0; j < rowSequence.length; j++){
                var nucleotide = rowSequence.charAt(j);
                var nucleotideSVGGroup = this.sequenceAnnotationManager.sequenceSVG.append("svg:g")
                .attr("id", "nucleotide-row" +i+"-base" + j);

                nucleotideSVGGroup.append("svg:text")
                    .attr("x", sequenceX + j*16)
                    .attr("y", sequenceY + 20)
                    .text(nucleotide)
                    .attr("font-face", "Verdana")
                    .attr("font-size", 20);
            }

            row.metrics.x = rowX;
            row.metrics.y = rowY;
            row.metrics.width = rowWidth;
            row.metrics.height = rowHeight;

            row.getRowData().sequenceString = sequenceString;

            var newMetrics = {"x": rowX, "y": rowY, "width": rowWidth, "height": rowHeight};
            var newSequenceMetrics = {"x": sequenceX, "y": sequenceY, "width": sequenceWidth, "height": sequenceHeight};
           // console.log("Row metrics for "+i+": " + sequenceX + ", " + sequenceY + ", " + sequenceWidth + ", " + sequenceHeight);
            row.sequenceMetrics.x = sequenceX;
            //console.log("rendered sequence y: " + sequenceY);
            row.sequenceMetrics.y = sequenceY;
            //console.log(row.sequenceMetrics.y);
            row.sequenceMetrics.width = sequenceWidth;
            row.sequenceMetrics.height = sequenceHeight;
            
            var newRow = Ext.create("Teselagen.models.sequence.Row", {
                rowData: row.getRowData(),
                metrics: newMetrics,
                sequenceMetrics: newSequenceMetrics,
                index: i,
            });
            newRows.push(newRow);
        }
        
        //console.log("Before set rows: " + this.sequenceAnnotator.getRowManager().getRows()[0].getSequenceMetrics().x);
        this.sequenceAnnotator.getRowManager().setRows(newRows);
        this.sequenceAnnotator.setAnnotator(this.sequenceAnnotationManager);

        //console.log("After set rows: " + this.sequenceAnnotator.getRowManager().getRows()[0].getSequenceMetrics().x);
    },

    getUpdatedRows: function(){
        //console.log(this.sequenceAnnotator.getRowManager().getRows());
        return this.sequenceAnnotator.getRowManager().getRows();
    },

    splitWithSpaces: function(pString, pShift, pSplitLast){
        var result = "";
        var stringLength = pString.length;

        if(stringLength <= 10 - pShift){
            result += pString;
        }else{
            var start = 0;
            var end = 10 - pShift;
            while(start < stringLength){
                result += pString.substring(start, end);
                
                start = end;

                end += 10;

                if (end <= this.sequenceAnnotator.getBpPerRow()){
                    result += " ";
                }
            }
        }

        return result;
    },
    renderIndexString: function(pIndex){
        var result = String(pIndex);

        if(pIndex < 10){
            result = "    "  + result;
        } else if(pIndex < 100){
            result = "   " + result;
        }else if(pIndex < 1000){
            result = "  " + result;
        } else if(pIndex < 10000){
            result = " " + result;
        }

        return result;
    },


});
