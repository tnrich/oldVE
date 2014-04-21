/**
 * @class Teselagen.manager.RailManager
 * Manages renderers and aggregates rendered sprites to return to railController.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.RailManager", {
    requires: ["Teselagen.bio.sequence.dna.Feature",
               "Teselagen.renderer.rail.CutSiteLabel",
               "Teselagen.renderer.rail.CutSiteRenderer",
               "Teselagen.renderer.rail.FeatureLabel",
               "Teselagen.renderer.rail.FeatureRenderer",
               "Teselagen.renderer.rail.ORFRenderer",
               "Vede.view.rail.Caret",
               "Vede.view.rail.Frame",
               "Vede.view.rail.NameBox"],
    
    statics: {
        PAD: 50,
        LABEL_DISTANCE_FROM_RAIL: 3,
        LABEL_HEIGHT: 7,
        LABEL_CONNECTION_WIDTH: 0.5,
        LABEL_CONNECTION_COLOR: "#d2d2d2",
        RAIL_PAD: 100,
        SELECTION_COLOR: "#0099FF",
        SELECTION_TRANSPARENCY: 0.3,
        SELECTION_FRAME_COLOR: "#CCCCCC",
        STROKE_OPACITY: 0.8, // Selection and wireframe outline opacity.
        WIREFRAME_COLOR: "#808080",
        ZOOM_INCREMENT: 0.25
    },

    config: {
        sequenceManager: null,
        reference: null,
        rail: null,
        nameBox: null,
        railGap: 0,
        railWidth: 300,
        showMapCaret: true,
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

    labelSVG: null,
    cutSiteSVG: null,
    orfSVG: null,
    featureSVG: null,
    selectionSVG: null,
    wireframeSVG: null,
   
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
     * @member Teselagen.manager.RailManager
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager to obtain the sequence from.
     * @param {Object} center An object with parameters x and y, containing the
     * coordinates of the center of the rail.
     * @param {Int} railRadius The radius of the circular sequence display.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite[]} cutSites The
     * list of cut sites to be rendered.
     * @param {Teselagen.bio.sequence.common.Annotation[]} features The
     * list of features to be rendered.
     * @param {Teselagen.bio.orf.ORF[]} orfs The list of orfs to be
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

        this.cutSiteRenderer = Ext.create("Teselagen.renderer.rail.CutSiteRenderer", {
            cutSiteSVG: this.cutSiteSVG,
            sequenceManager: this.sequenceManager,
            reference: this.reference,
            railHeight: this.railHeight,
            railWidth: this.railWidth,
            railGap: this.railGap,
            cutSites: this.cutSites 
        });

        this.featureRenderer = Ext.create("Teselagen.renderer.rail.FeatureRenderer", {
            featureSVG: this.featureSVG,
            sequenceManager: this.sequenceManager,
            railWidth: this.railWidth,
            railHeight: this.railHeight,
            reference: this.reference,
            railGap: this.railGap,
            features: this.features
        });

        this.orfRenderer = Ext.create("Teselagen.renderer.rail.ORFRenderer", {
            orfSVG: this.orfSVG,
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
     * Function which gets all annotations in a range of indices. Only returns
     * annotations which are currently visible.
     * @param {Int} start The start of the range of nucleotides.
     * @param {Int} end The end of the range of nucleotides.
     * @return {Teselagen.bio.sequence.common.Annotation[]} All annotations
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
     * then returns a list of sprites from all renderers.
     * @return {Ext.draw.Sprite[]} A list of sprites aggregated from all
     * renderers.
     */
    render: function() {
        var renderer;
        if(this.dirty) {
            for(var i = 0; i < this.renderers.length; i++) {
                renderer = this.renderers[i];
                if(this.sequenceManagerChanged) {
                    renderer.setSequenceManager(this.sequenceManager);
                }
                if(this.railRadiusChanged) {
                    renderer.setRailRadius(this.railRadius);
                }
                if(this.referenceChanged) {
                    renderer.setCenter(this.center);
                }
            }

            this.dirty = false;
            this.sequenceManagerChanged = false;
            this.railWidthChanged = false;
            this.referenceChanged = false;
        }

        if(this.cutSitesChanged) {
            this.cutSiteSVG.remove();
            this.cutSiteSVG = this.parentSVG.append("svg:g")
                                            .attr("class", "railCutSite");
            this.cutSiteRenderer.setCutSiteSVG(this.cutSiteSVG);

            this.cutSiteRenderer.setCutSites(this.cutSites);
            this.cutSiteRenderer.render();

            this.cutSitesChanged = false;
        }

        if(this.featuresChanged) {
            this.featureSVG.remove();
            this.featureSVG = this.parentSVG.append("svg:g")
                                            .attr("class", "railFeature");
            this.featureRenderer.setFeatureSVG(this.featureSVG);

            this.featureRenderer.setFeatures(this.features);
            this.featureRenderer.render();

            this.featuresChanged = false;
        }

        if(this.orfsChanged) {
            this.orfSVG.remove();
            this.orfSVG = this.parentSVG.append("svg:g")
                                            .attr("class", "railOrf");
            this.orfRenderer.setOrfSVG(this.orfSVG);

            this.orfRenderer.setOrfs(this.orfs);
            this.orfRenderer.render();

            this.orfsChanged = false;
        }

        this.renderLabels();

        if(this.showOrfs) {
            this.orfSVG.style("visibility", "visible");
        } else {
            this.orfSVG.style("visibility", "hidden");
        }

        if(this.showCutSites) {
            this.cutSiteSVG.style("visibility", "visible");
        } else {
            this.cutSiteSVG.style("visibility", "hidden");
        }

        if(this.showFeatures) {
            this.featureSVG.style("visibility", "visible");
        } else {
            this.featureSVG.style("visibility", "hidden");
        }

        /*if(this.showMapCaret) {
            this.caretSVG.style("visibility", "visible");
        } else {
            this.caretSVG.style("visibility", "hidden");
        }*/
    },

    /**
     * Zooms the rail in by scaling it with a transformation matrix.
     */
    zoomIn: function() {
        Ext.suspendLayouts();

        // Get previous values for scale and transform.
        var translateValues = this.parentSVG.attr("transform").match(/[-.\d]+/g);
        var scale = [Number(translateValues[0]), Number(translateValues[3])];
        var translate = [Number(translateValues[4]), Number(translateValues[5])];

        // Increase scale values.
        scale[0] += this.self.ZOOM_INCREMENT;
        scale[1] += this.self.ZOOM_INCREMENT;

        this.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                 " " + translate[0] + " " + translate[1] + ")");

        Ext.resumeLayouts(true);

        this.fitWidthToContent(this);
    },

    /**
     * Zooms the rail out using a transformation matrix.
     */
    zoomOut: function() {
        // Get previous values for scale and transform.
        var translateValues = this.parentSVG.attr("transform").match(/[-.\d]+/g);
        var scale = [translateValues[0], translateValues[3]];
        var translate = [translateValues[4], translateValues[5]];

        // Only zoom out if it won't make the SVG disappear!
        if(scale[0] > this.self.ZOOM_INCREMENT && scale[1] > this.self.ZOOM_INCREMENT) {
            Ext.suspendLayouts();

            // Increase scale values.
            scale[0] -= this.self.ZOOM_INCREMENT;
            scale[1] -= this.self.ZOOM_INCREMENT;

            this.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                     " " + translate[0] + " " + translate[1] + ")");

            Ext.resumeLayouts(true);

            this.fitWidthToContent(this);//, 1 / this.self.ZOOM_FACTOR / 5);
        }
    },

    /**
     * Restores the rail to a scale factor of 1.
     */
    removeZoom: function() {
        // Get previous values for scale and transform.
        var translateValues = this.parentSVG.attr("transform").match(/[-.\d]+/g);
        var scale = [translateValues[0], translateValues[3]];
        var translate = [translateValues[4], translateValues[5]];

        this.previousZoomLevel = scale[0];

        // Increase scale values.
        scale[0] = 1.5;
        scale[1] = 1.5;

        this.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                 " " + translate[0] + " " + translate[1] + ")");

        this.fitWidthToContent(this, true);
    },

    /**
     * Reverts zoom level back to what it was before calling removeZoom.
     */
    restoreZoom: function() {
        // Get previous values for scale and transform.
        var translateValues = this.parentSVG.attr("transform").match(/[-.\d]+/g);
        var scale = [translateValues[0], translateValues[3]];
        var translate = [translateValues[4], translateValues[5]];

        // Increase scale values.
        scale[0] = this.previousZoomLevel || 1.5;
        scale[1] = this.previousZoomLevel || 1.5;

        this.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                 " " + translate[0] + " " + translate[1] + ")");

        this.fitWidthToContent(this, true);
    },

    /**
     * Adjust the width of the surface to fit all content, ensuring that a 
     * scrollbar appears.
     * @param {Teselagen.manager.RailManager} scope The railManager. Used when being
     * called by the window onresize event.
     */
    fitWidthToContent: function(scope) {
        var container = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='RailContainer']");

        if(container && container.el) {
            var containerSize = container.getSize();
            var rc = container.el.dom;
            var frame = scope.rail.select(".railFrame").node();
            var rcRect = rc.getBoundingClientRect();

            var scrollWidthRatio = (rc.scrollLeft + rcRect.width / 2) / rc.scrollWidth;

            var transY = containerSize.height / 2;

            var railBox = scope.rail[0][0].getBBox();
            var parentBox = scope.parentSVG[0][0].getBBox();

            // Get previous values for scale and transform.
            var translateValues = scope.parentSVG.attr("transform").match(/[-.\d]+/g);
            var scale = [Number(translateValues[0]), Number(translateValues[3])];
            var translate = [Number(translateValues[4]), Number(translateValues[5])];

            scope.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                     " " + translate[0] + " " + transY + ")");

            scope.rail.attr("width", railBox.width + translate[0] + this.self.RAIL_PAD)
                      .attr("height", railBox.height + transY);

            container.el.setScrollLeft(scrollWidthRatio * rc.scrollWidth - rcRect.width / 2);
        }
    },

    /**
     * Helper function which renders the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to render.
     * @deprecated
     */
    showSprites: function(collection) {
        var sprite;

        for(var i = 0; i < collection.length; i++) {
            sprite = collection.getAt(i);
            this.rail.surface.add(sprite);
            sprite.show(true);
            this.rail.doComponentLayout();
        }
    },
    
    /**
     * Helper function which hides the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to hide.
     * @deprecated
     */
     hideSprites: function(collection) {
         for(var i = 0; i < collection.length; i++) {
             collection.getAt(i).hide(true);
         }
     },


    /**
     * @private
     * Renders the labels in this.labels.
     */
    renderLabels: function() {
        var labels = [];
        var start;
        var color;

        this.labelSVG.remove();
        this.labelSVG = this.parentSVG.append("svg:g")
                                .attr("class", "railLabel");

        if(this.showCutSites && this.showCutSiteLabels) {
            var site;
            for(var i = 0; i < this.cutSites.length; i++) {
                site = this.cutSites[i];
                start = this.cutSiteRenderer.startPoints.get(site);

                if(site.getNumCuts() == 1) {
                    color = "#E57676";
                } else {
                    color = "#888888";
                }

                label = Ext.create("Teselagen.renderer.rail.CutSiteLabel", {
                    labelSVG: this.labelSVG,
                    annotation: site,
                    x: start.x,
                    y: start.y,
                    start: start,
                    color: color,
                    tooltip: this.cutSiteRenderer.getToolTip(site),
                    click: this.cutSiteRenderer.getClickListener(
                                                    site.getStart(),
                                                    site.getEnd())
                });

                labels.push(label);
            }
        }

        if(this.showFeatures && this.showFeatureLabels) {
            var feature;
            for(var i = 0; i < this.features.length; i++) {
                feature = this.features[i];
                start = this.featureRenderer.startPoints.get(feature);

                label = Ext.create("Teselagen.renderer.rail.FeatureLabel", {
                    labelSVG: this.labelSVG,
                    annotation: feature,
                    x: start.x,
                    y: start.y,
                    start: start,
                    tooltip: this.featureRenderer.getToolTip(feature),
                    click: this.featureRenderer.getClickListener(
                                                    feature.getStart(),
                                                    feature.getEnd()),
                    rightClick: this.featureRenderer.getRightClickListener(feature)
                });

                labels.push(label);
            }
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
        var label;

        for(var i = 0; i < labels.length; i++) {
            label = labels[i];
            if(i < (totalNumberOfLabels/2)) {
                leftLabels.push(label);
            } else {
                rightLabels.push(label);
            }
        }

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
            
            var xPosition = this.reference.x + (label.label.attr("x"));
            var yPosition = this.reference.y -  labelHeight;
            
            if(yPosition < lastLabelYPosition) {
                lastLabelYPosition = yPosition - this.self.LABEL_HEIGHT;
            } else {
                yPosition = lastLabelYPosition;
                
                lastLabelYPosition = yPosition - this.self.LABEL_HEIGHT;
            }

            label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")")
                       .style("text-anchor", "end");
           
            labels.push(this.drawConnection(label, xPosition, yPosition));
        }
        
        for(var i = 0; i <= totalNumberOfLabels - numberOfLeftLabels - 1; i++) {
            label = rightLabels[i];
            
            if(!label.includeInView) {
                continue; 
            }
            
            var xPosition = this.reference.x + (label.label.attr("x"));
            var yPosition = this.reference.y -  labelHeight;
            
            if(yPosition < lastLabelYPosition) {
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            } else {
                yPosition = lastLabelYPosition;
                
                lastLabelYPosition = yPosition + this.self.LABEL_HEIGHT;
            }

            label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")")
                       .style("text-anchor", "start");
           
            labels.push(this.drawConnection(label, xPosition, yPosition));
        }
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
        var path;
        if(label.annotation instanceof Teselagen.bio.sequence.dna.Feature) {
            path = "M" + this.featureRenderer.startPoints.get(label.annotation).x + " " + labelY +
                   "L" + this.featureRenderer.startPoints.get(label.annotation).x + 
                   " " + this.featureRenderer.startPoints.get(label.annotation).y;
        } else {
            path = "M" + labelX + " " + labelY +
                   "L" + this.cutSiteRenderer.startPoints.get(label.annotation).x + 
                   " " + this.cutSiteRenderer.startPoints.get(label.annotation).y;
        }

        return this.labelSVG.append("svg:path")
                            .attr("stroke", this.self.LABEL_CONNECTION_COLOR)
                            .attr("stroke-width", this.self.LABEL_CONNECTION_WIDTH)
                            .attr("d", path);
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

        if(this.rail) {
            this.nameBox.remove();

            this.nameBox = Ext.create("Vede.view.rail.NameBox", {
                rail: this.parentSVG,
                center: this.center,
                name: pSequenceManager.getName(),
                length: pSequenceManager.getSequence().toString().length
            });

        }

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
    initRail: function(newTab) {
        var newTabDomId = newTab.el.dom.id;
        // If there's no SVG in the current tab, VE hasn't been rendered yet, so
        // add svg elements. Otherwise, just set this.rail to the rail in this tab,
        // and so on.
        if(!d3.select("#" + newTabDomId + " .Rail").node()) {
            this.rail = d3.select("#" + newTabDomId + " .RailContainer")
                          .append("svg:svg")
                          .attr("class", "Rail")
                          .attr("overflow", "auto");

            this.parentSVG = this.rail.append("svg:g")
                                      .attr("class", "railParent")
                                      .attr("transform", "matrix(1.5 0 0 1.5 " + this.self.RAIL_PAD + " 0)");

            this.frame = Ext.create("Vede.view.rail.Frame", {
                rail: this.parentSVG,
                railWidth: this.railWidth,
                center: this.center
            });

            this.caret = Ext.create("Vede.view.rail.Caret", {
                rail: this.parentSVG,
                start: 0,
                reference: this.reference,
                railWidth: this.railWidth,
                length: 3
            });

            var name = "unknown";
            var length = 0
            if(this.sequenceManager) {
                name = this.sequenceManager.getName();
                length = this.sequenceManager.getSequence().toString().length;
            }

            this.nameBox = Ext.create("Vede.view.rail.NameBox", {
                rail: this.parentSVG,
                center: this.center,
                name: name,
                length: length
            });

            this.labelSVG = this.parentSVG.append("svg:g")
                                    .attr("class", "railLabel");

            this.selectionSVG = this.parentSVG.append("svg:path")
                                    .attr("class", "railSelection")
                                    .attr("stroke", this.self.SELECTION_FRAME_COLOR)
                                    .attr("stroke-opacity", this.self.STROKE_OPACITY)
                                    .attr("fill", this.self.SELECTION_COLOR)
                                    .attr("fill-opacity", this.self.SELECTION_TRANSPARENCY)
                                    .style("pointer-events", "none");

            this.wireframeSVG = this.parentSVG.append("svg:path")
                                    .attr("class", "railWireframe")
                                    .attr("stroke", this.self.WIREFRAME_COLOR)
                                    .attr("stroke-opacity", this.self.STROKE_OPACITY)
                                    .attr("fill", "none");

            this.cutSiteSVG = this.parentSVG.append("svg:g")
                                      .attr("class", "railCutSite");
            this.cutSiteRenderer.setCutSiteSVG(this.cutSiteSVG);

            this.orfSVG = this.parentSVG.append("svg:g")
                                  .attr("class", "railOrf");
            this.orfRenderer.setOrfSVG(this.orfSVG);

            this.featureSVG = this.parentSVG.append("svg:g")
                                      .attr("class", "railFeature");
            this.featureRenderer.setFeatureSVG(this.featureSVG);

            this.fitWidthToContent(this);
        } else {
            this.rail = d3.select("#" + newTabDomId + " .Rail");

            this.parentSVG = this.rail.select(".railParent");

            this.parentSVG.select(".railCaret").remove();
            this.caret = Ext.create("Vede.view.rail.Caret", {
                rail: this.parentSVG,
                start: 0,
                reference: this.reference,
                railWidth: this.railWidth,
                length: 3
            });

            this.frame = this.parentSVG.select(".railFrame");
            this.nameBox = this.parentSVG.select(".railNameBox");
            this.labelSVG = this.parentSVG.select(".railLabel");
            this.selectionSVG = this.parentSVG.select(".railSelection");
            this.wireframeSVG = this.parentSVG.select(".railWireframe");
            this.cutSiteSVG = this.parentSVG.select(".railCutSite");
            this.orfSVG = this.parentSVG.select(".railOrf");
            this.featureSVG = this.parentSVG.select(".railFeature");

            this.cutSiteRenderer.setCutSiteSVG(this.cutSiteSVG);
            this.orfRenderer.setOrfSVG(this.orfSVG);
            this.featureRenderer.setFeatureSVG(this.featureSVG);
        }
    },

    updateNameBox: function() {
        var name;
        var length;

        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.nameBox.remove();
        this.nameBox = Ext.create("Vede.view.rail.NameBox", {
            rail: this.parentSVG,
            center: this.center,
            name: name,
            length: length
        });
    },
    
    /**
     * Repositions the caret to the given angle.
     * @param {Int} angle The angle of the caret to reposition to.
     */
    adjustCaret: function(bp) {
        var start = bp / 
            this.sequenceManager.getSequence().seqString().length;

        //this.caret.remove();

        if(this.sequenceManager &&
           this.sequenceManager.getSequence().toString().length > 0) {

            this.caret.setStart(start);
            /*this.caret = Ext.create("Vede.view.rail.Caret", {
                rail: this.parentSVG,
                start: start,
                reference: this.reference,
                railWidth: this.railWidth,
                length: 3
            });*/
        }
    }
});
