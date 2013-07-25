/**
 * @class Teselagen.manager.GridManager
 */
Ext.define("Teselagen.manager.GridManager", {
	
	requires: [
		"Teselagen.constants.Constants",
		"Teselagen.constants.SBOLIcons",
        "Teselagen.event.DeviceEvent",
		"Teselagen.manager.DeviceDesignManager",
		"Teselagen.manager.GridCommandPatternManager",
		"Teselagen.manager.InspectorPanelManager",
		"Teselagen.manager.ProjectManager",
		"Teselagen.renderer.de.BinHeaderRenderer",
		"Teselagen.renderer.de.PartRenderer"
	],
    
	singleton: true,
	
	// vvv Below is useful for typing into console. vvv
	//Teselagen.manager.ProjectManager.workingProject.designsStore.data.items[0]
	//().binsStore.data.items[0].partsStore.data.items
	
	COLUMN_WIDTH: 125,
	
	BIN_HEIGHT: 100,
	BIN_FILL_COLOR: "#fefefe",
	BIN_OUTLINE_COLOR: "#ecf0f1",
	BIN_OUTLINE_WIDTH: 1,	// Not really sure right now.
	BIN_HOVER_OUTLINE_COLOR: "#4A4B4C",
	BIN_SELECTED_OUTLINE_COLOR: "#006CAB",
	BIN_SELECTED_FILL_COLOR: "rgb(240,240,240)",
	
	BIN_PART_GAP_HEIGHT: 10,
	
	PART_HEIGHT: 40,
	PART_FILL_COLOR: "#fefefe",
	PART_OUTLINE_COLOR: "#ecf0f1",
	PART_OUTLINE_WIDTH: 1,	// Not really sure right now.
	PART_HOVER_OUTLINE_COLOR: "#4A4B4C",
	PART_SELECTED_OUTLINE_COLOR: "#4A4B4C",
	PART_SELECTED_FILL_COLOR: "#ECF0F1",
	
	FLIP_ARROW_PATH: "m 27.64032,9.92550 -9.35672,-6.23781 0,3.36062 -6.61209,0 0,5.75438 6.61209,0 0,3.36062 9.35672,-6.23781 z",
	
	currentTab: null,
	activeProject: null,
	
	rulesData: [],
	partsWithRules: [],
	
	//binsData: [],
	//partsData: [],
	
	grid: null,
	
	parentSVG: null,
	gridSVG: null,
	gridBinSVG: null,		
	gridPartSVG: null,
	
	gridBinRectSVG: null,
	gridBinTextSVG: null,
	gridBinSbolIconSVG: null,
	gridBinFlipButtonSVG: null,
	gridBinFlipButtonArrowSVG: null,
	gridBinDsfSVG: null,
	
	gridPartRectSVG: null,
	gridPartTextSVG: null,
	gridPartFasIndicatorSVG: null,
	//gridPartDsfSVG: null,
	
	// The selected parts and bins are each a d3 selection (i.e., an array of arrays of elements).
	selectedGridPart: null,
	selectedGridBin: null,
	selectedClipboardPart: null,

    GridController: null,
	
	totalRows: 0,
    totalColumns: 0,
    
    newColumnSuffixNum: 0,

	removeGrid: function() {
		if(this.grid) this.grid.remove();
	},
	
	renderGrid: function(model) {
		var me = this;

        this.removeGrid();

        this.currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
        this.activeProject = model;

        if(!this.GridController) {
            this.GridController = Vede.application.getController("DeviceEditor.GridController");
        }

        this.totalColumns = model.bins().count();

        if(this.totalColumns > 0) {
            this.totalRows = model.bins().getAt(0).cells().count();
        } else {
            this.totalRows = 0;
        }
		
		Teselagen.manager.InspectorPanelManager.refreshInspectorGrid();
		Teselagen.manager.InspectorPanelManager.refreshPlasmidGeometry();

		this.grid = d3.select(this.currentTab.el.dom)
			.select(".designGrid")
			.append("svg:svg")
		    .attr("class", "gridSVG")
		    .attr("overflow", "auto")
		    .attr("width",me.COLUMN_WIDTH*me.totalColumns)
		    .attr("height",me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.PART_HEIGHT*me.totalRows);
	
		this.parentSVG = this.grid.append("svg:g")
		 	.attr("class", "gridParent");
		
		this.gridBinSVG = this.parentSVG.selectAll("g")
		    .data(me.activeProject.bins().getRange())
		    .enter()
		    .append("g")
			.attr("class", "gridBinSVG")
			.attr("deGridBinIndex", function(d, i) {return i;})
			.attr("width", me.COLUMN_WIDTH-1)
		    .attr("height", me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.PART_HEIGHT*me.totalRows)
		    .attr('transform', function(d, i) { return 'translate('+(i*me.COLUMN_WIDTH)+', 0)';});
		
		this.gridBinHeaderSVG = this.gridBinSVG
		    .append("g")
			.attr("class", "gridBinHeaderSVG")
			.attr("width", me.COLUMN_WIDTH)
		    .attr("height", me.BIN_HEIGHT);
		    //.attr('transform', function(d, i) { return 'translate('+(i*me.COLUMN_WIDTH)+', 0)';});
		
		this.binHeaderRenderer = Ext.create("Teselagen.renderer.de.BinHeaderRenderer", {			
            gridManager: me,
            gridBinHeaderSVG: this.gridBinHeaderSVG
        });
		this.binHeaderRenderer.renderBinHeaders();
		
		this.gridPartParentSVG = this.gridBinSVG
		    .append("g")
			.attr("class", "gridPartParentSVG")
			.attr("width", me.COLUMN_WIDTH)
		    .attr("height", me.PART_HEIGHT*me.totalRows)
			.attr('transform', 'translate(0, '+(me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT)+')');
		
		this.gridPartSVG = this.gridPartParentSVG.selectAll("g")
			.data(function(d) { return d.cells().getRange();})
			.enter()
		    .append("g")
			.attr("class", "gridPartSVG")
			.attr("deGridRowIndex", function(d, i) {return i;})
			.attr("width", me.COLUMN_WIDTH)
		    .attr("height", me.PART_HEIGHT)
			.attr('transform', function(d, i) { return 'translate(0, '+(i*me.PART_HEIGHT)+')';});
		
		this.partRenderer = Ext.create("Teselagen.renderer.de.PartRenderer", {			
	        gridManager: me,
	        gridPartParentSVG: this.gridPartParentSVG,
	        gridPartSVG: this.gridPartSVG
	    });
		this.partRenderer.renderParts();
		
		this.gridBinDsfSVG = this.gridBinSVG
		    .append("svg:line")
		    .attr("class", "gridBinDsfSVG")
		    .attr("x1", function (d) {
		    	if(d.dsf) return me.COLUMN_WIDTH-1;
		    	else d3.select(this).remove();
	    	})
		    .attr("y1", 1)
		    .attr("x2", me.COLUMN_WIDTH-1)
		    .attr("y2", me.BIN_HEIGHT+me.BIN_PART_GAP_HEIGHT+me.totalRows*me.PART_HEIGHT)
		    .attr("stroke", "red")
		    .attr("stroke-width", 1)
		    .attr("shape-rendering", "crispEdges")
		    .attr("stroke-dasharray",(me.BIN_HEIGHT-2)+", "+(me.BIN_PART_GAP_HEIGHT+1)+", "+(me.totalRows*me.PART_HEIGHT+1)+",0");
	},

	addRowBelow: function() {
		var me = this;			
		var rowIndex;
		if(this.selectedGridPart==null) rowIndex = -1;
		else rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));	
		
		for(var i=0;i<this.totalColumns;i++) {
			this.collectionData[i].parts.splice(rowIndex+1,0,{phantom: true});
		}
		
		this.selectedGridPart = null;
		this.selectedGridBin = null;
		this.totalRows++;
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "ROW",
        	data: {
        		type: "ADD",
        		y: rowIndex,
        		loc: "BELOW"       		
        	}
		});
	},
	
	addRowAbove: function() {
		var me = this;			
		var rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));
		
		for(var i=0;i<this.totalColumns;i++) {
			this.collectionData[i].parts.splice(rowIndex,0,{phantom: true});
		}
		
		this.selectedGridPart = null;
		this.selectedGridBin = null;
		this.totalRows++;
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "ROW",
        	data: {
        		type: "ADD",
        		y: rowIndex,
        		loc: "ABOVE"       		
        	}
		});
	},
	
	addColumnRight: function() {
		var me = this;
		me.newColumnSuffixNum++;
		var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));
		var binName = me.generateDefaultColumnName();
		
		var newBin = {
			//binName: "Bin"+me.newColumnSuffixNum, 
			binName: binName, 
			iconID: "USER-DEFINED",
			directionForward: true,
			parts: []
		}
		for(var i=0;i<this.totalRows;i++) {
			newBin.parts.push({phantom: true});
		}
		this.collectionData.splice(columnIndex+1,0,newBin);	
		
		this.selectedGridPart = null;
		this.selectedGridBin = null;
		this.totalColumns++;
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        
        me.selectGridBinHeaderByIndex(columnIndex+1);
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "BIN",
        	data: {
        		type: "ADD",
        		x: columnIndex,
        		loc: "RIGHT",
        		data: newBin
        	}
		});
	},
	
	addColumnLeft: function() {
		var me = this;
		me.newColumnSuffixNum++;
		var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));
		var binName = me.generateDefaultColumnName();
		
		var newBin = {
			//binName: "Bin"+me.newColumnSuffixNum, 
			binName: binName,
			iconID: "USER-DEFINED",
			directionForward: true,
			parts: []
		}
		
		var digests;
		if(columnIndex===0) {
			digests = [];
			for(var i=0;i<this.totalRows;i++) {
				newBin.parts.push({phantom: true});
				if(me.collectionData[0].parts[i].fas==="DIGEST" || 
						(me.collectionData[0].fases && me.collectionData[0].fases[i]==="DIGEST")) {
					me.collectionData[0].parts[i].fas = "None";
					me.collectionData[0].fases[i] = "None";
					digests.push(i);
				}
			}
		} else {
			for(var i=0;i<this.totalRows;i++) {
				newBin.parts.push({phantom: true});				
			}
		}
		this.collectionData.splice(columnIndex,0,newBin);	
		
		this.selectedGridPart = null;
		this.selectedGridBin = null;
		this.totalColumns++;
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        
        me.selectGridBinHeaderByIndex(columnIndex);
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "BIN",
        	data: {
        		type: "ADD",
        		x: columnIndex,
        		loc: "LEFT",
        		data: newBin,
        		digests: digests
        	}
		});
	},
	
	removeColumn: function() {
		var me = this;
		var columnIndex = parseInt(this.selectedGridBin.attr("deGridBinIndex"));
		var removedRules = me.removeRuleDataInvolvingColumn(columnIndex);
		me.updatePartsWithRules();
		var removedBin;
		if(this.totalColumns==1) {
			var newBin = {
				binName: "Bin"+me.newColumnSuffixNum, 
				iconID: "USER-DEFINED",
				directionForward: true,
				parts: []
			}
			for(var i=0;i<this.totalRows;i++) {
				newBin.parts.push({phantom: true});
			}
			removedBin = this.collectionData.splice(columnIndex,1,newBin);
		} else {
			removedBin = this.collectionData.splice(columnIndex,1);
			this.totalColumns--;
		}
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        me.clearPartInfo();
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "BIN",
        	data: {
        		type: "DEL",
        		x: columnIndex,
        		data: removedBin[0],
        		rules: removedRules
        	}
		});
	},
	
	removeRow: function() {
		var me = this;
		var rowIndex = parseInt(this.selectedGridPart.attr("deGridRowIndex"));
		var removedRules = me.removeRuleDataInvolvingRow(rowIndex);
		me.updatePartsWithRules();
		var removedRow = [];
		if(this.totalRows==1) {
			for(var i=0;i<this.totalColumns;i++) {
				removedRow.push(this.collectionData[i].parts.splice(rowIndex,1,{phantom: true})[0]);
			}
		} else {
			for(var i=0;i<this.totalColumns;i++) {
				removedRow.push(this.collectionData[i].parts.splice(rowIndex,1)[0]);
			}
			this.totalRows--;
		}
		
		this.grid.remove();
		this.renderGrid();
		
		this.GridController.toggleCutCopyPastePartOptions(false);
        this.GridController.toggleInsertOptions(false);
        this.GridController.toggleInsertRowAboveOptions(false);
        this.GridController.toggleInsertRowBelowOptions(false);
        me.clearPartInfo();
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "ROW",
        	data: {
        		type: "DEL",
        		y: rowIndex,
        		data: removedRow,
        		rules: removedRules
        	}
		});
	},
	
	//>> And also toastr message.
	clearSelectedPart: function() {
		var me = Teselagen.manager.GridManager;
		var removedRules = me.removeRuleDataInvolvingPart(me.selectedGridPart.datum().id, true);
		d3.select(me.selectedGridPart.node().parentNode.parentNode).datum().parts[parseInt(me.selectedGridPart.attr("deGridRowIndex"))] = {phantom: true};	
		me.updatePartsWithRules();
		me.grid.remove();
		me.renderGrid();
		me.clearPartInfo();
		//me.selectedGridPart.select(".gridPartTextSVG").text("");
		//me.selectedGridPart.select(".gridPartFasIndicatorSVG").style("display","none");
		
		var xIndex = parseInt(me.selectedGridBin.attr("deGridBinIndex"));
		var yIndex = parseInt(me.selectedGridPart.attr("deGridRowIndex"));
			
		Teselagen.manager.GridCommandPatternManager.addCommand({
        	type: "PART",
        	data: {
        		type: "DEL",
        		x: xIndex,
        		y: yIndex,
        		data: me.selectedGridPart.datum(),
        		rules: removedRules
        	}
		});
		me.selectPartByIndex(xIndex, yIndex);
	},
	
	onGridPartRectSvgClick: function() {
		var gridManager = Teselagen.manager.GridManager;
		gridManager.GridController.toggleCutCopyPastePartOptions(true);
		gridManager.GridController.toggleInsertOptions(true);
		gridManager.GridController.toggleInsertRowAboveOptions(true);
		gridManager.GridController.toggleInsertRowBelowOptions(true);
		
		if(d3.select(this.parentNode.parentNode.parentNode).select(".gridBinHeaderRectSVG").attr("isSelected")!="true") {
			d3.selectAll(".gridBinHeaderRectSVG")
				.attr("fill", gridManager.BIN_FILL_COLOR)
				.attr("stroke", gridManager.BIN_OUTLINE_COLOR)
				.attr("isSelected", "false");
			d3.select(this.parentNode.parentNode.parentNode).select(".gridBinHeaderRectSVG")
				.transition()
			    .duration(30)
			    .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
			    .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
			    .attr("isSelected", "true");
			gridManager.selectedGridBin = d3.select(this.parentNode.parentNode.parentNode);
		}
		
		if(d3.select(this).attr("isSelected")=="true") return;
		
		d3.selectAll(".gridPartRectSVG")
			.attr("fill", gridManager.PART_FILL_COLOR)
			.attr("stroke", gridManager.PART_OUTLINE_COLOR)
			.attr("isSelected", "false");
						
		d3.select(this).transition()
		    .duration(30)
		    .attr("stroke", gridManager.PART_SELECTED_OUTLINE_COLOR)
		    .attr("fill", gridManager.PART_SELECTED_FILL_COLOR)
		    .attr("isSelected", "true");
		
		gridManager.selectedGridPart = d3.select(this.parentNode);

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, gridManager.selectedGridPart.datum());

		/*gridManager.inspector.setActiveTab(0);
		

        var partPropertiesForm = gridManager.inspector.down("form[cls='PartPropertiesForm']");
        var openPartLibraryBtn = gridManager.inspector.down("button[cls='openPartLibraryBtn']");
        var changePartDefinitionBtn = gridManager.inspector.down("button[cls='changePartDefinitionBtn']");
        var deletePartBtn = gridManager.inspector.down("button[cls='deletePartBtn']");
        var clearPartMenuItem = gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
        var fasForm = gridManager.inspector.down("form[cls='forcedAssemblyStrategyForm']");
        var fasCombobox = fasForm.down("combobox");
        var partSourceNameField = gridManager.inspector.down("displayfield[cls='partSourceField']");
        var fasArray = [];
        
        openPartLibraryBtn.enable();
        openPartLibraryBtn.removeCls('btnDisabled');

        var removeRowMenuItem = gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Remove Row']");
        removeRowMenuItem.enable();
        
        var selectedBinIndex = parseInt(gridManager.selectedGridBin.attr("deGridBinIndex"));
        if(selectedBinIndex !== 0) {
            // Turn the FAS_LIST array into an array of arrays, as required by
            // the store's loadData function.
            Ext.each(Teselagen.constants.Constants.FAS_LIST_NO_DIGEST, function(fas) {
                fasArray.push([fas]);
            });

            fasForm.down("combobox").store.loadData(fasArray);
        } else {
            Ext.each(Teselagen.constants.Constants.FAS_LIST, function(fas) {
                fasArray.push([fas]);
            });

            fasForm.down("combobox").store.loadData(fasArray);
        }
        
        //debugger;
        var j5Part = gridManager.j5PartFromCollectionDataPart(gridManager.selectedGridPart.datum());
        
        partPropertiesForm.loadRecord(j5Part);

        if( j5Part.get('sequencefile_id')!=="" && !j5Part.get('phantom') )
        {
            j5Part.getSequenceFile({
                callback: function(sequenceFile){
                    if(sequenceFile)
                    {
                        if(sequenceFile.get("partSource")!="") {
                            changePartDefinitionBtn.removeCls('btnDisabled');
                            openPartLibraryBtn.setText("Open Part Library");
                            openPartLibraryBtn.removeCls('selectPartFocus');
                            changePartDefinitionBtn.enable();
                            deletePartBtn.enable();
                            deletePartBtn.removeCls('btnDisabled');
                            deletePartBtn.removeCls('selectPartFocus');
                            clearPartMenuItem.enable();
                            partSourceNameField.setValue(sequenceFile.get('partSource'));
                        } else {
                            changePartDefinitionBtn.disable();
                            openPartLibraryBtn.setText("Select Part From Library");
                            openPartLibraryBtn.addCls('selectPartFocus');
                            changePartDefinitionBtn.addCls('btnDisabled');     
                            deletePartBtn.disable();
                            clearPartMenuItem.disable();
                            deletePartBtn.removeCls('selectPartFocus');
                            deletePartBtn.addCls('btnDisabled');
                        }
                    }
                }
            });
        } else if (j5Part.get('sequencefile_id') == "" && j5Part.get('name') != ""){
            changePartDefinitionBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.addCls('selectPartFocus');
            changePartDefinitionBtn.addCls('btnDisabled');
            deletePartBtn.enable();
            deletePartBtn.removeCls('btnDisabled');
            deletePartBtn.addCls('selectPartFocus');
            clearPartMenuItem.enable();  
        } else {
            changePartDefinitionBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.addCls('selectPartFocus');
            changePartDefinitionBtn.addCls('btnDisabled');     
            deletePartBtn.disable();
            clearPartMenuItem.disable();
            deletePartBtn.removeCls('selectPartFocus');
            deletePartBtn.addCls('btnDisabled');
        }
        
        if(j5Part.get("fas") === "") {
            fasForm.down("combobox").setValue("None");
        } else {
            fasForm.loadRecord(j5Part);
        }
        
        Ext.getCmp('mainAppPanel').getActiveTab().down('InspectorPanel').expand();
        
        
        //>> Eugene rules stuff should go here.
		Teselagen.manager.InspectorPanelManager.refreshEugeneRulesGridForPart(gridManager.selectedGridPart.datum().id);*/
		
	},

    selectBin: function(gridBin) {
        var gridManager = Teselagen.manager.GridManager;
		gridManager.GridController.toggleCutCopyPastePartOptions(false);
		gridManager.GridController.toggleInsertOptions(true);
		gridManager.GridController.toggleInsertRowAboveOptions(false);
		gridManager.GridController.toggleInsertRowBelowOptions(true);
		
		if(gridManager.selectedGridPart != null) {
			d3.selectAll(".gridPartRectSVG")
				.attr("fill", gridManager.PART_FILL_COLOR)
				.attr("stroke", gridManager.PART_OUTLINE_COLOR)
				.attr("isSelected", "false");
			gridManager.selectedGridPart = null;
		}
		
		if(d3.select(gridBin).attr("isSelected")=="true") return;
		
		d3.selectAll(".gridBinHeaderRectSVG")
			.attr("fill", gridManager.BIN_FILL_COLOR)
			.attr("stroke", gridManager.BIN_OUTLINE_COLOR)
			.attr("isSelected", "false");
		
		d3.select(gridBin).transition()
		    .duration(30)
		    .attr("stroke", gridManager.BIN_SELECTED_OUTLINE_COLOR)
		    .attr("fill", gridManager.BIN_SELECTED_FILL_COLOR)
		    .attr("isSelected", "true");
		
		gridManager.selectedGridBin = d3.select(gridBin.parentNode.parentNode);				

        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, gridManager.selectedGridBin.datum());

    },
	
	onGridBinHeaderRectSvgClick: function() {
	    Teselagen.manager.GridManager.selectBin(this);
	},

    onFlipBinButtonClick: function() {
        var gridBin = d3.select(this.parentNode.parentNode);
        var j5Bin = gridBin.datum();

        d3.select(this.parentNode).select(".gridBinHeaderFlipButtonArrowSVG")
            .attr("transform", function(dr) {
                if(dr.get("directionForward") === true) return "translate(93, 9)scale(0.7)rotate(180,19,10)";
                else return "translate(93, 9)scale(0.7)";
            });

        d3.select(this.parentNode).select(".gridBinHeaderSbolIconSVG")
            .attr("transform", function(dr) {
                if(dr.get("directionForward") === true) return "translate(38, -15)rotate(180,25,50)";
                else return "translate(38, -15)";
            });

        j5Bin.set("directionForward", !j5Bin.get("directionForward"));
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "BIN",
            data: {
                type: "DIR",
                x: parseInt(gridBin.attr("deGridBinIndex")),
                data: directionForward
            }
        });
        
        Teselagen.manager.GridManager.selectBin(gridBin);
    },

	selectPartByIndex: function(xIndex, yIndex) {
    	var me = Teselagen.manager.GridManager;
    	var gridPart = me.parentSVG.selectAll(".gridBinSVG")
    		.filter(function(d, i) {return i===xIndex;})
    		.selectAll(".gridPartSVG")
    		.filter(function(d, i) {return i===yIndex;})[0][0];
    	me.selectPart(gridPart);
    },
    
    selectGridBinHeaderByIndex: function(xIndex) {
    	var me = Teselagen.manager.GridManager;
    	var gridBinHeader = me.parentSVG.selectAll(".gridBinSVG")
    		.filter(function(d, i) {return i===xIndex;})
    		.select(".gridBinHeaderSVG")[0][0];
    	me.selectBinHeader(gridBinHeader);
    }
});
