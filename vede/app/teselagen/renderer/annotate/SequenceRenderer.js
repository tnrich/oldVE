/**
 * @class Teselagen.renderer.annotate.SequenceRenderer
 * Class which handles SVG generating and rendering of the DNA sequence, both 
 * forward and reverse, as well as miscellaneous features like the bp labels and
 * amino acid sequences.
 * @author Micah Lerner
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SequenceRenderer.as)
 */
Ext.define("Teselagen.renderer.annotate.SequenceRenderer", {
    requires: ["Teselagen.bio.enzymes.RestrictionCutSite",
               "Teselagen.bio.orf.ORF",
               "Teselagen.bio.sequence.common.Annotation",
               "Teselagen.models.sequence.Row",
               "Teselagen.utils.SystemUtils"],

    statics: {
        FONT_SIZE: 12,
        FONT_FAMILY: "Ubuntu Mono",
        COMPLEMENTARY_SEQUENCE_FILL: "#b0b0b0",
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

        needsMeasurement: false
    },

    aminoAcidsString1: null,
    aminoAcidsString2: null,
    aminoAcidsString3: null,

    aminoAcidsStringRevCom1: null,
    aminoAcidsStringRevCom2: null,
    aminoAcidsStringRevCom3: null,

    constructor: function(inData){
        this.initConfig(inData);
        this.sequenceAnnotationManager = this.sequenceAnnotator;
        this.sequenceAnnotator = this.sequenceAnnotator.sequenceAnnotator;
    },

    update: function(){
        this.rows = [];
        this.numRows = Math.round((Math.ceil(((contentHolder.sequenceProvider.sequence.length + 1) / 50))));
    },

    render: function(){
        var newRows = [];

        this.aminoAcidsString1 = this.sequenceAnnotator.getAaManager().getSequenceFrame(0, true);
        this.aminoAcidsString2 = this.sequenceAnnotator.getAaManager().getSequenceFrame(1, true);
        this.aminoAcidsString3 = this.sequenceAnnotator.getAaManager().getSequenceFrame(2, true);

        this.aminoAcidsStringRevCom1 = this.sequenceAnnotator.getAaManager().getRevComFrame(0, true);
        this.aminoAcidsStringRevCom2 = this.sequenceAnnotator.getAaManager().getRevComFrame(1, true);
        this.aminoAcidsStringRevCom3 = this.sequenceAnnotator.getAaManager().getRevComFrame(2, true);

        this.totalWidth = 0;
        this.totalHeight = 0;
        var sequenceX = 6*3;
        var sequenceY = 0;
        var sequence = this.sequenceAnnotator.getSequenceManager().getSequence().seqString();
        var rows = this.sequenceAnnotator.getRowManager().getRows();
        var sequenceNucleotideMatrix = [];

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
                        row.getRowData().getCutSitesAlignment().getValues()) + 1) * 30;
                }
            }


            if (this.sequenceAnnotator.getShowOrfs() && row.getRowData().getOrfAlignment()){
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

            if(this.sequenceAnnotator.showAminoAcidsRevCom){
                this.renderAARevCom(row);
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

            var rowSequence = row.getRowData().getSequence();
            this.sequenceAnnotationManager.sequenceSVG.append("svg:text")
                .attr("class", "sequenceSVG")
                .attr("x", sequenceX)
                .attr("y", sequenceY + 20)
                .text(sequenceString);

            row.metrics.x = rowX;
            row.metrics.y = rowY;
            row.metrics.width = rowWidth;
            row.metrics.height = rowHeight;

            row.getRowData().sequenceString = sequenceString;

            var newMetrics = {"x": rowX, "y": rowY, "width": rowWidth, "height": rowHeight};
            var newSequenceMetrics = {"x": sequenceX, "y": sequenceY, "width": sequenceWidth, "height": sequenceHeight};
            row.sequenceMetrics.x = sequenceX;
            row.sequenceMetrics.y = sequenceY;
            row.sequenceMetrics.width = sequenceWidth;
            row.sequenceMetrics.height = sequenceHeight;
            
            var newRow = Ext.create("Teselagen.models.sequence.Row", {
                rowData: row.getRowData(),
                metrics: newMetrics,
                sequenceMetrics: newSequenceMetrics,
                index: i
            });
            newRows.push(newRow);

            this.renderBpLabel(row.getRowData().getStart() + 1, rowX + 10, 
                               sequenceY + 20);
        }
        
        this.sequenceAnnotator.getRowManager().setRows(newRows);
        this.sequenceAnnotator.setAnnotator(this.sequenceAnnotationManager);

        this.sequenceAnnotationManager.sequenceSVG.selectAll("text")
                        .attr("font-family", this.self.FONT_FAMILY)
                        .attr("font-size", this.self.FONT_SIZE)
                        .attr("letter-spacing", this.self.LETTER_SPACING);

        this.sequenceAnnotationManager.sequenceSVG.selectAll(".complementarySequenceSVG")
                        .attr("fill", this.self.COMPLEMENTARY_SEQUENCE_FILL);

        this.sequenceAnnotationManager.sequenceSVG.selectAll(".bpLabelSVG")
                        .attr("xml:space", "preserve");
                        

        this.sequenceAnnotationManager.aminoAcidsSVG.selectAll("text")
                        .attr("xml:space", "preserve")
                        .attr("fill", "blue")
                        .attr("font-family", this.self.FONT_FAMILY)
                        .attr("font-size", this.self.FONT_SIZE)
                        .attr("letter-spacing", this.self.LETTER_SPACING);
    },

    getUpdatedRows: function(){
        return this.sequenceAnnotator.getRowManager().getRows();
    },

    splitWithSpaces: function(pString, pShift, pSplitLast){
        var result = "";
        var stringLength = pString.length;

        if(stringLength <= 10 - pShift){
            result += pString;
        } else {
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
        var baseStart;
        var aaStart = [];
        var aaEnd = [];
        
        // Which frame will be displaying at the first character of the row.
        var leadingFrame;

        // Array of how many characters to indent each frame's aa display.
        var aaPadding = [];

        // Array of offsets to add to the index of each frame's first displayed aa.
        var frontOffsets = [];

        var start = row.getRowData().getStart();
        var end = row.getRowData().getEnd();

        leadingFrame = start % 3;

        // Indent the aa displays appropriately, based on which frame leads.
        aaPadding[leadingFrame] = 0;
        aaPadding[(leadingFrame + 1) % 3] = 1;
        aaPadding[(leadingFrame + 2) % 3] = 2;

        // Based on which frame is leading, set the offsets.
        if(leadingFrame === 0) {
            frontOffsets = [0, 0, 0];
        } else if(leadingFrame === 2) {
            frontOffsets = [1, 1, 0];
        } else {
            frontOffsets = [1, 0, 0];
        }

        // Calculate which aa index should first be displayed for each frame.
        baseStart = Math.floor(start / 3) * 2; // *2 to account for spaces in the aa sequence.
        
        aaStart[0] = baseStart + frontOffsets[0] * 2;
        aaStart[1] = baseStart + frontOffsets[1] * 2;
        aaStart[2] = baseStart + frontOffsets[2] * 2;

        // Calculate which aa index will be displayed last for each frame. 
        aaEnd[leadingFrame] = aaStart[leadingFrame] + 
                                            Math.ceil((end - start + 1) / 3) * 2;

        aaEnd[(leadingFrame + 1) % 3] = aaStart[(leadingFrame + 1) % 3] + 
                                            Math.ceil((end - start) / 3) * 2;

        aaEnd[(leadingFrame + 2) % 3] = aaStart[(leadingFrame + 2) % 3] + 
                                            Math.ceil((end - start - 1) / 3) * 2;

        var aminoAcids1 = this.aminoAcidsString1.substring(aaStart[0], aaEnd[0]);
        var aminoAcids2 = this.aminoAcidsString2.substring(aaStart[1], aaEnd[1]);
        var aminoAcids3 = this.aminoAcidsString3.substring(aaStart[2], aaEnd[2]);

        aminoAcids1 = aminoAcids1.replace(/ /g, "  ");
        aminoAcids2 = aminoAcids2.replace(/ /g, "  ");
        aminoAcids3 = aminoAcids3.replace(/ /g, "  ");

        if(this.sequenceAnnotator.showSpaceEvery10Bp){
            aminoAcids1 = this.splitWithSpaces(aminoAcids1, aaPadding[0], false);
            aminoAcids2 = this.splitWithSpaces(aminoAcids2, aaPadding[1], false);
            aminoAcids3 = this.splitWithSpaces(aminoAcids3, aaPadding[2], false);
        }

        var verticalOffset = 0;
        if(row.getRowData().getOrfAlignment()) {
            verticalOffset = row.getRowData().getOrfAlignment().getCount() * 8;
        }

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "aminoAcidSVG")
            .attr("x", (6 + aaPadding[0]) * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight - verticalOffset)
            .text(aminoAcids1);

        this.totalHeight += 20;

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "aminoAcidSVG")
            .attr("x", (6 + aaPadding[1]) * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight - verticalOffset)
            .text(aminoAcids2);

        this.totalHeight += 20;

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "aminoAcidSVG")
            .attr("x", (6 + aaPadding[2]) * this.sequenceAnnotationManager.self.CHAR_WIDTH) 
            .attr("y", this.totalHeight - verticalOffset)
            .text(aminoAcids3);

        this.totalHeight += 20;
    },

    renderAARevCom: function(row) {
        var baseStart;
        var aaStart = [];
        var aaEnd = [];
        
        // Which frame will be displaying at the first character of the row.
        var leadingFrame;

        // Depending on which frame is leading, this determines how far the rows
        // will be indented from the right side of the sequence.
        var aaOffsets = [];

        // Array of how many characters to indent each frame's aa display (from the start).
        var aaPadding = [];

        // Array of offsets to add to the index of each frame's first displayed aa.
        var frontOffsets = [];

        var seqLen = this.sequenceAnnotator.getSequenceManager().getSequence().toString().length;

        var start = seqLen - row.getRowData().getEnd() - 1;
        var end = seqLen - row.getRowData().getStart() - 1;

        leadingFrame = Math.abs(start) % 3;

        // Based on which frame is leading, set the offsets.
        if(leadingFrame === 0) {
            frontOffsets = [0, 0, 0];
        } else if(leadingFrame === 2) {
            frontOffsets = [1, 1, 0];
        } else {
            frontOffsets = [1, 0, 0];
        }

        // Calculate which aa index should first be displayed for each frame.
        baseStart = Math.floor(start / 3) * 2; // *2 to account for spaces in the aa sequence.
        
        aaStart[0] = baseStart + frontOffsets[0] * 2;
        aaStart[1] = baseStart + frontOffsets[1] * 2;
        aaStart[2] = baseStart + frontOffsets[2] * 2;

        // Calculate which aa index will be displayed last for each frame. 
        if(row.getIndex() !== this.sequenceAnnotator.getRowManager().getRows().length - 1) {
            aaEnd[leadingFrame] = aaStart[leadingFrame] + 
                                                Math.ceil((end - start + 1) / 3) * 2;

            aaEnd[(leadingFrame + 1) % 3] = aaStart[(leadingFrame + 1) % 3] + 
                                                Math.ceil((end - start) / 3) * 2;

            aaEnd[(leadingFrame + 2) % 3] = aaStart[(leadingFrame + 2) % 3] + 
                                                Math.ceil((end - start - 1) / 3) * 2;
        // Calculate the end index for the last row.
        } else {
            aaEnd[0] = Math.ceil(row.getRowData().getSequence().length / 3) * 2;
            aaEnd[1] = Math.ceil((row.getRowData().getSequence().length - 1) / 3) * 2;
            aaEnd[2] = Math.ceil((row.getRowData().getSequence().length - 2) / 3) * 2;
        }

        var aminoAcids1 = this.aminoAcidsStringRevCom1.substring(aaStart[0], aaEnd[0]);
        var aminoAcids2 = this.aminoAcidsStringRevCom2.substring(aaStart[1], aaEnd[1]);
        var aminoAcids3 = this.aminoAcidsStringRevCom3.substring(aaStart[2], aaEnd[2]);

        aminoAcids1 = aminoAcids1.replace(/ /g, "  ");
        aminoAcids2 = aminoAcids2.replace(/ /g, "  ");
        aminoAcids3 = aminoAcids3.replace(/ /g, "  ");

        var acids = [aminoAcids1, aminoAcids2, aminoAcids3];

        // Indent the aa displays appropriately, based on which frame leads.
        aaPadding[leadingFrame] = end - start + 1 - acids[leadingFrame].length;
        aaPadding[(leadingFrame + 1) % 3] = end - start - acids[(leadingFrame + 1) % 3].length;
        aaPadding[(leadingFrame + 2) % 3] = end - start - 1 - acids[(leadingFrame + 2) % 3].length;

        // Last row is a special case.
        if(row.getIndex() === this.sequenceAnnotator.getRowManager().getRows().length - 1) {
            var rowLength = row.getRowData().getSequence().length;
            var extraBases = 0;

            // Ensure that the "extra" bases at the end of the sequence don't
            // screw up the alignment of the reverse complement amino acids.
            if(this.sequenceAnnotator.showSpaceEvery10Bp) {
                extraBases = 10 - rowLength % 10;
            }

            aaPadding[0] = rowLength - 1 - aminoAcids1.length;
            aaPadding[1] = rowLength - 2 - aminoAcids2.length;
            aaPadding[2] = rowLength - 3 - aminoAcids3.length;

            aminoAcids1 = this.splitWithSpaces(aminoAcids1, 0 + extraBases, false).split("").reverse().join("");
            aminoAcids2 = this.splitWithSpaces(aminoAcids2, 1 + extraBases, false).split("").reverse().join("");
            aminoAcids3 = this.splitWithSpaces(aminoAcids3, 2 + extraBases, false).split("").reverse().join("");

            aminoAcids1 = aminoAcids1.replace(/^\s{2,}/, "   ");
            aminoAcids2 = aminoAcids2.replace(/^\s{2,}/, "   ");
            aminoAcids3 = aminoAcids3.replace(/^\s{2,}/, "   ");
        } else if(this.sequenceAnnotator.showSpaceEvery10Bp){
            aaOffsets[leadingFrame] = 0;
            aaOffsets[(leadingFrame + 1) % 3] = 1;
            aaOffsets[(leadingFrame + 2) % 3] = 2;

            aminoAcids1 = this.splitWithSpaces(aminoAcids1, aaOffsets[0], false).split("").reverse().join("");
            aminoAcids2 = this.splitWithSpaces(aminoAcids2, aaOffsets[1], false).split("").reverse().join("");
            aminoAcids3 = this.splitWithSpaces(aminoAcids3, aaOffsets[2], false).split("").reverse().join("");
        } else {
            aminoAcids1 = aminoAcids1.split("").reverse().join("");
            aminoAcids2 = aminoAcids2.split("").reverse().join("");
            aminoAcids3 = aminoAcids3.split("").reverse().join("");
        }

        var verticalOffset = 15;

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "revComAminoAcidSVG")
            .attr("x", (6 + aaPadding[0]) * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight + verticalOffset)
            .text(aminoAcids1);

        this.totalHeight += 20;

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "revComAminoAcidSVG")
            .attr("x", (6 + aaPadding[1]) * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight + verticalOffset)
            .text(aminoAcids2);

        this.totalHeight += 20;

        this.sequenceAnnotationManager.aminoAcidsSVG.append("svg:text")
            .attr("class", "revComAminoAcidSVG")
            .attr("x", (6 + aaPadding[2]) * this.sequenceAnnotationManager.self.CHAR_WIDTH) 
            .attr("y", this.totalHeight + verticalOffset)
            .text(aminoAcids3);

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

        this.sequenceAnnotationManager.sequenceSVG.append("svg:text")
            .attr("class", "complementarySequenceSVG")
            .attr("x", 6 * this.sequenceAnnotationManager.self.CHAR_WIDTH)
            .attr("y", this.totalHeight + 
                  this.self.COMPLEMENTARY_VERTICAL_OFFSET)
            .text(sequenceString);

        this.totalHeight += 20;
    },

    renderIndexString: function(pIndex){
        var result = String(pIndex);

        if(pIndex < 10){
            result = "   "  + result;
        } else if(pIndex < 100){
            result = "  " + result;
        }else if(pIndex < 1000){
            result = " " + result;
        } else if(pIndex < 10000){
            result = "" + result;
        }

        return result;
    },

    renderBpLabel: function(basePairs, labelX, labelY){
        this.sequenceAnnotationManager.sequenceSVG.append("svg:text")
            .attr("class", "bpLabelSVG")
            .attr("x", labelX)
            .attr("y", labelY)
            .text(this.renderIndexString(basePairs));
    }
});
