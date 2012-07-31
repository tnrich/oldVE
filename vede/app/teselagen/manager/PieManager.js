/**
 * @class Teselagen.manager.PieManager
 * Manages renderers and aggregates rendered sprites to return to PieController.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.PieManager", {
    config: {
        sequenceManager: null,
        center: {x: 0, y: 0},
        pie: null,
        railRadius: 0,
        cutSites: [],
        features: [],
        orfs: [],
        showCutSites: true,
        showFeatures: true,
        showOrfs: true
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

    orfSprites: null,
    featureSprites: null,
    cutSiteSprites: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager to obtain the sequence from.
     * @param {Object} center An object with parameters x and y, containing the
     * coordinates of the center of the pie.
     * @param {Int} railRadius The radius of the circular sequence display.
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} cutSites The
     * list of cut sites to be rendered.
     * @param {Array<Teselagen.bio.sequence.common.Annotation>} features The
     * list of features to be rendered.
     * @param {Array<Teselagen.bio.orf.ORF>} orfs The list of orfs to be
     * rendered.
     * @param {Boolean} showCutSites Whether or not to render cut sites.
     * Defaults to true.
     * @param {Boolean} showFeatures Whether or not to render features. Defaults
     * to true.
     * @param {Boolean} showOrfs Whether or not to render orfs. Defaults to
     * true.
     */
    constructor: function(inData) {
        this.initConfig(inData);

        this.pie = Ext.create("Vede.view.pie.Pie", {
            items: [Ext.create("Vede.view.pie.Frame")]
        });

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
        if(this.orfSprites) {
            this.orfSprites.destroy();
            this.featureSprites.destroy();
            this.cutSiteSprites.destroy();
        }

        this.orfSprites = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.pie.surface
        });
        this.featureSprites = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.pie.surface
        });
        this.cutSiteSprites = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.pie.surface
        });
 
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

        if(this.showCutSites) {
            this.cutSiteSprites.addAll(this.cutSiteRenderer.render());
        } 

        if(this.showFeatures) {
            this.featureSprites.addAll(this.featureRenderer.render());
        }

        if(this.showOrfs) {
            this.orfSprites.addAll(this.orfRenderer.render());
        }

        this.showSprites(this.cutSiteSprites);
        this.showSprites(this.featureSprites);
        this.showSprites(this.orfSprites);
    },

    showSprites: function(collection) {
        collection.each(function(sprite) {
            this.pie.surface.add(sprite);
            sprite.show(true);
        }, this);
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
    
    initPie: function() {
        var caret = Ext.create("Vede.view.pie.Caret");
        this.pie.surface.add(caret);
        caret.show(true);
    }
});
