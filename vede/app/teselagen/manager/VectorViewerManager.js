/**
 * @class Teselagen.manager.VectorViewerManager
 * Basically a scaled-down version of PieManager and RailManager. To be used for the read-only
 * Vector Viewer.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.VectorViewerManager", {
    requires: ["Teselagen.renderer.pie.FeatureRenderer",
               "Teselagen.renderer.rail.FeatureRenderer",
               "Vede.view.pie.Frame",
               "Vede.view.pie.NameBox",
               "Vede.view.rail.Frame",
               "Vede.view.rail.NameBox"],

    statics: {
        NAMEBOX_FONT_SIZE: "8px"
    },

    config: {
        sequenceManager: null,
        center: {},
        railRadius: 0,
        railGap: 0,
        railWidth: 300,
        reference: {
            x: 0,
            y: 0
        },
        features: []
    },

    constructor: function(inData) {
        this.initConfig(inData);

        this.setFeatures(inData.sequenceManager.getFeatures());

        this.pieRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
            featureSVG: this.pieFeatureSVG,
            sequenceManager: this.getSequenceManager(),
            center: this.getCenter(),
            railRadius: this.getRailRadius(),
            features: this.getSequenceManager().getFeatures()
        });

        this.railRenderer = Ext.create("Teselagen.renderer.rail.FeatureRenderer", {
            featureSVG: this.railFeatureSVG,
            sequenceManager: this.getSequenceManager(),
            railWidth: this.railWidth,
            railHeight: this.railHeight,
            reference: this.reference,
            railGap: this.railGap,
            railRadius: this.getRailRadius(),
            features: this.getSequenceManager().getFeatures()
        });

        this.pieSelectionLayer = Ext.create("Teselagen.renderer.pie.SelectionLayer", {
            center: this.center,
            radius: this.railRadius,
            sequenceManager: this.sequenceManager,
            selectionSVG: this.pieSelectionSVG
        });

        this.railSelectionLayer = Ext.create("Teselagen.renderer.rail.SelectionLayer", {
            reference: this.reference,
            railWidth: this.railWidth,
            sequenceManager: this.sequenceManager,
            selectionSVG: this.railSelectionSVG
        });
    },

    render: function() {
        if(this.railFeatureSVG) {
            this.railFeatureSVG.remove();
        }

        if(this.pieFeatureSVG) {
            this.pieFeatureSVG.remove();
        }

        this.pieFeatureSVG = this.pieParentSVG.append("svg:g")
                                            .attr("class", "vectorViewerPieFeature");

        this.railFeatureSVG = this.railParentSVG.append("svg:g")
                                            .attr("class", "vectorViewerRailFeature");

        if(this.sequenceManager.getCircular()) {
            this.pieRenderer.setFeatureSVG(this.pieFeatureSVG);
            this.pieRenderer.setFeatures(this.features);
            this.pieRenderer.render(true);

            this.pieParentSVG.style("visibility", "");
            this.railParentSVG.style("visibility", "hidden");
        } else {
            this.railRenderer.setFeatureSVG(this.railFeatureSVG);
            this.railRenderer.setFeatures(this.features);
            this.railRenderer.render(true);

            this.railParentSVG.style("visibility", "");
            this.pieParentSVG.style("visibility", "hidden");
        }
    },

    select: function(start, stop) {
        if(this.sequenceManager.getCircular()) {
            this.pieSelectionLayer.select(start, stop);

            this.pieSelectionSVG.style("visibility", "");
            this.railSelectionSVG.style("visibility", "hidden");
        } else {
            this.railSelectionLayer.select(start, stop);

            this.pieSelectionSVG.style("visibility", "hidden");
            this.railSelectionSVG.style("visibility", "");
        }
    },

    deselect: function() {
        this.pieSelectionLayer.deselect();
        this.railSelectionLayer.deselect();
    },

    init: function(vectorViewer) {
        var vectorViewerId = vectorViewer.el.dom.id;

        // If there's no SVG in the current tab, VE hasn't been rendered yet, so
        // add svg elements. Otherwise, just set this.pie to the pie in this tab,
        // and so on.
        if(!d3.select("#" + vectorViewerId + " .VectorViewer").node()) {
            this.pie = d3.select("#" + vectorViewerId)
                         .append("svg:svg")
                         .attr("class", "VectorViewer")
                         .attr("overflow", "auto")
                         .attr("width", "320px")
                         .attr("height", "320px");

            this.pieParentSVG = this.pie.append("svg:g")
                                     .attr("class", "vectorViewerPieParent")
                                     .attr("transform", "matrix(1.5 0 0 1.5 0 0)");

            this.railParentSVG = this.pie.append("svg:g")
                                     .attr("class", "vectorViewerRailParent")
                                     .attr("transform", "matrix(1.5 0 0 1.5 0 0)");

            this.pieFrame = Ext.create("Vede.view.pie.Frame", {
                pie: this.pieParentSVG,
                center: this.center,
                radius: this.getRailRadius()
            });

            this.railFrame = Ext.create("Vede.view.rail.Frame", {
                rail: this.railParentSVG,
                railWidth: this.railWidth,
                center: this.center,
                reference: this.reference
            });

            var name = "unknown";
            var length = 0;
            if(this.sequenceManager) {
                name = this.sequenceManager.getName();
                length = this.sequenceManager.getSequence().toString().length;
            }

            this.pieNameBox = Ext.create("Vede.view.pie.NameBox", {
                pie: this.pieParentSVG,
                center: this.center,
                name: name,
                length: length,
                fontSize: this.self.NAMEBOX_FONT_SIZE
            }).on("click", function(){});

            this.railNameBox = Ext.create("Vede.view.rail.NameBox", {
                rail: this.railParentSVG,
                center: this.center,
                name: name,
                length: length,
                fontSize: this.self.NAMEBOX_FONT_SIZE
            }).on("click", function(){});

            this.pieFeatureSVG = this.pieParentSVG.append("svg:g")
                                      .attr("class", "vectorViewerPieFeature");

            this.pieSelectionSVG = this.pieParentSVG.append("svg:path")
                                    .attr("class", "vectorViewerRailSelection")
                                    .attr("stroke", Teselagen.manager.PieManager.SELECTION_FRAME_COLOR)
                                    .attr("stroke-opacity", Teselagen.manager.PieManager.STROKE_OPACITY)
                                    .attr("fill", Teselagen.manager.PieManager.SELECTION_COLOR)
                                    .attr("fill-opacity", Teselagen.manager.PieManager.SELECTION_TRANSPARENCY)
                                    .attr("class", "vectorViewerPieSelection");

            this.railFeatureSVG = this.railParentSVG.append("svg:g")
                                      .attr("class", "vectorViewerRailFeature");

            this.railSelectionSVG = this.railParentSVG.append("svg:path")
                                    .attr("class", "vectorViewerRailSelection")
                                    .attr("stroke", Teselagen.manager.PieManager.SELECTION_FRAME_COLOR)
                                    .attr("stroke-opacity", Teselagen.manager.PieManager.STROKE_OPACITY)
                                    .attr("fill", Teselagen.manager.PieManager.SELECTION_COLOR)
                                    .attr("fill-opacity", Teselagen.manager.PieManager.SELECTION_TRANSPARENCY);
        } else {
            this.pie = d3.select("#" + vectorViewerId + " .VectorViewer");

            this.pieParentSVG = this.pie.select(".vectorViewerPieParent");
            this.railParentSVG = this.pie.select(".vectorViewerRailParent");

            this.pieFrame = this.pieParentSVG.select(".pieFrame");
            this.pieNameBox = this.pieParentSVG.select(".pieNameBox");

            this.railFrame = this.railParentSVG.select(".railFrame");
            this.railNameBox = this.railParentSVG.select(".railNameBox");

            this.pieFeatureSVG = this.pieParentSVG.select(".vectorViewerPieFeature");
            this.railFeatureSVG = this.railParentSVG.select(".vectorViewerRailFeature");

            this.pieSelectionSVG = this.pieParentSVG.select(".vectorViewerPieSelection");
            this.railSelectionSVG = this.railParentSVG.select(".vectorViewerRailSelection");
        }

        if(this.sequenceManager.getCircular()) {
            this.pieRenderer.setFeatureSVG(this.pieFeatureSVG);
            this.pieSelectionLayer.setSelectionSVG(this.pieSelectionSVG);
        } else {
            this.railRenderer.setFeatureSVG(this.railFeatureSVG);
            this.railSelectionLayer.setSelectionSVG(this.railSelectionSVG);
        }
    },

    updateNameBox: function() {
        var name;
        var length;

        if(this.sequenceManager) {
            name = this.sequenceManager.getName();
            length = this.sequenceManager.getSequence().toString().length;
        }

        this.pieNameBox.remove();
        this.railNameBox.remove();

        if(this.sequenceManager.getCircular()) {
            this.pieNameBox = Ext.create("Vede.view.pie.NameBox", {
                pie: this.pieParentSVG,
                center: this.center,
                name: name,
                length: length,
                fontSize: this.self.NAMEBOX_FONT_SIZE
            }).on("click", function(){});
        } else {
            this.railNameBox = Ext.create("Vede.view.rail.NameBox", {
                rail: this.railParentSVG,
                center: this.center,
                name: name,
                length: length,
                fontSize: this.self.NAMEBOX_FONT_SIZE
            }).on("click", function(){});
        }
    },

    applySequenceManager: function(pSeqMan) {
        if(this.pieRenderer) {
            this.pieRenderer.setSequenceManager(pSeqMan);
        }

        if(this.railRenderer) {
            this.railRenderer.setSequenceManager(pSeqMan);
        }

        return pSeqMan;
    }
});
