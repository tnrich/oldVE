/**
 * @class Teselagen.manager.PieManager
 * Manages renderers and aggregates rendered sprites to return to PieController.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.PieManager", {
    statics: {
        PAD: 50,
        LABEL_DISTANCE_FROM_RAIL: 35,
        LABEL_HEIGHT: 10,
        LABEL_CONNECTION_WIDTH: 0.5,
        LABEL_CONNECTION_COLOR: "#d2d2d2"
    },

    config: {
        sequenceManager: null,
        center: null,
        pie: null,
        railRadius: 0,
        cutSites: [],
        features: [],
        orfs: [],
        showCutSites: true,
        showFeatures: true,
        showOrfs: true,
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
    railRadiusChanged: false,
    cutSitesChanged: false,
    featuresChanged: false,
    orfsChanged: false,

    orfSprites: null,
    featureSprites: null,
    cutSiteSprites: null,

    labelSprites: null,

    /**
     * @member Teselagen.manager.PieManager
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

        this.pie = Ext.create("Vesa.view.pie.Pie", {
            items: [
                Ext.create("Vesa.view.pie.Frame"),
                Ext.create("Ext.draw.Sprite", {
                    type: "circle",
                    radius: this.railRadius + this.self.PAD,
                    x: this.center.x,
                    y: this.center.y
                })
            ]
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
     * Function which gets all annotations in a range of indices. Only returns
     * annotations which are currently visible.
     * @param {Int} start The start of the range of nucleotides.
     * @param {Int} end The end of the range of nucleotides.
     * @return {Array<Teselagen.bio.sequence.common.Annotation>} All annotations
     * (which are currently visible) that are contained in the range from start
     * to end, according to Annotation.contains().
     */
    getAnnotationsInRange: function(start, end) {
        var annotationsInRange = [];
        var selectionAnnotation = Ext.create("Teselagen.bio.sequence.common.Annotation", {
            start: start,
            end: end
        });

        if(this.showFeatures) {
            Ext.each(this.features, function(feature) {
                if(selectionAnnotation.contains(feature)) {
                    annotationsInRange.push(feature);
                }
            });
        }

        if(this.showCutSites) {
            Ext.each(this.cutSites, function(site) {
                if(selectionAnnotation.contains(site)) {
                    annotationsInRange.push(site);
                }
            });
        }

        if(this.showOrfs) {
            Ext.each(this.orfs, function(orf) {
                if(selectionAnnotation.contains(orf)) {
                    annotationsInRange.push(orf);
                }
            });
        }

        return annotationsInRange;
    },

    /**
     * First checks to see if any parameters need to be updated on renderers,
     * then renders a list of sprites from all renderers.
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
            this.cutSitesChanged = false;

            if(this.cutSiteSprites) {
                this.cutSiteSprites.destroy();
            }

            this.cutSiteSprites = Ext.create("Ext.draw.CompositeSprite", {
                surface: this.pie.surface
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
                surface: this.pie.surface
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
                surface: this.pie.surface
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
     * Function for debugging which draws coordinates on the pie.
     */
    drawCoordinates: function() {
        for(var i = 0; i < 200; i += 20) {
            for(var j = 0; j < 200; j += 20) {
                var sprite = Ext.create("Ext.draw.Sprite", {
                    type: "text",
                    text: i + ", " + j,
                    font: "4px monospace",
                    x: i,
                    y: j
                });
                this.pie.surface.add(sprite);
                sprite.show(true);
            }
        }
    },

    /**
     * Helper function which renders the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to render.
     */
    showSprites: function(collection) {
        collection.each(function(sprite) {
            this.pie.surface.add(sprite);
            sprite.show(true);
            this.pie.doComponentLayout();
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
     * Renders cut site labels.
     */
    renderLabels: function() {
        var labels = [];
        var center;
        var color;

        if(this.showCutSites && this.showCutSiteLabels) {
            Ext.each(this.cutSites, function(site) {
                center = this.cutSiteRenderer.middlePoints.get(site);

                if(site.getNumCuts() == 1) {
                    color = "#E57676";
                } else {
                    color = "#888888";
                }

                label = Ext.create("Teselagen.renderer.pie.CutSiteLabel", {
                    annotation: site,
                    x: center.x,
                    y: center.y,
                    center: this.annotationCenter(site),
                    color: color
                });

                this.cutSiteRenderer.addToolTip(label, 
                                            this.cutSiteRenderer.getToolTip(site));
                this.cutSiteRenderer.addClickListener(label,
                                                label.annotation.getStart(),
                                                label.annotation.getEnd());

                labels.push(label);
            }, this);
        }

        if(this.showFeatures && this.showFeatureLabels) {
            Ext.each(this.features, function(feature) {
                center = this.featureRenderer.middlePoints.get(feature);

                label = Ext.create("Teselagen.renderer.pie.FeatureLabel", {
                    annotation: feature,
                    x: center.x,
                    y: center.y,
                    center: this.annotationCenter(feature)
                });

                this.featureRenderer.addToolTip(label,
                                        this.featureRenderer.getToolTip(feature));
                this.featureRenderer.addClickListener(label,
                                                label.annotation.getStart(),
                                                label.annotation.getEnd());

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
        var totalNumberOfLabels = labels.length;
        var totalLength = this.sequenceManager.getSequence().toString().length;

        var rightTopLabels = [];
        var rightBottomLabels = [];
        var leftTopLabels = [];
        var leftBottomLabels = [];

        Ext.each(labels, function(label) {
            var labelCenter = label.center;
            if(labelCenter < totalLength / 4) {
                rightTopLabels.push(label);
            } else if((labelCenter >= totalLength / 4) && 
                      (labelCenter < totalLength / 2)) {
                rightBottomLabels.push(label);
            } else if((labelCenter >= totalLength / 2) && 
                      (labelCenter < 3 * totalLength / 4)) {
                leftBottomLabels.push(label);
            } else {
                leftTopLabels.push(label);
            }
        });

        var labelRadius = this.railRadius + this.self.LABEL_DISTANCE_FROM_RAIL;

        if(this.showOrfs && this.orfRenderer.maxAlignmentRow > 0) {
            labelRadius += this.orfRenderer.maxAlignmentRow * 
                           this.orfRenderer.self.DISTANCE_BETWEEN_ORFS;
        }
        
        // Scale Right Top Labels
        var lastLabelYPosition = this.center.y - 15; // -15 to count label height
        var numberOfRightTopLabels = rightTopLabels.length;
        var label;

        for(var i = numberOfRightTopLabels - 1; i >= 0; i--) {
            label = rightTopLabels[i];

            if(!label.includeInView) {
                continue; 
            }

            var labelCenter = label.center;
            var angle = labelCenter * 2 * Math.PI / 
                         this.sequenceManager.getSequence().toString().length;
            
            var xPosition = this.center.x + Math.sin(angle) * labelRadius;
            var yPosition = this.center.y - Math.cos(angle) * labelRadius;
            
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

        // Scale Right Bottom Labels
        lastLabelYPosition = this.center.y;
        var numberOfRightBottomLabels = rightBottomLabels.length;

        for(var j = 0; j < numberOfRightBottomLabels; j++) {
            label = rightBottomLabels[j];

            if(!label.includeInView) {
                continue; 
            }
            
            var labelCenter = label.center;
            var angle = labelCenter * 2 * Math.PI / 
                this.sequenceManager.getSequence().toString().length - Math.PI / 2;
            
            var xPosition = this.center.x + Math.cos(angle) * labelRadius;
            var yPosition = this.center.y + Math.sin(angle) * labelRadius;
            
            if(yPosition > lastLabelYPosition) {
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            } else {
                yPosition = lastLabelYPosition;
                
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            }

            label.setAttributes({translate: {x: xPosition - label.x,
                                              y: yPosition - label.y}});
            labels.push(this.drawConnection(label, xPosition, yPosition));
        }
        
        // Scale Left Top Labels
        lastLabelYPosition = this.center.y - 15; // -15 to count label totalHeight
        var numberOfLeftTopLabels = leftTopLabels.length;

        for(var k = 0; k < numberOfLeftTopLabels; k++) {
            label = leftTopLabels[k];

            if(!label.includeInView) {
                continue; 
            }

            var labelCenter = label.center;
            var angle = 2 * Math.PI - labelCenter * 2 * Math.PI / 
                         this.sequenceManager.getSequence().toString().length;
            
            var xPosition = this.center.x - Math.sin(angle) * labelRadius;
            var yPosition = this.center.y - Math.cos(angle) * labelRadius;
            
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
        
        // Scale Left Bottom Labels
        lastLabelYPosition = this.center.y;
        var numberOfLeftBottomLabels = leftBottomLabels.length;
            
        for(var l = numberOfLeftBottomLabels - 1; l >= 0; l--) {
            label = leftBottomLabels[l];

            if(!label.includeInView) {
                continue; 
            }

            var labelCenter = label.center;
            var angle = labelCenter * 2 * Math.PI / 
                        this.sequenceManager.getSequence().toString().length - Math.PI;
            
            var xPosition = this.center.x - Math.sin(angle) * labelRadius;
            var yPosition = this.center.y + Math.cos(angle) * labelRadius;
            
            if(yPosition > lastLabelYPosition) {
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

        this.labelSprites = Ext.create("Ext.draw.CompositeSprite", {
            surface: this.pie.surface
        });

        this.labelSprites.addAll(labels);
        this.showSprites(this.labelSprites);

        Ext.each(leftTopLabels, function(label) {
            label.setStyle("text-anchor", "end");
        });

        Ext.each(leftBottomLabels, function(label) {
            label.setStyle("text-anchor", "end");
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
                path: "M" + labelX + " " + labelY +
                      "L" + this.featureRenderer.middlePoints.get(label.annotation).x + 
                      " " + this.featureRenderer.middlePoints.get(label.annotation).y,
                stroke: this.self.LABEL_CONNECTION_COLOR,
                "stroke-width": this.self.LABEL_CONNECTION_WIDTH,
            });
        } else {
            return Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + labelX + " " + labelY +
                      "L" + this.cutSiteRenderer.middlePoints.get(label.annotation).x + 
                      " " + this.cutSiteRenderer.middlePoints.get(label.annotation).y,
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
        var labelCenter1 = label1.center;
        var labelCenter2 = label2.center;
        
        if(labelCenter1 > labelCenter2) {
            return 1;
        } else if(labelCenter1 < labelCenter2) {
            return -1;
        } else  {
            return 0;
        }
    },

    /**
     * @private
     * Calculates the center of an annotation.
     * @param {Teselagen.bio.sequence.common.Annotation} annotation The annotation
     * to determine the center of.
     */
    annotationCenter: function(annotation) {
        var result;

        if(annotation.getStart() > annotation.getEnd()) {
            var virtualCenter = annotation.getEnd() - 
                ((this.sequenceManager.getSequence().toString().length - 
                  annotation.getStart()) + annotation.getEnd()) / 2 + 1;

            if(virtualCenter >= 0) {
                return virtualCenter;
            } else {
                return this.sequenceManager.getSequence().toString().length + 
                    virtualCenter - 1;
            }
        } else {
            return (annotation.getStart() + annotation.getEnd() - 1) / 2 + 1;
        }
    },

    applySequenceManager: function(pSequenceManager) {
        this.dirty = true;
        this.sequenceManagerChanged = true;

        this.caret.show(true);
        this.nameBox.destroy();

        this.nameBox = Ext.create("Vesa.view.pie.NameBox", {
            center: this.center,
            name: pSequenceManager.getName(),
            length: pSequenceManager.getSequence().toString().length
        });

        this.pie.surface.add(this.nameBox);
        this.nameBox.show(true);
        this.nameBox.setStyle("dominant-baseline", "central");

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
     * Adds the caret to the pie.
     */
    initPie: function() {
        this.caret = Ext.create("Vesa.view.pie.Caret", {
            angle: 0,
            center: this.center,
            radius: this.railRadius + 10
        });

        this.pie.surface.add(this.caret);

        var name = "unknown";
        var length = 0
        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.nameBox = Ext.create("Vesa.view.pie.NameBox", {
            center: this.center,
            name: name,
            length: length
        });

        this.pie.surface.add(this.nameBox);
        this.nameBox.show(true);
        this.nameBox.setStyle("dominant-baseline", "central");
    },

    /**
     * Repositions the caret to the given angle.
     * @param {Int} angle The angle of the caret to reposition to.
     */
    adjustCaret: function(bp) {
        var angle = bp * 2 * Math.PI / 
            this.sequenceManager.getSequence().seqString().length;

        this.caret.destroy();
        this.caret = Ext.create("Vesa.view.pie.Caret", {
            angle: angle,
            center: this.center,
            radius: this.railRadius + 10
        });

        this.pie.surface.add(this.caret);
        this.caret.show(true);
    },
});
