/**
 * Controls the inspector panel, on the right side of the device editor.
 * @class Vede.controller.DeviceEditor.InspectorController
 */
/*global toastr*/
Ext.define("Vede.controller.DeviceEditor.InspectorController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.CommonEvent",
               "Teselagen.event.DeviceEvent",
               "Teselagen.models.EugeneRule",
               "Vede.view.de.PartDefinitionDialog",
               "Vede.view.de.DeviceEditorPartLibrary",
               "Ext.layout.container.Border"],

    DeviceDesignManager: null,
    DeviceEvent: null,
    Logger: null,

    activeProject: null,
    columnsGrid: null,
    eugeneRulesGrid: null,
    inspector: null,
    selectedBin: null,
    selectedPart: null,
    selectedBinIndex: null,
    selectedPartIndex: null,
    tabPanel: null,
    partLibraryWindow: null,

    findBinByPart:function(findingPart,cb){
        var foundBin = null;
        var deviceDesign = this.activeProject;

        deviceDesign.model.bins().each(function(bin){
            bin.cells().each(function(cell){
                var part = cell.getPart();
                if(part && part.internalId === findingPart.internalId) {
                    foundBin = bin;
                }
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
            this.application.fireEvent(this.DeviceEvent.CLEAR_PART);
        }
    },

    /**
     * Handler for the CLEAR_PART event. Just clears part info- most logic for
     * this event is handled in the grid controller, since it knows enough to
     * delete the part from the correct bin.
     */
    onClearPart: function() {
        var newPart = Ext.create("Teselagen.models.Part");

        this.clearPartInfo();
        this.selectedPart = null;

        this.partPropertiesForm.loadRecord(newPart);
        // toastr.options.onclick = null;




        // toastr.info("Part Cleared");
        this.application.fireEvent(this.DeviceEvent.CHECK_J5_READY);
    },

    checkCombinatorial:function(deviceDesign,cb){
        var tmpC = 0;
        var bins = deviceDesign.bins().getRange();
        var partsLength;

        for(var i = 0; i < bins.length; i++) {
            cells = bins[i].cells().getRange();

            var partsLength = 0;
            for(var k = 0; k < cells.length; k++) {
                if(cells[k].getPart()) {
                    partsLength += 1;

                    if(partsLength > 1) {
                        return cb(true);
                    }
                }
            }
        }

        return cb(false);
    },

    isj5Ready: function() {
        var bins = this.activeProject.bins().getRange();
        var cells;
        var part;

        for(var i = 0; i < bins.length; i++) {
            var emptyCnt = 0;
            cells = bins[i].cells().getRange();

            for(var j = 0; j < cells.length; j++) {
                part = cells[j].getPart();

                if(part && !part.isMapped()) {
                    return false;
                }

                if(!part) {
                    emptyCnt++;
                }
            }
            if (emptyCnt==cells.length) {
                return false;
            }
        }
        
        return true;
    },
    
    onCheckj5Ready: function(cb,notChangeMethod){
        /*
        non-combinatorial designs: each collection bin (column) must contain exactly one mapped part.
        combinatorial designs: each collection bin must contain at least one mapped part, and at least
        one bin must contain more than one mapped part. No column should contained a non-mapped (but named) part.
        */
        var tab = this.activeTab;
        var deviceDesign = tab.model;
        var inspector = this.inspector;
        var self = this;

        this.checkCombinatorial(deviceDesign, function(combinatorial){
            var j5ready = self.isj5Ready();

            if( !notChangeMethod ) {Vede.application.fireEvent(self.CommonEvent.LOAD_ASSEMBLY_METHODS, combinatorial);}

            self.combinatorialField.inputEl.setHTML(combinatorial);
            self.j5ReadyField.inputEl.setHTML(j5ready);
            if (j5ready) {
                    self.j5ReadyField.setFieldStyle("color:rgb(0, 219, 0)");

                    self.runj5Btn1.enable();
                    self.runj5Btn1.removeCls("btnDisabled");

                    // self.runj5Btn2.enable();
                    // self.runj5Btn2.removeCls("btnDisabled");

                    inspector.down("panel[cls='j5InfoTab']").setDisabled(false);
                } else {
                    self.j5ReadyField.setFieldStyle("color:red");

                    self.runj5Btn1.disable();
                    self.runj5Btn1.addCls("btnDisabled");

                    // self.runj5Btn2.disable();
                    // self.runj5Btn2.addCls("btnDisabled");

                    inspector.down("panel[cls='j5InfoTab']").setDisabled(true);
                }
            if (combinatorial) {
                    self.combinatorialField.setFieldStyle("color:purple");
                } else {
                    self.combinatorialField.setFieldStyle("color:rgb(0, 173, 255)");
                }

            if (typeof(cb) === "function") {cb(combinatorial,j5ready);}
        });
    },

    onChangePartDefinitionBtnClick: function(){
        var self = this;
        if(this.selectedPart) {
            if(this.selectedPart.getSequenceFile()) {
                this.selectedPart.getSequenceFile({
                    callback: function(){
                        Vede.application.fireEvent(self.DeviceEvent.OPEN_CHANGE_PART_DEFINITION,
                                self.selectedPart, self.selectedBinIndex, self.selectedPart.getSequenceFile());
                    }
                });
            } else {
                //There is a named empty grid cell
                Vede.application.fireEvent(this.DeviceEvent.CREATE_PART_IN_DESIGN,null,this.selectedPart);
            }
        } else {
            //There is an empty grid cell
            var newPart = Ext.create('Teselagen.models.Part');
            self.selectedCell.setPart(newPart);
            Vede.application.fireEvent(this.DeviceEvent.CREATE_PART_IN_DESIGN,null,newPart);
        }
    },

    /**
     * Handler for the Circular Plasmid radio button.
     */
    onCircularPlasmidRadioChange: function(radio){
        var tab = this.activeTab;
        tab.model.set("isCircular", radio.getValue());
    },

    onEmptySequenceBtnClick: function(){
        var selectedPart = this.selectedPart;

        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: "Genbank",
            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
            sequenceFileName: "untitled.gb",
            partSource: "New Part"
        });
        
        newSequenceFile.save({
            callback: function(){
                selectedPart.setSequenceFile(newSequenceFile);
                selectedPart.save({
                    callback: function(){

                    }
                });
            }
        });
    },
    
    onOpenPartLibraryBtnClick: function () {
    	Vede.application.fireEvent(Teselagen.event.DeviceEvent.OPEN_PART_LIBRARY);
    },
    
    
    onOpenPartLibrary: function () {
        var currentTab = this.activeTab;
        var currentTabEl = (currentTab.getEl());

        if(this.selectedCell) {
            Teselagen.manager.ProjectManager.parts.clearFilter();
	        Teselagen.manager.ProjectManager.currentUser.parts().load(function (parts, operation, success){
                currentTabEl.mask();
                var self = this;

                self.partLibraryWindow = Ext.create("Vede.view.de.DeviceEditorPartLibrary", {renderTo: currentTabEl}).show();
                self.partLibraryWindow.down("gridpanel[name='deviceEditorPartLibraryGrid']").reconfigure(Teselagen.manager.ProjectManager.parts);
                self.partLibraryWindow.down('pagingtoolbar').bind(Teselagen.manager.ProjectManager.parts);

                self.partLibraryWindow.down('pagingtoolbar').doRefresh();
            });
        }
    },

    onReRenderDECanvasEvent: function (silent) {
        if(!silent) {
	    	var tab = this.activeTab;
	        this.onTabChange(tab, tab, tab);
        }
    },

    /**
     * Handles the event that a cell is selected on the grid.
     * @param {Teselagen.models.Cell} cell The cell model that has been selected.
     */
    onCellSelected: function(cell, xIndex, yIndex) {
        this.selectedCell = cell;

        if(cell.getPart()) {
            var part = cell.getPart();
            this.onPartSelected(part, this.DeviceDesignManager.getCellBinAssignment(this.activeProject, cell));
        } else {
            this.selectedPart = null;
            this.onPartSelected(null, this.DeviceDesignManager.getCellBinAssignment(this.activeProject, cell));
        }
    },

    /**
     * Handles the event that a part is selected on the grid.
     * @param {Teselagen.models.Part} j5Part The part model that has been selected.
     * @param {Number} binIndex The index of the bin that owns the selected part.
     */
    onPartSelected: function (j5Part, binIndex) {
    	
    	this.inspector.setActiveTab(0);
    	
    	this.inspector.suspendLayouts(false);
    	
    	this.selectedBinIndex = binIndex;
        
        this.columnsGrid.getSelectionModel().select(binIndex, false, true);

        var fasArray = [];
        var self = this;
        var fasBox = this.fasForm.down("combobox");

        this.openPartLibraryBtn.enable();
        this.openPartLibraryBtn.removeCls("btnDisabled");

        this.removeRowMenuItem.enable();
        
        if(this.selectedBinIndex !== 0) {
            // Turn the FAS_LIST array into an array of arrays, as required by
            // the store's loadData function.
            Ext.each(Teselagen.constants.Constants.FAS_LIST_NO_DIGEST, function(fas) {
                fasArray.push([fas]);
            });

            fasBox.store.loadData(fasArray);
        } else {
            Ext.each(Teselagen.constants.Constants.FAS_LIST, function(fas) {
                fasArray.push([fas]);
            });

            fasBox.store.loadData(fasArray);
        }
        
        var rulesStore;
        // If selected part exists, load it. If not, create a
        // blank part and load it into the form.
        if(j5Part) {
        	this.partPropertiesForm.loadRecord(j5Part);

            if(j5Part.isMapped())
            {
            	j5Part.getSequenceFile({
                    callback: function(sequenceFile){
                        if(sequenceFile)
                        {
                            if(sequenceFile.get("partSource")!=="") {
                                self.changePartDefinitionBtn.removeCls("btnDisabled");
                                self.changePartDefinitionBtn.enable();
                                self.openPartLibraryBtn.setText("Open Part Library");
                                self.openPartLibraryBtn.removeCls("selectPartFocus");
                                self.changePartDefinitionBtn.enable();
                                self.changePartDefinitionBtn.setText("Change Part Definition");
                                self.changePartDefinitionBtn.removeCls("selectPartFocus");
                                self.deletePartBtn.enable();
                                self.deletePartBtn.removeCls("btnDisabled");
                                self.deletePartBtn.removeCls("selectPartFocus");
                                self.clearPartMenuItem.enable();
                                self.partSourceNameField.setValue(sequenceFile.get("partSource"));
                            } else {
                                self.changePartDefinitionBtn.enable();
                                self.openPartLibraryBtn.setText("Select Part From Library");
                                self.openPartLibraryBtn.addCls("selectPartFocus");
                                self.changePartDefinitionBtn.removeCls("btnDisabled");
                                self.changePartDefinitionBtn.setText("Create New Part");
                                self.changePartDefinitionBtn.addCls("selectPartFocus");
                                self.deletePartBtn.disable();
                                self.clearPartMenuItem.disable();
                                self.deletePartBtn.removeCls("selectPartFocus");
                                self.deletePartBtn.addCls("btnDisabled");
                            }
                        }
                    }
                });
            } else if (j5Part.get("name") !== ""){
            	self.changePartDefinitionBtn.enable();
                self.openPartLibraryBtn.setText("Select Part From Library");
                self.openPartLibraryBtn.addCls("selectPartFocus");
                self.changePartDefinitionBtn.removeCls("btnDisabled");
                self.changePartDefinitionBtn.setText("Create New Part");
                self.changePartDefinitionBtn.addCls("selectPartFocus");
                self.deletePartBtn.enable();
                self.deletePartBtn.removeCls("btnDisabled");
                self.deletePartBtn.addCls("selectPartFocus");
                self.clearPartMenuItem.enable();
            } else {
                self.changePartDefinitionBtn.enable();
                self.openPartLibraryBtn.setText("Select Part From Library");
                self.openPartLibraryBtn.addCls("selectPartFocus");
                self.changePartDefinitionBtn.removeCls("btnDisabled");
                self.changePartDefinitionBtn.setText("Create New Part");
                self.changePartDefinitionBtn.addCls("selectPartFocus");
                self.deletePartBtn.disable();
                self.clearPartMenuItem.disable();
                self.deletePartBtn.removeCls("selectPartFocus");
                self.deletePartBtn.addCls("btnDisabled");
            }

            if(this.selectedCell.get("fas") === "") {
                fasBox.setValue("None");
            } else {
                self.fasForm.loadRecord(this.selectedCell);
            }

            this.selectedPart = j5Part;
            
            rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,this.selectedPart);
        } else {
        	var newPart = Ext.create("Teselagen.models.Part");
            this.partPropertiesForm.loadRecord(newPart);
            this.fasCombobox.setValue("None");
            
            self.changePartDefinitionBtn.enable();
            self.deletePartBtn.disable();
            self.clearPartMenuItem.disable();
            self.deletePartBtn.addCls("btnDisabled");
            self.openPartLibraryBtn.setText("Select Part From Library");
            self.openPartLibraryBtn.addCls("selectPartFocus");
            self.changePartDefinitionBtn.removeCls("btnDisabled");
            self.changePartDefinitionBtn.setText("Create New Part");
            self.changePartDefinitionBtn.addCls("selectPartFocus");
            
            this.eugeneRulesGrid.store.clearData();            
            this.eugeneRulesGrid.view.refresh();
        }
        
        this.inspector.resumeLayouts();

        this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                       this.selectedPart);
        
        if(j5Part) this.eugeneRulesGrid.reconfigure(rulesStore);

        this.inspector.expand();
    },

    /**
     * Clears all the fields in the Part Info tab. Used when a part is deleted.
     */
    clearPartInfo: function() {
        this.inspector.suspendLayouts(false);
        
    	this.partPropertiesForm.getForm().reset();
        this.fasForm.getForm().reset();

        this.changePartDefinitionBtn.removeCls("btnDisabled");
        this.changePartDefinitionBtn.setText("Create New Part");
        this.changePartDefinitionBtn.addCls("selectPartFocus");
        this.deletePartBtn.disable();
        this.clearPartMenuItem.disable();
        this.deletePartBtn.addCls("btnDisabled");
        this.deletePartBtn.removeCls("selectedPartFocus");
        this.openPartLibraryBtn.setText("Select Part From Library");
        this.openPartLibraryBtn.addCls("selectPartFocus");
        
        this.eugeneRulesGrid.store.clearData();
        this.eugeneRulesGrid.view.refresh();
        
        this.inspector.resumeLayouts();
    },

    /**
     * Handles the event that a bin is selected on the grid.
     * @param {Teselagen.models.J5Bin} j5Bin The selected bin.
     */
    onBinSelected: function (j5Bin, binIndex) {
    	if(!j5Bin) j5Bin = Teselagen.manager.DeviceDesignManager.getBinByIndex(this.activeProject, binIndex);
        var selectionModel = this.columnsGrid.getSelectionModel();
        //var removeColumnMenuItem =  this.activeTab.down("DeviceEditorMenuPanel").query("menuitem[text='Remove Column']")[0];
        
        this.selectedBin = j5Bin;
        this.inspector.setActiveTab(1);
        
    	this.inspector.suspendLayouts(false);
    	
    	this.clearPartInfo();
        //console.log(selectedPart);
        selectionModel.select(j5Bin, false, true);
        
        this.changePartDefinitionBtn.disable();
        this.changePartDefinitionBtn.addCls("btnDisabled");
        this.deletePartBtn.disable();
        this.clearPartMenuItem.disable();
        this.deletePartBtn.addCls("btnDisabled");
        this.openPartLibraryBtn.disable();
        this.openPartLibraryBtn.setText("Select Part From Library");
        this.openPartLibraryBtn.removeCls("selectPartFocus");
        this.openPartLibraryBtn.addCls("btnDisabled");

        //removeColumnMenuItem.enable();
        this.inspector.resumeLayouts();
    },

    /**
     * Handler when part name field receives focus.
     */
    onPartNameFieldFocus: function() {
        if (this.selectedPart && this.selectedPart.get("sequencefile_id")) {
            this.Logger.notifyInfo("Changing the part's name will change its name across all designs.");
        }
    },

    /**
     * Handler when part name field receives keyup event.
     */
    onPartNameFieldKeyup: function(field, event) {
        if(event.getKey() === event.ENTER) {
            this.onPartNameFieldBlur(field);
        }
    },
    
    /**
     * Handles the event that the Part Name field changes due to loss of focus. Checks to see if the
     * part is already owned by a bin. If not, this is a new part, so we have to
     * add the part to the design.
     * @param {Ext.form.field.Text} nameField The Part Name textfield.
     */
    onPartNameFieldBlur: function (nameField) {
        if(this.selectedCell) {
            var newName = nameField.getValue();
            var self = this;
            
            if(!newName) {
                this.Logger.notifyWarn("Part name cannot be blank.");
                return;
            }

            if(!this.selectedPart) {
                this.selectedPart = this.partPropertiesForm.getRecord();

                var yIndex = this.activeProject.bins().getAt(this.selectedBinIndex).cells().indexOf(this.selectedCell);

                Teselagen.manager.GridCommandPatternManager.addCommand({
                    type: "PART",
                    data: {
                        type: "ADD",
                        x: this.selectedBinIndex,
                        y: yIndex,
                        oldPart: null,
                        newPart: this.selectedPart,
                        partAdded: true
                    }
                });
            }

            // Only validate/set the part's name if the name is different from
            // what it was before. This prevents the grid from being rendered
            // twice when entering a name, pressing enter, and then clicking 
            // away from the part name field.
            if(this.selectedPart.get("name") !== newName) {
                Vede.application.fireEvent(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, this.selectedPart, newName, this.selectedPart.get("partSource"), function() {
                    // If the selected part is not in the device already, add it.
                    if(self.activeProject.parts().indexOf(self.selectedPart) < 0) {
                        self.activeProject.parts().add(self.selectedPart);
                        self.selectedCell.setPart(self.selectedPart);
                    }

                    self.selectedPart.set("name", newName);

                    if(self.selectedPart.hasSequenceFile) {
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
                    }


                    if (!self.selectedPart.isMapped() && self.selectedPart.get("name") !== ""){
                        self.deletePartBtn.enable();
                        self.deletePartBtn.removeCls("btnDisabled");
                        self.deletePartBtn.addCls("selectPartFocus");
                        self.clearPartMenuItem.enable();
                    }
                    else if (!self.selectedPart.isMapped() && self.selectedPart.get("name") === ""){
                        self.deletePartBtn.disable();
                        self.deletePartBtn.addCls("btnDisabled");
                        self.deletePartBtn.removeCls("selectPartFocus");
                        self.clearPartMenuItem.disable();
                    }
                }, "Another non-identical part with that name already exists in the design. Please input a different name.");
            }
        }
    },

    /**
     * Handles the event that a part's assembly strategy combobox changes value.
     * @param {Ext.form.field.Combobox} box The FAS combobox.
     */
    onPartAssemblyStrategyChange: function (box) {
        if(this.selectedPart) {
    //        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];
            var newStrategy = box.getValue();
            var oldFas = this.selectedCell.get("fas");
            this.selectedCell.set("fas", newStrategy);
            this.columnsGrid.getView().refresh();
            var xIndex = this.selectedBinIndex;                                      
        	var yIndex = this.activeProject.bins().getAt(this.selectedBinIndex).cells().indexOf(this.selectedCell);

            Teselagen.manager.GridCommandPatternManager.addCommand({
            	type: "PART",
            	data: {
            		type: "FAS",
            		x: xIndex,
            		y: yIndex,
            		oldFas: oldFas,
            		newFas: newStrategy
            	}
    		});

            this.renderCollectionInfo();
        }
    },

    /**
     * Handles the event that the design's geometry radio button changes.
     * @param {Ext.form.RadioGroup} radioGroup The radio button group.
     * @param {Boolean} newValue Whether the plasmid is now circular.
     */
    onPlasmidGeometryChange: function (radioGroup, newValue) {
        this.activeProject.set("isCircular", newValue);

        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "MISC",
            data: {
                type: "GEO",
                data: !newValue
            }
        });
    },

    /**
     * Handler for the Add Column button. Calls on the DeviceDesignManager to
     * add a new empty bin to the design.
     */
    onAddColumnButtonClick: function () {
        var selectedBin = this.columnsGrid.getSelectionModel().getSelection()[0];

        if(selectedBin) {
            var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);
            this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, (selectedBinIndex+1));
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
        var removeColumnMenuItem =  this.activeTab.down("DeviceEditorMenuPanel").query("menuitem[text='Remove Column']")[0];
 

        if (selectedBin) {
            Ext.Msg.show({
                    title: "Are you sure you want to delete this column?",
                    msg: "WARNING: This will delete the current selected column.",
                    buttons: Ext.Msg.OKCANCEL,
                    cls: "messageBox",
                    fn: this.removeColumn.bind(this, selectedBin),
                    icon: Ext.Msg.QUESTION
            });
        }
        removeColumnMenuItem.disable();

        this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
    },

    removeColumn: function (selectedBin, evt) {
        if (evt === "ok") {
            if(selectedBin) {
                var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);
                this.activeProject.deleteBinByIndex(selectedBinIndex);
                this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
            } else {
                this.activeProject.deleteBinByIndex(
                this.activeProject.binCount() - 1);
                this.columnsGrid.getView().refresh();
                this.renderCollectionInfo();
                this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
            }

            if (this.activeProject.binCount() === 0) {
                this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, 0);
            }

            this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
        }
    },
    
    onRemoveColumn: function() {
    	this.clearPartInfo();
    },
    
    onRemoveRow: function() {
    	this.clearPartInfo();
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
            this.activeProject.rules().clearFilter();

            var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                name: this.DeviceDesignManager.generateDefaultRuleName(this.activeProject),
                compositionalOperator: Teselagen.constants.Constants.COMPOP_LIST[0]
            });

            this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                           this.selectedPart);

            var ruleForm = newEugeneRuleDialog.down("form");
            var operand2Field = ruleForm.down("combobox[cls='operand2PartField']");

            var allParts = this.DeviceDesignManager.getAllParts(
                                this.activeProject, this.selectedPart);
            var partsStore = [];
            Ext.each(allParts, function(part) {
                partsStore = partsStore.concat([part.get("name")]);
            });

            var self = this;
            newEugeneRule.setOperand1(self.selectedPart);

            newEugeneRuleDialog.show();

            ruleForm.loadRecord(newEugeneRule);
            ruleForm.down("displayfield[cls='operand1Field']").setValue(
                                        self.selectedPart.get("name"));

            operand2Field.bindStore(partsStore);
            operand2Field.setValue(partsStore[0]);
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
                    this.activeProject.rules().clearFilter(true);
                    this.activeProject.rules().remove(selectedRule);
                    selectedRule.destroy();
                    this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,this.selectedPart);
                    toastr.options.onclick = null;




                    toastr.info("Eugene Rule Removed");

                    Teselagen.manager.GridCommandPatternManager.addCommand({
                        type: "RULE",
                        data: {
                            type: "DEL",
                            data: selectedRule
                        }
                    });
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
//        var newOperand1_id =
//            newEugeneRuleDialog.down("displayfield[cls='operand1Field']").getValue();

        var newOperand2;
        var newOperand2Name;

        var design = this.activeProject;
        var duplicateRule = this.DeviceDesignManager.getRuleByName(design, newName);
        if (!newName) {
            Ext.MessageBox.show({
                title: "Name",
                msg: "Please enter a rule name.",
                buttons: Ext.MessageBox.OK,
            });            
            return Ext.MessageBox;
        }

        if (duplicateRule) {
            Ext.MessageBox.show({
                title: "Name conflict",
                msg: "A rule with this name already exists in this design. <p> Please enter another name.",
                buttons: Ext.MessageBox.OK,
            });                                      
            return Ext.MessageBox;                                  
        }

        if(newCompositionalOperator === Teselagen.constants.Constants.MORETHAN) {
            newOperand2 =
                newEugeneRuleDialog.down("numberfield[cls='operand2NumberField']").getValue();
            newRule.set({
            	"operand2isNumber": true, 
            	"operand2Number": newOperand2
        	});
        } else {
            newOperand2Name =
                newEugeneRuleDialog.down("component[cls='operand2PartField']").getValue();

            newOperand2 = this.DeviceDesignManager.getPartByName(this.activeProject,
                                                                 newOperand2Name);
        }
        
        newRule.set({
        	"name": newName,
        	"negationOperator": newNegationOperator,
        	"compositionalOperator": newCompositionalOperator
        });
        
        newRule.setOperand2(newOperand2); 
        
        var rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject, this.selectedPart);
        this.activeProject.addToRules(newRule);
        
        newEugeneRuleDialog.close();
        
        this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject, this.selectedPart);
        this.eugeneRulesGrid.reconfigure(rulesStore);
        
        
        toastr.options.onclick = null;
        
        toastr.info("Eugene Rule Added");
        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
        
        Teselagen.manager.GridCommandPatternManager.addCommand({
            type: "RULE",
            data: {
                type: "ADD",
                data: newRule
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

    onRuleNameChanged: function(newName) {
        var design = this.activeProject;
        var duplicateRule = this.DeviceDesignManager.getRuleByName(design, newName);

        if (duplicateRule) {
            Ext.MessageBox.show({
                title: "Name conflict",
                msg: "A rule with this name already exists in this design. <p> Please enter another name.",
                buttons: Ext.MessageBox.OK,
            });   
            return false                                  
        }
        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
    },

    onOperand2Changed: function(operand1Id, newId, ruleName, oldId, e) {
        var operand1 = this.DeviceDesignManager.getPartById(this.activeProject, operand1Id);
        var operand1Bin = this.DeviceDesignManager.getBinByPart(this.activeProject, operand1);

        if (isNaN(newId) && isNaN(oldId)) {
            var newOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, newId);
            var oldOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, oldId);
            var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);
            var oldrules = this.DeviceDesignManager.getNumberOfRulesInvolvingPart(this.activeProject, oldOperand2);


            var self = this;
            newOperand2.save({
                callback: function() {
                    rule.setOperand2(newOperand2)
                    var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                    self.eugeneRulesGrid.reconfigure(rulesStore);

                    self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
                    self.onPartSelected(operand1, self.selectedBinIndex);
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
                    
                    Ext.getCmp('mainAppPanel').getActiveTab().model.rules().clearFilter(true);
                }
            });

        } else if (isNaN(newId) && !isNaN(oldId)) {
            var newOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, newId);
            var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);

            var self = this;
            newOperand2.save({
                callback: function() {
                    rule.setOperand2(newOperand2)
                    var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                    self.eugeneRulesGrid.reconfigure(rulesStore);
                    
                    self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
                    self.onPartSelected(operand1, self.selectedBinIndex);
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
                    Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
                }
            });
        } else if (!isNaN(newId) && isNaN(oldId)) {
            Ext.getCmp('mainAppPanel').getActiveTab().model.rules().clearFilter(true);
            var newOperand2 = newId;
            var oldOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, oldId);
            var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);
            var self = this;
            rule.setOperand2(newOperand2)
            var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
            self.eugeneRulesGrid.reconfigure(rulesStore);
                
            self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
            self.onPartSelected(operand1, self.selectedBinIndex);
            Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
        } else {
            var newOperand2 = newId;
            var oldOperand2 = oldId;
            var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);

            var self = this;
                rule.setOperand2(newOperand2)
                var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                self.eugeneRulesGrid.reconfigure(rulesStore);
                
                self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
                self.onPartSelected(operand1, self.selectedBinIndex);
                Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
                Vede.application.fireEvent(Teselagen.event.DeviceEvent.SAVE_DESIGN);
        }
    },

    onChangeCompOperator: function(record, column, ruleName, oldOperand2, operand1Id, oldCompOperator, newCompOperator) {
        var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);
        var operand1 = this.DeviceDesignManager.getPartById(this.activeProject, operand1Id);
        var operand1Bin = this.DeviceDesignManager.getBinByPart(this.activeProject, operand1);
        var oldrules = this.DeviceDesignManager.getNumberOfRulesInvolvingPart(this.activeProject, oldOperand2);
        
        if (newCompOperator === "MORETHAN" && newCompOperator != oldCompOperator) {
            Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, operand1Bin);
            Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1);
            Ext.getCmp('mainAppPanel').getActiveTab().model.rules().clearFilter(true);
        } else if (newCompOperator != "MORETHAN" && oldCompOperator === "MORETHAN") {
            var self = this;
            if (oldOperand2.data.id) {
                oldOperand2.save({
                    callback: function() {
                        rule.setOperand2(oldOperand2)
                        var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                        self.eugeneRulesGrid.reconfigure(rulesStore);
                        
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, operand1Bin);
                        self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
                        self.onPartSelected(operand1, self.selectedBinIndex);
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
                    }
                });
            }
            else {
                var plugin = this.eugeneRulesGrid.getPlugin('cellplugin');
                var column = Ext.ComponentQuery.query("gridcolumn[cls='operand2_field']")[0];
                this.application.fireEvent('setOperand2Editor', column);
                var partStore = this.DeviceDesignManager.getAllParts(this.activeProject, this.selectedPart);
                var firstPart = partStore[0];

                firstPart.save({
                    callback: function() {
                        rule.setOperand2(firstPart)
                        var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                        self.eugeneRulesGrid.reconfigure(rulesStore);
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, operand1Bin);
                        self.selectedBinIndex = self.DeviceDesignManager.getBinIndex(self.activeProject, operand1Bin);
                        self.onPartSelected(operand1, self.selectedBinIndex);
                        Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_PART, operand1, self.selectedBinIndex);
                        plugin.startEdit(record, column);
                    }
                });
            }
        }
    },

    onSetOperand2Editor: function(column) {
        var compOperator = this.eugeneRulesGrid.getSelectionModel().getSelection()[0].data.compositionalOperator;
        var operand1Id = this.eugeneRulesGrid.getSelectionModel().getSelection()[0].data.operand1_id;
        var operand1 = this.DeviceDesignManager.getPartById(this.activeProject, operand1Id);

        var allParts = this.DeviceDesignManager.getAllParts(this.activeProject, operand1);
        var partsStore = [];
        Ext.each(allParts, function(part) {
            partsStore = partsStore.concat([[part.get('id'), part.get('name')]]);
        });

        var numberField = Ext.create('Ext.form.field.Number', {
            allowBlank: false,
            minValue: 0,
            allowDecimals: false,
            value: 0
        });
        var nameField = Ext.create('Ext.form.field.ComboBox', {
            store: partsStore,
            allowBlank: false,
            editable: false,
            displayField: 'name',
            valueField: 'id',
            cls: "operand2_namefield"
        });

        if (compOperator === "MORETHAN") {
            column.setEditor(numberField);
        } else {
            column.setEditor(nameField);
        }
    },

    onAddEugeneRuleIndicator: function(gridOperands2) {
        for(var k = 0; k < gridOperands2.length; k++) {
            var gridOperand2 = gridOperands2[k];
            if(!gridOperand2.partCell.down("image[cls='eugeneRuleIndicator']")) {
                gridOperand2.addEugeneRuleIndicator();
            }
        }
    },

    onRemoveEugeneRuleIndicator: function(gridOperands2) {
        for(var k = 0; k < gridOperands2.length; k++) {
            var gridOperand2 = gridOperands2[k];
            if(gridOperand2.partCell.down("image[cls='eugeneRuleIndicator']")) {
                gridOperand2.removeEugeneRuleIndicator();
            }
        }
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
    onGridBinSelect: function (grid, j5Bin, binIndex) {
    	this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin, binIndex);
    	this.GridController.scrollToBinOrCell(binIndex, null);
    },

    /**
     * When we switch to a new tab, switch the current active project to the one
     * associated with the new tab, and reset event handlers so they refer to the
     * new grid and j5 bins.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     */
    onTabChange: function (tabPanel, newTab, oldTab) {
        if(newTab.initialCls === "DeviceEditorTab") { // It is a DE tab
        	//Ext.suspendLayouts();
        	
            if(this.activeBins) {
                this.activeBins.un("add", this.onAddToBins, this);
                this.activeBins.un("remove", this.onRemoveFromBins, this);

                // Unset listeners for the parts store of each bin.
                this.activeBins.each(function (bin) {
                    var cells = bin.cells();

                    cells.un("add", this.onAddToCells, this);
                    cells.un("update", this.onUpdateCells, this);
                    cells.un("remove", this.onRemoveFromCells, this);
                }, this);

                // Remove listeners from the design's parts store.
                this.activeProject.parts().un("add", this.onAddToParts, this);
                this.activeProject.parts().un("update", this.onUpdateParts, this);
                this.activeProject.parts().un("remove", this.onRemoveFromParts, this);
            }

            this.activeTab = newTab;
            this.activeProject = newTab.model;

            this.activeBins = this.activeProject.bins();

            this.activeBins.on("add", this.onAddToBins, this);
            this.activeBins.on("remove", this.onRemoveFromBins, this);

            // Add listeners to the design's parts store.
            this.activeProject.parts().on("add", this.onAddToParts, this);
            this.activeProject.parts().on("update", this.onUpdateParts, this);
            this.activeProject.parts().on("remove", this.onRemoveFromParts, this);

            // Add listeners to the Eugene rules store.
            this.activeProject.rules().on("add", this.onAddToRules, this);

            // Add listeners to each bin's cells store.
            this.activeBins.each(function (bin) {
                var cells = bin.cells();

                cells.on("add", this.onAddToCells, this);
                cells.on("update", this.onUpdateCells, this);
                cells.on("remove", this.onRemoveFromCells, this);
            }, this);

            this.inspector = newTab.down("component[cls='InspectorPanel']");

            if(this.columnsGrid) {
                this.columnsGrid.un("select", this.onGridBinSelect, this);
            }

            this.columnsGrid = this.inspector.down(
                                "form[cls='collectionInfoForm'] > gridpanel");
            this.columnsGrid.on("select", this.onGridBinSelect, this);

            this.eugeneRulesGrid = this.inspector.down("form[cls='eugeneRulesForm'] > gridpanel");

            this.j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
            this.combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");

            this.runj5Btn1 = this.inspector.down("button[cls='runj5Btn']");
            // this.runj5Btn2 = newTab.down("button[cls='j5button']");

            this.partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
            this.openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
            this.changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
            this.deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
            this.clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
            this.fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");
            this.fasCombobox = this.fasForm.down("combobox");
            this.partSourceNameField = this.inspector.down("displayfield[cls='partSourceField']");
            this.removeRowMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Row']");

            // this.deletePartBtn.disable();
            // this.deletePartBtn.addCls("btnDisabled");
            // this.changePartDefinitionBtn.disable();
            // this.changePartDefinitionBtn.addCls("btnDisabled");
            // this.openPartLibraryBtn.disable();
            // this.openPartLibraryBtn.setText("Select Part From Library");
            // this.openPartLibraryBtn.removeCls("selectPartFocus");
            // this.openPartLibraryBtn.addCls("btnDisabled");

            this.renderCollectionInfo();
            this.inspector.setActiveTab(1);

            if(this.activeTab.partLibraryWindow) {
                if(this.activeTab.partLibraryWindow.down("textfield[cls='partLibrarySearchField']").value) {
                    this.activeTab.partLibraryWindow.down("textfield[cls='partLibrarySearchField']").setValue(null);
                }
            }
        }

        if (oldTab && oldTab.initialCls === "DeviceEditorTab") {
            if(oldTab.partLibraryWindow) {
                if(oldTab.partLibraryWindow.down("textfield[cls='partLibrarySearchField']").value) {
                    oldTab.partLibraryWindow.down("textfield[cls='partLibrarySearchField']").setValue(null);
                }
            }
        }
    },

    /**
     * Handles the event that one or more bins are added to the device design's
     * store of bins.
     * @param {Ext.data.Store} activeBins The device design's store of bins.
     * @param {Teselagen.model.J5Bin[]} addedBins An array of all the bins that
     * have been added.
     */
    onAddToBins: function (activeBins, addedBins) {
        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];

        // Add event listeners to the parts store of this bin.
        Ext.each(addedBins, function (j5Bin) {
            var cells = j5Bin.cells();
            cells.on("add", this.onAddToCells, this);
            cells.on("update", this.onUpdateCells, this);
            cells.on("remove", this.onRemoveFromCells, this);
        }, this);

        this.columnsGrid.getSelectionModel().deselect(selectedPart);

        this.renderCollectionInfo(true);
    },
    
    /**
     * Handles the deletion of a bin. Simply rerenders the collection info.
     */
    onRemoveFromBins: function () {
        this.renderCollectionInfo(true);
    },

    /**
     * Handles the event that one or more parts are added to any bin.
     */
    onAddToParts: function () {
        this.columnsGrid.view.refresh();
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
    onUpdateParts: function(parts, updatedCell, operation, modified) {
        if(modified) {
            if(parts.indexOf(this.selectedPart) > -1) {
                this.partPropertiesForm.loadRecord(this.selectedPart);
            }
        }
    },

    /**
     * Handles the deletion of a part from a bin.
     */
    onRemoveFromParts: function () {
        try {
            this.columnsGrid.getView().refresh();
            this.renderCollectionInfo();
            //this.clearPartInfo();
        } catch(err)
        {
            console.log("Failed removing part from bin. Error:", err);
        }
    },

    /**
     * Refreshes Eugene rules grid when a rule is added.
     */
    onAddToRules: function(rules, addedRules) {
        if(this.selectedPart) {
            var self = this;

            Ext.defer(function() {
                self.eugeneRulesGrid.getView().refresh();
            }, 10);
        }
    },

    /**
     * Handles the event that one or more cells are added to any bin.
     */
    onAddToCells: function () {
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
    onUpdateCells: function(parts, updatedCell, operation, modified) {
        if(modified && this.selectedPart) {
            this.partPropertiesForm.loadRecord(this.selectedPart);

            this.onCheckj5Ready();
        }
    },

    /**
     * Handles the deletion of a part from a bin.
     */
    onRemoveFromCells: function () {
        try {
            this.inspector.suspendLayouts();
        	
        	this.columnsGrid.getView().refresh();
            this.renderCollectionInfo();
            
            this.inspector.resumeLayouts();
            //this.clearPartInfo();
        } catch(err)
        {
            console.log("Failed removing part from bin. Error:", err);
        }
    },

    onReRenderCollectionInfoEvent: function() {
        this.renderCollectionInfo();
    },

    /**
     * Fills in the Collection Info tab's various fields.
     * @param {Boolean} skipReconfigureGrid True to not reconfigure the collection
     * info grid. This should be true when we're using the same bins store as
     * before.
     */
    renderCollectionInfo: function (skipReconfigureGrid) {
        Ext.suspendLayouts();

        var circularPlasmidField = this.inspector.down("radiofield[cls='circular_plasmid_radio']");
        var linearPlasmidField = this.inspector.down("radiofield[cls='linear_plasmid_radio']");

        if(this.activeProject) {
            Vede.application.fireEvent(this.DeviceEvent.CHECK_J5_READY);

            if(this.activeProject.get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            if(!skipReconfigureGrid) {
                this.columnsGrid.reconfigure(this.activeProject.bins());
            }
        }

        Ext.resumeLayouts(true);
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
        this.GridController = Vede.application.getController("DeviceEditor.GridController");
    },

    /**
     * @member Vede.controller.DeviceEditor.InspectorController
     */
    init: function () {
        this.callParent();

        this.CommonEvent = Teselagen.event.CommonEvent;
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.Logger = Teselagen.utils.Logger;

        this.application.on(this.DeviceEvent.SELECT_PART, this.onPartSelected, this);

        this.application.on(this.DeviceEvent.SELECT_CELL, this.onCellSelected, this);

        this.application.on(this.DeviceEvent.SELECT_BIN, this.onBinSelected, this);

        this.application.on(this.DeviceEvent.RERENDER_DE_CANVAS, this.onReRenderDECanvasEvent, this);

        this.application.on(this.DeviceEvent.OPEN_PART_LIBRARY, this.onOpenPartLibrary, this);

        this.application.on(this.DeviceEvent.CHECK_J5_READY, this.onCheckj5Ready, this);

        this.application.on(this.DeviceEvent.CLEAR_PART, this.onClearPart, this);

        this.application.on(this.DeviceEvent.REMOVE_COLUMN, this.onRemoveColumn, this);

        this.application.on(this.DeviceEvent.REMOVE_ROW, this.onRemoveRow, this);
        
        this.application.on("ReRenderCollectionInfo", this.onReRenderCollectionInfoEvent, this);

        this.application.on("ruleNameChanged", this.onRuleNameChanged, this);

        this.application.on("operand2Changed", this.onOperand2Changed, this);

        this.application.on("changeCompOperator", this.onChangeCompOperator, this);

        this.application.on("setOperand2Editor", this.onSetOperand2Editor, this);

        this.application.on("AddEugeneRuleIndicator", this.onAddEugeneRuleIndicator, this);

        this.application.on("RemoveEugeneRuleIndicator", this.onRemoveEugeneRuleIndicator, this);
        
        this.application.on(this.DeviceEvent.RERENDER_COLLECTION_INFO, this.onReRenderCollectionInfoEvent, this);

        this.control({
            "textfield[cls='partNameField']": {
                focus: this.onPartNameFieldFocus,
                blur: this.onPartNameFieldBlur,
                keyup: this.onPartNameFieldKeyup
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
                click: this.onOpenPartLibraryBtnClick
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
            }
        });
    }
});
