Ext.define("Teselagen.renderer.de.BinHeaderRenderer", {
	
	
	requires: [
	    "Teselagen.constants.SBOLIcons"       
    ],
	
	gridManager: null,
	gridBinHeaderSVG: null,
	
	constructor: function(inData) {
		this.gridManager = inData.gridManager;
		this.gridBinHeaderSVG = inData.gridBinHeaderSVG;
	},
	
	renderBinHeaders: function() {
		var gridManager = this.gridManager;
		
		this.gridBinHeaderRectSVG = this.gridBinHeaderSVG
			.append("rect")
		    .attr("class", "gridBinHeaderRectSVG")
		    .attr("width", this.gridManager.COLUMN_WIDTH-1)
		    .attr("height", this.gridManager.BIN_HEIGHT-1)
		    .attr("fill", this.gridManager.BIN_FILL_COLOR)
		    .attr("stroke", this.gridManager.BIN_OUTLINE_COLOR)
		    .attr("stroke-width", this.gridManager.BIN_OUTLINE_WIDTH)
		    .attr("x", 0)
		    .attr("y", 0)
		    .attr("shape-rendering", "crispEdges")
		    .on("mouseover", function() {
				var selection = d3.select(this);
				selection.transition()
				    .duration(30)
					.attr("stroke", gridManager.BIN_HOVER_OUTLINE_COLOR);
			})
			.on("mouseout", function() {
				var selection = d3.select(this);
				selection.transition()
				    .duration(30)
				    .attr("stroke", function(d) {						
						if(d3.select(this).attr("isSelected")=="true") return gridManager.BIN_SELECTED_OUTLINE_COLOR;
						else return gridManager.BIN_OUTLINE_COLOR;
					});
			})
			.on("click", function() {
                var bin = d3.select(this.parentNode.parentNode);
                Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, bin.datum(), parseInt(bin.attr("deGridBinIndex")));
            });
		
		this.gridBinHeaderTextSVG = this.gridBinHeaderSVG
		    .append("svg:text")
		    .attr("font-family", "Maven Pro")
		    .attr("font-size", "13px")
		    .attr("font-weight", 600)
		    .text(function(d) {return d.get("binName");})
		    .attr("text-anchor", "middle")
		    .attr("pointer-events", "none")
		    .attr("x", this.gridManager.COLUMN_WIDTH/2)
		    .attr("y", 80+13/2);
		
		this.gridBinHeaderSbolIconSVG = this.gridBinHeaderSVG
		    .append("svg:path")
		    .attr("class", "gridBinHeaderSbolIconSVG")
		    .attr("d", function(d) {return Teselagen.constants.SBOLIcons.ICON_1_0_LIST[d.get("iconID").toUpperCase()].path;})
		    .attr("stroke", "#000000")
		    .attr("stroke-width", 3)
		    .attr("stroke-linecap", "round")
		    .attr("stroke-linejoin", "round")
		    .attr("pointer-events", "none")
		    .attr("fill", "none")
		    .attr("transform", function(d) {
	    		if(d.get("directionForward")==true) return "translate(38, -15)";
    			else return "translate(38, -15)rotate(180,25,50)";
    		});
		
		this.gridBinHeaderFlipButtonSVG = this.gridBinHeaderSVG
		    .append("rect")
		    .attr("class", "gridBinHeaderFlipButtonSVG")
		    .attr("width", 22)
		    .attr("height", 22)
		    .attr("rx", 1)
		    .attr("ry", 1)
		    .attr("x", 95)
		    .attr("y", 5)
		    .attr("fill", "#ecf0f1")
		    .attr("stroke", "#e0e3e6")
		    .attr("stroke-width", 0.5)
		    .style("cursor", "pointer")
		    .on("click", function() {
                var gridBin = d3.select(this.parentNode.parentNode);
                var j5Bin = gridBin.datum();
                var xIndex = parseInt(gridBin.attr("deGridBinIndex"));
                var event = document.createEvent('UIEvents');

                event.initUIEvent('click', true, true);
                this.parentNode.parentNode.dispatchEvent(event);

                j5Bin.set("directionForward", !j5Bin.get("directionForward"));
                
                Teselagen.manager.GridCommandPatternManager.addCommand({
                    type: "BIN",
                    data: {
                        type: "DIR",
                        x: xIndex,
                        oldData: !j5Bin.get("directionForward")
                    }
                });
            });
		
		this.gridBinHeaderFlipButtonArrowSVG = this.gridBinHeaderSVG
		    .append("path")
		    .attr("class", "gridBinHeaderFlipButtonArrowSVG")
		    .attr("d", this.gridManager.FLIP_ARROW_PATH)
		    .attr("fill", "#5a5a5a")
		    .attr("pointer-events", "none")
		    .attr("transform", function(d) {
	    		if(d.get("directionForward") === true) return "translate(93, 9)scale(0.7)";
    			else return "translate(93, 9)scale(0.7)rotate(180,19,10)";
    		});
	},
});
