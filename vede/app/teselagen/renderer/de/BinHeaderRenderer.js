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
			.on("click", gridManager.onGridBinHeaderRectSvgClick/*function() {
				
				
				gridManager.toggleCutCopyPastePartOptions(false);
				gridManager.toggleInsertOptions(true);
				gridManager.toggleInsertRowAboveOptions(false);
				gridManager.toggleInsertRowBelowOptions(true);
				Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Column"]')[0].setDisabled(false);
				
				if(gridManager.selectedGridPart != null) {
					d3.selectAll(".gridPartRectSVG")
						.attr("fill", gridManager.PART_FILL_COLOR)
						.attr("stroke", gridManager.PART_OUTLINE_COLOR)
						.attr("isSelected", "false");
					gridManager.selectedGridPart = null;
				}
				
				if(d3.select(this).attr("isSelected")=="true") return;
				
				d3.selectAll(".gridBinHeaderRectSVG")
					.attr("fill", gridManager.BIN_FILL_COLOR)
					.attr("stroke", gridManager.BIN_OUTLINE_COLOR)
					.attr("isSelected", "false");
				
				d3.select(this).transition()
				    .duration(30)
				    .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
				    .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
				    .attr("isSelected", "true");
				
				gridManager.selectedGridBin = d3.select(this.parentNode.parentNode);				
	
		        var removeColumnMenuItem = Ext.getCmp("mainAppPanel").down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");
		        removeColumnMenuItem.enable();
	        }*/);
		
		this.gridBinHeaderTextSVG = this.gridBinHeaderSVG
		    .append("svg:text")
		    .attr("font-family", "Maven Pro")
		    .attr("font-size", "13px")
		    .attr("font-weight", 600)
		    .text(function(d) {return d.binName;})
		    .attr("text-anchor", "middle")
		    .attr("pointer-events", "none")
		    .attr("x", this.gridManager.COLUMN_WIDTH/2)
		    .attr("y", 80+13/2);
		
		this.gridBinHeaderSbolIconSVG = this.gridBinHeaderSVG
		    .append("svg:path")
		    .attr("class", "gridBinHeaderSbolIconSVG")
		    .attr("d", function(d) {return Teselagen.constants.SBOLIcons.ICON_1_0_LIST[d.iconID].path;})
		    .attr("stroke", "#000000")
		    .attr("stroke-width", 3)
		    .attr("stroke-linecap", "round")
		    .attr("stroke-linejoin", "round")
		    .attr("pointer-events", "none")
		    .attr("fill", "none")
		    .attr("transform", function(d) {
	    		if(d.directionForward==true) return "translate(38, -15)";
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
				gridManager.toggleCutCopyPastePartOptions(false);
				gridManager.toggleInsertOptions(true);
				gridManager.toggleInsertRowAboveOptions(false);
				gridManager.toggleInsertRowBelowOptions(true);
				Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Column"]')[0].setDisabled(false);
	
		    	var directionForward;
		    	d3.select(this.parentNode).select(".gridBinHeaderFlipButtonArrowSVG")
			    	.attr("transform", function(dr) {
			    		if(dr.directionForward==true) return "translate(93, 9)scale(0.7)rotate(180,19,10)";
		    			else return "translate(93, 9)scale(0.7)";
		    		});
		    	d3.select(this.parentNode).select(".gridBinHeaderSbolIconSVG")
			    	.attr("transform", function(dr) {
			    		directionForward = dr.directionForward;
			    		if(dr.directionForward==true) return "translate(38, -15)rotate(180,25,50)";
		    			else return "translate(38, -15)";
		    		});
		    	d3.select(this.parentNode.parentNode).datum().directionForward = !directionForward;
		    	
		    	Teselagen.manager.GridCommandPatternManager.addCommand({
		        	type: "BIN",
		        	data: {
		        		type: "DIR",
		        		x: parseInt(d3.select(this.parentNode.parentNode).attr("deGridBinIndex")),
		        		data: directionForward
		        	}
				});
		    	
		    	if(gridManager.selectedGridPart != null) {
					d3.selectAll(".gridPartRectSVG")
						.attr("fill", gridManager.PART_FILL_COLOR)
						.attr("stroke", gridManager.PART_OUTLINE_COLOR)
						.attr("isSelected", "false");
					gridManager.selectedGridPart = null;
				}
		    	
		    	gridManager.inspector.setActiveTab(1);
		        var columnsGrid = gridManager.inspector.down("form[cls='collectionInfoForm'] > gridpanel");
		        
		        var selectionModel = columnsGrid.getSelectionModel();
		        var selectedPart = columnsGrid.getSelectionModel().getSelection()[0];
		        gridManager.inspector.setActiveTab(1);
		        
		        gridManager.selectedGridBin = d3.select(this.parentNode.parentNode);
		        var j5Bin = gridManager.j5BinFromCollectionDataBin(gridManager.selectedGridBin.datum());
		        //selectionModel.select(j5Bin);

		        /*var contentField = gridManager.inspector.down("displayfield[cls='columnContentDisplayField']");
		        var contentArray = [];
		        j5bin.cells().each(function(part, i) {
		            if(!part.get("phantom")) {
		                contentArray.push(part.get("name"));
		                contentArray.push(": ");
		                contentArray.push(part.get("fas"));
		                contentArray.push("<br>");
		            }
		        });
		        contentField.setValue(contentArray.join(""));
		        */
		        Teselagen.manager.InspectorPanelManager.refreshInspectorGrid();
		        //Teselagen.manager.InspectorPanelManager.selectInspectorGridRowByIndex();
		        
		    	if(d3.select(this.parentNode).select(".gridBinHeaderRectSVG").attr("isSelected")=="true") return;
		    	
		    	d3.selectAll(".gridBinHeaderRectSVG")
					.attr("fill", gridManager.BIN_FILL_COLOR)
					.attr("stroke", gridManager.BIN_OUTLINE_COLOR)
					.attr("isSelected", "false");				
				
				d3.select(this.parentNode).select(".gridBinHeaderRectSVG").transition()
				    .duration(30)
				    .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
				    .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
				    .attr("isSelected", "true");
				
				
				
		        var removeColumnMenuItem = Ext.getCmp("mainAppPanel").down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");
		        removeColumnMenuItem.enable();
		        
		    });
		
		this.gridBinHeaderFlipButtonArrowSVG = this.gridBinHeaderSVG
		    .append("path")
		    .attr("class", "gridBinHeaderFlipButtonArrowSVG")
		    .attr("d", this.gridManager.FLIP_ARROW_PATH)
		    .attr("fill", "#5a5a5a")
		    .attr("pointer-events", "none")
		    .attr("transform", function(d) {
	    		if(d.directionForward==true) return "translate(93, 9)scale(0.7)";
    			else return "translate(93, 9)scale(0.7)rotate(180,19,10)";
    		});
		
	},
	
	
	
	
	
});















