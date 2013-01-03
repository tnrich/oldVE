/**
 * Class controlling the device display portion of Device Editor.
 */
Ext.define("Vede.controller.DeviceEditor.GridController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.models.DeviceEditorProject",
               "Teselagen.constants.SBOLIcons"],

    DeviceEvent: null,
    ProjectEvent: null,

    DeviceDesignManager: null,

    activeBins: null,
    activeProject: null,
    grid: null,
    tabPanel: null,

    selectedBin: null,
    selectedPart: null,

    totalRows: 1,

    onReRenderDECanvasEvent: function(){
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.onTabChange(tab,tab,tab);
    },

    /**
     * Renders a given DeviceDesign.
     * @param {Teselagen.models.DeviceDesign} The design to render.
     */
    renderDevice: function() {
        var bins = this.activeProject.getJ5Collection().bins();

        bins.each(function(j5Bin) {
            this.addJ5Bin(j5Bin);
        }, this);
    },

    onPartPanelButtonClick: function(button) {
        if(this.selectedBin) this.selectedBin.bin.set('iconID',button.data.iconKey);
    },

    onFlipBinButtonClick: function(button) {
        if(button.icon === Vede.view.de.grid.Bin.forwardButtonIconPath) {
            button.setIcon(Vede.view.de.grid.Bin.reverseButtonIconPath);
        } else {
            button.setIcon(Vede.view.de.grid.Bin.forwardButtonIconPath);
        }

        // Get the bin that the button refers to and reverse its direction.
        var parentBin = button.up().up().up().getBin();
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
        //console.log(partCell);
        //console.log(Ext.getClassName(partCell.body));
        partCell.body.on("click", function() {
            this.application.fireEvent("PartCellClick", partCell);
        },this);
        partCell.body.on("dblclick", function() {
            this.application.fireEvent("PartCellVEEditClick", partCell);
        },this);
    },

    onBinHeaderClick: function(binHeader) {
        var gridBin = binHeader.up().up();
        var j5Bin = gridBin.getBin();

        if(this.selectedBin) {
            this.selectedBin.deselect();
        }

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.selectedPart = null;
        }

        this.selectedBin = gridBin;
        gridBin.select();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    onPartCellClick: function(partCell) {
        var gridPart = partCell.up().up();
        var j5Part = gridPart.getPart();
        var j5Bin = gridPart.up("Bin").getBin();

        var binIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,
                                                            j5Bin);

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
        }

        this.selectedPart = gridPart;
        gridPart.select();

        this.application.fireEvent(this.DeviceEvent.SELECT_PART, j5Part, binIndex);
    },

    onTabChange: function(tabPanel, newTab, oldTab) {
        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
            this.selectedPart = null;
        }
        
        if(this.selectedBin) {
            this.selectedBin.deselect();
            this.selectedBin = null;
        }


        if(newTab.initialCls == "DeviceEditorTab") { // It is a DE tab
            this.grid = newTab.query("component[cls='designGrid']")[0];
            this.grid.removeAll(); // Clean grid

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

            this.activeProject = newTab.model.getDesign();
            newTab.query('label[cls="designName"]')[0].setText(newTab.model.data.name);
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

            this.renderDevice();
        }
    },

    onAddToBins: function(activeBins, addedBins, index) {
        Ext.each(addedBins, function(j5Bin) {
            this.addJ5Bin(j5Bin, index);

            // Add event listeners to the parts store of this bin.
            parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onPartsUpdate, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);
    },

    onBinsUpdate: function(activeBins, updatedBin, operation, modified) {
        console.log("bin '" + updatedBin.get("binName") + "' field " + modified + 
                    " modified, operation " + operation);

        this.rerenderBin(updatedBin);
    },

    onRemoveFromBins: function(activeBins, removedBin, index) {
        if(this.selectedBin && this.selectedBin.getBin() == removedBin) {
            this.selectedBin = null;
        }

        this.grid.remove(this.grid.query("Bin")[index]);
    },

    onAddToParts: function(parts, addedParts, index) {
        console.log("part '" + addedParts[0].get("name") + "' added");

        // For each part added, insert it to the part's bin.
        Ext.each(addedParts, function(addedPart) {
            var newPart = Ext.create("Vede.view.de.grid.Part", {
                part: addedPart,
                fasConflict: false
            });

            this.renderFasConflicts(parts, addedPart);
        }, this);
    },

    onPartsUpdate: function(parts, updatedPart, operation, modified) {
        console.log("part '" + updatedPart.get("name") + "' field " + modified +
                    " modified, new value " + updatedPart.get(modified));

        if(modified)
        {
            if(modified.indexOf("fas") >= 0) {
                this.renderFasConflicts(parts, updatedPart);
            } else {
                this.rerenderPart(updatedPart, false);
            }
        }
    },

    onRemoveFromParts: function(parts, removedPart, index) {
    },

    /**
     * Helper function to calculate which parts need to be rerendered after the
     * fas field of a part is modified.
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

    onAddRow: function() {
        this.totalRows += 1;
        this.updateBinsWithTotalRows();
    },

    onAddColumn: function() {
        var selectedBinIndex;

        if(this.selectedBin) {
            selectedBinIndex = this.DeviceDesignManager.getBinIndex(
                                                        this.activeProject,
                                                        this.selectedBin.getBin());
        } else {
            selectedBinIndex = 0;
        }

        this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, 
                                                    selectedBinIndex);
    },

    /**
     * Handler for the SELECT_BIN event.
     */
    onSelectBin: function(j5Bin) {
        var gridBin = this.getGridBinFromJ5Bin(j5Bin);

        if(this.selectedBin) {
            this.selectedBin.deselect();
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
            iconSource: icon.url_svg
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
     */
    rerenderPart: function(j5Part, fasConflict) {
        var binIndex = this.DeviceDesignManager.getBinAssignment(
                            this.activeProject, j5Part);
        var parentBin = this.DeviceDesignManager.getBinByIndex(
                            this.activeProject, binIndex);
        var parentGridBin = this.getGridBinFromJ5Bin(parentBin);

        var gridPart = this.getGridPartFromJ5Part(j5Part);
        var partIndex = parentBin.parts().indexOf(j5Part);

        if(this.selectedPart && this.selectedPart.down()) {
            this.selectedPart.deselect();
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
    },

    addJ5Bin: function(j5Bin, index) {
        var iconSource;
        iconSource = "resources/images/icons/device/small/origin_of_replication.png";
        
        var icon = Teselagen.constants.SBOLIcons.ICONS[j5Bin.data.iconID.toUpperCase()];

        var newBin = Ext.create("Vede.view.de.grid.Bin", {
            bin: j5Bin,
            totalRows: this.totalRows,
            iconSource: icon.url_svg
        });

        if(index === null) {
            this.grid.add(newBin);
        } else {
            this.grid.insert(index, newBin);
        }
    },

    updateBinsWithTotalRows: function() {
        this.grid.items.each(function(bin) {
            bin.setTotalRows(this.totalRows);
        }, this);
    },

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

    getGridPartFromJ5Part: function(j5Part) {
        var targetGridPart = null;

        Ext.each(this.grid.query("Part"), function(gridPart) {
            if(gridPart.getPart() === j5Part) {
                targetGridPart = gridPart;
                return false;
            }
        });

        // If this method fails, we may be trying to retrieve a grid part which
        // has no part associated with it yet. In this case, first retrieve the
        // bin associated with the j5Part, then the index of the part itself.
        if(!targetGridPart) {
            var ownerBinIndex = this.DeviceDesignManager.getBinAssignment(
                                        this.activeProject, j5Part);
            var ownerBin = this.DeviceDesignManager.getBinByIndex(this.activeProject,
                                                                  ownerBinIndex);
            var gridBin = this.getGridBinFromJ5Bin(ownerBin);

            var partIndex = ownerBin.parts().indexOf(j5Part);
            targetGridPart = gridBin.query("container[cls='gridPartContainer']")[partIndex];
        }

        return targetGridPart;
    },

    onPartCellVEEditClick: function(partCell){
        var gridPart = partCell.up().up();
        var j5Part = gridPart.getPart();
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        
        j5Part.getSequenceFile({
        callback: function(associatedSequence,operation){
        if(associatedSequence)
        {
            Vede.application.fireEvent("VectorEditorEditingMode",j5Part,activeTab);

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
                            console.log(j5Part);
                            var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
                            Vede.application.fireEvent("VectorEditorEditingMode",j5Part,activeTab);
                        }
                    });
                }
            });
        }
        
        }});

    },

    onLaunch: function() {
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

        this.grid = Ext.ComponentQuery.query("component[cls='designGrid']")[0];
        
        this.tabPanel = Ext.getCmp("mainAppPanel");

        // Create a sample bin and associated parts to render.
        this.totalRows = 2;
        var binModel = Ext.create("Teselagen.models.J5Bin", {
            binName: "cds",
            iconID: ""
        });

        var partModel1 = Ext.create("Teselagen.models.Part", {
            name: "p_con",
        });

        var partModel2 = Ext.create("Teselagen.models.Part", {
            name: "p_bad",
        });

        binModel.parts().add(partModel1);
        binModel.parts().add(partModel2);

        var deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
            name: "Untitled Project"
        });

        var design = this.DeviceDesignManager.createDeviceDesignFromBins([binModel]);

        deproject.setDesign(design);

        this.tabPanel.down("DeviceEditorPanel").model = deproject;

        this.tabPanel.on("tabchange",
                         this.onTabChange,
                         this);
    },

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
            }
        });

        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(this.DeviceEvent.ADD_ROW,
                            this.onAddRow,
                            this);

        this.application.on(this.DeviceEvent.ADD_COLUMN,
                            this.onAddColumn,
                            this);

        this.application.on(this.DeviceEvent.SELECT_BIN,
                            this.onSelectBin,
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
        
        },
});
