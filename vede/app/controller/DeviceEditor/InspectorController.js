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

    findBinByPart:function(findingPart,cb){
        var foundBin = null;
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        var j5collection = tab.model.getDesign().getJ5Collection();
        j5collection.bins().each(function(bin){
            bin.parts().each(function(part){
                if(part.internalId===findingPart.internalId) {foundBin = bin;}
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
        this.clearPartInfo();
        toastr.options.onclick = null;
        toastr.info("Part Cleared");
        this.application.fireEvent(this.DeviceEvent.CHECK_J5_READY);
    },

    checkCombinatorial:function(j5collection,cb){
        var tmpC = 0;
        var bins = j5collection.bins().getRange();
        var parts;
        var combinatorial = false;

        for(var i = 0; i < bins.length; i++) {
            parts = bins[i].parts().getRange();
            if(parts.length > 1) {
                tmpC = 0;

                for(var j = 0; j < parts.length; j++) {
                    if(parts[j].get("sequencefile_id")!=="" && !parts[j].get("phantom")) {
                        tmpC++;
                    }
                }

                if (tmpC>1) {
                    combinatorial = true;
                }
            }
        }

        return cb(combinatorial);
    },

    onCheckj5Ready: function(cb,notChangeMethod){
        /*
        non-combinatorial designs: each collection bin (column) must contain exactly one mapped part.
        combinatorial designs: each collection bin must contain at least one mapped part, and at least
        one bin must contain more than one mapped part. No column should contained a non-mapped (but named) part.
        */
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        var j5collection = tab.model.getDesign().getJ5Collection();
        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        var runj5Btn1 = this.inspector.down("button[cls='runj5Btn']");
        var runj5Btn2 = tab.down("button[cls='j5button']");
        var inspector = this.inspector;
        var self = this;

        this.checkCombinatorial(j5collection,function(combinatorial){
            var j5ready = true;
            var tmpJ = 0;
            var bins = j5collection.bins().getRange();
            var cnt = bins.length;
            var parts;
            var part;
            var names = 0;

            for(var i = 0; i < cnt; i++) {
                var tmpC = 0;
                parts = bins[i].parts().getRange();

                for(var j = 0; j < parts.length; j++) {
                    part = parts[j];

                    if(part !== undefined) {
                        if(part.get("sequencefile_id") !== "" && !part.get("phantom") ) {
                                tmpJ++;
                                tmpC++;
                        }
                        else if (part.get("phantom")){
                            tmpC--;
                        }
                    }
                    if(part !== undefined) {
                        if (part.get("name") !== "") {
                            names++;
                        }
                    }
                    if(tmpC<0) {
                        j5ready = false;
                    }
                }
            }

            if (tmpJ < cnt || names !== tmpJ) {
                j5ready = false;
            }

            if( !notChangeMethod ) {Vede.application.fireEvent(self.CommonEvent.LOAD_ASSEMBLY_METHODS, combinatorial);}

            tab.down("component[cls='combinatorial_field']").inputEl.setHTML(combinatorial);
            tab.down("component[cls='j5_ready_field']").inputEl.setHTML(j5ready);
            if (j5ready) {
                    j5ReadyField.setFieldStyle("color:rgb(0, 219, 0)");

                    runj5Btn1.enable();
                    runj5Btn1.removeCls("btnDisabled");

                    runj5Btn2.enable();
                    runj5Btn2.removeCls("btnDisabled");

                    inspector.down("panel[cls='j5InfoTab']").setDisabled(false);
                } else {
                    j5ReadyField.setFieldStyle("color:red");

                    runj5Btn1.disable();
                    runj5Btn1.addCls("btnDisabled");

                    runj5Btn2.disable();
                    runj5Btn2.addCls("btnDisabled");

                    inspector.down("panel[cls='j5InfoTab']").setDisabled(true);
                }
            if (combinatorial) {
                    combinatorialField.setFieldStyle("color:purple");
                } else {
                    combinatorialField.setFieldStyle("color:rgb(0, 173, 255)");
                }

            if (typeof(cb) === "function") {cb(combinatorial,j5ready);}
        });
    },

    onChangePartDefinitionBtnClick: function(){
        var self = this;
        if(this.selectedPart) {
            this.selectedPart.getSequenceFile({
                callback: function(){
                    Vede.application.fireEvent(self.DeviceEvent.OPEN_CHANGE_PART_DEFINITION, 
                            self.selectedPart, self.selectedBinIndex, self.selectedPart.getSequenceFile());
                }
            });
        }
    },

    /**
     * Handler for the Circular Plasmid radio button.
     */
    onCircularPlasmidRadioChange: function(radio){
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        tab.model.getDesign().getJ5Collection().set("isCircular",radio.getValue());
    },

    onEmptySequenceBtnClick: function(){
        var selectedPart = this.selectedPart;

//        console.log("Creating empty sequence");
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
                        //console.log(selectedPart);
                    }
                });
            }
        });
    },

    onopenPartLibraryBtnClick: function () {
        var currentTab = Ext.getCmp("mainAppPanel").getActiveTab();
        var currentTabEl = (currentTab.getEl());
//        var selectedPartIndex = this.selectedBin.indexOfPart(this.selectedPart);

        this.application.fireEvent(this.DeviceEvent.FILL_BLANK_CELLS);

        if(this.selectedPart) {
            // If the part is not owned by a bin yet, add it to the bin.
//            if(this.DeviceDesignManager.getBinAssignment(this.activeProject,
//                                                         this.selectedPart) < 0) {
//                var selectedBinIndex = this.selectedBinIndex;
//            }

            var self = this;

            var loadingMsgBox = Ext.MessageBox.show({
                title: "Loading Part",
                progressText: "Loading Part Library",
                progress: true,
                width: 300,
                renderTo: currentTabEl,
                closable: false
            });

            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("partLibrary", ""),
                method: "GET",
                success: function (response) {

                loadingMsgBox.updateProgress(50 / 100, 50 + "% completed");

                response = JSON.parse(response.responseText);

             var partLibrary = Ext.create("Teselagen.store.PartStore", {
                 model: "Teselagen.models.Part",
                 data:response,
                 proxy: {
                     type: "memory",
                     reader: {
                         type: "json",
                         root: "parts"
                     }
                 },
                 autoLoad: true,
                 sorters: [{
                    property: "name",
                    direction: "ASC"
                 }]
             });

                var selectWindow = Ext.create("Ext.window.Window", {
                    title: "Part Library",
                    height: 400,
                    width: 400,
                    layout: "fit",
                    //renderTo: currentTabEl,
                    closeAction: "close",
                    modal: true,
                    items: {
                        xtype: "grid",
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
                            "itemclick": function(grid, part){
                                Vede.application.fireEvent(self.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, part,part.get("name"),function(){
                                    var bin = self.DeviceDesignManager.getBinByIndex(self.activeProject,self.selectedBinIndex);
                                    //part.getSequenceFile({
                                    //    callback: function(sequence){
                                            if(bin)
                                            {
                                                self.application.fireEvent(self.DeviceEvent.INSERT_PART_AT_SELECTION, part);
                                                self.onReRenderDECanvasEvent();
                                                selectWindow.close();
                                                self.selectedPart = part;
                                                self.onReRenderDECanvasEvent();
                                                Vede.application.fireEvent(self.DeviceEvent.MAP_PART, self.selectedPart);
//                                                Vede.application.fireEvent(self.DeviceEvent.ADD_SELECT_ALERTS);
                                            }
                                            else
                                            {
                                                Ext.MessageBox.alert("Error","Failed mapping part from library");
                                            }
                                    //    }
                                    //});
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
        var tab = Ext.getCmp("mainAppPanel").getActiveTab();
        this.onTabChange(tab, tab, tab);
        Vede.application.fireEvent("populateOperand2Field");
    },

    /**
     * Handles the event that a part is selected on the grid.
     * @param {Teselagen.models.Part} j5Part The part model that has been selected.
     * @param {Number} binIndex The index of the bin that owns the selected part.
     */
    onPartSelected: function (j5Part, binIndex) {
        this.selectedBinIndex = binIndex;
        this.selectedBin = this.DeviceDesignManager.getBinByIndex(this.activeProject, binIndex);
        this.selectedPartIndex = this.DeviceDesignManager.getPartIndex(this.selectedBin, j5Part);
        //console.log(this.inspector);
        this.inspector.setActiveTab(0);

        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
        var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
        var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
        var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
        var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
        var fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");
        var fasCombobox = fasForm.down("combobox");
        var partSourceNameField = this.inspector.down("displayfield[cls='partSourceField']");
        var fasArray = [];

        openPartLibraryBtn.enable();
        openPartLibraryBtn.removeCls("btnDisabled");

        var removeRowMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Row']");
        removeRowMenuItem.enable();

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

            if( j5Part.get("sequencefile_id")!=="" && !j5Part.get("phantom") )
            {
                j5Part.getSequenceFile({
                    callback: function(sequenceFile){
                        if(sequenceFile)
                        {
                            if(sequenceFile.get("partSource")!=="") {
                                changePartDefinitionBtn.removeCls("btnDisabled");
                                openPartLibraryBtn.setText("Open Part Library");
                                openPartLibraryBtn.removeCls("selectPartFocus");
                                changePartDefinitionBtn.enable();
                                deletePartBtn.enable();
                                deletePartBtn.removeCls("btnDisabled");
                                deletePartBtn.removeCls("selectPartFocus");
                                clearPartMenuItem.enable();
                                partSourceNameField.setValue(sequenceFile.get("partSource"));
                            } else {
                                changePartDefinitionBtn.disable();
                                openPartLibraryBtn.setText("Select Part From Library");
                                openPartLibraryBtn.addCls("selectPartFocus");
                                changePartDefinitionBtn.addCls("btnDisabled");
                                deletePartBtn.disable();
                                clearPartMenuItem.disable();
                                deletePartBtn.removeCls("selectPartFocus");
                                deletePartBtn.addCls("btnDisabled");
                            }
                        }
                    }
                });
            } else if (j5Part.get("sequencefile_id") === "" && j5Part.get("name") !== ""){
                changePartDefinitionBtn.disable();
                openPartLibraryBtn.setText("Select Part From Library");
                openPartLibraryBtn.addCls("selectPartFocus");
                changePartDefinitionBtn.addCls("btnDisabled");
                deletePartBtn.enable();
                deletePartBtn.removeCls("btnDisabled");
                deletePartBtn.addCls("selectPartFocus");
                clearPartMenuItem.enable();
            } else {
                changePartDefinitionBtn.disable();
                openPartLibraryBtn.setText("Select Part From Library");
                openPartLibraryBtn.addCls("selectPartFocus");
                changePartDefinitionBtn.addCls("btnDisabled");
                deletePartBtn.disable();
                clearPartMenuItem.disable();
                deletePartBtn.removeCls("selectPartFocus");
                deletePartBtn.addCls("btnDisabled");
            }

            if(j5Part.get("fas") === "") {
                fasForm.down("combobox").setValue("None");
            } else {
                fasForm.loadRecord(j5Part);
            }
//            fasCombobox.setValue(this.selectedBin.getFas(this.selectedPartIndex));
            this.selectedPart = j5Part;
        } else {
            var newPart = Ext.create("Teselagen.models.Part");
            partPropertiesForm.loadRecord(newPart);
            fasCombobox.setValue("None");
            
            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls("btnDisabled");
            deletePartBtn.disable();
            clearPartMenuItem.disable();
            deletePartBtn.addCls("btnDisabled");
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.addCls("selectPartFocus");

            this.selectedPart = newPart;

        }

        var rulesStore = this.DeviceDesignManager.getRulesInvolvingPart(this.activeProject,
                                                                        this.selectedPart);

        this.eugeneRulesGrid.reconfigure(rulesStore);

        Ext.getCmp("mainAppPanel").getActiveTab().down("InspectorPanel").expand();

        Vede.application.fireEvent("populateOperand2Field");
    },

    /**
     * Clears all the fields in the Part Info tab. Used when a part is deleted.
     */
    clearPartInfo: function() {
        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
        var fasForm = this.inspector.down("form[cls='forcedAssemblyStrategyForm']");

        var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
        var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
        var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
        var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");

        partPropertiesForm.getForm().reset();
        fasForm.getForm().reset();

        changePartDefinitionBtn.disable();
        changePartDefinitionBtn.addCls("btnDisabled");
        deletePartBtn.disable();
        clearPartMenuItem.disable();
        deletePartBtn.addCls("btnDisabled");
        deletePartBtn.removeCls("selectedPartFocus");
        openPartLibraryBtn.setText("Select Part From Library");
        openPartLibraryBtn.addCls("selectPartFocus");
        //this.eugeneRulesGrid.reconfigure();
    },

    /**
     * Handles the event that a bin is selected on the grid.
     * @param {Teselagen.models.J5Bin} j5Bin The selected bin.
     */
    onBinSelected: function (j5Bin) {
        var selectionModel = this.columnsGrid.getSelectionModel();
//        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];
        this.selectedBin = j5Bin;
        this.inspector.setActiveTab(1);

        //console.log(selectedPart);
        selectionModel.select(j5Bin);
    },

    /**
     * Handler when part name field receives focus.
     */
    onPartNameFieldFocus: function() {
        if (this.selectedPart.get("sequencefile_id")) {
            this.Logger.notifyInfo("Changing the part's name will change its name across all designs.");
        }
    },

    onPartNameFieldKeyup: function(field, event) {
        if(event.getKey() === event.ENTER) {
            this.onPartNameFieldBlur(field);
        }
    },
    
    /**
     * Handles the event that the Part Name field changes due to keyup. Checks to see if the
     * part is already owned by a bin. If not, this is a new part, so we have to
     * add the part to the design.
     * @param {Ext.form.field.Text} nameField The Part Name textfield.
     */
    onPartNameFieldBlur: function (nameField) {
        var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
        var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
        var newName = nameField.getValue();
        var self = this;

        this.application.fireEvent(this.DeviceEvent.FILL_BLANK_CELLS);

        Vede.application.fireEvent(this.DeviceEvent.VALIDATE_DUPLICATED_PART_NAME, this.selectedPart, newName, function() {
            // If the selected part is not in the device already, add it.
            //if(self.selectedPart.get("phantom") ||
            if(self.DeviceDesignManager.getBinAssignment(self.activeProject,
                                                         self.selectedPart) < 0) {
                self.selectedPart = Ext.create("Teselagen.models.Part");
                self.selectedPart.set("phantom", false);
                self.selectedPart.set("name", newName);

                self.application.fireEvent(self.DeviceEvent.INSERT_PART_AT_SELECTION, self.selectedPart);
            } else {
                if(self.selectedPart.get("phantom")) {
                    self.selectedPart.set("phantom", false);
                }

                self.selectedPart.set("name", newName);
            }

        }, "Another non-identical part with that name already exists in the design. Please input a different name.");

        if (self.selectedPart.get("sequencefile_id") === "" && self.selectedPart.get("name") !== ""){
            deletePartBtn.enable();
            deletePartBtn.removeCls("btnDisabled");
            deletePartBtn.addCls("selectPartFocus");
            clearPartMenuItem.enable();
        }
        else if (self.selectedPart.get("sequencefile_id") === "" && self.selectedPart.get("name") === ""){
            deletePartBtn.disable();
            deletePartBtn.addCls("btnDisabled");
            deletePartBtn.removeCls("selectPartFocus");
            clearPartMenuItem.disable();

        }
    },

    /**
     * Handles the event that a part's assembly strategy combobox changes value.
     * @param {Ext.form.field.Combobox} box The FAS combobox.
     */
    onPartAssemblyStrategyChange: function (box) {
//        var selectedPart = this.columnsGrid.getSelectionModel().getSelection()[0];
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
        var removeColumnMenuItem =  Ext.getCmp("mainAppPanel").getActiveTab().down("DeviceEditorMenuPanel").query("menuitem[text='Remove Column']")[0];
 

        if (selectedBin) {
            Ext.Msg.show({
                    title: "Are you sure you want to delete this column?",
                    msg: "WARNING: This will delete the current selected column. This process cannot be undone.",
                    buttons: Ext.Msg.OKCANCEL,
                    cls: "messageBox",
                    fn: this.removeColumn.bind(this, selectedBin),
                    icon: Ext.Msg.QUESTION
            });
        }
        removeColumnMenuItem.disable();

        this.toggleInsertOptions(false);
        this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
    },

    removeColumn: function (selectedBin, evt) {
        if (evt === "ok") {
            if(selectedBin) {
                var selectedBinIndex = this.DeviceDesignManager.getBinIndex(this.activeProject, selectedBin);
                this.activeProject.getJ5Collection().deleteBinByIndex(selectedBinIndex);
                this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
            } else {
                this.activeProject.getJ5Collection().deleteBinByIndex(
                this.activeProject.getJ5Collection().binCount() - 1);
                this.columnsGrid.getView().refresh();
                this.renderCollectionInfo();
                this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
            }

            if (this.activeProject.getJ5Collection().binCount() === 0) {
                this.DeviceDesignManager.addEmptyBinByIndex(this.activeProject, 0);
            }

            this.application.fireEvent(this.DeviceEvent.RERENDER_COLLECTION_INFO);
        }
    },

    toggleInsertOptions: function(state) {
        Ext.getCmp("mainAppPanel").getActiveTab().down("DeviceEditorMenuPanel").query("menuitem[text='Row Above']")[0].setDisabled(!state||false);
        Ext.getCmp("mainAppPanel").getActiveTab().down("DeviceEditorMenuPanel").query("menuitem[text='Row Below']")[0].setDisabled(!state||false);
        Ext.getCmp("mainAppPanel").getActiveTab().down("DeviceEditorMenuPanel").query("menuitem[text='Column Left']")[0].setDisabled(!state||false);
        Ext.getCmp("mainAppPanel").getActiveTab().down("DeviceEditorMenuPanel").query("menuitem[text='Column Right']")[0].setDisabled(!state||false);
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
            //this.selectedPart.save({
            //    callback: function(){
                    newEugeneRule.setOperand1(self.selectedPart);

                    newEugeneRuleDialog.show();

                    ruleForm.loadRecord(newEugeneRule);
                    ruleForm.down("displayfield[cls='operand1Field']").setValue(
                                                self.selectedPart.get("name"));

                    operand2Field.bindStore(partsStore);
                    operand2Field.setValue(partsStore[0]);
            //    }
            //});
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
                    toastr.options.onclick = null;
                    toastr.info("Eugene Rule Removed");
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

        var uniqueName = this.DeviceDesignManager.isUniqueRuleName(this.activeProject, newName);
//        console.log(uniqueName);
        if (!uniqueName || !newName) {
            Ext.MessageBox.show({
                title: "Name conflict",
                msg: "A rule with this name already exists in this design. <p> Please enter another name:",
                buttons: [{
                    text: "Ok",
                    handler: function () {
                        Ext.MessageBox.hide();
                    }
                }, {
                    text: "Cancel",
                    handler: function () {
                        newEugeneRuleDialog.close();
                    }
                }]

            });
            return Ext.MessageBox;
                                             
        }
        if(newCompositionalOperator === Teselagen.constants.Constants.MORETHAN) {
            newOperand2 =
                newEugeneRuleDialog.down("numberfield[cls='operand2NumberField']").getValue();
            newRule.set("operand2isNumber", true);
            newRule.set("operand2Number", newOperand2);
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

        if(Ext.isNumber(newOperand2)) {
            newRule.setOperand2(newOperand2);
        } else {
            newOperand2.save({
                callback: function(){
                    newRule.setOperand2(newOperand2);
                }
            });
        }

        if(newCompositionalOperator !== Teselagen.constants.Constants.MORETHAN) {
            newOperand2.save({
                callback: function(){
                    newRule.setOperand2(newOperand2);
                    self.activeProject.addToRules(newRule);

                    var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject,
                                                                                    self.selectedPart);
                    self.eugeneRulesGrid.reconfigure(rulesStore);
                    
                    newEugeneRuleDialog.close();
                }
            });
        } else {
            self.activeProject.addToRules(newRule);

            var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject,
                                                                            self.selectedPart);

            self.eugeneRulesGrid.reconfigure(rulesStore);
            newEugeneRuleDialog.close();
        }

        toastr.options.onclick = null;
        toastr.info("Eugene Rule Added");
        Vede.application.fireEvent("populateOperand2Field");
        Vede.application.fireEvent(this.DeviceEvent.SAVE_DESIGN, this.onDeviceEditorSaveEvent, this);
    },

    onPopulateOperand2Field: function() {
        var allParts = this.DeviceDesignManager.getAllParts(this.activeProject, this.selectedPart);
            
        var partsStore = [];
        Ext.each(allParts, function(part) {
            partsStore = partsStore.concat([[part.get("id"), part.get("name")]]);
        });

        var operand2Field = this.inspector.down("gridcolumn[cls='operand2_field']").editor;
        if (operand2Field) {
            operand2Field.store = partsStore;
        }
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

    onOperand2Changed: function(newId, ruleName, oldId) {
        var newOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, newId);
        var oldOperand2 = this.DeviceDesignManager.getPartById(this.activeProject, oldId);
        var rule = this.DeviceDesignManager.getRuleByName(this.activeProject, ruleName);

        var self = this;
        newOperand2.save({
            callback: function() {
                if (newOperand2 !== oldOperand2) {
                    Vede.application.fireEvent("getNewGridParts", newOperand2);
                    Vede.application.fireEvent("getOldGridParts", oldOperand2);
                }

                rule.setOperand2(newOperand2);
                var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject, self.selectedPart);
                self.eugeneRulesGrid.reconfigure(rulesStore);
            }
        });
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
        

        // var newEugeneRuleDialog = Ext.ComponentQuery.query("component[cls='addEugeneRuleDialog']")[0];
        // var newRule = newEugeneRuleDialog.down("form").getForm().getRecord();
        // newRule.set("name", newOperand2);
        // var self = this;
        // newOperand2.save({
        //     callback: function(){
        //         newRule.setOperand2(newOperand2);

        //         self.activeProject.addToRules(newRule);

        //         var rulesStore = self.DeviceDesignManager.getRulesInvolvingPart(self.activeProject,
        //                                                                         self.selectedPart)

        //         self.eugeneRulesGrid.reconfigure(rulesStore);

        //         newEugeneRuleDialog.close();
        //     }
        // });

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
    onGridBinSelect: function (grid, j5Bin) {
//        var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
            var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
            var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
            var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");
            var clearPartMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Clear Part']");
            var removeColumnMenuItem = this.tabPanel.down("button[cls='editMenu'] > menu > menuitem[text='Remove Column']");

            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls("btnDisabled");
            deletePartBtn.disable();
            clearPartMenuItem.disable();
            deletePartBtn.addCls("btnDisabled");
            openPartLibraryBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.removeCls("selectPartFocus");
            openPartLibraryBtn.addCls("btnDisabled");

            removeColumnMenuItem.enable();

        this.application.fireEvent(this.DeviceEvent.SELECT_BIN, j5Bin);
    },

    /**
     * When we switch to a new tab, switch the current active project to the one
     * associated with the new tab, and reset event handlers so they refer to the
     * new grid and j5 bins.
     * @param {Ext.tab.Panel} tabPanel The tabpanel.
     * @param {Ext.Component} newTab The tab that is being switched to.
     */
    onTabChange: function (tabPanel, newTab) {
        if(newTab.initialCls === "DeviceEditorTab") { // It is a DE tab

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

//            var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
            var openPartLibraryBtn = this.inspector.down("button[cls='openPartLibraryBtn']");
            var changePartDefinitionBtn = this.inspector.down("button[cls='changePartDefinitionBtn']");
            var deletePartBtn = this.inspector.down("button[cls='deletePartBtn']");

            changePartDefinitionBtn.disable();
            changePartDefinitionBtn.addCls("btnDisabled");
            deletePartBtn.disable();
            deletePartBtn.addCls("btnDisabled");
            openPartLibraryBtn.disable();
            openPartLibraryBtn.setText("Select Part From Library");
            openPartLibraryBtn.removeCls("selectPartFocus");
            openPartLibraryBtn.addCls("btnDisabled");
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
            var parts = j5Bin.parts();
            parts.on("add", this.onAddToParts, this);
            parts.on("update", this.onUpdateParts, this);
            parts.on("remove", this.onRemoveFromParts, this);
        }, this);

        this.columnsGrid.getSelectionModel().deselect(selectedPart);

        // Remove the highlighting from the selected row- it appears that a bug
        // is preventing this from happening automatically. EDIT: Not happening
        // with the new Ext version.
        /*this.columnsGrid.getView().removeRowCls(selectedPart,
                                    this.columnsGrid.getView().selectedItemCls);
        this.columnsGrid.getView().removeRowCls(selectedPart,
                                    this.columnsGrid.getView().focusedItemCls);*/

        this.renderCollectionInfo(true);
    },

    /**
     * Handles the deletion of a bin. Simply rerenders the collection info.
     */
    onRemoveFromBins: function () {
        this.renderCollectionInfo();
    },

    /**
     * Handles the event that one or more parts are added to any bin.
     */
    onAddToParts: function () {
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
        if(modified && !updatedPart.data.phantom)
        {
//            if(modified.indexOf("name") > -1 || modified.indexOf("fas") > -1) {
//                var parentBin = this.DeviceDesignManager.getBinByPart(this.activeProject,
//                                                                      updatedPart);
//            }

            if(parts.indexOf(this.selectedPart) > -1) {
                var partPropertiesForm = this.inspector.down("form[cls='PartPropertiesForm']");
                partPropertiesForm.loadRecord(this.selectedPart);
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

//        var j5ReadyField = this.inspector.down("displayfield[cls='j5_ready_field']");
//        var combinatorialField = this.inspector.down("displayfield[cls='combinatorial_field']");
        var circularPlasmidField = this.inspector.down("radiofield[cls='circular_plasmid_radio']");
        var linearPlasmidField = this.inspector.down("radiofield[cls='linear_plasmid_radio']");

        if(this.activeProject) {
            Vede.application.fireEvent(this.DeviceEvent.CHECK_J5_READY);
            // j5ReadyField.setValue(this.DeviceDesignManager.checkJ5Ready(
            //                                                 this.activeProject));

            //  if (this.DeviceDesignManager.checkJ5Ready(this.activeProject)) {
            //         j5ReadyField.setFieldStyle("color:rgb(0, 219, 0)");
            //     } else {
            //         j5ReadyField.setFieldStyle("color:red");
            //     }

            // combinatorialField.setValue(this.DeviceDesignManager.setCombinatorial(
            //                                                 this.activeProject));
            // console.log(this.DeviceDesignManager.setCombinatorial(this.activeProject));

            // if (this.DeviceDesignManager.setCombinatorial(this.activeProject) == true) {
            //         combinatorialField.setFieldStyle("color:purple");
            //     } else {
            //         combinatorialField.setFieldStyle("color:rgb(0, 173, 255)");
            //     }

            if(this.activeProject.getJ5Collection().get("isCircular")) {
                circularPlasmidField.setValue(true);
            } else {
                linearPlasmidField.setValue(true);
            }

            if(!skipReconfigureGrid) {
                this.columnsGrid.reconfigure(this.activeProject.getJ5Collection().bins());
            }
        }

        Ext.resumeLayouts(true);
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
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

        this.application.on(this.DeviceEvent.SELECT_BIN, this.onBinSelected, this);

        this.application.on(this.DeviceEvent.RERENDER_DE_CANVAS, this.onReRenderDECanvasEvent, this);

        this.application.on(this.DeviceEvent.OPEN_PART_LIBRARY, this.onopenPartLibraryBtnClick, this);

        this.application.on(this.DeviceEvent.CHECK_J5_READY, this.onCheckj5Ready, this);

        this.application.on(this.DeviceEvent.CLEAR_PART, this.onClearPart, this);

        this.application.on(this.DeviceEvent.REMOVE_COLUMN, this.onRemoveColumnButtonClick, this);

        this.application.on("ReRenderCollectionInfo", this.onReRenderCollectionInfoEvent, this);

        this.application.on("operand2Changed", this.onOperand2Changed, this);

        this.application.on("populateOperand2Field", this.onPopulateOperand2Field, this);

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
            }
        });
    }
});
