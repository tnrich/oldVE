Ext.define("Teselagen.renderer.de.PartRenderer", {
    
    requires: [
           "Teselagen.constants.SBOLIcons",
        "Teselagen.event.DeviceEvent",
        "Teselagen.event.ProjectEvent",
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
            //.attr("stroke", this.gridManager.PART_OUTLINE_COLOR)
            .attr("stroke", function(d) {
                var part = d.getPart();

                if(!part) {
                    return gridManager.PART_OUTLINE_COLOR;
                }

                var sequenceFile = part.getSequenceFile();

                if(!part.isMapped()) {
                    return gridManager.PART_UNMAPPED_OUTLINE_COLOR;
                } else {
                    return gridManager.PART_OUTLINE_COLOR;
                }
            })
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
                var part = d.getPart();

                if(!part) {
                    return;
                }

                d3.selectAll(".gridPartRectSVG")
                    .filter(function(dr){
                        return dr.getPart() === part;
                    })
                    .transition()
                    .duration(30)
                    .attr("stroke", gridManager.PART_HOVER_OUTLINE_COLOR);
            })
            .on("mouseout", function(d) {
                //var selection = d3.select(this);
                var selection = d3.selectAll(".gridPartRectSVG");
                selection.transition()
                    .duration(30)
                    .attr("stroke", function(d) {
                        var part = d.getPart();
                        var sequenceFile = !part || part.getSequenceFile();
                        if(part && !part.isMapped()) {
                            return gridManager.PART_UNMAPPED_OUTLINE_COLOR;
                        } else if(d3.select(this).attr("isSelected")=="true") {
                            return gridManager.PART_SELECTED_OUTLINE_COLOR;
                        } else {
                            return gridManager.PART_OUTLINE_COLOR;
                        }
                    });
            })
            .on("click", function(d) {
                var gridCell = d3.select(this.parentNode);
                var xIndex = parseInt(d3.select(this.parentNode.parentNode.parentNode).attr("deGridBinIndex"));
                var yIndex = parseInt(gridCell.attr("deGridRowIndex"));

                var part = d.getPart();

                if(!part) {
                    return;
                }

                d3.selectAll(".gridPartRectSVG")
                    .filter(function(dr){
                        return dr.getPart() === part;
                    })
                    .transition()
                    .duration(30)
                    .attr("stroke", gridManager.PART_HOVER_OUTLINE_COLOR)
                    .attr("isSelected", "true");

                Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_CELL, gridCell.datum(), xIndex, yIndex);
            })
            .on("dblclick", function(d) {
                if(!d.getPart()) {
                    // Remember to change the listener to the following event.
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.OPEN_PART_LIBRARY);
                } else {
                    var seq = d.getPart().getSequenceFile();
                    console.log(seq);
                    
                    if(seq != null) {
                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, seq, d.getPart());
                    } else {
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.OPEN_PART_LIBRARY);
                    }
                }
            })
            .on("contextmenu", function(d) {                
                d3.event.preventDefault();
                var gridManager = Teselagen.manager.GridManager;
                
                // Manually trigger the click event to select the cell.
                var event = document.createEvent('UIEvents');
                event.initUIEvent('click', true, true, window, 1);

                this.dispatchEvent(event);

                var gridController = Vede.application.getController("DeviceEditor.GridController");
                
                var contextMenu = Ext.create('Ext.menu.Menu',{
                    items: [{
                            text: 'Cut',
                            handler: function() {
                              Vede.application.fireEvent(Teselagen.event.DeviceEvent.CUT_PART);
                            }
                      }, {
                          text: 'Copy',    
                          handler: function() {
                              Vede.application.fireEvent(Teselagen.event.DeviceEvent.COPY_PART);
                            }
                      }, {
                          text: 'Paste',
                          handler: function() {
                              Vede.application.fireEvent(Teselagen.event.DeviceEvent.PASTE_PART);
                            }
                      }, {
                          text: 'Delete',
                          handler: function() {
                              Vede.application.fireEvent(Teselagen.event.DeviceEvent.CLEAR_PART);
                            }
                      }]
                });
                
                contextMenu.on("hide", function() {
                    contextMenu.close();
                });
                if(!d.getPart()) {
                    contextMenu.items.items[0].setDisabled(true);
                    contextMenu.items.items[1].setDisabled(true);
                    contextMenu.items.items[3].setDisabled(true);
                }
                if(gridManager.clipboardPart==null) {
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
                var part = d.getPart();
                if(part && gridManager.activeProject.getNumberOfRulesInvolvingPart(part)>0) {
                    d3.select(this).style("display","inline");
                    return "orange";
                } else {
                    d3.select(this).style("display","none");
                    return;
                }
            })
            .attr("r", 4.5)
            .attr("pointer-events", "none")
            .attr("cx", gridManager.COLUMN_WIDTH-3-5)
            .attr("cy", this.gridManager.PART_HEIGHT-3-5);
    }
});
