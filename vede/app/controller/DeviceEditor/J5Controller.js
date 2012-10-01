Ext.define('Vede.controller.DeviceEditor.J5Controller', {
    extend: 'Ext.app.Controller',

    j5Window: null,
    j5ParamsWindow: null,
    automationParamsWindow: null,

    onOpenJ5: function() {
        this.j5Window = Ext.create("Vede.view.DeviceEditor.j5Controls").show();
    },

    onEditJ5ParamsBtnClick: function() {
        this.j5ParamsWindow = Ext.create("Vede.view.DeviceEditor.j5Parameters").show();
    },

    onUseServerPlasmidsRadioBtnClick: function(e) {
    },

    onCustomizeAutomationParamsBtnClick: function() {
        this.automationParamsWindow = 
            Ext.create("Vede.view.DeviceEditor.j5AutomationParameters").show();
    },

    onResetAutomationParams: function() {
    },

    onAutomationParamsCancelClick: function() {
        this.automationParamsWindow.close();
    },

    onAutomationParamsOKClick: function() {
        //this.saveAutomationParams();
        this.automationParamsWindow.close();
    },

    init: function() {
        this.control({
            "#editj5ParamsBtn": {
                click: this.onEditJ5ParamsBtnClick
            },
            "#useServerPlasmidsRadioBtn": {
                change: this.onUseServerPlasmidsRadioBtnClick
            },
            "#useEmptyPlasmidsRadioBtn": {
                change: this.onUseEmptyPlasmidsRadioBtnClick
            },
            "#useServerOligosRadioBtn": {
                change: this.onUseServerOligosRadioBtnClick
            },
            "#useEmptyOligosRadioBtn": {
                change: this.onUseEmptyOligosRadioBtnClick
            },
            "#useServerSynthesesRadioBtn": {
                change: this.onUseServerSynthesesRadioBtnClick
            },
            "#useEmptySynthesesRadioBtn": {
                change: this.onUseEmptySynthesesRadioBtnClick
            },
            "#customizeAutomationParamsBtn": {
                click: this.onCustomizeAutomationParamsBtnClick
            },
            "#runj5Btn": {
                click: this.onRunJ5BtnClick
            },
            "#loadAssemblyBtn": {
                click: this.onLoadAssemblyBtnClick
            },
            "#automationParamsCancelBtn": {
                click: this.onAutomationParamsCancelClick
            },
            "#automationParamsOKBtn": {
                click: this.onAutomationParamsOKClick
            },
            "#automationParamsResetBtn": {
                click: this.onResetAutomationParams
            },
        });
        
        this.application.on("openj5", this.onOpenJ5, this);
    }
});
