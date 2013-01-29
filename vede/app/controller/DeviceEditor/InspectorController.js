/**
 * Controls the inspector panel, on the right side of the device editor.
 * @class Vede.controller.DeviceEditor.InspectorController
 */
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
    "Vede.view.de.ChangePartDefinitionPanel"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    activeProject: null,
    columnsGrid: null,
    eugeneRulesGrid: null,
    inspector: null,
    selectedPart: null,
    selectedBinIndex: null,
    tabPanel: null,

    onChangePartDefinitionBtnClick: function(){
        var self = this;
        this.selectedPart.getSequenceFile({
            callback: function(){
                Vede.application.fireEvent("openChangePartDefinition",self.selectedPart,self.selectedBinIndex,self.selectedPart.getSequenceFile());
            }
        });
    },

    onCircularPlasmidRadioChange: function(radio){
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        tab.model.getDesign().getJ5Collection().set('isCircular',radio.getValue());
    },

    onEmptySequenceBtnClick: function(){
        var selectedPart = this.selectedPart;

        console.log("Creating empty sequence");
        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: "Genbank",
            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
            sequenceFileName: "untitled.gb",
            partSource: "New Part"
        });
        
        newSequenceFile.save({
            callback: function(){
                selectedPart.setSequenceFileModel(newSequenceFile);
                selectedPart.save({
                    callback: function(){
                        console.log(selectedPart);
                    }
                });
            }
        });
    },

    onChangeSequenceBtnClick: function () {
        console.log("changing part");

        var self = this;
        var selectWindow = Ext.create('Ext.window.Window', {
            title: 'Select sequence from Library',
            height: 200,
            width: 400,
            layout: 'fit',
            items: {
                xtype: 'grid',
                border: false,
                columns: {
                    items: {
                        text: "Name",
                        dataIndex: "name"
                    },
                    defaults: {
                        flex: 1
                    }
                },
                store: Teselagen.manager.ProjectManager.sequenceStore,
                listeners: {
                    "itemclick": function(grid, record, item){
                        console.log(record);
                        var veproject = record;
                        var sequence = record.getSequenceFile({
                            callback: function(){
                                sequence = record.getSequenceFile();
                                var sequencefile_id = sequence.data.id;
                                self.selectedPart.setSequenceFileModel(sequence);
                                self.selectedPart.set('sequencefile_id',sequencefile_id);

                                self.selectedPart.save({
                                    callback: function(){
                                        console.log("Part updated");
                                        selectWindow.close();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }).show();

    },

    onReRenderDECanvasEvent: function () {
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.onTabChange(tab, tab, tab);
    },

    // When a Part is selected
    onPartSelected: function (j5Part, binIndex) {

        this.selectedBinIndex = binIndex;
        this.inspector.setActiveTab(0);

        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
        var fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");

        this.eugeneRulesGrid = this.inspector.down("form[cls='eugeneRulesForm'] > gridpanel")

        // If a j5Part exists for the selected part, load it. If not, create a
        // blank part and load it into the form.
        if(j5Part) {
            partPropertiesForm.loadRecord(j5Part);

            if(j5Part.get("fas") === "") {
                fasForm.down("combobox").setValue("None");
            } else {
                fasForm.loadRecord(j5Part);
            }
            this.selectedPart = j5Part;
        } else {
            var newPart = this.DeviceDesignManager.createPart(this.activeProject, binIndex);
            partPropertiesForm.loadRecord(newPart);

            if(newPart.get("fas") === "") {
                fasForm.down("combobox").setValue("None");
            } else {
                fasForm.loadRecord(newPart);
            }

            this.selectedPart = newPart;
        }
        
        var rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                                        this.selectedPart)

        this.eugeneRulesGrid.reconfigure(rulesStore);

        Ext.getCmp('mainAppPanel').getActiveTab().down('InspectorPanel').expand();
    },

    onBinSelected: function (j5Bin) {
        var selectionModel = this.columnsGrid.getSelectionModel();
        var contentField = this.inspector.down("displayfield[cls='columnContentDisplayField']");
        var contentArray = [];

        this.inspector.setActiveTab(1);

        selectionModel.select(j5Bin);

        j5Bin.parts().each(function (part) {
            contentArray.push(part.get("name"));
            contentArray.push("<br>");
        });

        contentField.setValue(contentArray.join(""));
    },

    onPartNameFieldChange: function (nameField) {
        var newName = nameField.getValue();

        this.selectedPart.set("name", newName);
    },

    onPartAssemblyStrategyChange: function (box) {
        var newStrategy = box.getValue();

        this.selectedPart.set("fas", newStrategy);

        this.columnsGrid.getView().refresh();
    },

    onPlasmidGeometryChange: function (radioGroup, newValue) {
        this.activeProject.set("isCircular", newValue);
    },

    onAddColumnButtonClick: function () {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];
        var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);

        this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, selectedBinIndex);
    },

    onRemoveColumnButtonClick: function () {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];

        if(selectedBin) {
            var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);

            this.activeProject.getJ5Collection().deleteBinByIndex(selectedBinIndex);
        } else {
            this.activeProject.getJ5Collection().deleteBinByIndex(
            this.activeProject.getJ5Collection().binCount() - 1);
        }
    },

    onAddEugeneRuleBtnClick: function() {
        var newEugeneRuleDialog = Ext.create("Vede.view.de.EugeneRuleDialog");
        var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
            compositionalOperator: Teselagen.constants.Constants.COMPOP_LIST[0]
        });
        var ruleForm = newEugeneRuleDialog.down("form");
        var operand2Field = ruleForm.down("combobox[cls='operand2Field']");

        var allParts = this.DeviceDesignManager.getAllParts(
                            this.activeProject, this.selectedPart);
        var partsStore = [];
        Ext.each(allParts, function(part) {
            partsStore = partsStore.concat([part.get("name")]);
        });

        newEugeneRule.setOperand1(this.selectedPart);

        newEugeneRuleDialog.show();

        ruleForm.loadRecord(newEugeneRule);
        ruleForm.down("displayfield[cls='operand1Field']").setValue(
                                    this.selectedPart.get("name"));

        operand2Field.bindStore(partsStore); 
        operand2Field.setValue(partsStore[0]);
    },

    onDeleteEugeneRuleBtnClick: function() {
        var selectedRule = this.eugeneRulesGrid.getSelectionModel().getSelection()[0];
        selectedRule.destroy();
    },

    onSubmitNewEugeneRuleBtnClick: function() {
        var newEugeneRuleDialog = 
            Ext.ComponentQuery.query("component[cls='addEugeneRuleDialog']")[0];
        var newRule = newEugeneRuleDialog.down("form").getForm().getRecord();

        var newName = 
            newEugeneRuleDialog.down("textfield[name='name']").getValue();
        var newNegationOperator = 
            newEugeneRuleDialog.down("checkbox[cls='negationOperatorField']").getValue();
        var newCompositionalOperator = 
            newEugeneRuleDialog.down("combobox[name='compositionalOperator']").getValue();
        var newOperand2 =
            newEugeneRuleDialog.down("component[cls='operand2Field']").getValue();

        newRule.set("name", newName);
        newRule.set("negationOperator", newNegationOperator);
        newRule.set("compositionalOperator", newCompositionalOperator);
        newRule.setOperand2(this.DeviceDesignManager.getPartByName(this.activeProject, 
                                                                   newOperand2));
        this.activeProject.addToRules(newRule);

        var rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                                        this.selectedPart)

        this.eugeneRulesGrid.reconfigure(rulesStore);

        newEugeneRuleDialog.close();
    },

    onCancelNewEugeneRuleBtnClick: function() {
        var newEugeneRuleDialog = 
            Ext.ComponentQuery.query("component[cls='addEugeneRuleDialog']")[0];
        var newRule = newEugeneRuleDialog.down("form").getForm().getRecord();

        newEugeneRuleDialog.close();
        newRule.destroy();
    },

    onGridBinSelect: function (grid, j5Bin, selectedIndex) {
        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    onInspectorGridRender: function (grid) {
        console.log("render");
    },

    /**
     * When we switch to a new tab, switch the current active project to the one
     * associated with the new tab, and reset event handlers so they refer to the
     * new grid and j5 bins.
     */
    onTabChange: function (tabPanel, newTab, oldTab) {
        if(newTab.initialCls == "DeviceEditorTab") { // It is a DE tab
            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("update", this.onBinsUpdate, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);

                // Unset listeners for the parts store of each bin.
                this.activeBins.each(function (bin) {
                    var parts = bin.parts();

                    parts.un("add", this.onAddToParts, this);
                    parts.un("remove", this.onRemoveFromParts, this);
                }, this);
            }

            var self = this;
            this.activeProject = newTab.model.getDesign();

            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("update", this.onBinsUpdate, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            // Add listeners to each bin's parts store.
            this.activeBins.each(function (bin) {
                var parts = bin.parts();

                parts.on("add", this.onAddToParts, this);
                parts.on("remove", this.onRemoveFromParts, this);
            }, this);

            this.inspector = newTab.down("component[cls='InspectorPanel']");

            if(this.columnsGrid) {
                this.columnsGrid.un("select", this.onGridBinSelect, this);
            }

            this.columnsGrid = this.inspector.down(
                                "form[cls='collectionInfoForm'] > gridpanel");
            this.columnsGrid.on("select", this.onGridBinSelect, this);

            this.renderCollectionInfo();
        }
    },

    onAddToBins: function (activeBins, addedBins, index) {
        // Add event listeners to the parts store of this bin.
        Ext.each(addedBins, function (j5Bin) {
            parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);

        this.renderCollectionInfo();
    },

    onBinsUpdate: function (activeBins, updatedBin, operation, modified) {},

    onRemoveFromBins: function (activeBins, removedBin, index) {
        this.renderCollectionInfo();
    },

    onAddToParts: function (parts, addedParts, index) {
        this.columnsGrid.getView().refresh();
        this.renderCollectionInfo();
    },

    onRemoveFromParts: function (parts, removedPart, index) {
        this.columnsGrid.getView().refresh();
        this.renderCollectionInfo();
    },

    renderCollectionInfo: function () {
        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        var circularPlasmidField = this.inspector.down("radiofield[cls='circular_plasmid_radio']");
        var linearPlasmidField = this.inspector.down("radiofield[cls='linear_plasmid_radio']");

        if(this.activeProject) {
            j5ReadyField.setValue(this.DeviceDesignManager.checkJ5Ready(
                                                            this.activeProject));
            combinatorialField.setValue(this.DeviceDesignManager.setCombinatorial(
                                                            this.activeProject));

            if(this.activeProject.getJ5Collection().get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            this.columnsGrid.reconfigure(this.activeProject.getJ5Collection().bins());
        }
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    init: function () {
        this.callParent();

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;

        this.application.on(this.DeviceEvent.SELECT_PART, this.onPartSelected, this);

        this.application.on(this.DeviceEvent.SELECT_BIN, this.onBinSelected, this);

        this.application.on("ReRenderDECanvas", this.onReRenderDECanvasEvent, this);

        this.application.on("partSelected",
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
            },
            "button[cls='changeSequenceBtn']": {
                click: this.onChangeSequenceBtnClick
            },
            "button[cls='emptySequenceBtn']": {
                click: this.onEmptySequenceBtnClick
            },
            "button[cls='addEugeneRuleBtn']": {
                click: this.onAddEugeneRuleBtnClick
            },
            "button[cls='deleteEugeneRuleBtn']": {
                click: this.onDeleteEugeneRuleBtnClick
            },
            "button[cls='submitNewEugeneRuleBtn']": {
                click: this.onSubmitNewEugeneRuleBtnClick
            },
            "button[cls='cancelNewEugeneRuleBtn']": {
                click: this.onCancelNewEugeneRuleBtnClick
            },
            "radio[cls='circular_plasmid_radio']": {
                change: this.onCircularPlasmidRadioChange
            },
            "button[cls='changePartDefinitionBtn']": {
                click: this.onChangePartDefinitionBtnClick
            },
        });
    }
});
