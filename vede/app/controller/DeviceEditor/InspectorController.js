/**
 * Controls the inspector panel, on the right side of the device editor.
 * @class Vede.controller.DeviceEditor.InspectorController
 */
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.DeviceEvent",
    "Vede.view.de.PartDefinitionDialog"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    activeProject: null,
    columnsGrid: null,
    eugeneRulesGrid: null,
    inspector: null,
    selectedPart: null,
    selectedBinIndex: null,
    tabPanel: null,

    findBinByPart:function(findingPart,cb){
        var foundBin = null;
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        var j5collection = tab.model.getDesign().getJ5Collection();
        j5collection.bins().each(function(bin,binKey){
            bin.parts().each(function(part){
                if(part.internalId===findingPart.internalId) foundBin = bin;
            });
        });
        return cb(foundBin);
    },

    /**
     * Handler for the Delete Part button. Destroys the selected part and all
     * the Eugene Rules that it is involved with.
     */
    onDeletePartBtnClick: function(){
        if(this.selectedPart) {
            var parentBin = this.DeviceDesignManager.getBinByPart(this.activeProject,
                                                                  this.selectedPart);
            var involvedRules = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                                               this.selectedPart);

            involvedRules.each(function(rule) {
                this.activeProject.rules().remove(rule);
                rule.destroy();
            }, this);

            if(parentBin) {
                parentBin.parts().remove(this.selectedPart);
            }

            this.clearPartInfo();
        }
    },

    checkCombinatorial:function(j5collection,cb){
        combinatorial = false;
        j5collection.bins().each(function(bin,binKey){
            if(bin.parts().getCount()>1) combinatorial = true;
        });
        return cb(combinatorial);
    },

    onCheckj5Ready: function(cb){
        /*
        non-combinatorial designs: each collection bin (column) must contain exactly one mapped part.
        combinatorial designs: each collection bin must contain at least one mapped part, and at least 
        one bin must contain more than one mapped part. No column should contained a non-mapped (but named) part.
        */
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        var j5collection = tab.model.getDesign().getJ5Collection();
        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        this.checkCombinatorial(j5collection,function(combinatorial){
            j5ready = true;
            j5collection.bins().each(function(bin,binKey){
                var firstPart = bin.parts().first();
                if(firstPart != undefined) {
                    if(firstPart.get('sequencefile_id') === "") {j5ready = false;}
                }
                else {j5ready = false;}
            });
            tab.query("component[cls='combinatorial_field']")[0].setValue(combinatorial);
            tab.query("component[cls='j5_ready_field']")[0].setValue(j5ready);

            if (j5ready ==  true) {
                    j5ReadyField.setFieldStyle("color:rgb(0, 219, 0)");
                } else {
                    j5ReadyField.setFieldStyle("color:red");
                }
            if (combinatorial == true) {
                    combinatorialField.setFieldStyle("color:purple");
                } else {
                    combinatorialField.setFieldStyle("color:rgb(0, 173, 255)");
                }

            if (typeof(cb) == "function") {cb(combinatorial,j5ready);}

        });
    },

    onChangePartDefinitionBtnClick: function(){
        var self = this;
        if(this.selectedPart) {
            this.selectedPart.getSequenceFile({
                callback: function(){
                    Vede.application.fireEvent("openChangePartDefinition",self.selectedPart,self.selectedBinIndex,self.selectedPart.getSequenceFile());
                }
            });
        }
    },

    /**
     * Handler for the Circular Plasmid radio button.
     */
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

    onopenPartLibraryBtnClick: function () {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());

        if(this.selectedPart) {
            // If the part is not owned by a bin yet, add it to the bin.
            if(this.DeviceDesignManager.getBinAssignment(this.activeProject,
                                                         this.selectedPart) < 0) {
                var added = this.DeviceDesignManager.addPartToBin(this.activeProject,
                                                      this.selectedPart,
                                                      this.selectedBinIndex);
                var selectedBinIndex = this.selectedBinIndex;
            }



            var self = this;

            var loadingMsgBox = Ext.MessageBox.show({
                title: 'Loading Part',
                progressText: 'Loading Part Library',
                progress: true,
                width: 300,
                renderTo: currentTabEl,
                closable: false
            });

            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("partLibrary", ''),
                method: 'GET',
                success: function (response) {

                loadingMsgBox.updateProgress(50 / 100, 50 + '% completed');

                response = JSON.parse(response.responseText);

             var partLibrary = Ext.create('Teselagen.store.PartStore', {
                 model: 'Teselagen.models.Part',
                 data:response,
                 proxy: {
                     type: 'memory',
                     reader: {
                         type: 'json',
                         root: 'parts'
                     }
                 },
                 autoLoad: true
             });

                var selectWindow = Ext.create('Ext.window.Window', {
                    title: 'Part Library',
                    height: 400,
                    width: 400,
                    layout: 'fit',
                    renderTo: currentTabEl,
                    closeAction: 'close',
                    modal: true,
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
                        store: partLibrary,
                        listeners: {
                            "itemclick": function(grid, part, item){
                                Vede.application.fireEvent("validateDuplicatedPartName",part,part.get('name'),function(){
                                    var bin = self.DeviceDesignManager.getBinByIndex(self.activeProject,self.selectedBinIndex);
                                    part.getSequenceFile({
                                        callback: function(sequence){
                                            if(bin)
                                            {
                                                var insertIndex = bin.parts().indexOf(self.selectedPart);
                                                // var binIndex = self.DeviceDesignManager.getBinIndex(self.activeProject,bin);
                                                bin.parts().removeAt(insertIndex);
                                                bin.parts().insert(insertIndex,part);
                                                self.onReRenderDECanvasEvent();
                                                selectWindow.close();
                                                self.selectedPart = part;
                                                self.onReRenderDECanvasEvent();
                                                Vede.application.fireEvent(self.DeviceEvent.MAP_PART, self.selectedPart);
                                            }
                                            else
                                            {
                                                Ext.MessageBox.alert('Error','Failed mapping part from library');
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }
                }).show();
                loadingMsgBox.close();
            //end ajax request
            }});
        }
    },

    onReRenderDECanvasEvent: function () {
        var tab = Ext.getCmp('mainAppPanel').getActiveTab();
        this.onTabChange(tab, tab, tab);
    },

    /**
     * Handles the event that a part is selected on the grid.
     * @param {Teselagen.models.Part} j5Part The part model that has been selected.
     * @param {Number} binIndex The index of the bin that owns the selected part.
     */
    onPartSelected: function (j5Part, binIndex) {

        this.selectedBinIndex = binIndex;
        this.inspector.setActiveTab(0);

        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
        var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
        var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
        var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
        var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
        var fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");
        var fasArray = [];

        openPartLibraryBtn.enable();
        openPartLibraryBtn.removeCls('btnDisabled');

        if(this.selectedBinIndex !== 0) {
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

        // If a j5Part exists for the selected part, load it. If not, create a
        // blank part and load it into the form.
        if(j5Part) {
            partPropertiesForm.loadRecord(j5Part);

            j5Part.getSequenceFile({
                callback: function(sequenceFile){
                    if(sequenceFile.get("partSource")!="") {
                        changePartDefinitionBtn.removeCls('btnDisabled');
                        openPartLibraryBtn.setText("Open Part Library");
                        openPartLibraryBtn.removeCls('selectPartFocus');
                        changePartDefinitionBtn.enable();
                        partPropertiesForm.loadRecord(sequenceFile);     
                        deletePartBtn.enable();
                        deletePartBtn.removeCls('btnDisabled');
                        clearPartMenuItem.enable();
                    } else {
                        changePartDefinitionBtn.disable();
                        openPartLibraryBtn.setText("Select Part From Library");
                        openPartLibraryBtn.addCls('selectPartFocus');
                        changePartDefinitionBtn.addCls('btnDisabled');     
                        deletePartBtn.enable();
                        clearPartMenuItem.enable();
                        deletePartBtn.removeCls('btnDisabled');
                    }
                }
            });

            if(j5Part.get("fas") === "") {
                fasForm.down("combobox").setValue("None");
            } else {
                fasForm.loadRecord(j5Part);
            }
            this.selectedPart = j5Part;
        } else {
            var newPart = Ext.create("Teselagen.models.Part");
            partPropertiesForm.loadRecord(newPart);

            if(newPart.get("fas") === "") {
                fasForm.down("combobox").setValue("None");
            } else {
                fasForm.loadRecord(newPart);
            }
            
            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls('btnDisabled');
            deletePartBtn.disable();
            clearPartMenuItem.disable();
            deletePartBtn.addCls('btnDisabled');
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.addCls('selectPartFocus');

            this.selectedPart = newPart;

        }

        var rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                                        this.selectedPart);

        this.eugeneRulesGrid.reconfigure(rulesStore);

        Ext.getCmp('mainAppPanel').getActiveTab().down('InspectorPanel').expand();
    },

    /**
     * Clears all the fields in the Part Info tab. Used when a part is deleted.
     */
    clearPartInfo: function() {
        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
        var fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");

        partPropertiesForm.getForm().reset();
        fasForm.getForm().reset();

        //this.eugeneRulesGrid.reconfigure();
    },

    /**
     * Handles the event that a bin is selected on the grid.
     * @param {Teselagen.models.J5Bin} j5Bin The selected bin.
     */
    onBinSelected: function (j5Bin) {
        var selectionModel = this.columnsGrid.getSelectionModel();
        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];

        this.inspector.setActiveTab(1);

        //console.log(selectedPart);
        selectionModel.select(j5Bin);

        this.updateColumnContentDisplayField(j5Bin);
    },

    /**
     * Updates the Column Contents field of a given bin model.
     * @param {Teselagen.models.J5Bin} j5Bin The bin model to update info for.
     */
    updateColumnContentDisplayField: function(j5Bin) {
        var contentField = this.inspector.down("displayfield[cls='columnContentDisplayField']");
        var contentArray = [];

        j5Bin.parts().each(function (part) {
            contentArray.push(part.get("name"));
            contentArray.push(": ");
            contentArray.push(part.get("fas"));
            contentArray.push("<br>");
        });

        contentField.setValue(contentArray.join(""));
    },

    /**
     * Handles the event that the Part Name field changes. Checks to see if the
     * part is already owned by a bin. If not, this is a new part, so we have to
     * add the part to the design.
     * @param {Ext.form.field.Text} nameField The Part Name textfield.
     */
    onPartNameFieldChange: function (nameField) {
        var newName = nameField.getValue();
        var self = this;
        Vede.application.fireEvent("validateDuplicatedPartName",this.selectedPart,newName,function(){
            self.selectedPart.set("name", newName);

            if(self.DeviceDesignManager.getBinAssignment(self.activeProject,
                                                         self.selectedPart) < 0) {
                self.DeviceDesignManager.addPartToBin(self.activeProject,
                                                      self.selectedPart,
                                                      self.selectedBinIndex);
            }
        });
    },

    /**
     * Handles the event that a part's assembly strategy combobox changes value.
     * @param {Ext.form.field.Combobox} box The FAS combobox.
     */
    onPartAssemblyStrategyChange: function (box) {
        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];
        var newStrategy = box.getValue();

        this.selectedPart.set("fas", newStrategy);  
        this.columnsGrid.getView().refresh();

        Vede.application.fireEvent(this.DeviceEvent.MAP_PART, this.selectedPart);
    },

    /**
     * Handles the event that the design's geometry radio button changes.
     * @param {Ext.form.RadioGroup} radioGroup The radio button group.
     * @param {Boolean} newValue Whether the plasmid is now circular.
     */
    onPlasmidGeometryChange: function (radioGroup, newValue) {
        this.activeProject.set("isCircular", newValue);
    },

    /**
     * Handler for the Add Column button. Calls on the DeviceDesignManager to 
     * add a new empty bin to the design.
     */
    onAddColumnButtonClick: function () {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];

        if(selectedBin) {
            var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin); 
            this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, selectedBinIndex);
            this.columnsGrid.getSelectionModel().deselectAll();
        } else {
            this.application.fireEvent(this.DeviceEvent.ADD_COLUMN);
        }
    },

    /**
     * Handler for the Remove Column button. Deletes the selected bin. If no bin
     * is selected, removes the last bin in the design.
     */
    onRemoveColumnButtonClick: function () {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];
        var removeColumnMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");
        
        if(selectedBin) {
            var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);
            this.activeProject.getJ5Collection().deleteBinByIndex(selectedBinIndex);
        } else {
            this.activeProject.getJ5Collection().deleteBinByIndex(
            this.activeProject.getJ5Collection().binCount() - 1);
        }

        removeColumnMenuItem.disable();
    },

    reconfigureEugeneRules: function() {
        this.eugeneRulesGrid.reconfigure();
    },

    /**
     * Handler for the Add Eugene Rule button. Brings up the Eugene Rule Dialog
     * and loads data into its fields.
     */
    onAddEugeneRuleBtnClick: function() {
        if(this.selectedPart) {
            var newEugeneRuleDialog = Ext.create("Vede.view.de.EugeneRuleDialog");
            var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                compositionalOperator: Teselagen.constants.Constants.COMPOP_LIST[0]
            });
            var ruleForm = newEugeneRuleDialog.down("form");
            var operand2Field = ruleForm.down("combobox[cls='operand2PartField']");

            var allParts = this.DeviceDesignManager.getAllParts(
                                this.activeProject, this.selectedPart);
            var partsStore = [];
            Ext.each(allParts, function(part) {
                partsStore = partsStore.concat([part.get("name")]);
            });

            var self = this;
            this.selectedPart.save({
                callback: function(){
                    newEugeneRule.setOperand1(self.selectedPart);

                    newEugeneRuleDialog.show();

                    ruleForm.loadRecord(newEugeneRule);
                    ruleForm.down("displayfield[cls='operand1Field']").setValue(
                                                self.selectedPart.get("name"));

                    operand2Field.bindStore(partsStore);
                    operand2Field.setValue(partsStore[0]);
                }
            });

        }
    },

    /**
     * Handler for the Delete Eugene Rule button. Brings up a confirmation
     * window, and then deletes the selected rule.
     */
    onDeleteEugeneRuleBtnClick: function() {
        if(this.eugeneRulesGrid.getSelectionModel().getSelection().length > 0) {
            var selectedRule = this.eugeneRulesGrid.getSelectionModel().getSelection()[0];

            Ext.Msg.confirm("Delete Rule", "Are you sure you want to delete this Eugene rule?", function(button) {
                if(button === "yes") {
                    this.activeProject.rules().clearFilter();
                    this.activeProject.rules().remove(selectedRule);
                    selectedRule.destroy();
                }
            }, this);
        }
    },

    /**
     * Handler for the confirmation button in the Eugene Rule Dialog. Saves
     * the new Eugene Rule and adds it to the design's store of rules.
     */
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

        var newOperand2;
        var newOperand2Name;
        if(newCompositionalOperator === Teselagen.constants.Constants.MORETHAN) {
            var newOperand2 = 
                newEugeneRuleDialog.down("numberfield[cls='operand2NumberField']").getValue();
        } else {
            newOperand2Name =
                newEugeneRuleDialog.down("component[cls='operand2PartField']").getValue();

            newOperand2 = this.DeviceDesignManager.getPartByName(this.activeProject, 
                                                                 newOperand2Name);
        }

        newRule.set("name", newName);
        newRule.set("negationOperator", newNegationOperator);
        newRule.set("compositionalOperator", newCompositionalOperator);
        var self = this;
        newOperand2.save({
            callback: function(){
                newRule.setOperand2(newOperand2);                

                self.activeProject.addToRules(newRule);

                var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject,
                                                                                self.selectedPart)

                self.eugeneRulesGrid.reconfigure(rulesStore);

                newEugeneRuleDialog.close();
            }
        });
    },

    /**
     * Handler for the Eugene Rule Dialog cancel button.
     */
    onCancelNewEugeneRuleBtnClick: function() {
        var newEugeneRuleDialog = 
            Ext.ComponentQuery.query("component[cls='addEugeneRuleDialog']")[0];
        var newRule = newEugeneRuleDialog.down("form").getForm().getRecord();

        newEugeneRuleDialog.close();
        newRule.destroy();
    },

    /**
     * Handler for the Eugene Rule Dialog compositional operator combobox.
     * Ensures that the operator 2 field is the appropriate type of input field
     * (numeric for the MORETHAN operator, combobox for all others).
     * @param {Ext.form.field.ComboBox} box The compositional operator combobox.
     */
    onCompositionalOperatorSelect: function(box) {
        var operator = box.getValue();
        var ruleDialog = 
            Ext.ComponentQuery.query("component[cls='addEugeneRuleDialog']")[0];

        if(operator === Teselagen.constants.Constants.MORETHAN) {
            ruleDialog.down("combobox[cls='operand2PartField']").setVisible(false);
            ruleDialog.down("numberfield[cls='operand2NumberField']").setVisible(true);
        } else {
            ruleDialog.down("combobox[cls='operand2PartField']").setVisible(true);
            ruleDialog.down("numberfield[cls='operand2NumberField']").setVisible(false);
        }
    },

    /**
     * Handles the event that a bin is selected in the Inspector.
     */
    onGridBinSelect: function (grid, j5Bin, selectedIndex) {
        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
            var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
            var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
            var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
            var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
            var removeColumnMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");

            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls('btnDisabled');
            deletePartBtn.disable();
            clearPartMenuItem.disable();
            deletePartBtn.addCls('btnDisabled');
            openPartLibraryBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.removeCls('selectPartFocus');
            openPartLibraryBtn.addCls('btnDisabled');

            removeColumnMenuItem.enable();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    /**
     * When we switch to a new tab, switch the current active project to the one
     * associated with the new tab, and reset event handlers so they refer to the
     * new grid and j5 bins.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     * @param {Ext.Component} oldTab The tab that is being switched from.
     */
    onTabChange: function (tabPanel, newTab, oldTab) {
        if(newTab.initialCls == "DeviceEditorTab") { // It is a DE tab

            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);

                // Unset listeners for the parts store of each bin.
                this.activeBins.each(function (bin) {
                    var parts = bin.parts();

                    parts.un("add", this.onAddToParts, this);
                    parts.un("update", this.onUpdateParts, this);
                    parts.un("remove", this.onRemoveFromParts, this);
                }, this);
            }

            var self = this;
            this.activeProject = newTab.model.getDesign();

            this.activeBins = this.activeProject.getJ5Collection().bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            // Add listeners to each bin's parts store.
            this.activeBins.each(function (bin) {
                var parts = bin.parts();

                parts.on("add", this.onAddToParts, this);
                parts.on("update", this.onUpdateParts, this);
                parts.on("remove", this.onRemoveFromParts, this);
            }, this);

            this.inspector = newTab.down("component[cls='InspectorPanel']");

            if(this.columnsGrid) {
                this.columnsGrid.un("select", this.onGridBinSelect, this);
            }

            this.columnsGrid = this.inspector.down(
                                "form[cls='collectionInfoForm'] > gridpanel");
            this.columnsGrid.on("select", this.onGridBinSelect, this);

            this.eugeneRulesGrid = this.inspector.down("form[cls='eugeneRulesForm'] > gridpanel");

            this.renderCollectionInfo();
            this.inspector.setActiveTab(1);

            var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
            var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
            var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
            var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");

            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls('btnDisabled');
            deletePartBtn.disable();
            deletePartBtn.addCls('btnDisabled');
            openPartLibraryBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.removeCls('selectPartFocus');
            openPartLibraryBtn.addCls('btnDisabled');
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
    onAddToBins: function (activeBins, addedBins, index) {
        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];

        // Add event listeners to the parts store of this bin.
        Ext.each(addedBins, function (j5Bin) {
            parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onUpdateParts, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);

        this.columnsGrid.getSelectionModel().deselect(selectedPart);

        // Remove the highlighting from the selected row- it appears that a bug
        // is preventing this from happening automatically.
        this.columnsGrid.getView().removeRowCls(selectedPart,
                                    this.columnsGrid.getView().selectedItemCls);
        this.columnsGrid.getView().removeRowCls(selectedPart,
                                    this.columnsGrid.getView().focusedItemCls);


        this.renderCollectionInfo();
    },

    /**
     * Handles the deletion of a bin. Simply rerenders the collection info.
     * @param {Ext.data.Store} activeBins The current device design's store of
     * bins.
     * @param {Teselagen.models.J5Bin} removedBin The bin that was removed.
     * @param {Number} index The index of the removed bin.
     */
    onRemoveFromBins: function (activeBins, removedBin, index) {
        this.renderCollectionInfo();
    },

    /**
     * Handles the event that one or more parts are added to any bin.
     * @param {Ext.data.Store} parts The parts store of the bin which has been
     * added to.
     * @param {Teselagen.model.Part[]} addedParts An array of all the parts that 
     * have been added.
     * @param {Number} index The index where the parts were added.
     */
    onAddToParts: function (parts, addedParts, index) {
        this.columnsGrid.getView().refresh();
        this.renderCollectionInfo();
    },

    /**
     * Handles the event where a part has been changed directly. 
     * @param {Ext.data.Store} parts The parts store of the bin which owns the
     * modified part.
     * @param {Teselagen.models.Part} updatedPart The part that has been updated.
     * @param {String} operation The type of update that occurred.
     * @param {String} modified The name of the field that was edited.
     */
    onUpdateParts: function(parts, updatedPart, operation, modified) {
        if(modified)
        {
            if(modified.indexOf("name") > -1 || modified.indexOf("fas") > -1) {
                var parentBin = this.DeviceDesignManager.getBinByPart(this.activeProject,
                                                                      updatedPart);

                this.updateColumnContentDisplayField(parentBin);
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
    onRemoveFromParts: function (parts, removedPart, index) {
        try {
            this.columnsGrid.getView().refresh();
            this.renderCollectionInfo();
            //this.clearPartInfo();
        } catch(err)
        {
            console.log("Failed removing part from bin.");
            console.log(err);
        }
    },

    onReRenderCollectionInfoEvent: function() {
        this.renderCollectionInfo();
    },

    /**
     * Fills in the Collection Info tab's various fields.
     */
    renderCollectionInfo: function () {
        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        var circularPlasmidField = this.inspector.down("radiofield[cls='circular_plasmid_radio']");
        var linearPlasmidField = this.inspector.down("radiofield[cls='linear_plasmid_radio']");

        if(this.activeProject) {
            j5ReadyField.setValue(this.DeviceDesignManager.checkJ5Ready(
                                                            this.activeProject));

             if (this.DeviceDesignManager.checkJ5Ready(this.activeProject)) {
                    j5ReadyField.setFieldStyle("color:rgb(0, 219, 0)");
                } else {
                    j5ReadyField.setFieldStyle("color:red");
                }

            combinatorialField.setValue(this.DeviceDesignManager.setCombinatorial(
                                                            this.activeProject));

            if (this.DeviceDesignManager.setCombinatorial(this.activeProject) == true) {
                    combinatorialField.setFieldStyle("color:purple");
                } else {
                    combinatorialField.setFieldStyle("color:rgb(0, 173, 255)");
                }

            if(this.activeProject.getJ5Collection().get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            this.columnsGrid.reconfigure(this.activeProject.getJ5Collection().bins());

            var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];

            if(selectedBin) {
                this.updateColumnContentDisplayField(selectedBin);
            }
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

        this.application.on("OpenPartLibrary", this.onopenPartLibraryBtnClick, this);

        this.application.on("checkj5Ready", this.onCheckj5Ready, this);

        this.application.on("partSelected", this.onPartSelected, this);

        this.application.on("ClearPart", this.onDeletePartBtnClick, this);

        this.application.on("RemoveColumn", this.onRemoveColumnButtonClick, this);

        this.application.on("ReRenderCollectionInfo", this.onReRenderCollectionInfoEvent, this);

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
            "button[cls='openPartLibraryBtn']": {
                click: this.onopenPartLibraryBtnClick
            },
            "button[cls='deletePartBtn']": {
                click: this.onDeletePartBtnClick
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
            "combobox[cls='compositionalOperatorCombobox']": {
                select: this.onCompositionalOperatorSelect
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
