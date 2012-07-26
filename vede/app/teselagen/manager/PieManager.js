/**
 * @class Teselagen.manager.PieManager
 * Manages renderers and aggregates rendered sprites to return to PieController.
 */
Ext.define("Teselagen.manager.PieManager", {
    config: {
        sequenceManager: null,
        center: 0,
        pie: null,
        railRadius: 0,
        cutSites: [],
        features: [],
        orfs: [],
        traces: [],
    },

    featureRenderer: null,
    cutSiteRenderer: null,
    traceRenderer: null,
    orfRenderer: null

    renderers: [this.featureRenderer,
                this.cutSiteRenderer,
                this.traceRenderer,
                this.orfRenderer],

    constructor: function(inData) {
        this.initConfig();

        this.pie = Ext.create("Vede.view.pie.Pie");

        this.cutSiteRenderer = Ext.create("Teselagen.renderer.pie.CutSiteRenderer", {
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            cutSites: this.cutSites
        });

        this.featureRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            features: this.features
        });

        this.orfRenderer = Ext.create("Teselagen.renderer.pie.ORFRenderer", {
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            orfs: this.orfs
        });

        this.traceRenderer = Ext.create("Teselagen.renderer.pie.TraceRenderer", {
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            traces: this.traces
        });
    },

    render: function() {
        var traceSprites = this.traceRenderer.render();
        var cutSiteSprites = this.cutSiteRenderer.render();
        var featureSprites = this.featureRenderer.render();
        var orfSprites = this.orfRenderer.render();

        return [].concat(traceSprites, cutSiteSprites, featureSprites, orfSprites);
    },

    applySequenceManager: function(pSequenceManager) {
        Ext.each(this.renderers, function(renderer) {
            renderer.setSequenceManager(pSequenceManager);
        });

        return pSequenceManager;
    },

    applyCenter: function(pCenter) {
        Ext.each(this.renderers, function(renderer) {
            renderer.setCenter(pCenter);
        });

        return pCenter;
    },

    applyRailRadius: function(pRailRadius) {
        Ext.each(this.renderers, function(renderer) {
            renderer.setRailRadius(pRailRadius);
        });

        return pRailRadius;
    },

    applyCutSits: function(pCutSites) {
        this.cutSiteRenderer.setCutSites(pCutSites);

        return pCutSites;
    },

    applyFeatures: function(pFeatures) {
        this.featureRenderer.setFeatures(pFeatures);

        return pFeatures;
    },

    applyOrfs: function(pOrfs) {
        this.orfRenderer.setOrfs(pOrfs);

        return pOrfs;
    },

    applyTraces: function(pTraces) {
        this.traceRenderer.setTraces(pTraces);

        return pTraces;
    },
    
    initPie: function() {
    	var base = Ext.create('Ext.draw.Sprite',{
            type: 'circle',
            fill: '#79BB3F',
            radius: 100,
            x: 100,
            y: 100,
        });
        var caret = Ext.create('Ext.draw.Sprite',{
            type: 'path',
            path: 'M 10 10 L 100 100',
            stroke: 'black',
        });
        this.pie.surface.add(base);
//        this.surface.add(pie, caret);

    }
});
