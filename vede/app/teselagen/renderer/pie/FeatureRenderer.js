/**
 * @class Teselagen.renderer.pie.FeatureRenderer
 * Class which creates sprites to draw all given features.
 */
Ext.define("Teselagen.renderer.pie.FeatureRenderer", {
    extend: "Teselagen.renderer.pie.PieRenderer", 

    requires: ["Teselagen.bio.sequence.common.StrandType"],

    statics: {
        DEFAULT_FEATURE_HEIGHT: 7,
        DEFAULT_FEATURES_GAP: 3,
        OUTLINE_COLOR: "black",
        OUTLINE_WIDTH: 0.5
    },

    config: {
        featureSVG: null,
        features: [],
        middlePoints: null
    },

    /**
     * @param {Teselagen.bio.sequence.common.Annotation[]} features The
     * features to be rendered.
     * @param {Ext.util.HashMap} middlePoints A hashmap of the middle points of
     * the features. Defaults to empty.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);

        this.setMiddlePoints(Ext.create("Ext.util.HashMap"));
    },

    /**
     * Converts the given features and their locations to sprites and appends
     * them to this.pie.
     */
    render: function(disableMouseEvents) {
        var path;
        var feature;
        var featureAlignment = this.Alignment.buildAlignmentMap(this.features, 
                                                         this.sequenceManager);

        for(var i = 0; i < this.features.length; i++) {
            feature = this.features[i];

            var featureRadius = this.railRadius - this.self.DEFAULT_FEATURES_GAP - 
                                2 * this.self.DEFAULT_FEATURES_GAP;
            var index = featureAlignment.get(feature.getIndex());

            if(index > 0) {
                featureRadius -= index * (this.self.DEFAULT_FEATURE_HEIGHT + 
                                          this.self.DEFAULT_FEATURES_GAP);
            }

            this.calculateAngles(feature, featureRadius);

            var color = "#ffffff";
            var direction = 0;
            if(feature.getStrand() == this.StrandType.FORWARD) {
                direction = 1;
            } else if(feature.getStrand() == this.StrandType.BACKWARD) {
                direction = 2;
            }

            // Draw a pie slice for each location in the feature.
            var startAngle;
            var endAngle;

            /*if(feature.getLocations().length > 1) {
                console.log(feature.toString());
            }*/

            Ext.each(feature.getLocations(), function(location) {
                color = this.colorByType(feature.getType().toLowerCase());

                startAngle = location.getStart() * 2 * Math.PI / 
                             this.sequenceManager.getSequence().seqString().length;
                endAngle = location.getEnd() * 2 * Math.PI / 
                             this.sequenceManager.getSequence().seqString().length;

                if(feature.getStart() == location.getStart() &&
                   feature.getStrand() == this.StrandType.BACKWARD) {

                    path = this.GraphicUtils.drawDirectedPiePiece(this.center, 
                                 featureRadius, this.self.DEFAULT_FEATURE_HEIGHT, 
                                 startAngle, endAngle, direction, color);
                } else if(feature.getEnd() == location.getEnd() && 
                          feature.getStrand() == this.StrandType.FORWARD) {

                    path = this.GraphicUtils.drawDirectedPiePiece(this.center,
                                 featureRadius, this.self.DEFAULT_FEATURE_HEIGHT, 
                                 startAngle, endAngle, direction, color);

                } else {
                    path = this.GraphicUtils.drawPiePiece(this.center,
                                 featureRadius, this.self.DEFAULT_FEATURE_HEIGHT, 
                                 startAngle, endAngle, direction, color);
                }

                if(disableMouseEvents) {
                    this.featureSVG.append("svg:path")
                                   .attr("stroke", this.self.OUTLINE_COLOR)
                                   .attr("stroke-width", this.self.OUTLINE_WIDTH)
                                   .attr("fill", color)
                                   .attr("fill-rule", "evenodd")
                                   .attr("d", path)
                                   .append("svg:title")
                                   .text(this.getToolTip(feature));
                } else {
                    this.featureSVG.append("svg:path")
                                   .attr("stroke", this.self.OUTLINE_COLOR)
                                   .attr("stroke-width", this.self.OUTLINE_WIDTH)
                                   .attr("fill", color)
                                   .attr("fill-rule", "evenodd")
                                   .attr("d", path)
                                   .on("mousedown", this.getClickListener(
                                                            feature.getStart(),
                                                            feature.getEnd()))
                                   .on("contextmenu", this.getRightClickListener(
                                                            feature))
                                   .append("svg:title")
                                   .text(this.getToolTip(feature));
                }
            }, this);
        }
    },

    /**
     * @private
     * Given a feature, return its start and end angles.
     * @param {Teselagen.bio.sequence.common.Annotation} feature The feature to
     * calculate angles for.
     * @return {Number[]} The start and end angles, in that order.
     */
    calculateAngles: function(feature, featureRadius) {
        var angle1 = feature.getStart() * 2 * Math.PI /
                     this.sequenceManager.getSequence().seqString().length;
        var angle2 = feature.getEnd() * 2 * Math.PI /
                     this.sequenceManager.getSequence().seqString().length;

        var centralAngle;

        if(angle1 > angle2) {
            var virtualCenter = angle2 - (((2 * Math.PI - angle1) + angle2) / 2);

            if(virtualCenter > 0) {
                centralAngle = virtualCenter;
            } else {
                centralAngle = 2 * Math.PI + virtualCenter;
            }
        } else {
            centralAngle = (angle1 + angle2) / 2;
        }

        this.middlePoints.add(feature, this.GraphicUtils.pointOnCircle(this.center,
                                                            centralAngle,
                                                            featureRadius));

        return [angle1, angle2];
    },

    /**
     * Generates a tooltip for the given feature.
     * @param {Teselagen.bio.sequence.common.Annotation} feature The feature to generate
     * a tooltip for.
     * @return {String} The generated tooltip.
     */
    getToolTip: function(feature) {
        var nameString = "";
        if(feature.getName()) {
            nameString = " - " + feature.getName();
        }

        return feature.getType() + nameString + ": " + (feature.getStart() + 1) 
            + ".." + feature.getEnd();
    },

    /**
     * @private
     * Given the type of a feature, return the color it should be drawn in.
     * @param {String} type The type of the feature.
     * @return {String} The color in hex.
     */
    colorByType: function(type) {
        var switchObj = {
            promoter: "#31B440",
            terminator: "#F51600",
            cds: "#EF6500",
            m_rna: "#FFFF00",
            misc_binding: "#006FEF",
            misc_feature: "#006FEF",
            misc_marker: "#8DCEB1",
            rep_origin: "#878787"
        };

        var color = switchObj[type] || "#CCCCCC";
        return color;
    },

    /**
     * @private
     * Called when features change. Flags the renderer for recalculation.
     */
    applyFeatures: function(pFeatures) {
        this.setNeedsMeasurement(true);

        return pFeatures;
    }
});
