Ext.define('Vede.controller.DeviceEditor.ChangePartDefinitionController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.event.MapperEvent",
               "Teselagen.event.ProjectEvent"],

    selectedPart: null,
    selectedWindow: null,
    selectedSequence: null,
    selectedBinIndex: null,
    selectedVEProject: null,

    selectedStartBP: null,
    selectedStopBP: null,

    onCancelPartDefinitionBtnClick: function(){
        this.selectedWindow.close();
    },

    onOpenPartInVEBtnClick: function() {

        var ready = this.onValidateFields();
        console.log(ready);

        if(ready) {
            this.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE,
                                       this.selectedSequence, this.selectedPart);
        }
    },

    onSequenceSelectionChanged: function(pieController,start,end){
        this.selectedStartBP = start+1;
        this.selectedStopBP = end;
    },

    onSpecifiedSequenceChange: function(combobox){
        var form = this.selectedWindow.down('form').getForm();
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');

        if(combobox.getValue() === "Whole sequence")
        {
            startBP.setValue(1);
            stopBP.setValue(this.selectedSequence.getLength());
            startBP.disable();
            stopBP.disable();
        }
        else
        {   
            startBP.enable();
            stopBP.enable();
            startBP.setReadOnly(false);
            stopBP.setReadOnly(false);
        if(this.selectedStartBP!==null && this.selectedStopBP!==null)
        {
            startBP.setValue(this.selectedStartBP);
            stopBP.setValue(this.selectedStopBP);
        }
        // else
        // {
        //     startBP.setValue(this.selectedPart.get('genbankStartBP'));
        //     stopBP.setValue(this.selectedPart.get('endBP'));
        // }
        }
    },

    populateFields:function(){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        var sequenceLength = this.selectedSequence.getLength();
        
        name.setValue(this.selectedPart.get('name'));
        partSource.setValue(this.selectedSequence.get('partSource'));

        if(this.selectedStartBP!==null && this.selectedStopBP!==null)
        {
            if(currentTab.initialCls!="DeviceEditorTab") {
                startBP.setValue(this.selectedStartBP);
                stopBP.setValue(this.selectedStopBP);
            } else {
                startBP.setValue(this.selectedPart.get('genbankStartBP'));
                stopBP.setValue(this.selectedPart.get('endBP'));
            }
        } else
        {
            startBP.setValue(this.selectedPart.get('genbankStartBP'));
            stopBP.setValue(this.selectedPart.get('endBP'));
        }


        if(this.selectedSequence)
        {
            if(this.selectedVEProject)
            partSource.setValue(this.selectedVEProject.get('name'));
            sourceData.setValue(this.selectedSequence.get('sequenceFileContent'));
            if(startBP.getValue()===1 && stopBP.getValue()===sequenceLength)
            {
                startBP.setReadOnly(true);
                stopBP.setReadOnly(true);
                specifiedSequence.setValue('Whole sequence');
            }
            else specifiedSequence.setValue('Specified sequence');
        }

        partSource.disable();

        startBP.setMaxValue(sequenceLength);
        stopBP.setMaxValue(sequenceLength);

        revComp.setValue(this.selectedPart.get('revComp'));
    },


    populateFields:function(){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        var sequenceLength = this.selectedSequence.getLength();
        
        name.setValue(this.selectedPart.get('name'));
        partSource.setValue(this.selectedSequence.get('partSource'));

        if(this.selectedSequence)
        {
            if(this.selectedVEProject)
            partSource.setValue(this.selectedVEProject.get('name'));
            sourceData.setValue(this.selectedSequence.get('sequenceFileContent'));
            if(startBP.getValue()===1 && stopBP.getValue()===sequenceLength)
            {
                startBP.setReadOnly(true);
                stopBP.setReadOnly(true);
                specifiedSequence.setValue('Whole sequence');
            }
            else specifiedSequence.setValue('Specified sequence');
        }

        if(this.selectedStartBP!==null && this.selectedStopBP!==null)
        {
            if(currentTab.initialCls!="DeviceEditorTab") {
                startBP.setValue(this.selectedStartBP);
                stopBP.setValue(this.selectedStopBP);
            } else {
                startBP.setValue(this.selectedPart.get('genbankStartBP'));
                stopBP.setValue(this.selectedPart.get('endBP'));
            }
        } else
        {
            startBP.setValue(this.selectedPart.get('genbankStartBP'));
            stopBP.setValue(this.selectedPart.get('endBP'));
        }

        partSource.disable();

        startBP.setMaxValue(sequenceLength);
        stopBP.setMaxValue(sequenceLength);

        revComp.setValue(this.selectedPart.get('revComp'));
    },

    open: function(selectedPart,selectedBinIndex,selectedSequence){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());
        currentTab.el.mask();
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog', {renderTo: currentTabEl}).show();
        this.selectedPart = selectedPart;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex = selectedBinIndex;
        this.selectedVEProject = null,
        this.populateFields();

    },

    openCreatePart: function(veproject,selectedPart,selectedSequence){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());
        currentTab.el.mask();
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog', {renderTo: currentTabEl}).show();
        var form = this.selectedWindow.down('form').getForm();
        this.selectedPart = selectedPart;
        this.selectedVEProject = veproject;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex = null;
        this.selectedBinIndex = -1;

        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');

        startBP.setValue(this.selectedStartBP);
        stopBP.setValue(this.selectedStopBP);

        this.populateFields();

        this.selectedWindow.setTitle('Create Part');
    },

    openCreatePartInDesign: function(veproject,selectedPart,selectedSequence){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());
        currentTab.el.mask();
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog', {renderTo: currentTabEl}).show();
        var form = this.selectedWindow.down('form').getForm();
        var partName  = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var specifiedSequence = form.findField('specifiedSequence');
        // specifiedSequence.name = "DESpecifiedSequence";
        var rawGenbank;

        var doneButton = this.selectedWindow.down("button[cls='changePartDefinitionDoneBtn']");
        var submitButton = this.selectedWindow.down("button[cls='createNewPartInDE']");
        doneButton.hide();
        submitButton.show();
        submitButton.addCls("createNewPartInDE");

        partSource.setReadOnly(false);
        sourceData.setReadOnly(false);
        sourceData.setFieldLabel('Raw Sequence');

        if(selectedPart.get("name")) {
            partName.setValue(selectedPart.get("name"));
        }
        
        var newPart = Ext.create("Teselagen.models.Part");
        
        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: "Genbank",
            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
            sequenceFileName: "untitled.gb",
            partSource: "New Part"
        });

        var newSequenceManager = Ext.create("Teselagen.manager.SequenceManager");

        sourceData.on("change", function(text) {
            newSequenceManager.sequence = Teselagen.bio.sequence.DNATools.createDNA(text);
            rawGenbank = newSequenceManager.toGenbank().toString();
            newSequenceManager.toGenbank().setLocus(partSource.getValue());
            newSequenceManager.name = (partSource.getValue());
            newSequenceFile.setSequenceFileContent(rawGenbank);
            newSequenceFile.setSequenceManager(newSequenceManager);
            startBP.setValue(1);
            stopBP.setValue(newSequenceFile.getLength());
            specifiedSequence.setValue("Whole sequence");
        });

        partSource.on("change", function(text) {
            newSequenceManager.name = (partSource.getValue());
            newSequenceFile.setPartSource(text);
        });

        this.selectedPart = selectedPart;

        this.selectedSequence = newSequenceFile;

        // this.populateFields();
        this.selectedBinIndex = null;
        this.selectedBinIndex = -1;

        this.selectedWindow.setTitle('Create Part');
    },

    onValidateFields: function() {
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName').getValue();
        var partSource = form.findField('partSource').getValue();
        var sourceData = form.findField('sourceData').getValue();

        if(!name || !partSource || !sourceData) {
            if(name=='') {
                Ext.MessageBox.alert("Warning", "The 'Part Name' field is required to create a part.");
                return false;
            } else if(!partSource) {
                Ext.MessageBox.alert("Warning", "The 'Part Source' field is required to create a part.");
                return false;
            } else if (!sourceData) {
                Ext.MessageBox.alert("Warning", "The 'Raw Sequence' field is required to create a part.");
                return false;
            }
        } else {
            return true;
        }
    },

    onCreateNewPartInDEBtnClick: function() {
        var self = this;

        var ready = this.onValidateFields();


        if(ready) {

        var inspectorController = Vede.application.getController("DeviceEditor.InspectorController");
        var activeProject = inspectorController.activeProject;
        var yIndex = activeProject.bins().getAt(inspectorController.selectedBinIndex).cells().indexOf(inspectorController.selectedCell);

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName').getValue();
        var partSource = form.findField('partSource').getValue();
        var sourceData = form.findField('sourceData').getValue();
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        var newSeq = Ext.create("Teselagen.models.SequenceFile", {
            name: partSource,
            sequenceFileFormat: "GENBANK",
            sequenceFileContent: this.selectedSequence.data.sequenceFileContent,
            sequenceFileName: partSource + ".gb",
            partSource: partSource
        });

        var newFeature = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: name,
                type: 'misc_feature',
                start: (startBP.getValue()-1),
                end: stopBP.getValue(),
                strand: 1,
                featureNotes: ''
        });

        self.selectedSequence = newSeq;

        var saveSequence = function(sequence,cb){
            sequence.save({
                success: function (msg,operation) {
                    var response = JSON.parse(operation.response.responseText);

                    if(response.duplicated)
                    {
                        if(typeof(cb)=="function") cb(true);
                        Ext.MessageBox.alert("Warning", "An identical sequence with the same name already exists in the sequence library, no changes to save!");
                    }
                    else 
                        {
                            if(typeof(cb)=="function") cb(false);
                        }
                },
                failure: function() {
                    if(typeof(cb)=="function") cb(false);
                }
            });
        };

            self.selectedSequence.processSequence(function(err,seqMgr,gb){
                seqMgr.addFeature(newFeature,true);
                seqMgr.name = partSource;
                var rawGenbank = seqMgr.toGenbank().toString();
                self.selectedSequence.setSequenceFileContent(rawGenbank);
                self.selectedSequence.setSequenceManager(seqMgr);
                saveSequence(self.selectedSequence,function(err){
                    if(err) {
                        return null;
                    }

                    var partDef = {
                            name: name,
                            partSource: partSource,
                            genbankStartBP: startBP.getValue(),
                            endBP: stopBP.getValue(),
                            revComp: revComp.getValue(),
                    };
                    self.selectedPart.set(partDef);
                    self.selectedPart.setSequenceFile(self.selectedSequence);

                    self.selectedPart.save({
                        callback: function(){
                            var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
                            currentTab.model.parts().add(self.selectedPart);

                            toastr.options.onclick = null;
                            
                            toastr.info("Part Definition Changed");
                            Vede.application.fireEvent(self.DeviceEvent.RELOAD_DESIGN);
                            Vede.application.fireEvent(self.DeviceEvent.RERENDER_COLLECTION_INFO);
                            Vede.application.fireEvent(self.DeviceEvent.SELECT_CELL, inspectorController.selectedCell, inspectorController.selectedBinIndex, yIndex);

                            self.selectedWindow.destroy();
                            currentTab.el.unmask();
                        }
                    });
                });

            });
        }
    },

    onChangePartDefinitionDoneBtnClick: function(){
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName').getValue();
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');
            
        if (this.selectedPart) {
            
            var oldDef = {
                name: this.selectedPart.get("name"),
                partSource: this.selectedPart.get("partSource"),
                genbankStartBP: this.selectedPart.get("genbankStartBP"),
                endBP: this.selectedPart.get("endBP"),
                revComp: this.selectedPart.get("revComp")
            };
            var newDef = {
                name: name,
                partSource: partSource.getValue(),
                genbankStartBP: startBP.getValue(),
                endBP: stopBP.getValue(),
                revComp: revComp.getValue(),
                features: this.selectedSequence.getSequenceManager().featuresByRangeText(
                                startBP.getValue(), stopBP.getValue())
            };
            
            this.selectedSequence.set({
                partSource: partSource.getValue(),
                sequenceFileContent: sourceData.getValue()
            });
            
            this.selectedPart.set(newDef);

            if(this.selectedBinIndex!=-1) {
                Vede.application.fireEvent(this.DeviceEvent.SELECT_PART, this.selectedPart, this.selectedBinIndex);

                var self = this;
                Vede.application.fireEvent(this.DeviceEvent.SAVE_DESIGN, function(){
                    self.selectedPart.save({
                        callback: function(record, operation, success){
                            if(success) {
                                toastr.options.onclick = null;
                                
                                toastr.info("Part Definition Changed");
                                Vede.application.fireEvent(self.DeviceEvent.RELOAD_DESIGN);
                                Vede.application.fireEvent(self.DeviceEvent.RERENDER_COLLECTION_INFO);
                            } else {
                                Ext.Msg.alert("Duplicate Part Definition", "A part with that name and definition already exists in the part library.");
                                record.reject();

                                // Manually trigger an update event to force the 
                                // part info form to reload.
                                record.set("name", record.get("name"));
                            }
                        }
                    });
                });
                
            }
            else Vede.application.fireEvent(this.DeviceEvent.PART_CREATED, this.selectedSequence, this.selectedPart);

            this.selectedWindow.close();
        } else {
            // Creating new part in DE
        }

    },

    onCancelPartDefinitionBtnClick: function() {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.el.unmask();
        this.selectedWindow.close();
        if(!this.selectedPart.data.partSource) {
            Vede.application.fireEvent(Teselagen.event.DeviceEvent.CLEAR_PART);
        }
    },

    onCreatePartWindowClose: function() {
        if(!this.selectedPart.data.partSource) {
            Vede.application.fireEvent(Teselagen.event.DeviceEvent.CLEAR_PART);
        }
    },

    init: function () {
    
        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;

        this.control({
            "button[cls='changePartDefinitionDoneBtn']": {
                click: this.onChangePartDefinitionDoneBtnClick
            },
            "button[cls='cancelPartDefinitionBtn']": {
                click: this.onCancelPartDefinitionBtnClick
            },
            "button[cls='openPartInVEBtn']": {
                click: this.onOpenPartInVEBtnClick
            },
            "button[cls='createNewPartInDE']": {
                click: this.onCreateNewPartInDEBtnClick
            },
            "combobox[name='specifiedSequence']": {
                change: this.onSpecifiedSequenceChange
            },
            "window[name='Create Part']": {
                close: this.onCreatePartWindowClose
            }
        });
        
        this.application.on(this.DeviceEvent.OPEN_CHANGE_PART_DEFINITION, this.open, this);
        this.application.on(this.DeviceEvent.CREATE_PART_DEFINITION, this.openCreatePart, this);
        this.application.on(this.DeviceEvent.CREATE_PART_IN_DESIGN, this.openCreatePartInDesign, this);
        this.application.on(this.DeviceEvent.CLOSE_PART_CREATE_WINDOW, this.onCreatePartWindowClose, this);

        this.application.on(this.SelectionEvent.SELECTION_CHANGED, this.onSequenceSelectionChanged, this);
    }
});
