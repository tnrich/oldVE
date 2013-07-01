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
        LABEL_CONNECTION_COLOR: "#d2d2d2",
        ZOOM_INCREMENT: 0.25
    },

    requires: ["Teselagen.bio.sequence.dna.Feature",
               "Teselagen.renderer.pie.CutSiteLabel",
               "Teselagen.renderer.pie.CutSiteRenderer",
               "Teselagen.renderer.pie.FeatureLabel",
               "Teselagen.renderer.pie.FeatureRenderer",
               "Teselagen.renderer.pie.ORFRenderer",
               "Vede.view.pie.Caret",
               "Vede.view.pie.Frame",
               "Vede.view.pie.NameBox"],

    config: {
        sequenceManager: null,
        center: null,
        pie: null,
        railRadius: 0,
        cutSites: [],
        features: [],
        orfs: [],
        showCutSites: false,
        showFeatures: true,
        showOrfs: false,
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

    zoomLevel: 0,

    /**
     * @member Teselagen.manager.PieManager
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager to obtain the sequence from.
     * @param {Object} center An object with parameters x and y, containing the
     * coordinates of the center of the pie.
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

        this.cutSiteRenderer = Ext.create("Teselagen.renderer.pie.CutSiteRenderer", {
            cutSiteSVG: this.cutSiteSVG,
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            cutSites: this.cutSites
        });

        this.featureRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
            featureSVG: this.featureSVG,
            sequenceManager: this.sequenceManager,
            center: this.center,
            railRadius: this.railRadius,
            features: this.features
        });

        this.orfRenderer = Ext.create("Teselagen.renderer.pie.ORFRenderer", {
            orfSVG: this.orfSVG,
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
            var feature;
            for(var i = 0; i < this.features.length; i++) {
                feature = this.features[i];
                if(selectionAnnotation.contains(feature)) {
                    annotationsInRange.push(feature);
                }
            }
        }

        if(this.showCutSites) {
            var site;
            for(var i = 0; i < this.cutSites.length; i++) {
                site = this.cutSites[i];
                if(selectionAnnotation.contains(site)) {
                    annotationsInRange.push(site);
                }
            }
        }

        if(this.showOrfs) {
            var orf;
            for(var i = 0; i < this.orfs.length; i++) {
                orf = this.orfs[i];
                if(selectionAnnotation.contains(orf)) {
                    annotationsInRange.push(orf);
                }
            }
        }

        return annotationsInRange;
    },

    /**
     * First checks to see if any parameters need to be updated on renderers,
     * then renders a list of sprites from all renderers.
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
                if(this.centerChanged) {
                    renderer.setCenter(this.center);
                }
            }

            this.dirty = false;
            this.sequenceManagerChanged = false;
            this.railRadiusChanged = false;
            this.centerChanged = false;
        }

        if(this.cutSitesChanged) {
            this.cutSiteSVG.remove();
            this.cutSiteSVG = this.parentSVG.append("svg:g")
                                      .attr("class", "pieCutSite");
            this.cutSiteRenderer.setCutSiteSVG(this.cutSiteSVG);

            this.cutSiteRenderer.setCutSites(this.cutSites);
            this.cutSiteRenderer.render();

            this.cutSitesChanged = false;
        }

        if(this.featuresChanged) {
            this.featureSVG.remove();
            this.featureSVG = this.parentSVG.append("svg:g")
                                      .attr("class", "pieFeature");
            this.featureRenderer.setFeatureSVG(this.featureSVG);

            this.featureRenderer.setFeatures(this.features);
            this.featureRenderer.render();

            this.featuresChanged = false;
        }

        if(this.orfsChanged) {
            this.orfSVG.remove();
            this.orfSVG = this.parentSVG.append("svg:g")
                                  .attr("class", "pieOrf");
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

        Ext.defer(function(){this.fitWidthToContent(this)}, 10, this);
    },

    /**
     * Zooms the pie in using a transformation matrix.
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
     * Zooms the pie out using a transformation matrix.
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
     * Adjust the width of the surface to fit all content, ensuring that a 
     * scrollbar appears.
     * @param {Teselagen.manager.PieManager} scope The pieManager. Used when being
     * called by the window onresize event.
     */
    fitWidthToContent: function(scope) {
        if(Ext.getCmp("PieContainer").el) {
            var containerSize = Ext.getCmp("PieContainer").getSize();
            var transX = containerSize.width / 2 - scope.center.x;
            var transY = containerSize.height / 2 - scope.center.y;
            var pieBox = scope.pie[0][0].getBBox();

            // Get previous values for scale and transform.
            var translateValues = scope.parentSVG.attr("transform").match(/[-.\d]+/g);
            var scale = [Number(translateValues[0]), Number(translateValues[3])];
            var translate = [Number(translateValues[4]), Number(translateValues[5])];

            scope.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                     " " + transX + " " + transY + ")");

            scope.pie.attr("width", pieBox.width + transX)
                     .attr("height", pieBox.height + transY);
        }
    },

    /**
     * Function for debugging which draws coordinates on the pie.
     */
    drawCoordinates: function() {
        d3.select(".coordinateSVG").remove();
        var coordSVG = this.parentSVG.append("svg:g")
                                     .attr("class", "coordinateSVG");
        for(var i = -50; i < 500; i += 20) {
            for(var j = -50; j < 500; j += 20) {
                coordSVG.append("svg:text")
                        .attr("font-size", "6px")
                        .attr("x", i)
                        .attr("y", j)
                        .text(i + "," + j);
            }
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
            this.pie.surface.add(sprite);
            sprite.show(true);
            this.pie.doComponentLayout();
        }
    },

    /**
     * Helper function which hides the sprites in a CompositeSprite.
     * @param {Ext.draw.CompositeSprite} collection The CompositeSprite to hide.
     * @deprecated
     */
    hideSprites: function(collection) {
        var sprite;
        for(var i = 0; i < collection.length; i++) {
            sprite = collection.getAt(i);
            sprite.hide(true);
        }
    },

    /**
     * @private
     * Renders cut site labels.
     */
    renderLabels: function() {
        var labels = [];
        var center;
        var color;

        this.labelSVG.remove();
        this.labelSVG = this.parentSVG.append("svg:g")
                                .attr("class", "pieLabel");

        if(this.showCutSites && this.showCutSiteLabels) {
            var site;
            for(var i = 0; i < this.cutSites.length; i++) {
                site = this.cutSites[i];
                center = this.cutSiteRenderer.middlePoints.get(site);

                if(site.getNumCuts() == 1) {
                    color = "#E57676";
                } else {
                    color = "#888888";
                }

                label = Ext.create("Teselagen.renderer.pie.CutSiteLabel", {
                    labelSVG: this.labelSVG,
                    annotation: site,
                    x: center.x,
                    y: center.y,
                    center: this.annotationCenter(site),
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
                center = this.featureRenderer.middlePoints.get(feature);

                label = Ext.create("Teselagen.renderer.pie.FeatureLabel", {
                    labelSVG: this.labelSVG,
                    annotation: feature,
                    x: center.x,
                    y: center.y,
                    center: this.annotationCenter(feature),
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
        var totalNumberOfLabels = labels.length;
        var totalLength = this.sequenceManager.getSequence().toString().length;

        var rightTopLabels = [];
        var rightBottomLabels = [];
        var leftTopLabels = [];
        var leftBottomLabels = [];

        var label;
        for(var i = 0; i < labels.length; i++) {
            label = labels[i];

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
        }

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

            if(label.includeInView) {
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

                label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")");
                labels.push(this.drawConnection(label, xPosition, yPosition));
            }
        }

        // Scale Right Bottom Labels
        lastLabelYPosition = this.center.y;
        var numberOfRightBottomLabels = rightBottomLabels.length;

        for(var j = 0; j < numberOfRightBottomLabels; j++) {
            label = rightBottomLabels[j];

            if(label.includeInView) {
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

                label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")");

                labels.push(this.drawConnection(label, xPosition, yPosition));
            }
        }
        
        // Scale Left Top Labels
        lastLabelYPosition = this.center.y - 15; // -15 to count label totalHeight
        var numberOfLeftTopLabels = leftTopLabels.length;

        for(var k = 0; k < numberOfLeftTopLabels; k++) {
            label = leftTopLabels[k];

            if(label.includeInView) {
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

                label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")")
                           .style("text-anchor", "end");

                labels.push(this.drawConnection(label, xPosition, yPosition)); 
            }
        }
        
        // Scale Left Bottom Labels
        lastLabelYPosition = this.center.y;
        var numberOfLeftBottomLabels = leftBottomLabels.length;
            
        for(var l = numberOfLeftBottomLabels - 1; l >= 0; l--) {
            label = leftBottomLabels[l];

            if(label.includeInView) {
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

                label.label.attr("transform", "translate(" + (xPosition - label.label.attr("x")) +
                                        "," + (yPosition - label.label.attr("y")) + ")")
                           .style("text-anchor", "end");

                labels.push(this.drawConnection(label, xPosition, yPosition));
            }
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
            path = "M" + labelX + " " + labelY +
                   "L" + this.featureRenderer.middlePoints.get(label.annotation).x + 
                   " " + this.featureRenderer.middlePoints.get(label.annotation).y;
        } else {
            path = "M" + labelX + " " + labelY +
                   "L" + this.cutSiteRenderer.middlePoints.get(label.annotation).x + 
                   " " + this.cutSiteRenderer.middlePoints.get(label.annotation).y;
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
        if(!this.sequenceManager) this.sequenceManager = pSequenceManager;
        this.dirty = true;
        this.sequenceManagerChanged = true;

        if(this.pie) {
            if(pSequenceManager.getSequence().toString().length > 0) {
                this.adjustCaret(0);
            } else if(this.caret.svgObject) {
                this.caret.svgObject.remove();
            }

            this.nameBox.remove();

            this.nameBox = Ext.create("Vede.view.pie.NameBox", {
                pie: this.parentSVG,
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
     * Adds the caret to the pie.
     */
    initPie: function() {
        this.pie = d3.select("#PieContainer")
                     .append("svg:svg")
                     .attr("id", "Pie")
                     .attr("overflow", "auto");
                     /*.on("mousedown", function(){
                    	 return function() {
                    		 if(d3.event.button == 2) d3.event.preventDefault();
                    	 }
                     });*/       

        this.parentSVG = this.pie.append("svg:g")
                                 .attr("class", "pieParent")
                                 .attr("transform", "matrix(1.5 0 0 1.5 0 0)");

        this.frame = Ext.create("Vede.view.pie.Frame", {
            pie: this.parentSVG,
            center: this.center
        });

        
        this.caret = Ext.create("Vede.view.pie.Caret", {
            pie: this.parentSVG,
            angle: 0,
            center: this.center,
            radius: this.railRadius + 10
        });

        var name = "unknown";
        var length = 0;
        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.nameBox = Ext.create("Vede.view.pie.NameBox", {
            pie: this.parentSVG,
            center: this.center,
            name: name,
            length: length
        });

        this.labelSVG = this.parentSVG.append("svg:g")
                                .attr("class", "pieLabel");

        this.selectionSVG = this.parentSVG.append("svg:g")
                                    .attr("class", "pieSelection");

        this.cutSiteSVG = this.parentSVG.append("svg:g")
                                  .attr("class", "pieCutSite");
        this.cutSiteRenderer.setCutSiteSVG(this.cutSiteSVG);

        this.orfSVG = this.parentSVG.append("svg:g")
                              .attr("class", "pieOrf");
        this.orfRenderer.setOrfSVG(this.orfSVG);

        this.featureSVG = this.parentSVG.append("svg:g")
                                  .attr("class", "pieFeature");
        this.featureRenderer.setFeatureSVG(this.featureSVG);

        this.fitWidthToContent(this);
        
        /*d3.select("#PieContainer").selectAll("*").on("mousedown", function(){
       	 	return function() {
       	 		if(d3.event.button == 2) d3.event.preventDefault();
       	 	}
        }); */
    },

    updateNameBox: function() {
        var name;
        var length;

        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.nameBox.remove();
        this.nameBox = Ext.create("Vede.view.pie.NameBox", {
            pie: this.parentSVG,
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
        //this.caret.remove();

        if(this.sequenceManager &&
           this.sequenceManager.getSequence().toString().length > 0) {

            var angle = bp * 2 * Math.PI / 
                this.sequenceManager.getSequence().seqString().length;

            var showMapCaret = Ext.getCmp("mapCaretMenuItem").checked;
            if (showMapCaret) {
                this.caret.setAngle(angle);
                /*this.caret = Ext.create("Vede.view.pie.Caret", {
                    pie: this.parentSVG,
                    angle: angle,
                    center: this.center,
                    radius: this.railRadius + 10
                });*/
            }
        }
    },
});
