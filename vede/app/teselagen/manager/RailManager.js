/**
 * @class Teselagen.manager.RailManager
 * Manages renderers and aggregates rendered sprites to return to railController.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.RailManager", {
    statics: {
        PAD: 50,
        LABEL_DISTANCE_FROM_RAIL: 3,
        LABEL_HEIGHT: 7,
        LABEL_CONNECTION_WIDTH: 0.5,
        LABEL_CONNECTION_COLOR: "#d2d2d2"
    },

    config: {
        sequenceManager: null,
        reference: null,
        rail: null,
        nameBox: null,
        railGap: 0,
        railWidth: 300,
        cutSites: [],
        features: [],
        orfs: [],
        showCutSites: false,
        showFeatures: true,
        showOrfs: false,
        startPoints: null,
        showFeatureLabels: true,
        showCutSiteLabels: true
    },

    nameBox: null,
    caret: null,
   
    cutSiteRenderer: null,
    orfRenderer: null,
    renderers: [],

    dirty: false,
    sequenceManagerChanged: false,
    centerChanged: false,
    railGapChanged: false,
    cutSitesChanged: false,
    featuresChanged: false,
    orfsChanged: false,

    orfSprites: null,
    featureSprites: null,
    cutSiteSprites: null,
    labelSprites: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager to obtain the sequence from.
     * @param {Object} center An object with parameters x and y, containing the
     * coordinates of the center of the rail.
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

        this.rail = Ext.create("Vede.view.rail.Rail", {
            items: [
                Ext.create("Vede.view.rail.Frame"),
                
            ]
        });

        this.cutSiteRenderer = Ext.create("Teselagen.renderer.rail.CutSiteRenderer", {
            sequenceManager: this.sequenceManager,
            reference: this.reference,
            railHeight: this.railHeight,
            railWidth: this.railWidth,
            railGap: this.railGap,
            cutSites: this.cutSites 
        });

        this.featureRenderer = Ext.create("Teselagen.renderer.rail.FeatureRenderer", {
            sequenceManager: this.sequenceManager,
            railWidth: this.railWidth,
            railHeight: this.railHeight,
            reference: this.reference,
            railGap: this.railGap,
            features: this.features
        });

        this.orfRenderer = Ext.create("Teselagen.renderer.rail.ORFRenderer", {
            sequenceManager: this.sequenceManager,
            reference: this.reference,
            railHeight: this.railGap,
            railWidth: this.railWidth,
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
        if(this.dirty) {
            Ext.each(this.renderers, function(renderer) {
                if(this.sequenceManagerChanged) {
                    renderer.setSequenceManager(this.sequenceManager);
                }
                if(this.railRadiusChanged) {
                    renderer.setRailRadius(this.railRadius);
                }
                if(this.referenceChanged) {
                    renderer.setCenter(this.center);
                }
            }, this);

            this.dirty = false;
            this.sequenceManagerChanged = false;
            this.railWidthChanged = false;
            this.referenceChanged = false;
        }

        if(this.cutSitesChanged) {
            this.cutSiteRenderer.setCutSites(this.cutSites);
            this.cutSitesChanged = false;

            if(this.cutSiteSprites) {
                this.cutSiteSprites.destroy();
            }

            this.cutSiteSprites = Ext.create("Ext.draw.CompositeSprite", {
                surface: this.rail.surface
            });

            this.cutSiteSprites.addAll(this.cutSiteRenderer.render());
        }

        if(this.featuresChanged) {
            this.featureRenderer.setFeatures(this.features);
            this.featuresChanged = false;

            if(this.featureSprites) {
                this.featureSprites.destroy();
            }

            this.featureSprites = Ext.create("Ext.draw.CompositeSprite", {
                surface: this.rail.surface
            });

            this.featureSprites.addAll(this.featureRenderer.render());
        }

        if(this.orfsChanged) {
            this.orfRenderer.setOrfs(this.orfs);
            this.orfsChanged = false;

            if(this.orfSprites) {
                this.orfSprites.destroy();
            }

            this.orfSprites = Ext.create("Ext.draw.CompositeSprite", {
                surface: this.rail.surface
            });

            this.orfSprites.addAll(this.orfRenderer.render());
        }

        this.renderLabels();

        if(this.showOrfs) {
            this.showSprites(this.orfSprites);
        } else {
            this.hideSprites(this.orfSprites);
        }

        if(this.showCutSites) {
            this.showSprites(this.cutSiteSprites);
        } else {
            this.hideSprites(this.cutSiteSprites);
        }

        if(this.showFeatures) {
            this.showSprites(this.featureSprites);
        } else {
            this.hideSprites(this.featureSprites);
        }
    },

    /**
     * Helper function which renders the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to render.
     */
    showSprites: function(collection) {
        collection.each(function(sprite) {
            this.rail.surface.add(sprite);
            sprite.show(true);
            this.rail.doComponentLayout();
        }, this);
    },
    
    /**
     * Helper function which hides the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to hide.
     */
     hideSprites: function(collection) {
         collection.each(function(sprite) {
             sprite.hide(true);
         });
     },


    /**
     * @private
     * Renders the labels in this.labels.
     */
    renderLabels: function() {
        var labels = [];
        var start;
        
        if(this.showCutSites && this.showCutSiteLabels) {
            Ext.each(this.cutSites, function(site) {
                start = this.cutSiteRenderer.startPoints.get(site);
                label = Ext.create("Teselagen.renderer.rail.CutSiteLabel", {
                    annotation: site,
                    x: start.x,
                    y: start.y,
                    start: start
                });

                this.cutSiteRenderer.addToolTip(label, 
                                            this.cutSiteRenderer.getToolTip(site));
     
                labels.push(label);
            }, this);
            }
        
        if(this.showFeatures && this.showFeatureLabels) {
        Ext.each(this.features, function(feature) {
            start = this.featureRenderer.startPoints.get(feature);
            
            label = Ext.create("Teselagen.renderer.rail.FeatureLabel", {
                annotation: feature,
                x: start.x,
                y: start.y,
                start: start
            });

            this.featureRenderer.addToolTip(label,
                                    this.featureRenderer.getToolTip(feature));
            labels.push(label);
        }, this);
        }


        labels.sort(this.labelSort);
        this.adjustLabelPositions(labels);
    },

    /**
     * @private
     * Corrects label positions so they don't overlap.
     */
    adjustLabelPositions: function(labels) {
        // Sort labels into four quadrants of the screen.
        var railWidth = this.railWidth;
        
        var totalNumberOfLabels = labels.length;
        var totalLength = this.sequenceManager.getSequence().toString().length;
        
        var rightLabels = [];
        var leftLabels = [];
        var labelIndex;

        Ext.each(labels, function(label) {
            labelIndex = labels.indexOf(label);
            if(labelIndex < (totalNumberOfLabels/2)) {
                leftLabels.push(label);
            } else {
                rightLabels.push(label);
            }
        });

        var labelHeight = 3 + this.self.LABEL_DISTANCE_FROM_RAIL;

        if(this.showOrfs && this.orfRenderer.maxAlignmentRow > 0) {
            labelHeight += this.orfRenderer.maxAlignmentRow * 
                           this.orfRenderer.self.DISTANCE_BETWEEN_ORFS;
        }
        
        
        var lastLabelYPosition = this.reference.y - 10; // -10 to count label height
        var label;
        
        var numberOfLeftLabels = leftLabels.length;

        for(var i = 0; i <= numberOfLeftLabels - 1; i++) {
            label = leftLabels[i];
            
            if(!label.includeInView) {
                continue; 
            }
            
            var xPosition = this.reference.x + (label.x);
            var yPosition = this.reference.y -  labelHeight;
            
            if(yPosition < lastLabelYPosition) {
                lastLabelYPosition = yPosition - this.self.LABEL_HEIGHT;
            } else {
                yPosition = lastLabelYPosition;
                
                lastLabelYPosition = yPosition - this.self.LABEL_HEIGHT;
            }

            label.setAttributes({translate: {x: xPosition - label.x,
                                              y: yPosition - label.y}});
           
            labels.push(this.drawConnection(label, xPosition, yPosition));
        }
        
        for(var i = 0; i <= totalNumberOfLabels - numberOfLeftLabels - 1; i++) {
            label = rightLabels[i];
            
            if(!label.includeInView) {
                continue; 
            }
            
            var xPosition = this.reference.x + (label.x);
            var yPosition = this.reference.y -  labelHeight;
            
            if(yPosition < lastLabelYPosition) {
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            } else {
                yPosition = lastLabelYPosition;
                
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            }

            label.setAttributes({translate: {x: xPosition - label.x,
                                              y: yPosition - label.y}});
           
            labels.push(this.drawConnection(label, xPosition, yPosition));
        }

        if(this.labelSprites) {
            this.labelSprites.destroy();
        }

        if(this.labelSprites) {
            this.labelSprites.destroy();
        }

        this.labelSprites = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.rail.surface
        });

        this.labelSprites.addAll(labels);
        this.showSprites(this.labelSprites);
        
        Ext.each(leftLabels, function(label) {
            label.setStyle("text-anchor", "end");
        });

        Ext.each(rightLabels, function(label) {
            label.setStyle("text-anchor", "start");
        });
    },

    /**
     * @private
     * Generates a path sprite as the connection between a label and its 
     * annotation, and adds the sprite to labels.
     * @param {Teselagen.renderer.common.Label} label The label to draw a
     * connection from.
     * @param {Int} labelX The label's x position.
     * @param {Int} labelY The label's y position.
     * @param {String} align The argument for the text-anchor property.
     */
    drawConnection: function(label, labelX, labelY) {
        if(label.annotation instanceof Teselagen.bio.sequence.dna.Feature) {
            return Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + this.featureRenderer.startPoints.get(label.annotation).x + " " + labelY +
                      "L" + this.featureRenderer.startPoints.get(label.annotation).x + 
                      " " + this.featureRenderer.startPoints.get(label.annotation).y,
                stroke: this.self.LABEL_CONNECTION_COLOR,
                "stroke-width": this.self.LABEL_CONNECTION_WIDTH,
            });
        } else {
            return Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + labelX + " " + labelY +
                      "L" + this.cutSiteRenderer.startPoints.get(label.annotation).x + 
                      " " + this.cutSiteRenderer.startPoints.get(label.annotation).y,
                stroke: this.self.LABEL_CONNECTION_COLOR,
                "stroke-width": this.self.LABEL_CONNECTION_WIDTH,
            });
        }
    },

    /**
     * @private
     * Function for sorting labels based on their centers.
     */
    labelSort: function(label1, label2) {
        var labelStart1 = label1.start.x;
        var labelStart2 = label2.start.x;
        
        if(labelStart1 > labelStart2) {
            return 1;
        } else if(labelStart1 < labelStart2) {
            return -1;
        } else  {
            return 0;
        }
    },


    applySequenceManager: function(pSequenceManager) {
        this.dirty = true;
        this.sequenceManagerChanged = true;

        this.rail.surface.remove(this.nameBox);

        this.setNameBox(Ext.create("Vede.view.rail.NameBox", { 
            name: pSequenceManager.getName()
        }));

        this.rail.surface.add(this.nameBox);
        this.nameBox.show(true);

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
    
    /**
     * @private
     * Adds the caret to the rail.
     */
    initRail: function() {
//        this.caret = Ext.create("Vede.view.rail.Caret");
//        this.rail.surface.add(this.caret);
//        caret.show(true);

        var name = "unknown";
        var length = 0
        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.nameBox = Ext.create("Vede.view.rail.NameBox", {
            center: this.center,
            name: name,
            length: length
        });

        this.rail.surface.add(this.nameBox);
        this.nameBox.show(true);
        this.nameBox.setStyle("dominant-baseline", "central");
    }
});
