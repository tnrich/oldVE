/**
 * Class controlling the device display portion of Device Editor.
 * @class Vede.controller.DeviceEditor.GridController
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.models.DeviceEditorProject",
               "Vede.view.de.grid.Bin",
               "Vede.view.de.grid.Part",
               "Teselagen.constants.SBOLIcons"],

    statics: {
        DEFAULT_ROWS: 2
    },

    DeviceEvent: null,
    ProjectEvent: null,

    DeviceDesignManager: null,

    activeBins: null,
    activeProject: null, 
    grid: null,
    tabPanel: null,

    selectedBin: null,
    selectedPart: null,
    selectedClipboardPart: null,
    ClipboardCutFlag: false,

    skipPadOnRemovePart: false,

    totalRows: 2,
    totalColumns: 1,

    onReRenderDECanvasEvent: function(){
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.onTabChange(tab,tab,tab);
    },

    /**
     * Renders a given DeviceDesign.
     */
    renderDevice: function() {
        Ext.suspendLayouts();

        var bins = this.activeProject.getJ5Collection().bins().getRange();
        var j5Bin;

        for(var i = 0; i < bins.length; i++) {
            j5Bin = bins[i];
            this.addJ5Bin(j5Bin);
        }

        Ext.resumeLayouts(true);
    },

    /**
     * Changes the selected bin's icon to the clicked icon button.
     * @param {Ext.button.Button} button The clicked button.
     */
    onPartPanelButtonClick: function(button) {
        if(this.selectedBin) this.selectedBin.bin.set('iconID',button.data.iconKey);
    },

    /**
     * Flips a bin icon and reverses its direction when the reverse button is 
     * clicked.
     * @param {Ext.button.Button} button The clicked reverse button.
     */
    onFlipBinButtonClick: function(button) {
        if(button.icon === Vede.view.de.grid.Bin.forwardButtonIconPath) {
            button.setIcon(Vede.view.de.grid.Bin.reverseButtonIconPath);
        } else {
            button.setIcon(Vede.view.de.grid.Bin.forwardButtonIconPath);
        }

        // Get the bin that the button refers to and reverse its direction.
        var parentBin = button.up().up().up().getBin();

        this.application.fireEvent("BinHeaderClick", button.up());

        parentBin.set("directionForward", !parentBin.get("directionForward"));
    },

    /**
     * This is a hack that allows binHeaders and partCells (and any container,
     * theoretically) to fire a 'click' event, which ExtJS for some reason does
     * not allow.
     */
    addBinHeaderClickEvent: function(binHeader) {
        binHeader.body.on("click", function() {
            this.application.fireEvent("BinHeaderClick", binHeader);
        }, this);
    },

    addPartCellClickEvent: function(partCell) {
        partCell.body.on("click", function() {
            this.application.fireEvent("PartCellClick", partCell);
        },this);
        
        partCell.body.on("dblclick", function() {
            this.application.fireEvent("PartCellVEEditClick", partCell);
        },this);
    },

    /**
     * Selects the bin when a bin header is clicked.
     * @param {Ext.container.Container} binHeader The clicked bin header.
     */
    onBinHeaderClick: function(binHeader) {
        Ext.suspendLayouts();

        var gridBin = binHeader.up().up();
        var j5Bin = gridBin.getBin();

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        //Commented out to keep named but unmapped part selected
        
        // if(this.selectedPart && this.selectedPart.down()) {
        //     this.selectedPart.deselect();
        //     this.deHighlight(this.selectedPart.getPart());
        //     this.selectedPart = null;
        // }

        this.selectedBin = gridBin;
        gridBin.select();

        // DE-Activate Cut, Copy, Paste Options
        this.toggleCutCopyPastePartOptions(false);
        this.toggleInsertOptions(true);
        this.toggleInsertRowAboveOptions(false);
        this.toggleInsertRowBelowOptions(true);

        var removeColumnMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");
        removeColumnMenuItem.enable();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);

        Ext.resumeLayouts(true);
    },

    /**
     * Selects a part when it is clicked in the grid.
     * @param {Ext.container.Container} partCell The clicked part cell.
     */
    onPartCellClick: function(partCell) {
        Ext.suspendLayouts();

        if(this.selectedPart) {
           /* this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());

           if (this.selectedPart.getPart() && this.selectedPart.getPart().get("name")=="") {
                this.selectedPart.deselect();
            } else if (this.selectedPart.getPart() && this.selectedPart.getPart().getSequenceFile().get("partSource")=="") {
                this.selectedPart.select();
                this.selectedPart.leaveselect();
            }*/
        }


        var gridPart = partCell.up().up();

        var j5Part = gridPart.getPart();

        var j5Bin = gridPart.up("Bin").getBin();
        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);

        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,j5Bin);

        this.selectedPart = gridPart;

        gridPart.deselect();
        gridPart.select();

        if(j5Part) {
            if(j5Part.get("sequencefile_id")==="") {
                gridPart.select();
                if (j5Part.get('name') != "") {
                    gridPart.selectAlert();
                    gridPart.unHighlight();
                }
            } else {
                gridPart.deselect();
                gridPart.mapSelect();
            }
        } else {
            console.log("no part associated with cell");
            gridPart.select();
        }

        // Activate Cut, Copy, Paste Options
        this.toggleCutCopyPastePartOptions(true);
        this.toggleInsertOptions(true);
        this.toggleInsertRowAboveOptions(true);
        this.toggleInsertRowBelowOptions(true);

        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);

        Ext.resumeLayouts(true);
    },

    /**
     * Handles the event where there are empty cells that need blank parts associated to them.
     * Is called through an event that opens the Part Library. 
     */

    onfillBlankCells: function() {
        var bins = this.activeProject.getJ5Collection().bins();
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        var selectedBinIndex = this.DeviceDesignManager.getBinIndex(
                                                        this.activeProject,
                                                        this.selectedBin.getBin());
        var selectedPartIndex = null;
        var selectedBin = this.selectedBin;
        var partCells = selectedBin.query("Part");

        var partGrids = tab.query("component[cls='gridPartsCell']");

        var cellCount = this.selectedBin.items.items.length - 1;

        if(this.selectedPart) {
            selectedPartIndex = this.selectedBin.query("Part").indexOf(this.selectedPart);
            this.selectedPart = null;
        }

        for (var i = 0; i < cellCount; i++) {
            var gridPart = partCells[i];
            var j5Part = gridPart.getPart();
            if (!j5Part) {
                var newPart = Ext.create("Teselagen.models.Part",{phantom:true});
                var j5Bin = selectedBin;
                var binIndex =  selectedBinIndex;
                this.DeviceDesignManager.addPartToBin(this.activeProject, newPart, binIndex);
            }
        }

        if(selectedPartIndex !== null && selectedPartIndex >= 0) {
            this.selectedPart = this.selectedBin.query("Part")[selectedPartIndex];
            this.selectedPart.select();
        }
    },

    /**
     * When the tab changes on the main panel, handles loading and rendering the
     * new device design, assuming the new tab is a device editor tab. Also sets
     * all the event listeners on the new device.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     * @param {Ext.Component} oldTab The tab that is being switched from.
     */
    onTabChange: function(tabPanel, newTab, oldTab) {
        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
            this.selectedPart = null;
        }
        
        if(this.selectedBin) {
            this.selectedBin.deselect();
            this.selectedBin = null;
        }


        if(newTab.initialCls == "DeviceEditorTab") { // It is a DE tab
            this.grid = newTab.query("component[cls='designGrid']")[0];
            this.grid.removeAll(); // Clean grid


            Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]').setText(''); // Clean status bar alert

            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onBinsUpdate, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);

                // Unset listeners for the parts store of each bin.
                this.activeBins.each(function(bin) {
                    var parts = bin.parts();

                    parts.un("add", this.onAddToParts, this);
                    parts.un("update", this.onPartsUpdate, this);
                    parts.un("remove", this.onRemoveFromParts, this);
                }, this);
            }

            if(this.activeProject) {
                // Unset listeners for the project's Eugene Rules, and set them for
                // the new active project.
                this.activeProject.rules().un("add", this.onAddToEugeneRules, this);
                this.activeProject.rules().un("remove", this.onRemoveFromEugeneRules, this);
            }

            this.activeProject = newTab.model.getDesign(); // yb:This is confusing because a Project is not a DeviceDesign.

            this.totalColumns = this.DeviceDesignManager.binCount(this.activeProject);

            this.activeProject.rules().on("add", this.onAddToEugeneRules, this);
            this.activeProject.rules().on("remove", this.onRemoveFromEugeneRules, this);

            // newTab.query('label[cls="designName"]')[0].setText(newTab.model.data.name);
            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onBinsUpdate, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            this.activeBins.each(function(bin) {
                var parts = bin.parts();

                parts.on("add", this.onAddToParts, this);
                parts.on("update", this.onPartsUpdate, this);
                parts.on("remove", this.onRemoveFromParts, this);
            }, this);

            this.totalRows = this.DeviceDesignManager.findMaxNumParts(
                                                            this.activeProject);

            if(this.totalRows == 0) {
                this.totalRows = this.self.DEFAULT_ROWS;
            }

            this.renderDevice();
        }
    },

    /**
     * Handles the event that one or more bins are added to the device design's
     * store of bins.
     * @param {Ext.data.Store} activeBins The device design's store of bins.
     * @param {Teselagen.model.J5Bin[]} addedBins An array of all the bins that 
     * have been added.
     * @param {Number} index The index where the bins were added.
     */
    onAddToBins: function(activeBins, addedBins, index) {
        Ext.suspendLayouts();

        var j5Bin;
        for(var i = 0; i < addedBins.length; i++) {
            j5Bin = addedBins[i];

            this.addJ5Bin(j5Bin, index);

            // Add event listeners to the parts store of this bin.
            parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onPartsUpdate, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }

        if(this.selectedBin){
            this.selectedBin.deselect();
            this.selectedBin = null;
        }

        Ext.resumeLayouts(true);
    },

    /**
     * Handles the event where a bin has been changed directly. Simply rerenders
     * the bin in question.
     * @param {Ext.data.Store} activeBins The current device design's store of
     * bins.
     * @param {Teselagen.models.J5Bin} updatedBin The bin that has been updated.
     * @param {String} operation The type of update that occurred.
     * @param {String} modified The name of the field that was edited.
     */
    onBinsUpdate: function(activeBins, updatedBin, operation, modified) {
        this.rerenderBin(updatedBin);
    },

    /**
     * Handles the deletion of a bin.
     * @param {Ext.data.Store} activeBins The current device design's store of
     * bins.
     * @param {Teselagen.models.J5Bin} removedBin The bin that was removed.
     * @param {Number} index The index of the removed bin.
     */
    onRemoveFromBins: function(activeBins, removedBin, index) {
        if(this.selectedBin && this.selectedBin.getBin() == removedBin) {
            this.selectedBin = null;
        }

        this.grid.remove(this.grid.query("Bin")[index]);
    },

    /**
     * Handles the event that one or more parts are added to any bin.
     * @param {Ext.data.Store} parts The parts store of the bin which has been
     * added to.
     * @param {Teselagen.model.Part[]} addedParts An array of all the parts that 
     * have been added.
     * @param {Number} index The index where the parts were added.
     */
    onAddToParts: function(parts, addedParts, index) {
        var parentJ5Bin = this.DeviceDesignManager.getBinByPartsStore(this.activeProject, parts);
        var parentGridBin = this.getGridBinFromJ5Bin(parentJ5Bin);

        // For each part added, insert it to the part's bin.
        Ext.each(addedParts, function(addedPart) {
            parentGridBin.insert(index + 1, Ext.create("Vede.view.de.grid.Part", {
                part: addedPart
            }));

            this.renderFasConflicts(parts, addedPart);
        }, this);

        this.totalRows = this.DeviceDesignManager.findMaxNumParts(this.activeProject);
        this.updateBinsWithTotalRows();
    },

    /**
     * Handles the event where a part has been changed directly. 
     * @param {Ext.data.Store} parts The parts store of the bin which owns the
     * modified part.
     * @param {Teselagen.models.Part} updatedPart The part that has been updated.
     * @param {String} operation The type of update that occurred.
     * @param {String} modified The name of the field that was edited.
     */
    onPartsUpdate: function(parts, updatedPart, operation, modified) {
        if(modified)
        {
            Vede.application.fireEvent("checkj5Ready");

            if(modified.indexOf("fas") >= 0) {
                this.renderFasConflicts(parts, updatedPart);
            } else {
                this.rerenderPart(updatedPart, false);
            }
        }
    },

    /**
     * Handles the deletion of a part from a bin.
     * @param {Ext.data.Store} parts The parts store of the bin which owned the
     * deleted part.
     * @param {Teselagen.models.Part} removedPart The part that was removed.
     * @param {Number} index The index of the removed part.
     */
    onRemoveFromParts: function(parts, removedPart, index) {
        var j5Bin;
        var gridBin;
        var childGridParts;
        var gridPart;

        j5Bin = this.DeviceDesignManager.getBinByPartsStore(this.activeProject,
                                                            parts);

        if(j5Bin) {
            gridBin = this.getGridBinFromJ5Bin(j5Bin);

            childGridParts = gridBin.query("Part");

            for(var i = 0; i < childGridParts.length; i++) {
                gridPart = childGridParts[i];

                if(gridPart.getPart() === removedPart) {
                    gridBin.remove(gridPart);

                    this.application.fireEvent("ReRenderCollectionInfo");

                    this.selectedPart = null;
                }
            }

            // Only add empty rows to the design if the skipPad flag is not set.
            if(!this.skipPadOnRemovePart) {
                this.updateBinsWithTotalRows();
            }

            // Reset the skipPad flag.
            this.skipPadOnRemovePart = false;
        }
    },

    /**
     * Handles the event that one or more Eugene Rules are added to the device.
     * @param {Ext.data.Store} rules The device's store of rules.
     * @param {Teselagen.model.EugeneRule[]} addedRules An array of added rules.
     * @param {Number} index The index where the rules were added.
     */
    onAddToEugeneRules: function(rules, addedRules, index) {
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

    /**
     * Handles the deletion of a Eugene Rule from the device. Removes the rule
     * indicator from the involved parts if they have no other rules applied to 
     * them.
     * @param {Ext.data.Store} rules The device's store of rules.
     * @param {Teselagen.models.EugeneRule} removedRule The rule that was removed.
     * @param {Number} index The index of the removed rule.
     */
    onRemoveFromEugeneRules: function(rules, removedRule, index) {
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

    /**
     * Helper function to calculate which parts need to be rerendered after the
     * fas field of a part is modified.
     * @param {Ext.data.Store} parts A store of the parts in a bin.
     * @param {Teselagen.models.Part} updatedPart The part which has been updated.
     */
    renderFasConflicts: function(parts, updatedPart) {
        var partsArray = parts.getRange();

        // If the modified part is at index 0, update all the other parts
        // with the appropriate fasConflict flag.
        if(parts.indexOf(updatedPart) == 0) {
            Ext.each(partsArray.slice(1, partsArray.length), function(part) {
                if(part.get("fas") != "None" && 
                   updatedPart.get("fas") != "None" &&
                   part.get("fas") != updatedPart.get("fas")) {
                    this.rerenderPart(part, true);
                } else if(part.get("fas") == updatedPart.get("fas") ||
                    updatedPart.get("fas") == "None") {
                    this.rerenderPart(part, false);
                }
            }, this);

            this.rerenderPart(updatedPart, false);
        } else if(partsArray[0].get("fas") != updatedPart.get("fas") && partsArray[0].get('sequencefile_id')) {
            this.rerenderPart(updatedPart, true);
        } else {
            this.rerenderPart(updatedPart, false);
        }
    },

    /**
     * Handler for the Insert Row button.
     */
    onAddRowAbove: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();

        var PartIndex = null;
        var bins = this.activeProject.getJ5Collection().bins();

        if (this.selectedPart) {
            var gridPart = this.selectedPart;
            partIndex = (gridPart.up("Bin").items.indexOf(gridPart)-1);

            bins.each(function (bin,binIndex) {
                bin.parts().insert(partIndex, "Teselagen.models.sequence.Row")
            });
           
            this.selectedBin.deselect();
            this.selectedPart.deselect();
            this.selectedBin = null;
            this.selectedPart = null;
        }

        else {
            this.selectedBin.deselect();
            this.selectedBin = null;
            bins.each(function (bin,binIndex) {
                bin.parts().insert(0, "Teselagen.models.sequence.Row")
            });
        }

        this.grid.removeAll();
        this.renderDevice();

        this.toggleCutCopyPastePartOptions(false);
        this.toggleInsertOptions(false);
        this.toggleInsertRowAboveOptions(false);
        this.toggleInsertRowBelowOptions(false);
    },

    onAddRowBelow: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();

        var PartIndex = null;
        var bins = this.activeProject.getJ5Collection().bins();

        if (this.selectedPart) {
            var gridPart = this.selectedPart;
            partIndex = (gridPart.up("Bin").items.indexOf(gridPart));

            bins.each(function (bin,binIndex) {
                bin.parts().insert(partIndex, "Teselagen.models.sequence.Row")
            });
           
            this.selectedBin.deselect();
            this.selectedPart.deselect();
            this.selectedBin = null;
            this.selectedPart = null;
        }

        else {
            this.selectedBin.deselect();
            this.selectedBin = null;
            bins.each(function (bin,binIndex) {
                bin.parts().insert(0, "Teselagen.models.sequence.Row")
            });
        }

        this.grid.removeAll();
        this.renderDevice();

        this.toggleCutCopyPastePartOptions(false);
        this.toggleInsertOptions(false);
        this.toggleInsertRowAboveOptions(false);
        this.toggleInsertRowBelowOptions(false);
    },

    onRemoveRow: function() {
        Ext.Msg.show({
                title: "Are you sure you want to delete this row?",
                msg: "WARNING: This will delete the current selected row. This process cannot be undone.",
                buttons: Ext.Msg.OKCANCEL,
                cls: "messageBox",
                fn: this.removeRows.bind(this),
                icon: Ext.Msg.QUESTION
        });
    },


    removeRows: function(evt) {
        if (evt === "ok") {

            this.totalRows -= 1;
            this.updateBinsWithTotalRows(); 


            var partIndex=null;
            var gridPart = this.selectedPart;
            var bins = this.activeProject.getJ5Collection().bins();

            if(this.totalRows == 0) {
                partIndex = (gridPart.up("Bin").items.indexOf(gridPart)-1);

                this.selectedBin = null;
                this.selectedPart = null;
                
                bins.each(function (bin, binIndex) {
                    bin.parts().removeAt(partIndex);
                });

                this.grid.removeAll();
                this.renderDevice();

                this.totalRows += 1;
                this.updateBinsWithTotalRows();
            }else {
                partIndex = (gridPart.up("Bin").items.indexOf(gridPart)-1);

                this.selectedBin = null;
                this.selectedPart = null;
                
                bins.each(function (bin, binIndex) {
                    bin.parts().removeAt(partIndex);
                });

                this.grid.removeAll();
                this.renderDevice();
            }

             this.toggleCutCopyPastePartOptions(false);
             this.toggleInsertOptions(false);
             this.toggleInsertRowAboveOptions(false);
             this.toggleInsertRowBelowOptions(false);
        }
    },

    /**
     * Handler for the Insert Column to the Left button. Inserts a bin after the selected
     * bin, or at the end of the device if there is no selected bin.
     */
    onAddColumnLeft: function() {
        var selectedBinIndex = null;

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
            this.selectedPart = null;
        }

        if(this.selectedBin) {
            selectedBinIndex = this.DeviceDesignManager.getBinIndex(
                                                        this.activeProject,
                                                        this.selectedBin.getBin());

            this.selectedBin.deselect();
            this.selectedBin = null;
        } else {
            selectedBinIndex = this.DeviceDesignManager.binCount(this.activeProject);
        }

        this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject,
                                                    selectedBinIndex);

        this.toggleCutCopyPastePartOptions(false);

        this.toggleInsertOptions(false);
        this.toggleInsertRowAboveOptions(false);
        this.toggleInsertRowBelowOptions(false);

        // toastr.info("Added Column Left");

    },

    /**
     * Handler for the Insert Column to the Right button. Inserts a bin after the selected
     * bin, or at the end of the device if there is no selected bin.
     */
    onAddColumnRight: function() {
        var selectedBinIndex = null;

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
            this.selectedPart = null;
        }

        if(this.selectedBin) {
            selectedBinIndex = (this.DeviceDesignManager.getBinIndex(
                                                        this.activeProject,
                                                        this.selectedBin.getBin())+1);

            this.selectedBin.deselect();
            this.selectedBin = null;
        } else {
            selectedBinIndex = this.DeviceDesignManager.binCount(this.activeProject);
        }

        this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject,
                                                    selectedBinIndex);


        this.toggleCutCopyPastePartOptions(false);
        this.toggleInsertOptions(false);
        this.toggleInsertRowAboveOptions(false);
        this.toggleInsertRowBelowOptions(false);
        
        // toastr.info("Added Column Right");
    },

    /**
     * Handler for InsertPartAtSelection event.
     */
    onInsertPartAtSelection: function(j5Part) {
        var selectedIndex;
        var selectedGridBin = this.selectedBin;
        var selectedJ5Bin = this.selectedBin.getBin();
        if(this.selectedPart) {
            selectedIndex = selectedGridBin.query("Part").indexOf(this.selectedPart);

            this.skipPadOnRemovePart = true;
            selectedJ5Bin.parts().removeAt(selectedIndex);
            selectedJ5Bin.parts().insert(selectedIndex, j5Part);

            this.selectedPart.setPart(j5Part);
            this.renderFasConflicts(selectedJ5Bin.parts(), j5Part);
        }
    },

    /**
     * Handler for the CLEAR_PART event.
     */
    onClearPart: function() {
        var j5Part = this.selectedPart.getPart();

        if(this.selectedPart && j5Part) {
            var parentBins = this.DeviceDesignManager.getParentBins(
                                                            this.activeProject,
                                                            j5Part);

            this.deHighlight(j5Part);

            // Remove associated rules if the part is only contained in one bin.
            if(parentBins.length > 1) {
                this.selectedPart.up('Bin').getBin().parts().remove(j5Part);
            } else {
                var rule;
                var involvedRules = this.DeviceDesignManager.getRulesInvolvingPart(
                                                            this.activeProject,
                                                            j5Part);

                while(involvedRules.getCount() > 0) {
                    rule = involvedRules.getAt(0);
                    involvedRules.removeAt(0);
                    rule.destroy();
                    involvedRules = this.DeviceDesignManager.getRulesInvolvingPart(
                                                            this.activeProject,
                                                            j5Part);
                }

                parentBins[0].parts().remove(j5Part);
            }

            this.selectedPart = null;
        }
    },

    /**
     * Handler for the SELECT_BIN event. This event is fired when a bin is
     * selected in the Inspector.
     * @param {Teselagen.models.J5Bin} j5Bin The bin which has been selected.
     */
    onSelectBin: function(j5Bin) {
        var gridBin = this.getGridBinFromJ5Bin(j5Bin);

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
            //Logic for selecting part with no sequence file but named
             if (this.selectedPart.getPart()) {
                if ((this.selectedPart.getPart().get("sequencefile_id") === "") && (this.selectedPart.getPart().get('name') != "")) {
                    /*this.selectedPart.select();*/
                    this.selectedPart.selectAlert();

                }
            }

            this.selectedPart = null;
        }

        this.selectedBin = gridBin;

        /*
        var toolbarPartItems = Ext.getCmp('mainAppPanel').getActiveTab().query('button[cls="toolbarPartItem"]');

        toolbarPartItems.forEach(function(item){
            item.on("click", function( btn, e, eOpts ){
                console.log(btn);
            });
        });
        */
        gridBin.select();
    },

    /**
     * Re-renders a grid bin given a j5Bin. Used when a bin is updated.
     * @param {Teselagen.models.J5Bin} j5Bin The bin to be rerendered.
     */
    rerenderBin: function(j5Bin) {
        Ext.suspendLayouts();

        var gridBin = this.getGridBinFromJ5Bin(j5Bin);
        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,
                                                            j5Bin);

        // Remove grid bin and re-render it.
        this.grid.remove(gridBin);

        var icon = Teselagen.constants.SBOLIcons.ICONS[j5Bin.get('iconID').toUpperCase()];

        var newBin = Ext.create("Vede.view.de.grid.Bin", {
            bin: j5Bin,
            totalRows: this.totalRows,
            iconSource: icon.url_large
        });

        // If false flip, otherwise do nothing;
        var flip = !j5Bin.get("directionForward");
        if(flip)
        {
            var imageBinIcon = newBin.query('image[cls="binIcon"]')[0];
            imageBinIcon.addCls('flipImage');
        }

        this.grid.insert(binIndex, newBin);

        // If the bin was previously selected, reselect it.
        if(this.selectedBin === gridBin) {
            this.selectedBin = newBin;
            newBin.select();
        }

        Ext.resumeLayouts(true);
    },

    /**
     * Re-renders a part in the grid by deleting it and re-adding it. Used when
     * a part is updated.
     * @param {Teselagen.models.Part} j5Part The part model to be rerendered.
     * @param {Boolean} fasConflict Whether the part should be rendered with a
     * fas conflict indicator or not.
     */
    rerenderPart: function(j5Part, fasConflict) {
        Ext.suspendLayouts();

        var gridParts = this.getGridPartsFromJ5Part(j5Part);
        var gridPart;

        for(var i = 0; i < gridParts.length; i++) {
            gridPart = gridParts[i];
            var parentGridBin = gridPart.up("Bin");
            var partIndex = parentGridBin.getBin().parts().indexOf(j5Part);

            if(this.selectedPart && this.selectedPart.down()) {
                this.selectedPart.deselect();
                this.deHighlight(this.selectedPart.getPart());
                this.selectedPart = null;
            }

            // Remove part from grid and re-add it.
            parentGridBin.remove(gridPart);
            var newPart = Ext.create("Vede.view.de.grid.Part", {
                part: j5Part,
                fasConflict: fasConflict
            });

            // Insert the part at partIndex + 1, because the bin header is at index 0.
            parentGridBin.insert(partIndex + 1, newPart);

            this.selectedPart = newPart;

            newPart.select();
        }

        Ext.resumeLayouts(true);
    },

    /**
     * Renders a new bin from a j5Bin model at the given index.
     * @param {Teselagen.models.J5Bin} j5Bin The model of the bin to be added.
     * @param {Number} index The location to add the bin to on the grid.
     */
    addJ5Bin: function(j5Bin, index) {
        var icon = Teselagen.constants.SBOLIcons.ICONS[j5Bin.data.iconID.toUpperCase()];

        var newBin = Ext.create("Vede.view.de.grid.Bin", {
            bin: j5Bin,
            totalRows: this.totalRows,
            iconSource: icon.url_large
        });

        if(index === null) {
            this.grid.add(newBin);
        } else {
            this.grid.insert(index, newBin);
        }
    },

    /**
     * Adds empty part cells to bins which don't have the maximum number of
     * parts already.
     */
    updateBinsWithTotalRows: function() {
        var items = this.grid.items.getRange();

        for(var i = 0; i < items.length; i++) {
            items[i].setTotalRows(this.totalRows);
        }
    },

    /**
     * Helper function to retrieve the class of the bin rendered on the grid
     * given its corresponding J5Bin model.
     * @param {Teselagen.models.J5Bin} j5Bin The model to match to a bin
     * rendered on the grid.
     * @return {Vede.view.de.grid.Bin} The grid bin corresponding to the given 
     * J5Bin.
     */
    getGridBinFromJ5Bin: function(j5Bin) {
        var targetGridBin = null;
        var bins = this.grid.query("Bin");
        var gridBin;

        for(var i = 0; i < bins.length; i++) {
            gridBin = bins[i];

            if(gridBin.getBin() === j5Bin) {
                return gridBin;
            }
        }

        return targetGridBin;
    },

    /**
     * Helper function to retrieve the class of the parts rendered on the grid
     * given their corresponding Part model.
     * @param {Teselagen.models.Part} j5Part The model to match to a part
     * rendered on the grid.
     * @return {Vede.view.de.grid.Part[]} The grid parts corresponding to the given 
     * part model.
     */
    getGridPartsFromJ5Part: function(j5Part) {
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
            var partIndex = ownerBin.parts().indexOf(j5Part);
            gridPart = gridBin.query("Part")[partIndex];

            if(targetGridParts.indexOf(gridPart) < 0) {
                targetGridParts.push(gridPart);
            }
        }

        return targetGridParts;
    },

    onPartMapped: function(pj5Part) {
        var j5Part = pj5Part;

        var j5Bin = this.DeviceDesignManager.getBinByPart(this.activeProject, j5Part);

        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,j5Bin);

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
        }

        this.onPartCellHasBeenMapped(j5Part);
        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);
    },

    onPartCellHasBeenMapped: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        for(var i = 0; i < gridParts.length; i++) {
            gridParts[i].mapSelect();
        }

        this.selectedPart = null;
        this.selectedBin = null;

        this.grid.removeAll();
        this.renderDevice();
    },

    onPartCellHasNotBeenMapped: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        for(var i = 0; i < gridParts.length; i++) {
            gridParts[i].select();
        }

        this.grid.removeAll();
        this.renderDevice();
    },

    /**
     * When a SELECT_PART event is fired, check to see if it is already selected.
     * If not, select it, then highlight all of the grid parts which have the
     * same j5Part.
     */
    onPartSelected: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        if(gridParts.length > 0 && gridParts.indexOf(this.selectedPart) === -1) {
            this.selectedPart = gridParts[0];
            gridParts[0].mapSelect();
        }

        // Select all gridParts with the same source, unless the j5Part is empty.
        if(j5Part) {
            if(j5Part.get("sequencefile_id") !== "") {
                for(var i = 0; i < gridParts.length; i++) {
                    gridParts[i].highlight();
                }
            }
        }
    },

    /**
     * De-highlights all gridParts associated with a given j5 part.
     * @param {Teselagen.model.Part} j5Part
     */
    deHighlight: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        for(var i = 0; i < gridParts.length; i++) {
            gridParts[i].deselect();
        }
    },

    onPartCellVEEditClick: function(partCell) {
        var gridPart = partCell.up().up();
        var j5Part = gridPart.getPart();
        var DETab = Ext.getCmp('mainAppPanel').getActiveTab();

        if (j5Part) {

            DETab.setLoading(true);

            setTimeout(function() {
                j5Part.getSequenceFile({
                callback: function(associatedSequence,operation){

                if(associatedSequence.get("partSource")!="") {
                    if(associatedSequence) 
                    {
                        console.log("onPartCellVEEditClick");
                        j5Part.getSequenceFile({
                            callback: function (seq) {
                                Vede.application.fireEvent("OpenVectorEditor",seq);
                        }});
                        DETab.setLoading(false);
                    }
                    else
                    {
                        console.log("This part doesn't have an associated sequence, creating new empty sequence");
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
                                        Vede.application.fireEvent("openVectorEditor",newSequenceFile);
                                        DETab.setLoading(false);
                                    }
                                });
                            }
                        });
                    }
                } else {
                    DETab.setLoading(false);
                    Vede.application.fireEvent("OpenPartLibrary");
                }

                }});
            }, 1);
    } else {
        Vede.application.fireEvent("OpenPartLibrary");
    }

    },

    suspendPartAlerts: function(){
        //console.log("suspending part alerts");
        this.activeBins.each(function(bin) {
            var parts = bin.parts();

            parts.un("add", this.onAddToParts, this);
            parts.un("update", this.onPartsUpdate, this);
            parts.un("remove", this.onRemoveFromParts, this);
        }, this);
    },
    resumePartAlerts: function(){
        //console.log("resuming part alerts");
        this.activeBins.each(function(bin) {
            var parts = bin.parts();

            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onPartsUpdate, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);
    },

    onValidateDuplicatedPartNameEvent: function(pPart,name,cb){
        //console.log("Checking for duplicate part with id:"+pPart.get('id'));
        duplicated = false;
        this.activeBins.each(function(bin) {
            bin.parts().each(function(part){
                //console.log(part.get('id'));
                if(part.get('id')!=pPart.get('id') && part.get('name')===name && part.get("sequencefile_id") != "") duplicated = true;
            });
        });

        if(duplicated)
        {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: 'Another non-identical part with that name already exists in the design. Please select the same part or a part with another name.',
                    buttons: Ext.MessageBox.OK,
                    icon:Ext.MessageBox.ERROR
                });
        }
        else return cb();
    },

    toggleCutCopyPastePartOptions: function(state){
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Cut Part"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Copy Part"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Paste Part"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Row"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Clear Part"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Column"]')[0].setDisabled(!state||false);
    },

    toggleInsertOptions: function(state) {
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Column Left"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Column Right"]')[0].setDisabled(!state||false);
    },

    toggleInsertRowAboveOptions: function(state) {
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Row Above"]')[0].setDisabled(!state||false);
    },

    toggleInsertRowBelowOptions: function(state) {
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Row Below"]')[0].setDisabled(!state||false);
    },

    reRenderGrid: function(){
        this.selectedBin = null;
        this.selectedPart = null;

        this.grid.removeAll(); // Clean grid
        this.renderDevice();
    },

    onCutPartMenuItemClick: function(){
        console.log("Cutting Part",this.selectedPart.getPart());
        this.selectedClipboardPart = this.selectedPart.getPart();
        var index = this.selectedPart.up("Bin").query("Part").indexOf(this.selectedPart);
        var parentGridBin = this.selectedPart.up("Bin");
        parentGridBin.getBin().parts().removeAt(index);
        this.reRenderGrid();
        ClipboardCutFlag = true;
    },

    onCopyPartMenuItemClick: function(){
        console.log("Copying Part",this.selectedPart.getPart());
        this.selectedClipboardPart = this.selectedPart.getPart();
        ClipboardCutFlag = false;
    },

    onPastePartMenuItemClick: function(){
        Ext.suspendLayouts();

        var index = this.selectedPart.up("Bin").query("Part").indexOf(this.selectedPart);
        var parentGridBin = this.selectedPart.up("Bin");
        var parentJ5Bin = parentGridBin.getBin();
        var partsStore = parentJ5Bin.parts();
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

    onLaunch: function() {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        this.tabPanel.on("tabchange",
                         this.onTabChange,
                         this);
    },

    /**
     * @member Vede.controller.DeviceEditor.GridController
     */
    init: function() {
        this.callParent();

        this.control({
            "DeviceEditorPartPanel button": {
                click: this.onPartPanelButtonClick
            },
            "button[cls='flipBinButton']": {
                click: this.onFlipBinButtonClick
            },
            "component[cls='binHeader']": {
                render: this.addBinHeaderClickEvent
            },
            "component[cls='gridPartCell']": {
                render: this.addPartCellClickEvent
            },
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
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on("suspendPartAlerts",this.suspendPartAlerts, this);
        this.application.on("resumePartAlerts",this.resumePartAlerts, this);

        this.application.on("FillBlankCells", this.onfillBlankCells, this);

        this.application.on("rerenderPart",this.rerenderPart, this);

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

        this.application.on(this.DeviceEvent.INSERT_PART_AT_SELECTION,
                            this.onInsertPartAtSelection,
                            this);

        this.application.on(this.DeviceEvent.CLEAR_PART,
                            this.onClearPart,
                            this);

        this.application.on(this.DeviceEvent.REMOVE_ROW, 
                            this.onRemoveRow, 
                            this);

        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
                            this);

        this.application.on(this.DeviceEvent.MAP_PART,
                            this.onPartMapped,
                            this);

        this.application.on(this.DeviceEvent.MAP_PART_SELECT,
                            this.onPartCellHasBeenMapped,
                            this);

        this.application.on(this.DeviceEvent.MAP_PART_NOTSELECT,
                            this.onPartCellHasNotBeenMapped,
                            this);

        this.application.on(this.DeviceEvent.SELECT_PART,
                            this.onPartSelected,
                            this);

        this.application.on("BinHeaderClick",
                            this.onBinHeaderClick,
                            this);

        this.application.on("PartCellClick",
                            this.onPartCellClick,
                            this);

        this.application.on("ReRenderDECanvas",
                            this.onReRenderDECanvasEvent,
                            this);

        this.application.on("PartCellVEEditClick",
                            this.onPartCellVEEditClick,
                            this);

        this.application.on("validateDuplicatedPartName",
                            this.onValidateDuplicatedPartNameEvent,
                            this);
        }
});
