Ext.define('Vede.controller.DeviceEditor.ChangePartDefinitionController', {
    extend: 'Ext.app.Controller',

    selectedPart: null,
    selectedWindow: null,
    selectedSequence: null,
    selectedBinIndex: null,

    populateFields:function(){
        var form = this.selectedWindow.down('form').getForm();
        var name = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        name.setValue(this.selectedPart.get('name'));

        if(this.selectedSequence)
        {
            partSource.setValue(this.selectedSequence.get('partSource'));
            sourceData.setValue(this.selectedSequence.get('sequenceFileContent'));
        }

        specifiedSequence.setValue('Whole sequence');
        startBP.setValue(this.selectedPart.get('genbankStartBP'));
        stopBP.setValue(this.selectedPart.get('endBP'));
        revComp.setValue(this.selectedPart.get('revComp'));
    },

    open: function(selectedPart,selectedBinIndex,selectedSequence){
        this.selectedWindow = Ext.create('Vede.view.de.PartDefinitionDialog').show();
        this.selectedPart = selectedPart;
        this.selectedSequence = selectedSequence;
        this.selectedBinIndex =selectedBinIndex;
        this.populateFields();
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

        if(this.selectedSequence)
        {
            this.selectedSequence.set('partSource',partSource.getValue());
            this.selectedSequence.set('sequenceFileContent',sourceData.getValue());
        }

        //specifiedSequence.getValue()('Whole sequence');
        this.selectedPart.set('genbankStartBP',startBP.getValue());
        this.selectedPart.set('endBP',stopBP.getValue());
        this.selectedPart.set('revComp',revComp.getValue());

        Vede.application.fireEvent("partSelected",this.selectedPart,this.selectedBinIndex);
        this.selectedWindow.close();
    },

    init: function () {
    
        this.control({
            "button[cls='changePartDefinitionDoneBtn']": {
                click: this.onChangePartDefinitionDoneBtnClick
            }
        });
        
        this.application.on("openChangePartDefinition", this.open, this);
        /*
        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.J5ControlsUtils = Teselagen.utils.J5ControlsUtils;

        this.j5Parameters = Ext.create("Teselagen.models.J5Parameters");
        this.j5Parameters.setDefaultValues();

        this.automationParameters = Ext.create("Teselagen.models.DownstreamAutomationParameters");
        this.automationParameters.setDefaultValues();
        */
    }
});