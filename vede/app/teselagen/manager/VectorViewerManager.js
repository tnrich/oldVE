/**
 * @class Teselagen.manager.VectorViewerManager
 * Basically a scaled-down version of PieManager and RailManager. To be used for the read-only
 * Vector Viewer.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.manager.VectorViewerManager", {
    requires: ["Teselagen.renderer.pie.FeatureRenderer",
               "Vede.view.pie.Frame",
               "Vede.view.pie.NameBox"],

    statics: {
        NAMEBOX_FONT_SIZE: "8px"
    },

    config: {
        sequenceManager: null,
        center: {},
        railRadius: 0,
        features: []
    },

    constructor: function(inData) {
        this.initConfig(inData);

        this.setFeatures(inData.sequenceManager.getFeatures());

        if(this.getSequenceManager().getCircular()) {
            this.featureRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
                featureSVG: this.featureSVG,
                sequenceManager: this.getSequenceManager(),
                center: this.getCenter(),
                railRadius: this.getRailRadius(),
                features: this.getSequenceManager().getFeatures()
            });
        } else {
            this.featureRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
                featureSVG: this.featureSVG,
                sequenceManager: this.getSequenceManager(),
                center: this.getCenter(),
                railRadius: this.getRailRadius(),
                features: this.getSequenceManager().getFeatures()
            });
        }
    },

    render: function() {
        if(this.featureSVG) {
            this.featureSVG.remove();
        }

        this.featureSVG = this.parentSVG.append("svg:g")
                                        .attr("class", "vectorViewerFeature");

        this.featureRenderer.setFeatureSVG(this.featureSVG);
        this.featureRenderer.setFeatures(this.features);
        this.featureRenderer.render();

        Ext.defer(function(){this.fitWidthToContent(this, false)}, 10, this);
    },

    /**
     * Adjust the width of the surface to fit all content, ensuring that a 
     * scrollbar appears.
     */
    fitWidthToContent: function(scrollToCenter) {
        /*var container = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='VectorViewer']");

        if(container && container.el) {
            var pc = container.el.dom;
            var frame = this.pie.select(".pieFrame").node();
            var pcRect = pc.getBoundingClientRect();
            var frameRect = frame.getBoundingClientRect();
            var scrollWidthRatio = (pc.scrollLeft + pcRect.width / 2) / pc.scrollWidth;
            var scrollHeightRatio = (pc.scrollTop + pcRect.height / 2) / pc.scrollHeight;

            for(var i = 0; i < 8; i++) {
                pc = container.el.dom;
                frame = this.pie.select(".pieFrame").node();
                pcRect = pc.getBoundingClientRect();
                frameRect = frame.getBoundingClientRect();

                var pieBox = this.pie.node().getBBox();

                if(pieBox.height === 0 || pieBox.width === 0) {
                    return;
                }


                var distanceFromCenterX = pc.scrollWidth / 2 - (frameRect.left + pc.scrollLeft + frameRect.width / 2 - pcRect.left);
                var distanceFromCenterY = pc.scrollHeight / 2 - (frameRect.top + pc.scrollTop + frameRect.height / 2 - pcRect.top);

                // Get previous values for scale and transform.
                var translateValues = this.parentSVG.attr("transform").match(/[-.\d]+/g);
                var scale = [Number(translateValues[0]), Number(translateValues[3])];
                var translate = [Number(translateValues[4]), Number(translateValues[5])];

                var transX = distanceFromCenterX + translate[0];
                var transY = distanceFromCenterY + translate[1];

                this.parentSVG.attr("transform", "matrix(" + scale[0] + " 0 0 " + scale[1] + 
                                                          " " + transX + " " + transY + ")");

                this.pie.attr("width", pieBox.width + transX)
                         .attr("height", pieBox.height + transY);

            }

            if(scrollToCenter) {
                container.el.setScrollLeft((this.pie.node().width.baseVal.value - container.getWidth()) / 2);
                container.el.setScrollTop((this.pie.node().height.baseVal.value - container.getHeight()) / 2);
            } else {
                container.el.setScrollLeft(scrollWidthRatio * pc.scrollWidth - pcRect.width / 2);
                container.el.setScrollTop(scrollHeightRatio * pc.scrollHeight - pcRect.height / 2);
            }
        }*/
    },

    initPie: function(vectorViewer) {
        var vectorViewerId = vectorViewer.el.dom.id;
        // If there's no SVG in the current tab, VE hasn't been rendered yet, so
        // add svg elements. Otherwise, just set this.pie to the pie in this tab,
        // and so on.



        if(!d3.select("#" + vectorViewerId + " .VectorViewer").node()) {
            this.pie = d3.select("#" + vectorViewerId)
                         .append("svg:svg")
                         .attr("class", "VectorViewer")
                         .attr("overflow", "auto");

            this.parentSVG = this.pie.append("svg:g")
                                     .attr("class", "vectorViewerParent")
                                     .attr("transform", "matrix(1.5 0 0 1.5 0 0)");

            this.frame = Ext.create("Vede.view.pie.Frame", {
                pie: this.parentSVG,
                center: this.center,
                radius: this.getRailRadius()
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
                length: length,
                fontSize: this.self.NAMEBOX_FONT_SIZE
            });

            this.labelSVG = this.parentSVG.append("svg:g")
                                    .attr("class", "vectorViewerLabel");

            this.featureSVG = this.parentSVG.append("svg:g")
                                      .attr("class", "vectorViewerFeature");
        } else {
            this.pie = d3.select("#" + vectorViewerId + " .VectorViewer");

            this.parentSVG = this.pie.select(".vectorViewerParent");

            this.frame = this.parentSVG.select(".pieFrame");
            this.nameBox = this.parentSVG.select(".pieNameBox");
            this.featureSVG = this.parentSVG.select(".vectorViewerFeature");
        }

        this.featureRenderer.setFeatureSVG(this.featureSVG);
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
            length: length,
            fontSize: this.self.NAMEBOX_FONT_SIZE
        });
    }
});
