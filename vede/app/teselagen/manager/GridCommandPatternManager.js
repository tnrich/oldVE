Ext.define("Teselagen.manager.GridCommandPatternManager", {
	
	requires: [],
	
	singleton: true,
	
	//tab.commandPattern
	//tab.commandIndex
	
	addCommand: function(command) {
		var gridManager = Teselagen.manager.GridManager;
		var tab = gridManager.currentTab;

        if(!tab.commandPattern) {
            tab.commandPattern = [];
        }

		if(tab.commandIndex===0) {
			tab.commandPattern.push(command);
		} else {
			tab.commandPattern = tab.commandPattern.slice(0, tab.commandPattern.length-tab.commandIndex);
			tab.commandIndex = 0;
			tab.commandPattern.push(command);
		}

		gridManager.undoMenuItem.setDisabled(false);
		gridManager.redoMenuItem.setDisabled(true);
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
		} else if(type=="PASTE") {
			me.undoPartPaste(command);
		}/*else if(type=="DEF") {
			me.undoPartDef(command);
		}*/
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
		} else if(type=="EDIT") {
			me.undoBinEdit(command);
		} else if(type=="DIR") {
			me.undoBinDir(command);
		} else if(type=="ICON") {
			me.undoBinIcon(command);
		}/*else if(type=="RENAME") {
			me.undoBinRename(command);
		}  else if(type=="DSF") {
			me.undoBinDsf(command);
		}*/
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
		} else if(loc=="RIGHT") {
			binIndex = command.data.x+1;
		}
		
		gridManager.activeProject.bins().removeAt(binIndex);
		
		if(command.data.digests && command.data.digests.length>0) {
			var firstBinCells = gridManager.activeProject.bins().getAt(0).cells();
			for(var i=0;i<command.data.digests.length;i++) {
				firstBinCells.getAt(command.data.digests[i]).set("fas", "DIGEST");
			}
		}
	},
	
	undoBinDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		var removedBin = command.data.data;
		
		if(command.data.rules.length>0) gridManager.activeProject.rules().add(command.data.rules);
		if(command.data.parts.length>0) gridManager.activeProject.parts().add(command.data.parts);
		
		if(command.data.oneBinLeft) {
			gridManager.activeProject.bins().removeAt(0);
			gridManager.activeProject.bins().add(removedBin);
		} else {
			gridManager.activeProject.bins().insert(binIndex, removedBin);
		}
	},
	
	/**
	 * Only for editing via the inspector grid.
	 */
	undoBinEdit: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set(command.data.oldData);
	},
	
	/**
	 * Only for changes done via the flip button on the header.
	 */
	undoBinDir: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set("directionForward", command.data.oldData);
	},
	
	/**
	 * Only for changes done via the parts bar.
	 */
	undoBinIcon: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set("iconID", command.data.oldData);
	},
	
	/*undoBinRename: function(command) {
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
	},*/
	
	undoRowAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.setListenersEnabled(false);

		this.selected
		var loc = command.data.loc;
		var rowIndex;
		var subRowIndex;
		if(loc=="ABOVE") {
			rowIndex = command.data.y;
			subRowIndex = command.data.y;
		} else if(loc=="BELOW") {
			rowIndex = command.data.y+1;
			subRowIndex = command.data.y;
		}
			
		for(var i=0;i<gridManager.activeProject.bins().count();i++) {
			gridManager.activeProject.bins().getAt(i).cells().removeAt(rowIndex);
			gridManager.selectedGridPart = null;
		}
		
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS, true);

		if(gridManager.selectedColumnIndex !== null) {
            gridManager.selectGridCellByIndex(gridManager.selectedColumnIndex, subRowIndex, true);
        }
		
		gridManager.setListenersEnabled(true);
	},
	
	undoRowDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.setListenersEnabled(false);
		
		var rowIndex = command.data.y;
		var row = command.data.data;
		
		if(command.data.rules.length>0) gridManager.activeProject.rules().add(command.data.rules);
		if(command.data.parts.length>0) gridManager.activeProject.parts().add(command.data.parts);
		
		if(command.data.oneRowLeft) {
			for(var i=0;i<gridManager.activeProject.bins().count();i++) {
				var cell = gridManager.activeProject.bins().getAt(i).cells().getAt(rowIndex);
				cell.setPart(row[i].getPart());
				cell.set("fas", row[i].get("fas"));
				cell.set("part_id", row[i].get("part_id"));
			}
		} else {
			for(var i=0;i<gridManager.activeProject.bins().count();i++) {
				gridManager.activeProject.bins().getAt(i).cells().insert(rowIndex, row[i]);
			}
		}
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
		gridManager.setListenersEnabled(true);
	},
	
	undoPartDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
        var inspectorController = Vede.application.getController("DeviceEditor.InspectorController");

		gridManager.setListenersEnabled(false);
		
		var part = command.data.part;
		var rules = command.data.rules;
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		if(part) gridManager.activeProject.parts().add(part);
		
		var cell = gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex);
		cell.setPart(command.data.data.oldPart);
		cell.set("fas", command.data.data.oldFas);
		
		if(rules.length!==0) gridManager.activeProject.rules().add(rules);
		
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
		inspectorController.onCellSelected(cell, xIndex, yIndex);
		gridManager.setListenersEnabled(true);
	},
	
	undoPartAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var xIndex = command.data.x;
		var yIndex = command.data.y;
        var inspectorController = Vede.application.getController("DeviceEditor.InspectorController");
		var cell = gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex);
		
		if(command.data.partAdded) {
			gridManager.activeProject.parts().remove(command.data.newPart);			
			//gridManager.activeProject.parts().add(command.data.oldPart);
		}
		gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex).setPart(command.data.oldPart);
		inspectorController.onCellSelected(cell, xIndex, yIndex);
	},
	
	undoPartFas: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex).set("fas", command.data.oldFas);
	},
	
	/*undoPartDef: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		command.data.part.set(command.data.oldDef);
	},*/
	
	undoPartPaste: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		var cell = gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex);
		cell.setPart(command.data.oldPart);
	},
	
	undoRuleAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.activeProject.rules().remove(command.data.data);
	},
	
	undoRuleDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
        var gridController = Vede.application.getController("DeviceEditor.GridController");
		
		gridManager.activeProject.rules().add(command.data.data);

        // Clear rules grid.
        Ext.defer(function() {
            Teselagen.manager.DeviceDesignManager.getRulesInvolvingPart(
                                                gridManager.activeProject, null);
        }, 10);
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid(gridManager.activeProject);
		
		gridController.toggleCutCopyPastePartOptions(false);
		gridController.toggleInsertOptions(false);
		gridController.toggleInsertRowAboveOptions(false);
		gridController.toggleInsertRowBelowOptions(false);
	},
	
	undoMiscGeo: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
        Ext.getCmp("mainAppPanel").getActiveTab().down("radiofield[cls='circular_plasmid_radio']").setValue(command.data.data);
        Ext.getCmp("mainAppPanel").getActiveTab().down("radiofield[cls='linear_plasmid_radio']").setValue(!command.data.data);
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
		} else if(type=="PASTE") {
			me.redoPartPaste(command);
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
		} else if(type=="EDIT") {
			me.redoBinEdit(command);
		} else if(type=="DIR") {
			me.redoBinDir(command);
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
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		if(command.data.partAdded) {
			gridManager.activeProject.parts().add(command.data.newPart);			
		}
		gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex).setPart(command.data.newPart);
	},
	
	redoPartDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;

		gridManager.setListenersEnabled(false);
		
		var part = command.data.part;
		var rules = command.data.rules;
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		if(part) gridManager.activeProject.parts().remove(part);
		
		var cell = gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex);
		cell.setPart();
		cell.set("part_id", null);
		cell.set("fas", "None");
		
		if(rules.length!==0) gridManager.activeProject.rules().remove(rules);
		
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
		gridManager.setListenersEnabled(true);
	},
	
	redoPartFas: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex).set("fas", command.data.newFas);
	},
	
	redoPartPaste: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		var xIndex = command.data.x;
		var yIndex = command.data.y;
		
		var cell = gridManager.activeProject.bins().getAt(xIndex).cells().getAt(yIndex);
		cell.setPart(command.data.newPart);
	},
	
	redoRowAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.setListenersEnabled(false);

		var loc = command.data.loc;
		var rowIndex;
		if(loc=="ABOVE") {
			rowIndex = command.data.y;
		} else if(loc=="BELOW") {
			rowIndex = command.data.y+1;
		}
		
		var bin;
		var newCell;
		for(var i=0;i<gridManager.activeProject.bins().count();i++) {
			bin = gridManager.activeProject.bins().getAt(i);
			newCell = Ext.create("Teselagen.models.Cell", {
                index: rowIndex
            });
			newCell.setJ5Bin(bin);
            bin.cells().insert(rowIndex, newCell);
		}
		
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
		gridManager.setListenersEnabled(true);
	},
	
	redoRowDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.setListenersEnabled(false);
		
		var rowIndex = command.data.y;
		var row = command.data.data;
		
		if(command.data.rules.length>0) gridManager.activeProject.rules().remove(command.data.rules);
		if(command.data.parts.length>0) gridManager.activeProject.parts().remove(command.data.parts);
		
		if(command.data.oneRowLeft) {
			var newCell;
			for(var i=0;i<gridManager.activeProject.bins().count();i++) {
				var cells = gridManager.activeProject.bins().getAt(i).cells();
				cells.removeAt(rowIndex);
				newCell = Ext.create("Teselagen.models.Cell", {
	                index: rowIndex
	            });
				cells.add(newCell);
			}
		} else {
			for(var i=0;i<gridManager.activeProject.bins().count();i++) {
				gridManager.activeProject.bins().getAt(i).cells().removeAt(rowIndex);
			}
		}
		Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
		gridManager.setListenersEnabled(true);
	},
	
	redoBinAdd: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var loc = command.data.loc;
		var binIndex;
		if(loc=="LEFT") {
			binIndex = command.data.x;
			if(command.data.digests && command.data.digests.length>0) {
				var firstBinCells = gridManager.activeProject.bins().getAt(0).cells();
				for(var i=0;i<command.data.digests.length;i++) {
					firstBinCells.getAt(command.data.digests[i]).set("fas", "None");
				}
			}
		} else if(loc=="RIGHT") {
			binIndex = command.data.x+1;
		}
		
		gridManager.activeProject.bins().insert(binIndex, command.data.data);
	},
	
	redoBinDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		var removedBin = command.data.data;
		
		if(command.data.rules.length>0) gridManager.activeProject.rules().remove(command.data.rules);
		if(command.data.parts.length>0) gridManager.activeProject.parts().remove(command.data.parts);
		
		if(command.data.oneBinLeft) {
			gridManager.activeProject.bins().removeAt(0);
			gridManager.activeProject.addNewBinByIndex(binIndex);
		} else {
			gridManager.activeProject.bins().removeAt(binIndex);
		}
	},
	
	/**
	 * Only for editing via the inspector grid.
	 */
	redoBinEdit: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set(command.data.newData);
	},
	
	/**
	 * Only for changes done via the flip button on the header.
	 */
	redoBinDir: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set("directionForward", !command.data.oldData);
	},
	
	/**
	 * Only for changes done via the parts bar.
	 */
	redoBinIcon: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
		var binIndex = command.data.x;
		gridManager.activeProject.bins().getAt(binIndex).set("iconID", command.data.newData);
	},
	
	redoRuleAdd: function(command) {
		var gridManager = Teselagen.manager.GridManager;
		
		gridManager.activeProject.rules().add(command.data.data);
	},
	
	redoRuleDel: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;
        var gridController = Vede.application.getController("DeviceEditor.GridController");

        gridManager.activeProject.rules().remove(command.data.data);
		
		gridManager.selectedGridPart = null;
		gridManager.selectedGridBin = null;
		
		gridManager.removeGrid();
		gridManager.renderGrid(gridManager.activeProject);
		
		gridController.toggleCutCopyPastePartOptions(false);
		gridController.toggleInsertOptions(false);
		gridController.toggleInsertRowAboveOptions(false);
		gridController.toggleInsertRowBelowOptions(false);
	},
	
	redoMiscGeo: function(command) {
		var me = Teselagen.manager.GridCommandPatternManager;
		var gridManager = Teselagen.manager.GridManager;

        Ext.getCmp("mainAppPanel").getActiveTab().down("radiofield[cls='circular_plasmid_radio']").setValue(command.data.data);
        Ext.getCmp("mainAppPanel").getActiveTab().down("radiofield[cls='linear_plasmid_radio']").setValue(!command.data.data);
	}
});
