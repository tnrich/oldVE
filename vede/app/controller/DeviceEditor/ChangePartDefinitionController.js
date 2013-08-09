Ext.define('Vede.controller.DeviceEditor.ChangePartDefinitionController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.event.DeviceEvent",
               "Teselagen.event.MapperEvent"],

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
            startBP.setValue(this.selectedStartBP);
            stopBP.setValue(this.selectedStopBP);        }
        else
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

    open: function(selectedPart,selectedBinIndex,selectedSequence){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog', {renderTo: currentTabEl}).show();
        this.selectedPart = selectedPart;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex =selectedBinIndex;
        this.selectedVEProject = null,
        this.populateFields();
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

        //console.log(this.selectedStartBP);
        startBP.setValue(this.selectedStartBP);
        stopBP.setValue(this.selectedStopBP);

        this.populateFields();

        this.selectedWindow.setTitle('Create Part');
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
                            /*Teselagen.manager.GridCommandPatternManager.addCommand({
                            	type: "PART",
                            	data: {
                            		type: "DEF",
                            		part: record,
                            		oldDef: oldDef,
                            		newDef: newDef
                            	}
                    		});*/
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
            "combobox[name='specifiedSequence']": {
                change: this.onSpecifiedSequenceChange
            }
        });
        
        this.application.on(this.DeviceEvent.OPEN_CHANGE_PART_DEFINITION, this.open, this);
        this.application.on(this.DeviceEvent.CREATE_PART_DEFINITION, this.openCreatePart, this);

        this.application.on(this.SelectionEvent.SELECTION_CHANGED, this.onSequenceSelectionChanged, this);

        /*+
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.J5ControlsUtils = Teselagen.utils.J5ControlsUtils;

        this.j5Parameters = Ext.create("Teselagen.models.J5Parameters");
        this.j5Parameters.setDefaultValues();

        this.automationParameters = Ext.create("Teselagen.models.DownstreamAutomationParameters");
        this.automationParameters.setDefaultValues();
        */
    }
});
