Ext.define("Teselagen.renderer.annotate.SequenceRenderer", {
    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
               "Teselagen.bio.orf.ORF",
               "Teselagen.bio.sequence.common.Annotation",
               "Teselagen.utils.SystemUtils"],

    statics: {
        FONT_SIZE: 12,
        FONT_FAMILY: "Monaco",
        COMPLEMENTARY_VERTICAL_OFFSET: 16,
        LETTER_SPACING: 3
    },

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


            if (this.sequenceAnnotator.getShowOrfs() && row.getRowData().getOrfAlignment()){
                //console.log("show orfs");
                this.totalHeight += (row.getRowData().getOrfAlignment().getCount() * 6);
            }

            var sequenceX = 6 * this.sequenceAnnotationManager.self.CHAR_WIDTH;
            var sequenceY = this.totalHeight;

            if(this.totalWidth < (this.sequenceAnnotationManager.self.CHAR_WIDTH * sequenceStringLength)){
                this.totalWidth = (this.sequenceAnnotationManager.self.CHAR_WIDTH * sequenceStringLength);
            }

            this.totalHeight += 20;

            var sequenceWidth = sequenceStringLength * this.sequenceAnnotationManager.self.CHAR_WIDTH;
            var sequenceHeight = this.totalHeight - sequenceY;

            if(this.sequenceAnnotator.getShowAminoAcids()){
                this.renderAA(row);
                sequenceY += 60;
            }

            if(this.sequenceAnnotator.getShowComplementarySequence()){
                this.renderComplementarySequence(row);
                sequenceHeight = this.totalHeight - sequenceY;
            }

            if(this.sequenceAnnotator.showAminoAcids1RevCom){
                //this.renderAARevCom(row);
            }

            if(this.sequenceAnnotator.showFeatures){
                if(row.getRowData().getFeaturesAlignment() && row.getRowData().getFeaturesAlignment().getCount() > 0){
                    this.totalHeight += row.getRowData().getFeaturesAlignment().getCount() * (10) + 2;
                }
            }


            this.totalHeight += 3;

            var rowWidth = this.totalWidth;
            var rowHeight = this.totalHeight - rowY;
            //sequenceY += 20;

            var nucleotideRowSVG = this.sequenceAnnotationManager.sequenceSVG.append("svg:g")
                .attr("id", "nucleotide-row" +i);


            var rowSequence = row.getRowData().getSequence();
            nucleotideRowSVG.append("svg:text")
                .attr("x", sequenceX)
                .attr("y", sequenceY + 20)
                .text(sequenceString)
                .attr("font-family", this.self.FONT_FAMILY)
                .attr("font-size", this.self.FONT_SIZE)
                .attr("letter-spacing", this.self.LETTER_SPACING);

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

            this.renderBpLabel(row.getRowData().getStart() + 1, rowX, 
                               sequenceY + 20);
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

    renderAA: function(row){
        var aaStart, aaEnd, 
        //leftShift adjust the AA sequence positions
        leftShift,
        
        //aaPadding moves the Amino acid rows into the correct places.
        aaPadding;

        var aminoAcidsString1 = this.sequenceAnnotator.getAaManager().getSequenceFrame(0, true).replace(/\s/g, '');
        var aminoAcidsString2 = this.sequenceAnnotator.getAaManager().getSequenceFrame(1, true).replace(/\s/g, '');
        var aminoAcidsString3 = this.sequenceAnnotator.getAaManager().getSequenceFrame(2, true).replace(/\s/g, '');

        var start = row.getRowData().getStart();
        var end = row.getRowData().getEnd();
        var numberOfSpaces = 0;

        if (start > 20){
            aaStart = Math.floor((start ) / 3) ;
        }else{
            aaStart = start + 2;
        }
        if (end > 20){
            aaEnd = Math.floor(end / 3);
        }else{
            aaEnd = end;
        }

        if(this.sequenceAnnotator.showSpaceEvery10Bp){
            aminoAcidsString1 = this.splitWithSpaces(aminoAcidsString1, 0, false);
            aminoAcidsString2 = this.splitWithSpaces(aminoAcidsString2, 0, false);
            aminoAcidsString3 = this.splitWithSpaces(aminoAcidsString3, 0, false);
            numberOfSpaces = (row.getRowData().getSequence().length % 10) ? Math.round(row.getRowData().getSequence().length/10) : (Math.round(row.getRowData().getSequence().length/10) -1);
        }

        var aminoAcidsString1 = aminoAcidsString1.replace(/ /g, "      ");
        var aminoAcidsString2 = aminoAcidsString2.replace(/ /g, "      ");
        var aminoAcidsString3 = aminoAcidsString3.replace(/ /g, "      ");

        for (var i = 0; i < aminoAcidsString1.length; ++i){
            leftShift = i * (18*3);
            this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
                .attr("x", leftShift + 6 * this.sequenceAnnotationManager.self.CHAR_WIDTH)
                .attr("y", this.totalHeight)
                .attr("font-family", this.self.FONT_FAMILY)
                .attr("font-size", this.self.FONT_SIZE)
                .attr("xml:space", "preserve")
                .attr("fill", "blue")
                .text(aminoAcidsString1.charAt(i));
        }
        this.totalHeight += 20;
        for (var i = 0; i < aminoAcidsString2.length; ++i){
            leftShift = i * this.sequenceAnnotationManager.self.CHAR_WIDTH * 3;
            this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
                .attr("x", leftShift + 7 * this.sequenceAnnotationManager.self.CHAR_WIDTH)
                .attr("y", this.totalHeight)
                .attr("font-family", this.self.FONT_FAMILY)
                .attr("font-size", this.self.FONT_SIZE)
                .attr("xml:space", "preserve")
                .attr("fill", "blue")
                .text(aminoAcidsString2.charAt(i));
        }
        this.totalHeight += 20;
        for (var i = 0; i < aminoAcidsString3.length; ++i){
            leftShift = i * this.sequenceAnnotationManager.self.CHAR_WIDTH * 3;
            this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
                .attr("x", leftShift + 8 * this.sequenceAnnotationManager.self.CHAR_WIDTH) 
                .attr("y", this.totalHeight)
                .attr("font-family", this.self.FONT_FAMILY)
                .attr("font-size", this.self.FONT_SIZE)
                .attr("xml:space", "preserve")
                .attr("fill", "blue")
                .text(aminoAcidsString3.charAt(i));
        }
        this.totalHeight += 20;
    },

    renderComplementarySequence: function(row) {
        var sequenceString = ["      "];
        var stringLength;

        if(this.sequenceAnnotator.showSpaceEvery10Bp) {
            sequenceString = sequenceString.concat([this.splitWithSpaces(
                                            row.rowData.oppositeSequence,
                                            0, false)]);
        } else {
            sequenceString = sequenceString.concat([row.rowData.oppositeSequence]);
        }

        sequenceString = sequenceString.join("");
        stringLength = sequenceString.length;

        var complementRowSVG = this.sequenceAnnotationManager.sequenceSVG.append("svg:g")
            .attr("id", "nucleotide-comp-row" + row.getIndex())
            .append("svg:text")
            .attr("x", 6 * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight + 
                  this.self.COMPLEMENTARY_VERTICAL_OFFSET)
            .text(sequenceString)
            .attr("fill", "#b0b0b0")
            .attr("font-family", this.self.FONT_FAMILY)
            .attr("font-size", this.self.FONT_SIZE)
            .attr("letter-spacing", this.self.LETTER_SPACING);

        this.totalHeight += 20;
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

    renderBpLabel: function(basePairs, labelX, labelY){
        this.sequenceAnnotationManager.sequenceSVG.append("svg:text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("font-family", this.self.FONT_FAMILY)
            .attr("font-size", this.self.FONT_SIZE)
            .attr("letter-spacing", this.self.LETTER_SPACING)
            .text(String(basePairs));
    },
});
