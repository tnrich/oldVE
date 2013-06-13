/**
 * @class Teselagen.renderer.pie.SelectionLayer
 * Renders the shaded regions of a selection.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author of SelectionLayer.as)
 */
Ext.define("Teselagen.renderer.pie.SelectionLayer", {
    extend: "Teselagen.renderer.pie.Layer",

    statics: {
        SELECTION_COLOR: "#0099FF",
        SELECTION_TRANSPARENCY: 0.3,
        SELECTION_FRAME_COLOR: "#CCCCCC"
    },

    /**
     * Draws the shaded wedge-shaped selection area.
     */
    drawSelectionPie: function(fromIndex, endIndex, pointerEvents) {
        var seqLen = this.sequenceManager.getSequence().toString().length;
        if(seqLen == 0) {
            return;
        }
        
        if(this.selectionSprite) {
            this.selectionSprite.destroy();
        }

        this.startAngle = fromIndex * 2 * Math.PI / seqLen;
        this.endAngle = endIndex * 2 * Math.PI / seqLen;

        var startPoint = Ext.create("Teselagen.bio.util.Point");
        startPoint.x = this.center.x + this.radius * Math.sin(this.startAngle);
        startPoint.y = this.center.y - this.radius * Math.cos(this.startAngle);

        var endPoint = Ext.create("Teselagen.bio.util.Point");
        endPoint.x = this.center.x + this.radius * Math.sin(this.endAngle);
        endPoint.y = this.center.y - this.radius * Math.cos(this.endAngle);

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        var adjustedEnd = this.endAngle;
        if(this.endAngle > this.startAngle) {
            adjustedEnd -= this.startAngle;
        } else {
            adjustedEnd += 2 * Math.PI - this.startAngle;
        }

        var adjustedStart = 0;

        var sweepFlag = 0;
        if(adjustedEnd > adjustedStart) {
            sweepFlag = 1;
        }

        var largeArcFlag = 0;
        if(Math.abs(adjustedEnd - adjustedStart) > Math.PI) {
            largeArcFlag = 1;
        }

        this.selectionSprite = Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + this.center.x + " " + this.center.y + " " +
                  "L" + startPoint.x + " " + startPoint.y + " " + 
                  "A" + this.radius + " " + this.radius + " 0 " + largeArcFlag +
                  " " + sweepFlag + " " + endPoint.x + " " + endPoint.y +
                  "L" + this.center.x + " " + this.center.y,
            stroke: this.self.SELECTION_FRAME_COLOR,
            "stroke-opacity": this.self.STROKE_OPACITY,
            fill: this.self.SELECTION_COLOR,
            "fill-opacity": this.self.SELECTION_TRANSPARENCY
        });
        
        if(!pointerEvents) {
	        this.selectionSprite.pointerEvents = "none";
        	this.selectionSprite.on("render", function(sprite) {
	        	sprite.setStyle("pointer-events", "none");
	        	//console.log(sprite.el.getStyle("pointer-events"));
	        });
        } else {
        	this.selectionSprite.pointerEvents = pointerEvents;
        	this.selectionSprite.on("render", function(sprite) {
	        	sprite.setStyle("pointer-events", pointerEvents);
	        	//console.log(sprite.el.getStyle("pointer-events"));
	        });
        }
        
        if(this.selectionSprite.pointerEvents=="all") {
	        this.selectionSprite.on("render", function(sprite) {
	    		var contextMenu = Ext.create('Ext.menu.Menu',{items: [{
		        	  text: 'Annotate as new Sequence Feature',
		        	  handler: function() {
		        		  var createNewFeatureWindow = Ext.create("Vede.view.ve.CreateNewFeatureWindow");     	
		        		  createNewFeatureWindow.show();
		        		  createNewFeatureWindow.center();
		        	  }
		        }]});
	    		
	    		console.log("SelectionSprite rendered");
	    		
	    		Vede.application.on("RightClickedOnFeature", function onRightClickedOnFeature(e, feature) {  			
	    			Vede.application.fireEvent("VectorPanelAnnotationContextMenu", feature);      			
	    			contextMenu.add([{
	                    xtype: 'menuseparator'
	                  },{
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
	    	      	    	this.sequenceManager.removeFeature(feature,false);
	    	      	    }
	    	      	}]);
	    			console.log("isRightClickedOnFeature is TRUE & working");
	    		}, this, {single: true});
	    		
	        	sprite.el.on("contextmenu", function(e) {
	        		e.preventDefault();
	        		//console.log("### CONTEXT MENU SHOWN ###");
	        		contextMenu.show();   		
	                contextMenu.setPagePosition(e.getX()+1,e.getY()-5);
	                Vede.application.fireEvent("SelectionLayerContextMenu");
	            }, this);
	        	
	        	
	        }, this, {single: true});
        }
    }
    
});




