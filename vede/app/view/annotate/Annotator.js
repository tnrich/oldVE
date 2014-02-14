/**
 * @class Vede.view.annotate.Annotator
 * Class which handles rendering in the annotate panel.
 */
Ext.define("Vede.view.annotate.Annotator", {
    requires: ["Teselagen.models.Rectangle",
               "Teselagen.renderer.annotate.CutSiteRenderer",
               "Teselagen.renderer.annotate.FeatureRenderer",
               "Teselagen.renderer.annotate.ORFRenderer",
               "Teselagen.renderer.annotate.SequenceRenderer"],

    extend: "Ext.draw.Component",
    alias: "widget.annotator",

    statics: {
        CHAR_WIDTH: 9
    },

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
        aminoSequencesShown: 5
    },

    /**
     * @member Vede.view.annotate.Annotator
     */
    constructor: function(inData){
        this.callParent([inData]);
        this.initConfig(inData);
        this.cls = "AnnotationSurface";

        // Firefox doesn't support SVG's text-width, so we have to modify
        // CHAR_WIDTH if the user is using Firefox.
        if(Ext.isGecko) {
            this.self.CHAR_WIDTH = 6;
        }

        this.sequenceAnnotator = inData.sequenceAnnotator;

        this.createSequenceRenderer();
    },

    init: function() {
        var containerId = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='AnnotateContainer']").el.dom.id;

        // Only add new svg elements if there isn't already one present.
        if(!d3.select("#" + containerId + " .annotateSVG").node()) {
            this.annotateSVG = d3.select("#" + containerId + ".AnnotateContainer")
                .append("svg:svg")
                .attr("class", "annotateSVG");

            this.linesSVG = this.annotateSVG.append("svg:g")
                .attr("class", "linesSVG");

            this.sequenceSVG = this.annotateSVG.append("svg:g")
                .attr("class", "sequenceSVG");

            this.bpLabelsSVG = this.annotateSVG.append("svg:g")
                    .attr("class", "bpLabelsSVG");

            this.aminoAcidsSVG = this.annotateSVG.append("svg:g")
                    .attr("class", "aminoAcidsSVG");

            this.featuresSVG = this.annotateSVG.append("svg:g")
                    .attr("class", "featuresSVG");
        } else {
            this.annotateSVG = d3.select("#" + containerId + " .annotateSVG");
            this.linesSVG = this.annotateSVG.select(".linesSVG");
            this.sequenceSVG = this.annotateSVG.select(".sequenceSVG");
            this.bpLabelsSVG = this.annotateSVG.select(".bpLabelsSVG");
            this.aminoAcidsSVG = this.annotateSVG.select(".aminoAcidsSVG");
            this.featuresSVG = this.annotateSVG.select(".featuresSVG");
        }
    },

    sequenceChanged: function(){
    },

    /**
     * Renders all annotations.
     */
    render: function(){
        this.clean();
        this.panel = Ext.getCmp('mainAppPanel').getActiveTab().down("component[cls='AnnotatePanel']");
        this.xMax = this.panel.getBox().width;
        this.yMax = this.panel.getBox().height;

        var x1 = 10;
        var y = 20;

        if(this.sequenceAnnotator.getSequenceManager()) {
            this.renderSequence();
            this.drawSplitLines();

            d3.selectAll("#" + this.panel.el.dom.id + " .cutSiteSVG").remove();
            d3.selectAll("#" + this.panel.el.dom.id + " .orfSVG").remove();

            if (this.sequenceAnnotator.getShowFeatures()){
                this.loadFeatureRenderers();
                this.renderFeatures();
            }

            if(this.sequenceAnnotator.getShowCutSites()){
                this.loadCutSiteRenderers();
                this.renderCutSites();
            }

            if (this.sequenceAnnotator.getShowOrfs()){
                this.loadOrfRenderers();
                this.renderOrfs();
            }

            this.annotateSVG.attr("height", this.sequenceRenderer.getTotalHeight());
            this.annotateSVG.attr("width", this.sequenceRenderer.getTotalWidth() + 60);
        }
    },

    /**
     * Instantiates feature renderers for all the features.
     */
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
            //console.log("feature " + feature.getName() + " starts at " + feature.getStart() + " and ends at " + feature.getEnd());
            var featureRenderer = Ext.create("Teselagen.renderer.annotate.FeatureRenderer", {
                sequenceAnnotator: that,
                feature: feature
            });
            this.featureRenderers.push(featureRenderer);
        }
    },

    /**
     * Deletes all feature renderers.
     */
    removeFeatureRenderers: function(){
        this.featureRenderers = [];
    },

    /**
     * Instantiates cut site renderers.
     */
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

    /**
     * Deletes cut site renderers.
     */
    removeCutSiteRenderers: function() {
        this.setCutSiteRenderers([]);
    },

    /**
     * Instantiates orf renderers.
     */
    loadOrfRenderers: function() {
        this.removeOrfRenderers();

        var frames = this.sequenceAnnotator.getOrfFrames();
        var retrievedOrfs = this.sequenceAnnotator.orfManager.getOrfsByFrame(frames);

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

    /**
     * Deletes orf renderers.
     */
    removeOrfRenderers: function() {
        this.setOrfRenderers([]);
    },

    /**
     * Given the index of a nucleotide, returns its coordinates in the panel.
     * @param {Int} index The index of the nucleotide to locate.
     * @return {Teselagen.models.Rectangle} The nucleotide's location.
     */
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
                numberOfCharacters += Math.floor(numberOfCharacters / 10);
            }

            var bpX = row.getSequenceMetrics().x + numberOfCharacters * 
                this.self.CHAR_WIDTH;

            var bpY = row.getSequenceMetrics().y;

            resultsMetrics = {
                x: bpX,
                y: bpY,
                width: 2, //fix to make resizable
                height: 3
            };
        }
        return resultsMetrics;
    },

    /**
     * Given a nucleotide index, returns the row it lies in.
     * @param {Int} pIndex The index of the nucleotide to determine the row of.
     * @return {Teselagen.models.sequence.Row} The row object of the nucleotide.
     */
    rowByBpIndex: function(pIndex){
        if(!this.isValidIndex(pIndex)){
            return null;
            throw new Error("Can't get bp metrics for bp with index " + String(pIndex));
        }

        return this.sequenceAnnotator.getRowManager().getRows()[Math.floor(pIndex/this.sequenceAnnotator.getBpPerRow())];
    },

    /**
     * Returns true if the given nucleotide index is between 0 and the sequence
     * length.
     * @param {Int} pIndex The index to check for validity.
     * @return {Boolean} True if the index is valid.
     */
    isValidIndex: function(pIndex){
        return pIndex >= 0 && pIndex <= this.sequenceAnnotator.getSequenceManager().getSequence().seqString().length;
    },

    /**
     * Renders sequence.
     */
    renderSequence: function(){
        this.sequenceRenderer.render();
        // Uncomment to draw nucleotide indices for debugging.
        /*for(var i = 0; i < this.sequenceAnnotator.sequenceManager.getSequence().toString().length; i++) {
            var metrics = this.bpMetricsByIndex(i);
            this.sequenceSVG.append("svg:text")
                .attr("x", metrics.x)
                .attr("y", metrics.y + 5)
                .attr("font-size", "6px")
                .text(i);
        }*/
    },

    /**
     * Renders features.
     */
    renderFeatures: function(){
        if (this.sequenceAnnotator.getShowFeatures()){
            for (var i = 0; i < this.featureRenderers.length; ++i){
                var featureRenderer = this.featureRenderers[i];
                featureRenderer.render();
            }
        }
    },

    /**
     * Renders cut sites.
     */
    renderCutSites: function() {
        if(this.sequenceAnnotator.getShowCutSites()) {
            Ext.each(this.cutSiteRenderers, function(renderer) {
                renderer.render();
            });
        }
    },

    /**
     * Renders orfs.
     */
    renderOrfs: function() {
        if(this.sequenceAnnotator.getShowOrfs()) {
            Ext.each(this.orfRenderers, function(renderer) {
                renderer.render();
            });
        }
    },

    /**
     * Draws lines in between rows.
     */
    drawSplitLines: function(){
        var rows = this.sequenceRenderer.sequenceAnnotator.getRowManager().getRows();
        for (var i = 0; i < rows.length; ++i){
            var row = rows[i];
            if( i != rows.length ){
                var rowSequenceMetrics = row.getSequenceMetrics();
                var rowMetrics = row.getMetrics();
                this.linesSVG.append("svg:line")
                    .attr("x1", rowMetrics.x)
                    .attr("y1", rowMetrics.y)
                    .attr("x2", rowMetrics.x + (row.getRowData().getSequence().length* 20))
                    .attr("y2", rowMetrics.y)
                    .attr("stroke", "lightgray");

            }
        }
    },

    /**
     * Instantiates the sequence renderer.
     */
    createSequenceRenderer: function(){
        if (this.sequenceRenderer == null){
            this.sequenceRenderer = Ext.create("Teselagen.renderer.annotate.SequenceRenderer",
                    {
                        sequenceAnnotator: this
                    }
            );
        }
    },

    /**
     * Removes all SVG objects and re-adds new ones.
     */
    clean: function(){

        d3.selectAll(".linesSVG").remove(); 
        this.linesSVG = this.annotateSVG.append("svg:g")
            .attr("class", "linesSVG");

        d3.selectAll(".sequenceSVG").remove(); 
        this.sequenceSVG = this.annotateSVG.append("svg:g")
            .attr("class", "sequenceSVG");

        d3.selectAll(".bpLabelsSVG").remove(); 
        this.bpLabelsSVG = this.annotateSVG.append("svg:g")
                .attr("class", "bpLabelsSVG");

        d3.selectAll(".aminoAcidsSVG").remove(); 
        this.aminoAcidsSVG = this.annotateSVG.append("svg:g")
                .attr("class", "aminoAcidsSVG");

        d3.selectAll(".featuresSVG").remove(); 
        this.featuresSVG = this.annotateSVG.append("svg:g")
                .attr("class", "featuresSVG");
    }
});
