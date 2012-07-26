/**
 * @class Teselagen.manager.PieManager
 * Manages renderers and aggregates rendered sprites to return to PieController.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.PieManager", {
    config: {
        sequenceManager: null,
        center: {x: 0, y: 0},
        railRadius: 0,
        cutSites: [],
        features: [],
        orfs: [],
    },

    cutSiteRenderer: null,
    orfRenderer: null,

    renderers: [],

    dirty: false,
    sequenceManagerChanged: false,
    centerChanged: false,
    railRadiusChanged: false,
    cutSitesChanged: false,
    featuresChanged: false,
    orfsChanged: false,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager to obtain the sequence from.
     * @param {Object} center An object with parameters x and y, containing the
     * coordinates of the center of the pie.
     * @param {Int} railRadius
     */
    constructor: function(inData) {
        this.initConfig(inData);

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

        /*this.traceRenderer = Ext.create("Teselagen.renderer.pie.TraceRenderer", {
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            traces: this.traces
        });*/

        this.renderers = [this.cutSiteRenderer,
                          this.featureRenderer,
                          this.orfRenderer];
    },

    /**
     * First checks to see if any parameters need to be updated on renderers,
     * then returns a list of sprites from all renderers.
     * @return {Array<Ext.draw.Sprite>} A list of sprites aggregated from all
     * renderers.
     */
    render: function() {
        if(this.dirty) {
            Ext.each(this.renderers, function(renderer) {
                if(this.sequenceManagerChanged) {
                    renderer.setSequenceManager(this.sequenceManager);
                }
                if(this.railRadiusChanged) {
                    renderer.setRailRadius(this.railRadius);
                }
                if(this.centerChanged) {
                    renderer.setCenter(this.center);
                }
            }, this);

            this.dirty = false;
            this.sequenceManagerChanged = false;
            this.railRadiusChanged = false;
            this.centerChanged = false;
        }

        if(this.cutSitesChanged) {
            this.cutSiteRenderer.setCutSites(this.cutSites);
        }

        if(this.featuresChanged) {
            this.featureRenderer.setFeatures(this.features);
        }

        if(this.orfsChanged) {
            this.orfRenderer.setOrfs(this.orfs);
        }

        var cutSiteSprites = this.cutSiteRenderer.render();
        var featureSprites = this.featureRenderer.render();
        var orfSprites = this.orfRenderer.render();

        return [].concat(traceSprites, cutSiteSprites, featureSprites, orfSprites);
    },

    applySequenceManager: function(pSequenceManager) {
        this.dirty = true;
        this.sequenceManagerChanged = true;

        return pSequenceManager;
    },

    applyCenter: function(pCenter) {
        this.dirty = true;
        this.centerChanged = true;

        return pCenter;
    },

    applyRailRadius: function(pRailRadius) {
        this.dirty = true;
        this.railRadiusChanged = true;

        return pRailRadius;
    },

    applyCutSites: function(pCutSites) {
        this.cutSitesChanged = true;

        return pCutSites;
    },

    applyFeatures: function(pFeatures) {
        this.featuresChanged = true;

        return pFeatures;
    },

    applyOrfs: function(pOrfs) {
        this.orfsChanged = true;

        return pOrfs;
    },
});
