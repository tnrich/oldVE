Ext.define("Vede.view.annotate.Annotator", {
    extend: "Ext.draw.Component",
    alias: "widget.annotator",

    autoScroll: true,
    config: {
        sequenceAnnotator: null,
        sequenceSVG: null,
        annotateSVG: null,
        bpLabelsSVG: null,
        linesSVG: null,

        featureRenderers: null,
        cutSiteRenderers: null,
        orfRenderers: null,
        sequenceRenderer: null,
        yMax: null,
        xMax: null,
        id: null,
        panel: null,
        dirty: false,
        featureRows: 2,
        BP_PER_LINE: 60,
        bpPerRow: 60,
        aminoSequencesShown: 5,
    },

    constructor: function(inData){
        this.callParent([inData]);
        this.initConfig(inData);
        this.id = "AnnotationSurface";
        //console.log("Created Annotator");
        this.sequenceAnnotator = inData.sequenceAnnotator;

        //this.lineRenderer = Ext.create("Teselagen.renderer.annotation.LineRender", {});
        this.annotateSVG = d3.select("#AnnotateContainer")
            .append("svg:svg")
            .attr("id", "annotateSVG");
        
        this.linesSVG = this.annotateSVG.append("svg:g")
            .attr("id", "linesSVG");

        this.sequenceSVG = this.annotateSVG.append("svg:g")
            .attr("id", "sequenceSVG");

        this.bpLabelsSVG = this.annotateSVG.append("svg:g")
                .attr("id", "bpLabelsSVG");

        this.aminoAcidsSVG = this.annotateSVG.append("svg:g")
                .attr("id", "aminoAcidsSVG");

        this.featuresSVG = this.annotateSVG.append("svg:g")
                .attr("id", "featuresSVG");
        this.createSequenceRenderer();
    },
    
    sequenceChanged: function(){
    },

    render: function(){
       // this.updateAverageRowHeight();
        this.clean();
        this.panel = Ext.getCmp('AnnotatePanel');
        this.xMax = this.panel.getBox().width;
        this.yMax = this.panel.getBox().height;

        //console.log(this.lines); 
        var x1 = 10;
        //console.log(this.yMax);
        var y = 20;
        
        if(this.sequenceAnnotator.getSequenceManager()) {
            console.log(this.sequenceRenderer.getTotalHeight());
            this.renderSequence();
            this.drawSplitLines();
            //this.renderLines();
            /*`for ( var i = 0; i < this.sequenceAnnotator.getRowManager().getRows().length; ++i){
                var row = this.sequenceAnnotator.getRowManager().getRows()[i]; 
                adjustedHeight =  y + (30 * (this.aminoSequencesShown + 1)); 
                var distanceFromLine = y + 30;
                var distanceFromAABottom = distanceFromLine + 60;
                //Sequence will always be at 100 indented, but y might change based
                //upon whether amino acids are being shown
                //this.renderSequence(row, 100, distanceFromAABottom);

                //BpLabel will always be indented 10, but y might change based upon
                //whether amino acids are being shown
                this.renderBpLabel(i * this.BP_PER_LINE + 1, 10, distanceFromAABottom);

                //lines will always be rendered at the initial x mark, but
                //y changes, and xMax changes (based on resizing of panel)
                this.renderLine(x1, y, 1024, y);
                
                
                this.renderAminoAcids(row, 100, distanceFromLine);
                //this.renderBpLabels();
                //this.renderFeatures();
                y += (20 * 1.5 * (this.aminoSequencesShown+ 1));
                
            }*/

            this.loadFeatureRenderers();
            this.renderFeatures();
            this.loadCutSiteRenderers();
            this.renderCutSites();

            this.loadOrfRenderers();
            this.renderOrfs();
            this.annotateSVG.attr("height", this.sequenceRenderer.getTotalHeight());

        }


        //console.log(this.lines.length);
        
        //console.log("rendered annotator");
            //line renderer
                //text render
            //amino acid renderer
    },

    loadFeatureRenderers: function(){
        this.removeFeatureRenderers();
        var retrievedFeatures = this.sequenceAnnotator.getSequenceManager().getFeatures();
        if (!this.sequenceAnnotator.getShowFeatures() 
            || !retrievedFeatures){
            return;
        }
        
        var that = this;
        for (var i = 0; i < retrievedFeatures.length; i++){
            var feature = retrievedFeatures[i];
            var featureRenderer = Ext.create("Teselagen.renderer.annotate.FeatureRenderer", {
                sequenceAnnotator: that,
                feature: feature
            });
            this.featureRenderers.push(featureRenderer);
        }
    },

    removeFeatureRenderers: function(){
        this.featureRenderers = [];
    },

    loadCutSiteRenderers: function() {
        this.removeCutSiteRenderers();
        var retrievedCutSites = this.sequenceAnnotator.restrictionEnzymeManager.getCutSites();
        if(!this.sequenceAnnotator.getShowCutSites() || !retrievedCutSites) {
            return;
        }

        var that = this;
        Ext.each(retrievedCutSites, function(site) {
            var cutSiteRenderer = Ext.create("Teselagen.renderer.annotate.CutSiteRenderer", {
                sequenceAnnotator: this,
                cutSite: site
            });

            this.cutSiteRenderers.push(cutSiteRenderer);
        }, this);
    },

    removeCutSiteRenderers: function() {
        this.setCutSiteRenderers([]);
    },

    loadOrfRenderers: function() {
        this.removeOrfRenderers();
        var retrievedOrfs = this.sequenceAnnotator.orfManager.getOrfs();
        if(!this.sequenceAnnotator.getShowOrfs() || !retrievedOrfs) {
            return;
        }

        Ext.each(retrievedOrfs, function(orf) {
            var orfRenderer = Ext.create("Teselagen.renderer.annotate.ORFRenderer", {
                sequenceAnnotator: this,
                orf: orf
            });

            this.orfRenderers.push(orfRenderer);
        }, this);
    },

    removeOrfRenderers: function() {
        this.setOrfRenderers([]);
    },


    bpMetricsByIndex: function(pIndex){
        if(!this.isValidIndex(pIndex)){
            return null;
            throw new Error("Can't get bp metrics for bp with index " + String(pIndex));
        }

        var row = this.rowByBpIndex(pIndex);
        var resultsMetrics;

        if (row == null){
            throw new Error("Can't get bp point for index: " + String(pIndex));
        }else{
            var numberOfCharacters = pIndex - row.getIndex() * this.sequenceAnnotator.getBpPerRow();

            
            if(this.sequenceAnnotator.showSpaceEvery10Bp){
                numberOfCharacters += Math.floor(numberOfCharacters/10);
            }

            var bpX = row.getSequenceMetrics().x + numberOfCharacters * 16;//this.sequenceSymbolRenderer.getTextWidth();
            var bpY = row.getSequenceMetrics().y;
            resultsMetrics = Ext.create("Teselagen.models.Rectangle", {
                x: bpX,
                y: bpY,
                width: 2, //fix to make resizable
                height: 3,
            });
        }
        return resultsMetrics;
    },

    rowByBpIndex: function(pIndex){
        if(!this.isValidIndex(pIndex)){
            return null;
            throw new Error("Can't get bp metrics for bp with index " + String(pIndex));
        }
    //    console.log("Row by bp Index result: " + this.sequenceAnnotator.getRowManager().getRows()[Math.floor(pIndex/this.sequenceAnnotator.getBpPerRow())]);

        return this.sequenceAnnotator.getRowManager().getRows()[Math.floor(pIndex/this.sequenceAnnotator.getBpPerRow())];
    },

   
    isValidIndex: function(pIndex){
        return pIndex >= 0 && pIndex <= this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length;
    },

    renderSequence: function(){
        this.sequenceRenderer.render();
        for(var i = 0; i < this.sequenceAnnotator.sequenceManager.getSequence().toString().length; i++) {
            var metrics = this.bpMetricsByIndex(i);
            this.sequenceSVG.append("svg:text")
                .attr("x", metrics.x)
                .attr("y", metrics.y + 5)
                .attr("font-size", "6px")
                .text(i);
        }
        /*this.sequenceSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y)
            .text(row.getRowData().getSequence())
            .attr("font-face", "Verdana")
            .attr("textLength", 917)
            .attr("font-size", 20);
        this.sequenceSVG.append("svg:text")
            .attr("x", x)
            .attr("y", y + 25)
            .text(row.getRowData().getOppositeSequence())
             .attr("textLength", 917)
            .attr("font-face", "Verdana")
            .attr("font-size", 20);*/
    },

    renderBpLabel: function(basePairs, labelX, labelY){
        this.bpLabelsSVG.append("svg:text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("font-face", "Verdana")
            .attr("font-size", 20)
            .text(String(basePairs));
    },

    renderAminoAcids: function(row, labelX, labelY){
        var aaStart, aaEnd;

        var aminoAcids1 = this.sequenceAnnotator.getAaManager().getSequenceFrame(0, true).replace(/\s/g, '');
        var aminoAcids2 = this.sequenceAnnotator.getAaManager().getSequenceFrame(1, true).replace(/\s/g, '');
        var aminoAcids3 = this.sequenceAnnotator.getAaManager().getSequenceFrame(2, true).replace(/\s/g, '');

        var start = row.getRowData().getStart();
		var end = row.getRowData().getEnd();
        /*console.log("Row start: " + (start));
        console.log("Row end: " + (end));
        console.log("Before substringing: " + aminoAcids1.replace(/\s/g, ''));*/
        if (start > 3){
            aaStart = (start - 1) / 3;
        }else{
            aaStart = start;
        }
        if (end > 3){
            aaEnd = end / 3;
        }else{
            aaStart = end;
        }
        /*console.log("AA row start: " + aaStart); 
        console.log("AA row end: " + aaEnd); */
			var aminoAcidsString1 = aminoAcids1.substring(aaStart, aaEnd ).replace(/ /g, "      ");
            //console.log("Frame 1: " + aminoAcidsString1);
			var aminoAcidsString2 = aminoAcids2.substring(aaStart, aaEnd).replace(/ /g, "      ");
			var aminoAcidsString3 = aminoAcids3.substring(aaStart, aaEnd).replace(/ /g, "      ");
        this.aminoAcidsSVG.append("svg:text")
            .attr("x", labelX)
            .attr("y", labelY - 10)
            .attr("font-face", "Verdana")
            .attr("font-size", 20)
            .attr("textLength", 917)
            .attr("xml:space", "preserve")
            .attr("fill", "blue")
            .text(aminoAcidsString1);
        this.aminoAcidsSVG.append("svg:text")
            .attr("x", labelX + 15)
            .attr("y", labelY + 15)
            .attr("font-face", "Verdana")
            .attr("font-size", 20)
            .attr("textLength", 917)
            .attr("xml:space", "preserve")
            .attr("fill", "blue")
            .text(aminoAcidsString2);
        this.aminoAcidsSVG.append("svg:text")
            .attr("x", labelX + 32)
            .attr("y", labelY + 40)
            .attr("font-face", "Verdana")
            .attr("font-size", 20)
            .attr("textLength", 917)
            .attr("xml:space", "preserve")
            .attr("fill", "blue")
            .text(aminoAcidsString3);
    },

    renderFeatures: function(){
        if (this.sequenceAnnotator.getShowFeatures()){
            for (var i = 0; i < this.featureRenderers.length; ++i){
                var featureRenderer = this.featureRenderers[i];
                featureRenderer.render();
                
            }
        }
    },

    renderCutSites: function() {
        d3.selectAll("#cutSiteSVG").remove();
        if(this.sequenceAnnotator.getShowCutSites()) {
            Ext.each(this.cutSiteRenderers, function(renderer) {
                renderer.render();
            });
        }
    },

    renderOrfs: function() {
        d3.selectAll("#orfSVG").remove();
        if(this.sequenceAnnotator.getShowOrfs()) {
            Ext.each(this.orfRenderers, function(renderer) {
                renderer.render();
            });
        }
    },

    drawSplitLines: function(){
        console.log(this.sequenceRenderer.getSequenceAnnotationManager().sequenceAnnotator);
        var rows = this.sequenceRenderer.sequenceAnnotator.getRowManager().getRows();
        for (var i = 0; i < rows.length; ++i){
            var row = rows[i];
            if( i != rows.length ){
                var rowSequenceMetrics = row.getSequenceMetrics();
                var rowMetrics = row.getMetrics();
                console.log('Row sequence metrics y position: ' + rowSequenceMetrics.y);
                console.log('Row metrics y position: ' + rowMetrics.y);
                this.linesSVG.append("svg:line")
                    .attr("x1", rowMetrics.x)
                    .attr("y1", rowMetrics.y)
                    .attr("x2", rowMetrics.x + (row.getRowData().getSequence().length* 20))
                    .attr("y2", rowMetrics.y)
                    .attr("stroke", "lightgray");

            }
        }
    },
    renderLine: function(x1, y1, x2, y2){
        this.lines    },

    updateAverageRowHeight: function(){
        var totalHeight = 0;
        var retrievedRows = this.sequenceAnnotator.getRowManager().getRows();

        for (var i = 0; i < retrievedRows.length; i++){
            var row = retrievedRows[i];
            totalHeight += row.getMetrics().height;

            averageRowHeight = (retrievedRows.length > 0) ? (totalHeight / retrievedRows.length) : 0;
        }
    },

    createSequenceRenderer: function(){
        if (this.sequenceRenderer == null){
            this.sequenceRenderer = Ext.create("Teselagen.renderer.annotate.SequenceRenderer",
                    {
                        sequenceAnnotator: this,
                    }
            );
        }
    },
    clean: function(){
        d3.select("#linesSVG").remove(); 
        d3.select("#sequenceSVG").remove(); 
        d3.select("#bpLabelsSVG").remove(); 
        d3.select("#aminoAcidsSVG").remove(); 
        d3.select("#featuresSVG").remove(); 

        this.linesSVG = this.annotateSVG.append("svg:g")
            .attr("id", "linesSVG");

        this.sequenceSVG = this.annotateSVG.append("svg:g")
            .attr("id", "sequenceSVG");
        
        this.bpLabelsSVG = this.annotateSVG.append("svg:g")
                .attr("id", "bpLabelsSVG");

        this.aminoAcidsSVG = this.annotateSVG.append("svg:g")
                .attr("id", "aminoAcidsSVG");
        this.featuresSVG = this.annotateSVG.append("svg:g")
                .attr("id", "featuresSVG");
    },

});
