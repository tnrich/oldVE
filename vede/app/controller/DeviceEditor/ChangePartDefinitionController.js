Ext.define('Vede.controller.DeviceEditor.ChangePartDefinitionController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.event.MapperEvent"],

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
        this.selectedPart = selectedPart;
        this.selectedVEProject = veproject;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex = null;
        this.selectedBinIndex = -1;

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

        this.selectedPart.set('name',name.getValue());
        this.selectedSequence.set('partSource',partSource.getValue());
        this.selectedPart.set('partSource',partSource.getValue());

        if(this.selectedSequence)
        {
            this.selectedSequence.set('partSource',partSource.getValue());
            this.selectedPart.set('partSource',partSource.getValue());
            this.selectedSequence.set('sequenceFileContent',sourceData.getValue());
        }

        this.selectedPart.set('genbankStartBP',startBP.getValue());
        this.selectedPart.set('endBP',stopBP.getValue());

        this.selectedPart.set('revComp',revComp.getValue());

        if(this.selectedBinIndex!=-1) Vede.application.fireEvent("partSelected",this.selectedPart,this.selectedBinIndex);
        else Vede.application.fireEvent("partCreated",this.selectedSequence,this.selectedPart);

        this.selectedWindow.close();
    },

    onCancelPartDefinitionBtnClick: function() {
        this.selectedWindow.close();
    },

    init: function () {
    
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
        
        this.application.on("openChangePartDefinition", this.open, this);
        this.application.on("createPartDefinition", this.openCreatePart, this);

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