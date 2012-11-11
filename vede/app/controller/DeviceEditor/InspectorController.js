/**
 * Controls the inspector panel, on the right side of the device editor.
 */
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent"],

    DeviceEvent: null,

    activeProject: null,
    selectedPart: null,
    tabPanel: null,

    onPartSelected: function(j5Part) {
        this.inspector.setActiveTab(0);

        this.populatePartInformation(j5Part);
        this.selectedPart = j5Part;
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

    onTabChange: function(tabPanel, newTab, oldTab) {
        if(newTab.model) {
            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onBinsUpdate, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);
            }

            this.activeProject = newTab.model;
            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onBinsUpdate, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            this.inspector = newTab.down("component[cls='InspectorPanel']");

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
        var columnsGrid = this.inspector.down("gridpanel");

        if(this.activeProject) {
            j5ReadyField.setValue(this.activeProject.getJ5Collection().get("j5Ready"));
            combinatorialField.setValue(this.activeProject.getJ5Collection().get("combinatorial"));

            if(this.activeProject.get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            columnsGrid.reconfigure(this.activeProject.getJ5Collection().bins());
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

            var sourceFile = j5Part.getSequenceFile();
            if(j5Part.getSequenceFile()) {
                sourceField.setValue(sourceFile.get("partSource"));
                revCompField.setValue(j5Part.get("revComp"));
            } else {
                sourceField.setValue("");
                revCompField.setValue("");
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
            }
        })
    },
});
