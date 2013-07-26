/**
 * Class controlling the device display portion of Device Editor.
 * @class Vede.controller.DeviceEditor.GridController
 */
/*global $*/
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.event.GridEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.manager.GridManager",
               "Teselagen.models.DeviceEditorProject",
               "Teselagen.constants.SBOLIcons",
               "Teselagen.utils.Logger"],

    statics: {
        DEFAULT_ROWS: 2
    },

    DeviceEvent: null,
    ProjectEvent: null,
    DeviceDesignManager: null,

    activeBins: null,
    activeProject: null,
    grid: null,
    GridManager: null,
    tabPanel: null,

    ReRenderDevice: function(){
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        this.GridManager.renderGrid(tab.model);
    },

    /**
     * Changes the selected bin's icon to the clicked icon button.
     * @param {Ext.button.Button} button The clicked button.
     */
    onPartPanelButtonClick: function(button) {
        if(this.selectedBin) {this.selectedBin.bin.set("iconID",button.data.iconKey);}
    },

    /**
     * Flips a bin icon and reverses its direction when the reverse button is
     * clicked.
     * @param {Ext.button.Button} button The clicked reverse button.
     */
    onFlipBinButtonClick: function(button) {
        //if(button.icon === Vede.view.de.grid.Bin.forwardButtonIconPath) {
        //    button.setIcon(Vede.view.de.grid.Bin.reverseButtonIconPath);
        //} else {
        //    button.setIcon(Vede.view.de.grid.Bin.forwardButtonIconPath);
        //}

        // Get the bin that the button refers to and reverse its direction.
        //var parentBin = button.up().up().up().getBin();

        this.application.fireEvent(this.GridEvent.BIN_HEADER_CLICK, button.up());

        parentBin.set("directionForward", !parentBin.get("directionForward"));
    },

    /**
     * Dehighlights linked parts when the mouse moves out of a partCell.
     * @param {Ext.container.Container} partCell The partCell.
     */
    /*
    onPartCellMouseout: function(partCell) {
        var j5Part = partCell.up().up().getPart();
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        // Dehighlight all gridParts with the same source, unless the j5Part is selected.
        if(j5Part) {
            if(!this.selectedPart || (this.selectedPart && this.selectedPart.getPart() !== j5Part)) {
                for(var i = 0; i < gridParts.length; i++) {
                    if(gridParts[i]) {gridParts[i].unHighlight();}
                }
            }
        }
    },
    */

    /**
     * When the tab changes on the main panel, handles loading and rendering the
     * new device design, assuming the new tab is a device editor tab. Also sets
     * all the event listeners on the new device.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     */
    onTabChange: function(tabPanel, newTab, oldTab) {
        if(newTab.initialCls === "DeviceEditorTab") { // It is a DE tab
            this.grid = newTab.down("component[cls='designGrid']");

            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onUpdateBins, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);
            	
                // Unset listeners for the parts store of each bin.
                this.activeBins.each(function(bin) {
                    var parts = bin.cells();

                    parts.un("add", this.onAddToParts, this);
                    parts.un("update", this.onUpdateParts, this);
                    parts.un("remove", this.onRemoveFromParts, this);
                }, this);
            }

            /*if(this.activeProject) {
                // Unset listeners for the project's Eugene Rules, and set them for
                // the new active project.
                this.activeProject.rules().un("add", this.onAddToEugeneRules, this);
                this.activeProject.rules().un("remove", this.onRemoveFromEugeneRules, this);
            }*/

            this.activeProject = newTab.model;
            this.activeTab = newTab;

            this.cutPartMenuItem = this.activeTab.down("menuitem[text='Cut Part']");
            this.copyPartMenuItem = this.activeTab.down("menuitem[text='Copy Part']");
            this.pastePartMenuItem = this.activeTab.down("menuitem[text='Paste Part']");
            this.removeRowMenuItem = this.activeTab.down("menuitem[text='Remove Row']");
            this.clearPartMenuItem = this.activeTab.down("menuitem[text='Clear Part']");
            this.removeColumnMenuItem = this.activeTab.down("menuitem[text='Remove Column']");

            this.columnLeftMenuItem = this.activeTab.down("menuitem[text='Column Left']");
            this.columnRightMenuItem = this.activeTab.down("menuitem[text='Column Right']");

            this.rowAboveMenuItem = this.activeTab.down("menuitem[text='Row Above']");
            this.rowBelowMenuItem = this.activeTab.down("menuitem[text='Row Below']");

            this.totalColumns = this.DeviceDesignManager.binCount(this.activeProject);

            //this.activeProject.rules().on("add", this.onAddToEugeneRules, this);
            //this.activeProject.rules().on("remove", this.onRemoveFromEugeneRules, this);

            this.activeBins = this.activeProject.bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onUpdateBins, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            this.activeBins.each(function(bin) {
                bin.cells().on("add", this.onAddToCells, this);
                bin.cells().on("update", this.onUpdateCells, this);
                bin.cells().on("remove", this.onRemoveFromCells, this);
            }, this);

            this.activeProject.parts().on("add", this.onAddToParts, this);
            this.activeProject.parts().on("update", this.onUpdateParts, this);
            this.activeProject.parts().on("remove", this.onRemoveFromParts, this);

            this.totalRows = this.DeviceDesignManager.findMaxNumParts(
                                                            this.activeProject);

            if(this.totalRows === 0) {
                this.totalRows = this.self.DEFAULT_ROWS;
            }

            this.GridManager.renderGrid(newTab.model);
        }
    },

    onAddToBins: function(store, addedBins) {
        for(var i = 0; i < addedBins.length; i++) {
            addedBins[i].cells().on("add", this.onAddToCells, this);
            addedBins[i].cells().on("update", this.onUpdateCells, this);
            addedBins[i].cells().on("remove", this.onRemoveFromCells, this);
        }

        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onUpdateBins: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onRemoveFromBins: function(store, removedBin) {
        removedBin.cells().un("add", this.onAddToCells, this);
        removedBin.cells().un("update", this.onUpdateCells, this);
        removedBin.cells().un("remove", this.onRemoveFromCells, this);

        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onAddToCells: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onUpdateCells: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onRemoveFromCells: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onAddToParts: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onUpdateParts: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onRemoveFromParts: function() {
        this.GridManager.renderGrid(Ext.getCmp("mainAppPanel").getActiveTab().model);
    },

    onAddRowAbove: function() {
        this.GridManager.addRowAbove();
    },

    onAddRowBelow: function() {
        this.GridManager.addRowBelow();
    },

    onAddColumnLeft: function() {
        this.GridManager.addColumnLeft();
    },

    onAddColumnRight: function() {
        this.GridManager.addColumnRight();
    },

    /**
     * Handles the event that one or more Eugene Rules are added to the device.
     * @param {Ext.data.Store} rules The device's store of rules.
     * @param {Teselagen.model.EugeneRule[]} addedRules An array of added rules.
     */
    /*
    onAddToEugeneRules: function(rules, addedRules) {
        var constants = Teselagen.constants;
        var addedRule;
        var gridOperand1;
        var gridOperand2;

        for(var i = 0; i < addedRules.length; i++) {
            addedRule = addedRules[i];
            var operand1 = addedRule.getOperand1();
            var operand2 = addedRule.getOperand2();

            var gridOperands1 = this.getGridPartsFromJ5Part(operand1);

            for(var j = 0; j < gridOperands1.length; j++) {
                gridOperand1 = gridOperands1[j];

                if(!gridOperand1.partCell.down("image[cls='eugeneRuleIndicator']")) {
                    gridOperand1.addEugeneRuleIndicator();
                }

                if(!addedRule.get("operand2isNumber") &&
                   addedRule.get("compositionalOperator") !== constants.THEN &&
                   addedRule.get("compositionalOperator") !== constants.NEXTTO) {

                    var gridOperands2 = this.getGridPartsFromJ5Part(operand2);
                    for(var k = 0; k < gridOperands2.length; k++) {
                        gridOperand2 = gridOperands2[k];

                        if(!gridOperand2.partCell.down("image[cls='eugeneRuleIndicator']")) {
                            gridOperand2.addEugeneRuleIndicator();
                        }
                    }
                }
            }
        }
    },
    */

    /**
     * Handles the deletion of a Eugene Rule from the device. Removes the rule
     * indicator from the involved parts if they have no other rules applied to
     * them.
     * @param {Ext.data.Store} rules The device's store of rules.
     * @param {Teselagen.models.EugeneRule} removedRule The rule that was removed.
     */
    /*
    onRemoveFromEugeneRules: function(rules, removedRule) {
        var operand1 = removedRule.getOperand1();
        var operand2 = removedRule.getOperand2();

        var operand1Rules = this.DeviceDesignManager.getRulesInvolvingPart(
                                            this.activeProject, operand1);

        // If there are no other rules involving operand 1, remove its indicator.
        if(operand1Rules.getCount() === 0) {
            Ext.each(this.getGridPartsFromJ5Part(operand1), function(gridPart) {
                gridPart.removeEugeneRuleIndicator();
            });
        }

        // If operand 2 is not a number, remove its Eugene rule indicator.
        if(!removedRule.get("operand2isNumber")) {
            var operand2Rules = this.DeviceDesignManager.getRulesInvolvingPart(
                                                this.activeProject, operand2);

            if(operand2Rules.getCount() === 0) {
                Ext.each(this.getGridPartsFromJ5Part(operand2), function(gridPart) {
                    gridPart.removeEugeneRuleIndicator();
                });
            }
        }
    },
    */

    /**
     * Helper function to calculate which parts need to be rerendered after the
     * fas field of a part is modified.
     * @param {Ext.data.Store} parts A store of the parts in a bin.
     * @param {Teselagen.models.Part} updatedPart The part which has been updated.
     */
    /*
    renderFasConflicts: function(parts, updatedPart) {
        var partsArray = parts.getRange();

        // If the modified part is at index 0, update all the other parts
        // with the appropriate fasConflict flag.
        if(parts.indexOf(updatedPart) === 0) {
            Ext.each(partsArray.slice(1, partsArray.length), function(part) {
                if(part.get("fas") !== "None" &&
                   updatedPart.get("fas") !== "None" &&
                   part.get("fas") !== updatedPart.get("fas")) {
                    this.rerenderPart(part, true);
                } else if(part.get("fas") === updatedPart.get("fas") ||
                    updatedPart.get("fas") === "None") {
                    this.rerenderPart(part, false);
                }
            }, this);

            this.rerenderPart(updatedPart, false);
        } else if(partsArray[0].get("fas") !== updatedPart.get("fas") && partsArray[0].get("sequencefile_id")) {
            this.rerenderPart(updatedPart, true);
        } else {
            this.rerenderPart(updatedPart, false);
        }
    },
    */

    /*
    getNewOperand2Parts: function(j5Part) {
        if(!j5Part) {
            return [];
        }

        var targetGridParts = [];
        var bins = this.grid.query("Bin");
        var parts;
        var gridBin;
        var gridPart;
        var ownerIndices = this.DeviceDesignManager.getOwnerBinIndices(this.activeProject,
                                                                       j5Part);

        // Iterate through gridParts and find all those with a matching j5Part.
        for(var i = 0; i < bins.length; i++) {
            gridBin = bins[i];
            parts = gridBin.query("Part");
            for(var j = 0; j < parts.length; j++) {
                gridPart = parts[j];
                if(gridPart.getPart() && gridPart.getPart().id === j5Part.id &&
                   !gridPart.getPart().get("phantom")) {
                    targetGridParts.push(gridPart);
                }
            }
        }

        // Iterate through j5Parts and find those matching ours.
        for(i = 0; i < ownerIndices.length; i++) {
            var ownerBin = this.DeviceDesignManager.getBinByIndex(this.activeProject,
                                                                  ownerIndices[i]);
            gridBin = this.getGridBinFromJ5Bin(ownerBin);
            var partIndex = ownerbin.cells().getRange().indexOf(j5Part);
            gridPart = gridBin.query("Part")[partIndex];

            if(targetGridParts.indexOf(gridPart) < 0 && partIndex >= 0) {
                targetGridParts.push(gridPart);
            }
        }

        Vede.application.fireEvent("AddEugeneRuleIndicator", targetGridParts);
    },

    getOldOperand2Parts: function(j5Part) {
        if(!j5Part) {
            return [];
        }

        var targetGridParts = [];
        var bins = this.grid.query("Bin");
        var parts;
        var gridBin;
        var gridPart;
        var ownerIndices = this.DeviceDesignManager.getOwnerBinIndices(this.activeProject,
                                                                       j5Part);

        // Iterate through gridParts and find all those with a matching j5Part.
        for(var i = 0; i < bins.length; i++) {
            gridBin = bins[i];
            parts = gridBin.query("Part");
            for(var j = 0; j < parts.length; j++) {
                gridPart = parts[j];
                if(gridPart.getPart() && gridPart.getPart().id === j5Part.id &&
                   !gridPart.getPart().get("phantom")) {
                    targetGridParts.push(gridPart);
                }
            }
        }

        // Iterate through j5Parts and find those matching ours.
        for(i = 0; i < ownerIndices.length; i++) {
            var ownerBin = this.DeviceDesignManager.getBinByIndex(this.activeProject,
                                                                  ownerIndices[i]);
            gridBin = this.getGridBinFromJ5Bin(ownerBin);
            var partIndex = ownerbin.cells().getRange().indexOf(j5Part);
            gridPart = gridBin.query("Part")[partIndex];

            if(targetGridParts.indexOf(gridPart) < 0 && partIndex >= 0) {
                targetGridParts.push(gridPart);
            }
        }

        Vede.application.fireEvent("RemoveEugeneRuleIndicator", targetGridParts);
    },
    */
   

   /*
    onPartMapped: function(pj5Part) {
        var j5Part = pj5Part;
        var j5Bin = this.DeviceDesignManager.getBinByPart(this.activeProject, j5Part);
        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,j5Bin);
        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);
    },
    */


    /*
    onPartCellVEEditClick: function(partCell) {
        var gridPart = partCell.up().up();
        var j5Part = gridPart.getPart();
        var DETab = Ext.getCmp("mainAppPanel").getActiveTab();
        var self = this;

        if (j5Part) {

            DETab.el.mask("loading", "loader rspin");
            $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");


            setTimeout(function() {
                j5Part.getSequenceFile({
                callback: function(associatedSequence){

                if(associatedSequence.get("partSource")!=="") {
                    if(associatedSequence)
                    {
                        j5Part.getSequenceFile({
                            callback: function (seq) {
                                Vede.application.fireEvent(self.ProjectEvent.OPEN_SEQUENCE_IN_VE, seq);
                        }});
                        DETab.el.unmask();
                    }
                    else
                    {
                        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                            sequenceFileFormat: "Genbank",
                            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                            sequenceFileName: "untitled.gb",
                            partSource: "New Part"
                        });

                        newSequenceFile.save({
                            callback: function(){
                                j5Part.setSequenceFileModel(newSequenceFile);
                                j5Part.save({
                                    callback: function(){
                                        Vede.application.fireEvent(self.ProjectEvent.OPEN_SEQUENCE_IN_VE, newSequenceFile);
                                        DETab.el.unmask();
                                    }
                                });
                            }
                        });
                    }
                } else {
                    DETab.el.unmask();
                    Vede.application.fireEvent(self.DeviceEvent.OPEN_PART_LIBRARY);
                }

                }});
            }, 1);
    } else {
        Vede.application.fireEvent(self.DeviceEvent.OPEN_PART_LIBRARY);
    }

    },
    */

    onValidateDuplicatedPartNameEvent: function(pPart,name,cb, errorMessage){
        var me = this;
        var duplicated = false;
        var nonidentical = false;

        this.activeProject.parts().each(function(part, partIndex){
            if(part.get("name") === name && part !== pPart) {
                nonidentical = true;
            }
        });

        if(nonidentical)
        {
            Ext.MessageBox.show({
                title: "Error",
                msg: errorMessage || "Another non-identical part with that name already exists in the design. Please select the same part or a part with another name.",
                buttons: Ext.MessageBox.OK,
                icon:Ext.MessageBox.ERROR
            });
        } else {
            cb();
        }
    },

    toggleCutCopyPastePartOptions: function(state){
        this.cutPartMenuItem.setDisabled(!state||false);
        this.copyPartMenuItem.setDisabled(!state||false);
        this.pastePartMenuItem.setDisabled(!state||false);
        this.removeRowMenuItem.setDisabled(!state||false);
        this.clearPartMenuItem.setDisabled(!state||false);
        this.removeColumnMenuItem.setDisabled(!state||false);
    },

    toggleInsertOptions: function(state) {
        this.columnLeftMenuItem.setDisabled(!state||false);
        this.columnRightMenuItem.setDisabled(!state||false);
    },

    toggleInsertRowAboveOptions: function(state) {
        this.rowAboveMenuItem.setDisabled(!state||false);
    },

    toggleInsertRowBelowOptions: function(state) {
        this.rowBelowMenuItem.setDisabled(!state||false);
    },
    
    onCutPartMenuItemClick: function() {
    	this.application.fireEvent(this.DeviceEvent.CUT_PART);
    },
    
    onCopyPartMenuItemClick: function() {
    	this.application.fireEvent(this.DeviceEvent.COPY_PART);
    },
    
    onPastePartMenuItemClick: function() {
    	this.application.fireEvent(this.DeviceEvent.PASTE_PART);
    },
    
    onCutPart: function() {
    	var gridManager = Teselagen.manager.GridManager;
    	if(gridManager.selectedGridPart) {
    		
    	}
    },
    
    onCopyPart: function() {
    	var gridManager = Teselagen.manager.GridManager;
    	if(gridManager.selectedGridPart) {
    		gridManager.clipboardPart = gridManager.selectedGridPart.datum().getPart();
    	}
    },
    
    onPastePart: function() {
    	var gridManager = Teselagen.manager.GridManager;
    	var selectedCell = gridManager.selectedGridPart.datum();
    	if(gridManager.clipboardPart && selectedCell) {
    		selectedCell.setPart(gridManager.clipboardPart);
    		//debugger;
    	}
    },
    
    /*
    onCutPartMenuItemClick: function(){
        this.selectedClipboardPart = this.selectedPart.getPart();
        var index = this.selectedPart.up("Bin").query("Part").indexOf(this.selectedPart);
        var parentGridBin = this.selectedPart.up("Bin");
        parentGridBin.getBin().parts().removeAt(index);
        this.reRenderGrid();
        this.ClipboardCutFlag = true;
    },

    onCopyPartMenuItemClick: function(){
        this.selectedClipboardPart = this.selectedPart.getPart();
        this.ClipboardCutFlag = false;
    },

    onPastePartMenuItemClick: function(){
        Ext.suspendLayouts();

        var index = this.selectedPart.up("Bin").query("Part").indexOf(this.selectedPart);
        var parentGridBin = this.selectedPart.up("Bin");
        var parentJ5Bin = parentGridBin.getBin();
        var partsStore = parentJ5bin.cells();
        var gridPart;

        if(this.selectedClipboardPart) {
            // Remove the selected j5Part from the j5Bin if the part exists. If not,
            // we must manually remove the selected gridPart from the gridBin, since
            // the removeFromParts handler will not be called if the j5Part we are
            // removing does not exist.
            if(!partsStore.getAt(index)) {
                parentGridBin.remove(parentGridBin.query("Part")[index]);
            } else {
                partsStore.removeAt(index);

                // If the bin has been padded with a phantom, remove the phantom
                // or inserting the new part will result in an extra row being
                // added to all bins.
                var lastIndex = partsStore.getCount() - 1;
                if(partsStore.getAt(lastIndex).phantom) {
                    partsStore.suspendEvents();
                    partsStore.removeAt(lastIndex);
                    partsStore.resumeEvents();

                    parentGridBin.remove(parentGridBin.query("Part")[lastIndex]);
                }
            }

            this.application.fireEvent(this.DeviceEvent.FILL_BLANK_CELLS);

            parentGridBin.getBin().parts().insert(index, this.selectedClipboardPart);
            this.reRenderGrid();

            parentGridBin = this.getGridBinFromJ5Bin(parentJ5Bin);
            gridPart = parentGridBin.query("Part")[index];

            this.onPartCellClick(gridPart.down().down()); //Select the original cell that was selected.
        }

        Ext.resumeLayouts(true);
    },
    */
    
    onSelectBin: function(j5Bin, binIndex) {
    	this.GridManager.selectGridBinHeaderByIndex(binIndex);
    },
    
    onSelectCell: function(cell, xIndex, yIndex) {
    	this.GridManager.selectGridCellByIndex(xIndex, yIndex);
    },
    
    onLaunch: function() {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        this.tabPanel.on("tabchange",
                         this.onTabChange,
                         this);
        this.InspectorController = this.application.getDeviceEditorInspectorControllerController();
    },

    /**
     * @member Vede.controller.DeviceEditor.GridController
     */
    init: function() {
        this.callParent();
        
        
        this.control({
            /*"DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            },
            "button[cls='flipBinButton']": {
                click: this.onFlipBinButtonClick
            },*/
            //"component[cls='binHeader']": {
            //    render: this.addBinHeaderClickEvent
            //},
            //"component[cls='gridPartCell']": {
            //    render: this.addPartCellEvents
            //},
            "button[cls='editMenu'] > menu > menuitem[text='Copy Part']": {
                click: this.onCopyPartMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Paste Part']": {
                click: this.onPastePartMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Cut Part']": {
                click: this.onCutPartMenuItemClick
            }
        });
        

        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.GridEvent = Teselagen.event.GridEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;
        this.Logger = Teselagen.utils.Logger;

        this.GridManager = Teselagen.manager.GridManager;

        //this.application.on("getNewGridParts", this.getNewOperand2Parts, this);

        //this.application.on("getOldGridParts", this.getOldOperand2Parts, this);

        this.application.on(this.DeviceEvent.ADD_ROW_ABOVE,
                            this.onAddRowAbove,
                            this);

        this.application.on(this.DeviceEvent.ADD_ROW_BELOW,
                            this.onAddRowBelow,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_LEFT,
                            this.onAddColumnLeft,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_RIGHT,
                            this.onAddColumnRight,
                            this);
        
        this.application.on(this.DeviceEvent.CUT_PART,
			                this.onCutPart,
			                this);

		this.application.on(this.DeviceEvent.COPY_PART,
			                this.onCopyPart,
			                this);

		this.application.on(this.DeviceEvent.PASTE_PART,
			                this.onPastePart,
			                this);
		
        /*this.application.on(this.DeviceEvent.INSERT_PART_AT_SELECTION,
                            this.onInsertPartAtSelection,
                            this);

        this.application.on(this.DeviceEvent.CLEAR_PART,
                            this.onClearPart,
                            this);

        this.application.on(this.DeviceEvent.REMOVE_ROW,
                            this.onRemoveRow,
                            this);*/
		
        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
                            this);
        
        this.application.on(this.DeviceEvent.SELECT_CELL,
			                this.onSelectCell,
			                this);
        /*this.application.on(this.DeviceEvent.MAP_PART,
                            this.onPartMapped,
                            this);*/


        this.application.on(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME,
                            this.onValidateDuplicatedPartNameEvent,
                            this);

        this.application.on(this.DeviceEvent.RERENDER_DE_CANVAS,
                            this.ReRenderDevice,
                            this);

        /*this.application.on(this.DeviceEvent.RELOAD_DESIGN,
                            this.onReloadDesign,
                            this);*/
    }
});
