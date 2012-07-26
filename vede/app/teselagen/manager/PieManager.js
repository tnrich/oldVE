/**
 * @class Teselagen.manager.PieManager
 * Manages renderers and aggregates rendered sprites to return to PieController.
 */
Ext.define("Teselagen.manager.PieManager", {
    config: {
        sequenceManager: null,
        center: 0,
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
});
