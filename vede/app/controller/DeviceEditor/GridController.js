/**
 * Class controlling the device display portion of Device Editor.
 * @class Vede.controller.DeviceEditor.GridController
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.models.DeviceEditorProject",
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
        var bins = this.activeProject.getJ5Collection().bins();

        bins.each(function(j5Bin) {
            this.addJ5Bin(j5Bin);
        }, this);
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

        var gridBin = binHeader.up().up();
        var j5Bin = gridBin.getBin();

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());
            this.selectedPart = null;
        }

        this.selectedBin = gridBin;
        gridBin.select();

        // DE-Activate Cut, Copy, Paste Options
        this.toggleCutCopyPastePartOptions(false);

        var removeColumnMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");
        removeColumnMenuItem.enable();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    /**
     * Selects a part when it is clicked in the grid.
     * @param {Ext.container.Container} partCell The clicked part cell.
     */
    onPartCellClick: function(partCell) {
        var gridPart = partCell.up().up();

        var j5Part = gridPart.getPart();

        var j5Bin = gridPart.up("Bin").getBin();
        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);

        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,j5Bin);

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.deHighlight(this.selectedPart.getPart());

            if (this.selectedPart.getPart() && this.selectedPart.getPart().get("name")=="") {
                this.selectedPart.deselect();
            } else if (this.selectedPart.getPart() && this.selectedPart.getPart().getSequenceFile().get("partSource")=="") {
                this.selectedPart.select();
                this.selectedPart.leaveselect();
            }
        }

        this.selectedPart = gridPart;

        gridPart.deselect();
        gridPart.select();


         if(j5Part) {
            if(j5Part.getSequenceFile().get("partSource")==="") {
                gridPart.select();
            } else {
                gridPart.deselect();
                gridPart.mapSelect();
            }
        } else {
            gridPart.select();
        }

        // Activate Cut, Copy, Paste Options
        this.toggleCutCopyPastePartOptions(true);

        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);
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
        var selectedBin = this.selectedBin;
        var partCells = this.selectedPart.up("Bin").query("Part");

        var partGrids = tab.query("component[cls='gridPartsCell']");

        var selectedPartCellIndex = this.selectedPart.up("Bin").items.indexOf(this.selectedPart);
        var selectedPart = this.selectedPart;

        var cellCount = this.selectedPart.up("Bin").items.items.length - 1;

        this.selectedBin = null;
        this.selectedPart = null;

        for (var i = 0; i < cellCount; i++) {
            var gridPart = partCells[i];
            var j5Part = gridPart.getPart();
            if (!j5Part) {
                var newPart = Ext.create("Teselagen.models.Part");
                var j5Bin = selectedBin;
                var binIndex =  selectedBinIndex;
                this.DeviceDesignManager.addPartToBin(this.activeProject, newPart, binIndex);
            }
        }

            this.grid.removeAll(); // Clean grid
            this.renderDevice();

        selectedBin = this.DeviceDesignManager.getBinByIndex(this.activeProject, selectedBinIndex);
        newGridBin = this.getGridBinFromJ5Bin(selectedBin);
        newGridPart = newGridBin.items.items[selectedPartCellIndex];

        this.onPartCellClick(newGridPart.down().down()); //Select the original cell that was selected.
        
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
        Ext.each(addedBins, function(j5Bin) {
            this.addJ5Bin(j5Bin, index);

            // Add event listeners to the parts store of this bin.
            parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onPartsUpdate, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);

        if(this.selectedBin){
            this.selectedBin.deselect();
            this.selectedBin = null;
        }
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
        // For each part added, insert it to the part's bin.
        Ext.each(addedParts, function(addedPart) {
            this.renderFasConflicts(parts, addedPart);
        }, this);
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
        var gridBin;
        var j5Bin;
        var gridParts = this.getGridPartsFromJ5Part(removedPart);
        var relatedRules;

        this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                       removedPart).removeAll();

        Ext.each(gridParts, function(gridPart) {
            gridBin = gridPart.up("Bin");
            j5Bin = gridPart.up("Bin").getBin();

            gridBin.remove(gridPart);
            gridBin.setTotalRows(this.totalRows);

            this.application.fireEvent("ReRenderCollectionInfo");
            
            /*this.selectedPart = null;
            Vede.application.fireEvent("partSelected", this.selectedPart);
            this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);*/
            Vede.application.fireEvent("checkj5Ready");
        }, this);
    },

    /**
     * Handles the event that one or more Eugene Rules are added to the device.
     * @param {Ext.data.Store} rules The device's store of rules.
     * @param {Teselagen.model.EugeneRule[]} addedRules An array of added rules.
     * @param {Number} index The index where the rules were added.
     */
    onAddToEugeneRules: function(rules, addedRules, index) {
        Ext.each(addedRules, function(addedRule) {
            var operand1 = addedRule.getOperand1();
            var operand2 = addedRule.getOperand2();

            var gridOperands1 = this.getGridPartsFromJ5Part(operand1);

            Ext.each(gridOperands1, function(gridOperand1) {
                if(!gridOperand1.partCell.down("image[cls='eugeneRuleIndicator']")) {
                    gridOperand1.addEugeneRuleIndicator();
                }

                if(!addedRule.get("operand2isNumber")) {
                    var gridOperands2 = this.getGridPartsFromJ5Part(operand2);
                    Ext.each(gridOperands2, function(gridOperand2) {
                        if(!gridOperand2.partCell.down("image[cls='eugeneRuleIndicator']")) {
                            gridOperand2.addEugeneRuleIndicator();
                        }
                    }, this);
                }
            }, this);
        }, this);
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
        } else if(partsArray[0].get("fas") != updatedPart.get("fas")) {
            this.rerenderPart(updatedPart, true);
        } else {
            this.rerenderPart(updatedPart, false);
        }
    },

    /**
     * Handler for the Insert Row button.
     */
    onAddRow: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();
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
            var partIndex=null;
            var gridPart = this.selectedPart;
            var bins = this.activeProject.getJ5Collection().bins();

            console.log(bins);

            partIndex = (gridPart.up("Bin").items.indexOf(gridPart)-1);
            console.log(partIndex);

            // for (var i = 0; i < bins.length; i++) {
            //     bins[i].parts()[partIndex].destroy();
            // }
            
            this.selectedBin = null;
            this.selectedPart = null;
            
            bins.each(function (bin, binIndex) {
                bin.parts().removeAt(partIndex);
            });

            this.grid.removeAll();
            this.renderDevice();
        }
    },

    /**
     * Handler for the Insert Column to the Left button. Inserts a bin after the selected
     * bin, or at the end of the device if there is no selected bin.
     */
    onAddColumnLeft: function() {
        var selectedBinIndex = null;

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
    },

    /**
     * Handler for the Insert Column to the Right button. Inserts a bin after the selected
     * bin, or at the end of the device if there is no selected bin.
     */
    onAddColumnRight: function() {
        var selectedBinIndex = null;

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
    },

    /**
     * Re-renders a part in the grid by deleting it and re-adding it. Used when
     * a part is updated.
     * @param {Teselagen.models.Part} j5Part The part model to be rerendered.
     * @param {Boolean} fasConflict Whether the part should be rendered with a
     * fas conflict indicator or not.
     */
    rerenderPart: function(j5Part, fasConflict) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        Ext.each(gridParts, function(gridPart) {
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
        }, this);
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
        this.grid.items.each(function(bin) {
            bin.setTotalRows(this.totalRows);
        }, this);


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

        Ext.each(this.grid.query("Bin"), function(gridBin) {
            if(gridBin.getBin() === j5Bin) {
                targetGridBin = gridBin;
                return false;
            }
        });

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
        var targetGridParts = [];

        Ext.each(this.grid.query("Bin"), function(gridBin) {
            Ext.each(gridBin.query("Part"), function(gridPart) {
                if(gridPart.getPart() === j5Part) {
                    targetGridParts.push(gridPart);
                }
            });
        });

        Ext.each(this.DeviceDesignManager.getOwnerBinIndices(this.activeProject, j5Part), function(index) {
            var ownerBin = this.DeviceDesignManager.getBinByIndex(this.activeProject,
                                                                  index);
            var gridBin = this.getGridBinFromJ5Bin(ownerBin);
            var partIndex = ownerBin.parts().indexOf(j5Part);
            var gridPart = gridBin.items[partIndex];

            if(!targetGridParts.indexOf(gridPart)) {
                targetGridParts.push(gridPart);
            }
        }, this);

        return targetGridParts;
    },

    onPartCellSelectByMap: function(pj5Part) {
        var j5Part = pj5Part;

        var j5Bin = this.DeviceDesignManager.getBinByPart(this.activeProject, j5Part);

        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,j5Bin);

        // if(this.selectedPart && this.selectedPart.down()) {
        //     this.selectedPart.deselect();
        //     this.deHighlight(this.selectedPart.getPart());
        // }

        this.onPartCellHasBeenMapped(j5Part);
        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);

    },

    onPartCellHasBeenMapped: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        console.log(gridParts);

        Ext.each(gridParts, function(gridPart) {
            gridPart.mapSelect();
        });

        this.selectedPart = null;
        this.selectedBin = null;

        this.grid.removeAll();
        this.renderDevice();
    },

    onPartCellHasNotBeenMapped: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        Ext.each(gridParts, function(gridPart) {
            gridPart.select();
        });

        this.grid.removeAll();
        this.renderDevice();
    },

    /**
     * When a SELECT_PART event is fired, check to see if it is already selected.
     * If not, select it, then mapSelect all of the grid parts which have the
     * same j5Part.
     */
    onPartSelected: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        if(gridParts && !gridParts.indexOf(this.selectedPart)) {
            this.selectedPart = gridParts[0];
            gridParts[0].select();
        }

        // Select all gridParts with the same source, unless the j5Part is empty.
        if(j5Part) {
            j5Part.getSequenceFile({
                callback: function(sequenceFile) {
                    if(sequenceFile.get("partSource") !== "") {
                        Ext.each(gridParts, function(gridPart) {
                            gridPart.mapSelect();
                            gridPart.highlight();
                        });
                    }
                }
            });
        }
    },

    /**
     * Deselects all gridParts associated with a given j5 part.
     * @param {Teselagen.model.Part} j5Part
     */
    deHighlight: function(j5Part) {
        var gridParts = this.getGridPartsFromJ5Part(j5Part);

        Ext.each(gridParts, function(gridPart) {
            gridPart.deselect();
        });
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
                if(part.get('id')!=pPart.get('id') && part.get('name')===name) duplicated = true;
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

        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Clear Part"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Column"]')[0].setDisabled(!state||false);
        Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorMenuPanel').query('menuitem[text="Remove Row"]')[0].setDisabled(!state||false);
    },

    onCopyPartMenuItemClick: function(){
        console.log("Copying Part",this.selectedPart.getPart());
        this.selectedClipboardPart = this.selectedPart.getPart();
    },

    onPastePartMenuItemClick: function(){

        var self = this;

        var reRenderGrid = function(){
            self.selectedBin = null;
            self.selectedPart = null;

            self.grid.removeAll(); // Clean grid
            self.renderDevice();
        };

        if(this.selectedClipboardPart)
        {
            var performPaste = function(linked){
                var index = self.selectedPart.up("Bin").query("Part").indexOf(self.selectedPart);
                var parentGridBin = self.selectedPart.up("Bin");

                parentGridBin.getBin().parts().removeAt(index);
                if (linked) { parentGridBin.getBin().parts().insert(index, self.selectedClipboardPart); reRenderGrid(); }
                else
                {
                    Ext.MessageBox.prompt('Part name', 'Please a name for the new part:', function(btn,text){
                        var duplicatedPart = self.selectedClipboardPart.copy();
                        duplicatedPart.set('name',text);
                        Vede.application.fireEvent("validateDuplicatedPartName",duplicatedPart,text,function(){
                            parentGridBin.getBin().parts().insert(index,duplicatedPart);
                            reRenderGrid();
                        })
                    });
                }


                //Ext.MessageBox.close();
            };

            Ext.MessageBox.show({
                title:'Special paste',
                msg: 'Select paste type',
                buttonText: {yes: "Link Part",no: "Duplicate Part",cancel: "Cancel"},
                fn: function(btn){
                    if(btn==="yes") { performPaste(true); }
                    else if(btn==="no") { performPaste(false); }
                    else { Ext.MessageBox.close(); }
                }
            });

        }
        else
        {
            console.log("No part in clipboard");
        }
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
        });

        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on("suspendPartAlerts",this.suspendPartAlerts, this);
        this.application.on("resumePartAlerts",this.resumePartAlerts, this);

        this.application.on("FillBlankCells", this.onfillBlankCells, this);

        this.application.on("rerenderPart",this.rerenderPart, this);

        this.application.on(this.DeviceEvent.ADD_ROW,
                            this.onAddRow,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_LEFT,
                            this.onAddColumnLeft,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN_RIGHT,
                            this.onAddColumnRight,
                            this);

        this.application.on(this.DeviceEvent.REMOVE_ROW, 
                            this.onRemoveRow, 
                            this);

        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
                            this);

        this.application.on(this.DeviceEvent.MAP_PART,
                            this.onPartCellSelectByMap,
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
