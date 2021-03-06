/**
 * @class Teselagen.renderer.rail.FeatureRenderer
 * Class which creates sprites to draw all given features.
 */
Ext.define("Teselagen.renderer.rail.FeatureRenderer", {
    extend: "Teselagen.renderer.rail.RailRenderer", 

    requires: ["Teselagen.bio.sequence.common.StrandType"],

    statics: {
        DEFAULT_FEATURE_HEIGHT: 7,
        DEFAULT_FEATURES_GAP: 5,
    },

    config: {
        features: [],
        railWidth: null,
        railHeight:null,
        railGap: null,
        startPoints:null,
    },

    /**
     * @param {Array<Teselagen.bio.sequence.common.Annotation>} features The
     * features to be rendered.
     * @param {Ext.util.HashMap} headPoints A hashmap of the middle points of
     * the features. Defaults to empty.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
        
        this.setStartPoints(Ext.create("Ext.util.HashMap"));
    },

    /**
     * Converts the given features and their locations to sprites.
     * @return {Array<Ext.draw.Sprite>} The array of sprites.
     */
    render: function() {
        var sprites = [];
        var featureAlignment = this.Alignment.buildAlignmentMap(this.features, 
                                                         this.sequenceManager);

        
        Ext.each(this.features, function(feature) {
            var featureGap = this.railGap - this.self.DEFAULT_FEATURES_GAP - 
                                2 * this.self.DEFAULT_FEATURES_GAP;
            var index = featureAlignment.get(feature);

            if(index > 0) {
                featureGap -= index * (this.self.DEFAULT_FEATURE_HEIGHT + 
                                          this.self.DEFAULT_FEATURES_GAP);
            }
            
//            this.calculateLocations(feature, featureGap);

            var color = "#ffffff";
            var direction = 0;
            if(feature.getStrand() == this.StrandType.FORWARD) {
                direction = 1;
            } else if(feature.getStrand() == this.StrandType.BACKWARD) {
                direction = 2;
            }

            var recSprite;
            var featureWidth;
            var startPos;
            var endPos;
            var labelPos = {};
            
            Ext.each(feature.getLocations(), function(location) {
                color = this.colorByType(feature.getType().toLowerCase());

                startPos = location.getStart() / 
                             this.sequenceManager.getSequence().seqString().length;
                endPos = location.getEnd() / 
                             this.sequenceManager.getSequence().seqString().length;
                
                
               
                var xStartPosition = (startPos*this.railWidth);
                var yEndPosition = (endPos*this.railWidth);
                var yPosition = -(this.railHeight + this.railGap + featureGap);
                
                labelPos.x = xStartPosition;
                
                labelPos.y = yPosition;
                this.startPoints.add(feature, labelPos);
                
                if (startPos > endPos) {
                    featureWidth = (startPos-endPos)*this.railWidth;
                } else {
                    featureWidth = (endPos-startPos)*this.railWidth;
                }
                
                
                if(feature.getStart() == location.getStart() &&
                   feature.getStrand() == this.StrandType.BACKWARD) {

                    recSprite = this.GraphicUtils.drawFeatureNegativeArrow(xStartPosition, yPosition, featureWidth, color);

                } else if(feature.getEnd() == location.getEnd() && 
                          feature.getStrand() == this.StrandType.FORWARD) {

                    recSprite = this.GraphicUtils.drawFeaturePositiveArrow(xStartPosition, yPosition, featureWidth, color);

                } else {
                    recSprite = this.GraphicUtils.drawRect(xStartPosition, yPosition, featureWidth, color);
                }

                this.addToolTip(recSprite, this.getToolTip(feature));

                sprites.push(recSprite);
                
            }, this);
        }, this);
        

        console.log("All sprites calculated.");
        return sprites;
    },

    /**
     * @private
     * Given a feature, return its start and end angles.
     * @param {Teselagen.bio.sequence.common.Annotation} feature The feature to
     * calculate angles for.
     * @return {Array<Int>} The start and end angles, in that order.
     */
    calculateLocations: function(feature, featureGap) {
        var locate1 = feature.getStart()/
                     this.sequenceManager.getSequence().seqString().length;
        var locate2 = feature.getEnd()/
                     this.sequenceManager.getSequence().seqString().length;

        var headLocate=locate1;

//        this.headPoints.add(feature, this.GraphicUtils.pointOnRect(this.reference,this.rectWidth,
//                                                            headLocate,
//                                                            featureGap));

        return [locate1, locate2];
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

        return feature.getType() + nameString + ": " + feature.getStart() +
               ".." + feature.getEnd();
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
     * Called when features changes. Flags the renderer for recalculation.
     */
    applyFeatures: function(pFeatures) {
        this.setNeedsMeasurement(true);

        return pFeatures;
    },
});
