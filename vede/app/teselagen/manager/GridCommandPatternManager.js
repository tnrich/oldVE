Ext.define("Teselagen.manager.GridCommandPatternManager", {
	
	requires: [],
	
	singleton: true,
	
	//tab.commandPattern
	//tab.commandIndex
	
	addCommand: function(command) {
		var gridManager = Teselagen.manager.GridManager;
		var tab = gridManager.currentTab;
		if(tab.commandIndex===0) {
			tab.commandPattern.push(command);
		} else {
			tab.commandPattern = tab.commandPattern.slice(0, tab.commandPattern.length-tab.commandIndex);
			tab.commandIndex = 0;
			tab.commandPattern.push(command);
		}
		gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Undo']").setDisabled(false);
		gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Redo']").setDisabled(true);
	},
	
	undo: function() {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var tab = gridManager.currentTab;
		if(tab.commandIndex>=tab.commandPattern.length) return;
		var command = tab.commandPattern[tab.commandPattern.length-tab.commandIndex-1];
		
		me.undoCommand(command);
		gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Redo']").setDisabled(false);
		
		tab.commandIndex++;
		if(tab.commandIndex>=tab.commandPattern.length) {
			gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Undo']").setDisabled(true);
		}
		
	},
	
	undoCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var commandType = command.type;
		if(commandType=="PART") {
			me.undoPartCommand(command);
		} else if(commandType=="ROW") {
			me.undoRowCommand(command);
		} else if(commandType=="BIN") {
			me.undoBinCommand(command);
		} else if(commandType=="RULE") {
			me.undoRuleCommand(command);
		} else if(commandType=="MISC") {
			me.undoMiscCommand(command);
		}
	},
	
	undoPartCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.undoPartAdd(command);
		} else if(type=="DEL") {
			me.undoPartDel(command);
		} else if(type=="FAS") {
			me.undoPartFas(command);
		}
	},
	
	undoRowCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.undoRowAdd(command);
		} else if(type=="DEL") {
			me.undoRowDel(command);
		}
	},
	
	undoBinCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.undoBinAdd(command);
		} else if(type=="DEL") {
			me.undoBinDel(command);
		} else if(type=="RENAME") {
			me.undoBinRename(command);
		} else if(type=="DIR") {
			me.undoBinDir(command);
		} else if(type=="DSF") {
			me.undoBinDsf(command);
		} else if(type=="ICON") {
			me.undoBinIcon(command);
		}
	},
	
	undoRuleCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.undoRuleAdd(command);
		} else if(type=="DEL") {
			me.undoRuleDel(command);
		}
	},
	
	undoMiscCommand: function(command) {		
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="GEO") {
			me.undoMiscGeo(command);
		}
	},
	
	undoBinAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var loc = command.data.loc;
		var binIndex;
		if(loc=="LEFT") {
			binIndex = command.data.x;
			if(command.data.digests && command.data.digests.length>0) {
				for(var i=0;i<command.data.digests.length;i++) {
					gridManager.collectionData[1].parts[command.data.digests[i]].fas = "DIGEST";
					gridManager.collectionData[1].fases[command.data.digests[i]] = "DIGEST";
				}
			}
		} else if(loc=="RIGHT") {
			binIndex = command.data.x+1;
		}
		gridManager.collectionData.splice(binIndex,1);
		gridManager.totalColumns--;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
		gridManager.clearPartInfo();
	},
	
	undoBinDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.collectionData.splice(binIndex,0,command.data.data);
		if(command.data.rules.length>0) gridManager.rulesData = gridManager.rulesData.concat(command.data.rules);
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		gridManager.totalColumns++;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoBinRename: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].binName = command.data.oldName;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoBinDir: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].directionForward = command.data.data;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoBinDsf: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].dsf = command.data.data;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoBinIcon: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].iconID = command.data.oldIcon;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoRowAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var loc = command.data.loc;
		var rowIndex;
		if(loc=="ABOVE") {
			rowIndex = command.data.y;
		} else if(loc=="BELOW") {
			rowIndex = command.data.y+1;
		}
			
		for(var i=0;i<gridManager.totalColumns;i++) {
			gridManager.collectionData[i].parts.splice(rowIndex,1);
		}
		gridManager.totalRows--;
			
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
        gridManager.toggleInsertRowBelowOptions(false);
        gridManager.clearPartInfo();        
	},
	
	undoRowDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var rowIndex = command.data.y;
		var row = command.data.data;
		if(command.data.rules.length>0) gridManager.rulesData = gridManager.rulesData.concat(command.data.rules);
		gridManager.updatePartsWithRules();
		
		for(var i=0;i<gridManager.totalColumns;i++) {
			gridManager.collectionData[i].parts.splice(rowIndex,0,row[i]);
		}
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		gridManager.totalRows++;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoPartDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].parts.splice(command.data.y,1,command.data.data);
		if(command.data.rules.length>0) gridManager.rulesData = gridManager.rulesData.concat(command.data.rules);
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoPartAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].parts.splice(command.data.y,1,command.data.oldPart);
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoPartFas: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].parts[command.data.y].fas = command.data.oldFas;
		gridManager.collectionData[command.data.x].fases[command.data.y] = command.data.oldFas;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoRuleAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		for (var i=0;i<gridManager.rulesData.length;i++) {
			if(gridManager.rulesData[i].name==command.data.rule.name) {
				gridManager.rulesData.splice(i,1);
				break;
			}
		}
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	undoRuleDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.rulesData.push(command.data.rule);
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
		
	},
	
	undoMiscGeo: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.isCircular = command.data.data;
		gridManager.deviceDesignData.j5collection.isCircular = command.data.data;
		
		Teselagen.manager.InspectorPanelManager.refreshPlasmidGeometry();
	},
	
	
	/**
	 * 
	 * 
	 * Redo
	 * 
	 * 
	 */
	redo: function() {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var tab = gridManager.currentTab;		
		if(tab.commandIndex===0) return;
		var command = tab.commandPattern[tab.commandPattern.length-tab.commandIndex];
		
		me.redoCommand(command);
		gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Undo']").setDisabled(false);
		
		tab.commandIndex--;
		if(tab.commandIndex===0) {
			gridManager.currentTab.down("button[cls='editMenu'] > menu > menuitem[text='Redo']").setDisabled(true);
		}	
	},
	
	redoCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var commandType = command.type;
		if(commandType=="PART") {
			me.redoPartCommand(command);
		} else if(commandType=="ROW") {
			me.redoRowCommand(command);
		} else if(commandType=="BIN") {
			me.redoBinCommand(command);
		} else if(commandType=="RULE") {
			me.redoRuleCommand(command);
		} else if(commandType=="MISC") {
			me.redoMiscCommand(command);
		}
	},
	
	redoPartCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.redoPartAdd(command);
		} else if(type=="DEL") {
			me.redoPartDel(command);
		} else if(type=="FAS") {
			me.redoPartFas(command);
		}
	},
	
	redoRowCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.redoRowAdd(command);
		} else if(type=="DEL") {
			me.redoRowDel(command);
		}
	},
	
	redoBinCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.redoBinAdd(command);
		} else if(type=="DEL") {
			me.redoBinDel(command);
		} else if(type=="RENAME") {
			me.redoBinRename(command);
		} else if(type=="DIR") {
			me.redoBinDir(command);
		} else if(type=="DSF") {
			me.redoBinDsf(command);
		} else if(type=="ICON") {
			me.redoBinIcon(command);
		}
	},
	
	redoRuleCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="ADD") {
			me.redoRuleAdd(command);
		} else if(type=="DEL") {
			me.redoRuleDel(command);
		}
	},
	
	redoMiscCommand: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var type = command.data.type;
		if(type=="GEO") {
			me.redoMiscGeo(command);
		}
	},
	
	redoPartAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].parts.splice(command.data.y,0,command.data.newPart);
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoPartDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;		
		if(command.data.rules.length>0) {
			gridManager.removeRuleDataInvolvingPart(command.data.data.id, true);
			gridManager.updatePartsWithRules();
		}
		gridManager.collectionData[command.data.x].parts.splice(command.data.y,1,{phantom: true});
		
		
		gridManager.clearPartInfo();
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoPartFas: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.collectionData[command.data.x].parts[command.data.y].fas = command.data.newFas;
		gridManager.collectionData[command.data.x].fases[command.data.y] = command.data.newFas;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoRowAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var loc = command.data.loc;
		var rowIndex;
		if(loc=="ABOVE") {
			rowIndex = command.data.y;
		} else if(loc=="BELOW") {
			rowIndex = command.data.y+1;
		}
		
		for(var i=0;i<gridManager.totalColumns;i++) {
			gridManager.collectionData[i].parts.splice(rowIndex,0,{phantom: true});
		}
		gridManager.totalRows++;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
        gridManager.toggleInsertRowBelowOptions(false);
        gridManager.clearPartInfo();
	},
	
	redoRowDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var rowIndex = command.data.y;
		if(command.data.rules.length>0) {
			gridManager.removeRuleDataInvolvingRow(rowIndex);			
			gridManager.updatePartsWithRules();
		}
		for(var i=0;i<gridManager.totalColumns;i++) {
			gridManager.collectionData[i].parts.splice(rowIndex,1);
		}
		
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		gridManager.totalRows--;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoBinAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var loc = command.data.loc;
		var binIndex;
		if(loc=="LEFT") {
			binIndex = command.data.x;
			if(command.data.digests && command.data.digests.length>0) {
				for(var i=0;i<command.data.digests.length;i++) {
					gridManager.collectionData[0].parts[command.data.digests[i]].fas = "None";
					gridManager.collectionData[0].fases[command.data.digests[i]] = "None";
				}
			}
		} else if(loc=="RIGHT") {
			binIndex = command.data.x+1;
		}
		gridManager.collectionData.splice(binIndex,0,command.data.data);
		
		gridManager.totalColumns++;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
		gridManager.clearPartInfo();
	},
	
	redoBinDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		if(command.data.rules.length>0) {
			gridManager.removeRuleDataInvolvingColumn(binIndex);			
			gridManager.updatePartsWithRules();
		}
		gridManager.collectionData.splice(binIndex,1);
		
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		gridManager.totalColumns--;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoBinRename: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].binName = command.data.newName;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoBinDir: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].directionForward = !command.data.data;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoBinDsf: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].dsf = !command.data.data;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoBinIcon: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		gridManager.collectionData[command.data.x].iconID = command.data.newIcon;
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoRuleAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.rulesData.push(command.data.rule);
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
	},
	
	redoRuleDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		for (var i=0;i<gridManager.rulesData.length;i++) {
			if(gridManager.rulesData[i].name==command.data.rule.name) {
				gridManager.rulesData.splice(i,1);
				break;
			}
		}
		gridManager.updatePartsWithRules();
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid();
		
		gridManager.toggleCutCopyPastePartOptions(false);
		gridManager.toggleInsertOptions(false);
		gridManager.toggleInsertRowAboveOptions(false);
		gridManager.toggleInsertRowBelowOptions(false);
		
	},
	
	redoMiscGeo: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;

		gridManager.isCircular = !command.data.data;
		gridManager.deviceDesignData.j5collection.isCircular = !command.data.data;
		
		Teselagen.manager.InspectorPanelManager.refreshPlasmidGeometry();		
	},
	
	
	
	
	
});





















