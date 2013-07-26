Ext.define("Teselagen.renderer.de.PartRenderer", {
	
	
	requires: [
   	    "Teselagen.constants.SBOLIcons",
   	    "Teselagen.manager.ProjectManager"
    ],
	
	gridManager: null,
	gridPartParentSVG: null,
	gridPartSVG: null,
	
	constructor: function(inData) {
		this.gridManager = inData.gridManager;
		this.gridPartParentSVG = inData.gridPartParentSVG;
		this.gridPartSVG = inData.gridPartSVG;
	},
	
	renderParts: function() {
		var gridManager = this.gridManager;
		
		this.gridPartRectSVG = this.gridPartSVG
			.append("rect")
			.attr("class", "gridPartRectSVG")
			.attr("width", this.gridManager.COLUMN_WIDTH-1)
			.attr("height", this.gridManager.PART_HEIGHT-1)
			.attr("fill", this.gridManager.PART_FILL_COLOR)
			.attr("stroke", this.gridManager.PART_OUTLINE_COLOR)
			.attr("stroke-width", this.gridManager.PART_OUTLINE_WIDTH)
			.attr("x", 0)
			.attr("y", 0)
			.attr("shape-rendering", "crispEdges")
			.on("mouseover", function(d) {
				var selection = d3.select(this);
				selection.transition()
					.duration(30)
					.attr("stroke", gridManager.PART_HOVER_OUTLINE_COLOR);
				
				// Highlight all gridParts with the same source, unless the j5Part is empty.
				//>> Part source seems to be null, so I am using 'sequencefile_id' as a temporary
				//*  substitute for proof-of-concept purposes. Change to whatever is best later.
				// Commented out right now as it is kind of annoying.
				/*var selectedPartSeqId = d.sequencefile_id;
				if(!selectedPartSeqId||selectedPartSeqId==""||selectedPartSeqId==null) return;
				d3.selectAll(".gridPartRectSVG")
					.filter(function(dr){
						return dr.sequencefile_id==selectedPartSeqId;
					})
					.transition()
					.duration(30)
					.attr("stroke", gridManager.PART_HOVER_OUTLINE_COLOR);*/
				
			})
			.on("mouseout", function() {
				//var selection = d3.select(this);
				var selection = d3.selectAll(".gridPartRectSVG");
				selection.transition()
					.duration(30)
					.attr("stroke", function(d) {
						if(d3.select(this).attr("isSelected")=="true") return gridManager.PART_SELECTED_OUTLINE_COLOR;
						else return gridManager.PART_OUTLINE_COLOR;
					});
			})
			.on("click", Teselagen.manager.GridManager.onGridPartRectSvgClick)
			.on("dblclick", function(d) {
				if(!d.getPart()) {
					Vede.application.fireEvent(Teselagen.event.DeviceEvent.OPEN_PART_LIBRARY);
				} else {
					//debugger;
					var seqID = d.getPart().get("sequencefile_id");
					var seqStore = Teselagen.manager.ProjectManager.workingProject.sequencesStore.data.items;
					var seq = null;
					for(var i=0;i<seqStore.length;i++) {
						if (seqID==seqStore[i].internalId) {
							seq = seqStore[i];
							break;
						}
					}
					if(seq != null) Vede.application.fireEvent("OpenVectorEditor",seq);
					else Vede.application.fireEvent(Teselagen.event.DeviceEvent.OPEN_PART_LIBRARY);
				}
			})
			.on("contextmenu", function(d) {				
				d3.event.preventDefault();
				var gridManager = Teselagen.manager.GridManager;
				
				gridManager.selectPart(this.parentNode);
				
				var contextMenu = Ext.create('Ext.menu.Menu',{
					items: [{
			  	    	  text: 'Cut',
			  	    	  handler: gridManager.onCutPartMenuItemClick
					  },
//					  {
//				        xtype: 'menuseparator',
//				      },
				      {
						  text: 'Copy',	
						  handler: gridManager.onCopyPartMenuItemClick
				      },{
				    	  text: 'Paste',
				    	  handler: gridManager.onPastePartMenuItemClick
				      },{
				    	  text: 'Delete',
				    	  handler: gridManager.clearSelectedPart
				      }]
				});
				if(d.get("part_id")===null) {
					contextMenu.items.items[0].setDisabled(true);
					contextMenu.items.items[1].setDisabled(true);
					contextMenu.items.items[3].setDisabled(true);
				}
				if(gridManager.selectedClipboardPart==null) {
					contextMenu.items.items[2].setDisabled(true);
				}
				
				contextMenu.show();
				contextMenu.setPagePosition(d3.event.pageX+1, d3.event.pageY - 5);
			});
		
		this.gridPartTextSVG = this.gridPartSVG
			.append("svg:text")
			.attr("class", "gridPartTextSVG")
			.attr("font-family", "Maven Pro")
			.attr("font-size", "13px")
			.attr("font-weight", 500)
			.text(function(d) {
                var part = d.getPart();

                if(!part) {
                    return "";
                }

                var partName = part.get("name");

                if(!partName) {
                    return "";
                } else if(partName.length > 14) {
                    return partName.substring(0, 14) + '..';
                } else {
                    return partName;
                }
			})
			.attr("text-anchor", "middle")
			.attr("pointer-events", "none")
			.attr("x", this.gridManager.COLUMN_WIDTH/2)
			.attr("y", 21.5);//15+13/2
				
		var firstFas = "None";
		this.gridPartFasIndicatorSVG = this.gridPartSVG
			.append("rect")
			.attr("class", "gridPartFasIndicatorSVG")
			.attr("fill", function(d, i) {
				var fas = d.get("fas") || "None";
				if(i===0) firstFas = "None";
				if(fas==="None") {
					d3.select(this).style("display","none");
					return;
				} else if(firstFas==="None") {
					d3.select(this).style("display","inline");
					firstFas = fas;
					return "blue";
				} else if(firstFas===fas) {
					d3.select(this).style("display","inline");
					return "blue";
				} else {
					d3.select(this).style("display","inline");
					return "red";
				}
			})
			.attr("pointer-events", "none")
			.attr("width", 13)
			.attr("height", 7)
			.attr("x", 3)
			.attr("y", 3);
		
		this.gridPartEugeneRuleFlagSVG = this.gridPartSVG
			.append("circle")
			.attr("class", "gridPartEugeneRuleFlagSVG")
			.attr("fill", function(d) {
				if($.inArray(d.id,gridManager.partsWithRules)<0) d3.select(this).style("display","none");
				else d3.select(this).style("display","inline");
				return "orange";
			})
			.attr("r", 4.5)
			.attr("pointer-events", "none")
			.attr("cx", gridManager.COLUMN_WIDTH-3-5)
			.attr("cy", this.gridManager.PART_HEIGHT-3-5);
		
	},
});
