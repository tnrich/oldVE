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
        this.selectedWindow.close();

        this.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE,
                                   this.selectedSequence, this.selectedPart);
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
        if(this.selectedStartBP!==null && this.selectedStopBP!==null)
        {
            startBP.setValue(this.selectedStartBP);
            stopBP.setValue(this.selectedStopBP);
        }
        else
        {
            startBP.setValue(this.selectedPart.get('genbankStartBP'));
            stopBP.setValue(this.selectedPart.get('endBP'));
        }
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
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog').show();
        this.selectedPart = selectedPart;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex = selectedBinIndex;
        this.selectedVEProject = null,
        this.populateFields();

        console.log(this.selectedPart);
        console.log(this.selectedSequence);
    },

    openCreatePart: function(veproject,selectedPart,selectedSequence){

        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog').show();
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
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog').show();
        var form = this.selectedWindow.down('form').getForm();
        var partName  = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var specifiedSequence = form.findField('specifiedSequence');
        var newSequenceManager;
        var rawGenbank;

        var doneButton = this.selectedWindow.down("button[cls='changePartDefinitionDoneBtn']");
        var submitButton = this.selectedWindow.down("button[cls='createNewPartInDE']");
        doneButton.hide();
        submitButton.show();
        submitButton.addCls("createNewPartInDE");

        partSource.setReadOnly(false);
        sourceData.setReadOnly(false);
        sourceData.setFieldLabel('Raw Sequence');
        
        var newPart = Ext.create("Teselagen.models.Part");
        
        var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
            sequenceFileFormat: "Genbank",
            sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
            sequenceFileName: "untitled.gb",
            partSource: "New Part"
        });

        sourceData.on("change", function(text) {
            newSequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
                sequence: Teselagen.bio.sequence.DNATools.createDNA(text)
            });
            rawGenbank = newSequenceManager.toGenbank().toString();
            newSequenceManager.toGenbank().setLocus(partSource.getValue());
            newSequenceFile.setSequenceFileContent(rawGenbank);
            newSequenceFile.setSequenceManager(newSequenceManager);
            startBP.setValue(1);
            stopBP.setValue(newSequenceFile.getLength());
            specifiedSequence.setValue("Whole sequence");
        });

        partSource.on("change", function(text) {
            newSequenceFile.setPartSource(text);
            newSequenceFile.setSequenceFileName(text);
        });

        this.selectedPart = newPart;

        this.selectedSequence = newSequenceFile;

        // this.populateFields();
        this.selectedBinIndex = null;
        this.selectedBinIndex = -1;

        this.selectedWindow.setTitle('Create Part');
    },

    onCreateNewPartInDEBtnClick: function() {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        var now = new Date();
        nowTime = Ext.Date.format(now, "g:i:s A  ");
        nowDate = Ext.Date.format(now, "l, F d, Y");

        var seqDef = {
            name: partSource.getValue(),
            dateCreated: nowDate,
            dateModified: nowDate,
            user_id: Teselagen.manager.ProjectManager.currentUser.internalId
        }

        this.selectedSequence.set(seqDef);

        this.selectedPart.setSequenceFile(this.selectedSequence);

        var partDef = {
                name: name.getValue(),
                partSource: partSource.getValue(),
                genbankStartBP: startBP.getValue(),
                endBP: stopBP.getValue(),
                revComp: revComp.getValue(),
                dateCreated: nowDate,
                dateModified: nowDate,
                devicedesign_id: currentTab.modelId,
                user_id: Teselagen.manager.ProjectManager.currentUser.internalId
        };
        this.selectedPart.set(partDef);

        //save part
        //save sequence
        console.log("the following two objects need to be saved.");
        console.log(this.selectedPart);
        console.log(this.selectedSequence);
    },

    onChangePartDefinitionDoneBtnClick: function(){
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName');
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
                name: name.getValue(),
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
        this.selectedWindow.close();
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
            }
        });
        
        this.application.on(this.DeviceEvent.OPEN_CHANGE_PART_DEFINITION, this.open, this);
        this.application.on(this.DeviceEvent.CREATE_PART_DEFINITION, this.openCreatePart, this);
        this.application.on(this.DeviceEvent.CREATE_PART_IN_DESIGN, this.openCreatePartInDesign, this);

        this.application.on(this.SelectionEvent.SELECTION_CHANGED, this.onSequenceSelectionChanged, this);
    }
});
