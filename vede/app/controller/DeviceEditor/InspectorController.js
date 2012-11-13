/**
 * Controls the inspector panel, on the right side of the device editor.
 */
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    activeProject: null,
    columnsGrid: null,
    selectedPart: null,
    tabPanel: null,

    onPartSelected: function(j5Part) {
        this.inspector.setActiveTab(0);

        this.populatePartInformation(j5Part);
        this.selectedPart = j5Part;
        console.log("Part selected");
    },

    onPartNameFieldChange: function(nameField) {
        var newName = nameField.getValue();

        this.selectedPart.set("name", newName);
    },

    onPartAssemblyStrategyChange: function(box) {
        var newStrategy = box.getValue();

        this.selectedPart.set("fas", newStrategy);
    },

    onPlasmidGeometryChange: function(radioGroup, newValue) {
        this.activeProject.set("isCircular", newValue);
    },

    onAddColumnButtonClick: function() {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];
        var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,
                                                                    selectedBin);

        this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject,
                                                    selectedBinIndex);
    },

    onRemoveColumnButtonClick: function() {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];
        var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject,
                                                                    selectedBin);
        
        this.activeProject.getJ5Collection().deleteBinByIndex(selectedBinIndex);
    },

    onGridBinSelect: function(grid, j5Bin, selectedIndex) {
        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    /**
     * When we switch to a new tab, switch the current active project to the one
     * associated with the new tab, and reset event handlers so they refer to the
     * new grid and j5 bins.
     */
    onTabChange: function(tabPanel, newTab, oldTab) {
        if(newTab.model) {
            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onBinsUpdate, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);
            }

            var self = this;
            this.activeProject = newTab.model.getDesign();
            
            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onBinsUpdate, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            this.inspector = newTab.down("component[cls='InspectorPanel']");

            if(this.columnsGrid) {
                this.columnsGrid.un("select", this.onGridBinSelect, this);
            }

            this.columnsGrid = this.inspector.down("gridpanel");
            this.columnsGrid.on("select", this.onGridBinSelect, this);

            this.renderCollectionInfo();
        }
    },

    onAddToBins: function(activeBins, bins, index) {
    },

    onBinsUpdate: function(activeBins, updatedBin, operation, modified) {
    },

    onRemoveFromBins: function(activeBins, removedBin, index) {
    },

    renderCollectionInfo: function() {
        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        var circularPlasmidField = this.inspector.down("radiofield[cls='circular_plasmid_radio']");
        var linearPlasmidField = this.inspector.down("radiofield[cls='linear_plasmid_radio']");

        if(this.activeProject) {
            j5ReadyField.setValue(this.activeProject.getJ5Collection().get("j5Ready"));
            combinatorialField.setValue(this.activeProject.getJ5Collection().get("combinatorial"));

            if(this.activeProject.get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            this.columnsGrid.reconfigure(this.activeProject.getJ5Collection().bins());
        }
    },

    populatePartInformation: function(j5Part) {
        var sourceField = this.inspector.down("component[cls='partSourceField']");
        var revCompField = this.inspector.down("component[cls='reverseComplementField']");
        var nameField = this.inspector.down("textfield[cls='partNameField']");
        var startField = this.inspector.down("displayfield[cls='startBPField']");
        var stopField = this.inspector.down("displayfield[cls='stopBPField']");
        var strategyField = this.inspector.down("combobox[cls='forcedAssemblyComboBox']");

        if(j5Part) {
            nameField.setValue(j5Part.get("name"));

            var existSequence = (j5Part.get('sequencefile_id')=="")? false : true;
            if(existSequence)
            {
                var sourceFile = j5Part.getSequenceFile({
                    callback: function(record,operation){
                        sourceField.setValue(sourceFile.get("partSource"));
                        revCompField.setValue(j5Part.get("revComp"));                        
                    }
                });
            } else {
                sourceField.setValue("No source assigned");
                revCompField.setValue("No source assigned");
            }

            var startBP = j5Part.get("genbankStartBP");
            if(startBP < 1) {
                startField.setValue("");
            } else {
                startField.setValue(startBP);
            }

            var endBP = j5Part.get("endBP");
            if(endBP < 1) {
                stopField.setValue("");
            } else {
                stopField.setValue(endBP);
            }

            var strategy = j5Part.get("fas");
            if(strategy) {
                strategyField.setValue(strategy);
            } else {
                strategyField.setValue("None");
            }
        } else {
            nameField.setValue("");
            sourceField.setValue("");
            revCompField.setValue("");
            startField.setValue("");
            stopField.setValue("");
            strategyField.setValue("None");
        }
    },

    onLaunch: function() {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange",
                         this.onTabChange,
                         this);
    },

    init: function() {
        this.callParent();

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;

        this.application.on(this.DeviceEvent.SELECT_PART,
                            this.onPartSelected,
                            this);

        this.control({
            "textfield[cls='partNameField']": {
                keyup: this.onPartNameFieldChange
            },
            "combobox[cls='forcedAssemblyComboBox']": {
                select: this.onPartAssemblyStrategyChange
            },
            "radiofield[cls='circular_plasmid_radio']": {
                change: this.onPlasmidGeometryChange
            },
            "button[cls='inspectorAddColumnBtn']": {
                click: this.onAddColumnButtonClick
            },
            "button[cls='inspectorRemoveColumnBtn']": {
                click: this.onRemoveColumnButtonClick
            },
            "gridpanel[cls='inspectorGrid']": {
                select: this.onGridBinSelect
            }
        })
    },
});
