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
        OUTLINE_COLOR: "black",
        OUTLINE_WIDTH: 0.5
    },

    config: {
        featureSVG: null,
        features: [],
        railWidth: null,
        railHeight:null,
        railGap: null,
        startPoints:null
    },

    /**
     * @param {Teselagen.bio.sequence.common.Annotation[]} features The
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
     * @return {Ext.draw.Sprite[]} The array of sprites.
     */
    render: function() {
        var path;
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

                    path = this.GraphicUtils.drawFeatureNegativeArrow(xStartPosition, yPosition, featureWidth, color);

                } else if(feature.getEnd() == location.getEnd() && 
                          feature.getStrand() == this.StrandType.FORWARD) {

                    path = this.GraphicUtils.drawFeaturePositiveArrow(xStartPosition, yPosition, featureWidth, color);

                } else {
                    path = this.GraphicUtils.drawRect(xStartPosition, yPosition, featureWidth, color);
                }

                this.featureSVG.append("svg:path")
                               .attr("stroke", this.self.OUTLINE_COLOR)
                               .attr("stroke-width", this.self.OUTLINE_WIDTH)
                               .attr("fill", color)
                               .attr("fill-rule", "evenodd")
                               .attr("d", path)
                               .on("mousedown", this.getClickListener(feature.getStart(),
                                                                      feature.getEnd()))
                               .on("contextmenu", this.getRightClickListener(
                                                        feature))                                       
                               .append("svg:title")
                               .text(this.getToolTip(feature));
                
            }, this);
            //this.addContextMenuListener(feature);
        }, this);
        
        
    },

    /**
     * @private
     * Given a feature, return its start and end angles.
     * @param {Teselagen.bio.sequence.common.Annotation} feature The feature to
     * calculate angles for.
     * @return {Number[]} The start and end angles, in that order.
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
    
    addContextMenuListener: function(feature) {
    	var sequenceManager = this.getSequenceManager();
    	this.featureSVG.on("contextmenu", function(data,index) {
    		Vede.application.fireEvent("VectorPanelAnnotationContextMenu", feature);
			d3.event.preventDefault();
            var contextMenu = Ext.create('Ext.menu.Menu',{
            	  items: [{
            	    text: 'Edit Sequence Feature',
            	    handler: function() {
                    	var editSequenceFeatureWindow = Ext.create(
                        "Vede.view.ve.EditSequenceFeatureWindow");
                    	
                        editSequenceFeatureWindow.show();
                        editSequenceFeatureWindow.center();
            	    }
            	  },{
              	    text: 'Delete Sequence Feature',
              	    handler: function() {
              	    	sequenceManager.removeFeature(feature,false);
              	    }
              	  }]
            });                  
            contextMenu.show(); 
            contextMenu.setPagePosition(d3.event.pageX+1,d3.event.pageY-5);
        });
    },
    
    onContextMenu: function(feature) {
    	return function() {
	    	var sequenceManager = this.getSequenceManager();
	    	Vede.application.fireEvent("VectorPanelAnnotationContextMenu", feature);
			d3.event.preventDefault();
	        var contextMenu = Ext.create('Ext.menu.Menu',{
	        	  items: [{
	        	    text: 'Edit Sequence Feature',
	        	    handler: function() {
	                	var editSequenceFeatureWindow = Ext.create(
	                    "Vede.view.ve.EditSequenceFeatureWindow");
	                	
	                    editSequenceFeatureWindow.show();
	                    editSequenceFeatureWindow.center();
	        	    }
	        	  },{
	          	    text: 'Delete Sequence Feature',
	          	    handler: function() {
	          	    	sequenceManager.removeFeature(feature,false);
	          	    }
	          	  }]
	        });                  
	        contextMenu.show(); 
	        contextMenu.setPagePosition(d3.event.pageX+1,d3.event.pageY-5);
    	}
    },
});





