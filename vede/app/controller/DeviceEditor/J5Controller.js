Ext.define('Vede.controller.DeviceEditor.J5Controller', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants"],

    j5Window: null,
    j5ParamsWindow: null,
    automationParamsWindow: null,

    j5Parameters: null,
    j5ParameterFields: [],

    defaultAutomationParameters: {
        "maxDeltaTempAdjacentZonesField": 5,
        "maxDeltaTempZoneAcceptableField": 5,
        "maxMCStepsPerZoneField": 1000,
        "maxWellVolumeField": 100,
        "finalMCTempField": 0.0001,
        "initialMCTempField": 0.1,
        "minPipettingVolumeField": 5,
        "numColumnsField": 12,
        "trialDeltaTempField": 0.1,
        "wellsPerZoneField": 16,
        "zonesPerBlockField": 6
    },
    automationParameters: {},

    plasmidsListText: null,
    oligosListText: null,

    onOpenJ5: function() {
        this.j5Window = Ext.create("Vede.view.de.j5Controls").show();
    },

    onEditJ5ParamsBtnClick: function() {
        this.j5ParamsWindow = Ext.create("Vede.view.de.j5Parameters").show();

        this.populateJ5ParametersDialog();
    },

    resetDefaultj5Params: function() {
        this.j5Parameters.setDefaultValues();
        this.populateJ5ParametersDialog();
    },

    resetServerj5Params: function() {
    },

    onj5ParamsCancelBtnClick: function() {
        this.j5ParamsWindow.close();
    },

    onj5ParamsOKBtnClick: function() {
        this.saveJ5Parameters();
        this.j5ParamsWindow.close();
    },

    onUseServerPlasmidsRadioBtnChange: function(e) {
    },

    onUseEmptyPlasmidsRadioBtnChange: function(e) {
    },

    onPlasmidsListFileSelectorChange: function(me, value) {
        var plasmidsFile = me.extractFileInput().files[0];
        var fr = new FileReader();

        fr.onload = processPlasmidsFile;
        fr.readAsText(plasmidsFile);

        function processPlasmidsFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if (headerFields.length != 5 || headerFields[0] != "Plasmid Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master plasmids list file.\n" +
                      "Please check the formatting of the file.");

                this.plasmidsListText = null;
            } else {
                this.plasmidsListText = result;
            }
        }
    },

    onUseServerOligosRadioBtnChange: function() {
    },

    onUseEmptyOligosRadioBtnChange: function() {
    },

    onOligosListFileSelectorChange: function(me) {
        var oligosFile = me.extractFileInput().files[0];
        var fr = new FileReader();

        fr.onload = processOligosFile;
        fr.readAsText(oligosFile);

        function processOligosFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if (headerFields.length != 5 || (headerFields[0] != "Oligo Name" && 
                                             headerFields[0] != "Oigo Name") || //accounting for typo in example file
                headerFields[1] != "Length" || headerFields[2] != "Tm" ||
                headerFields[3] != "Tm (3' only)" || headerFields[4] != "Sequence") {
             
                alert("Invalid headers in master oligos list file.\n" +
                      "Please check the formatting of the file.");

                this.oligosListText = null;
            } else {
                this.oligosListText = result;
            }
        }
    },

    onUseServerSynthesesRadioBtnChange: function() {
    },

    onUseEmptySynthesesRadioBtnChange: function() {
    },

    onDirectSynthesesFileSelectorChange: function(me) {
        var synthesesFile = me.extractFileInput().files[0];
        var fr = new FileReader();

        fr.onload = processOligosFile;
        fr.readAsText(synthesesFile);

        function processSynthesesFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if (headerFields.length != 5 || headerFields[0] != "Direct Synthesis Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {
             
                alert("Invalid headers in master syntheses list file.\n" +
                      "Please check the formatting of the file.");

                this.synthesesListText = null;
            } else {
                this.synthesesListText = result;
            }
        }
    },

    onCustomizeAutomationParamsBtnClick: function() {
        this.automationParamsWindow = 
            Ext.create("Vede.view.de.j5AutomationParameters").show();
        this.populateAutomationParametersDialog();
    },

    onResetAutomationParamsBtnClick: function() {
        this.resetAutomationParams();
        this.populateAutomationParametersDialog();
    },

    resetAutomationParams: function() {
        Ext.each(Object.keys(this.defaultAutomationParameters), function(key) {
            this.automationParameters[key] = this.defaultAutomationParameters[key];
        }, this);
    },

    populateAutomationParametersDialog: function() {
        Ext.each(Object.keys(this.automationParameters), function(key) {
            Ext.getCmp(key).setValue(this.automationParameters[key]);
        }, this);
    },

    saveAutomationParams: function() {
        Ext.each(Object.keys(this.automationParameters), function(key) {
            this.automationParameters[key] = Ext.getCmp(key).getValue();
        }, this);
    },

    onAutomationParamsCancelClick: function() {
        this.automationParamsWindow.close();
    },

    onAutomationParamsOKClick: function() {
        this.saveAutomationParams();
        this.automationParamsWindow.close();
    },

    populateJ5ParametersDialog: function() {
        Ext.each(this.j5ParameterFields, function(key) {
            Ext.getCmp(key).setValue(this.j5Parameters.get(key));
        }, this);
    },

    saveJ5Parameters: function() {
        Ext.each(this.j5ParameterFields, function(key) {
            this.j5Parameters.set(key, Ext.getCmp(key).getValue());
        }, this);
    },

    init: function() {
        this.control({
            "#editj5ParamsBtn": {
                click: this.onEditJ5ParamsBtnClick
            },
            "#resetj5DefaultParamsBtn": {
                click: this.resetDefaultj5Params
            },
            "#resetj5ServerParamsBtn": {
                click: this.resetServerj5Params
            },
            "#j5ParamsCancelBtn": {
                click: this.onj5ParamsCancelBtnClick
            },
            "#j5ParamsOKBtn": {
                click: this.onj5ParamsOKBtnClick
            },
            "#useServerPlasmidsRadioBtn": {
                change: this.onUseServerPlasmidsRadioBtnChange
            },
            "#useEmptyPlasmidsRadioBtn": {
                change: this.onUseEmptyPlasmidsRadioBtnChange
            },
            "#plasmidsListFileSelector": {
                change: this.onPlasmidsListFileSelectorChange
            },
            "#useServerOligosRadioBtn": {
                change: this.onUseServerOligosRadioBtnChange
            },
            "#useEmptyOligosRadioBtn": {
                change: this.onUseEmptyOligosRadioBtnChange
            },
            "#oligosListFileSelector": {
                change: this.onOligosListFileSelectorChange
            },
            "#useServerSynthesesRadioBtn": {
                change: this.onUseServerSynthesesRadioBtnChange
            },
            "#useEmptySynthesesRadioBtn": {
                change: this.onUseEmptySynthesesRadioBtnChange
            },
            "#directSynthesesFileSelector": {
                change: this.onDirectSynthesesFileSelectorChange
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
                click: this.onResetAutomationParamsBtnClick
            },
        });
        
        this.application.on("openj5", this.onOpenJ5, this);

        this.j5Parameters = Ext.create("Teselagen.models.J5Parameters");

        // j5ParameterFields will be all the keys in j5Parameters except for 'id'.
        this.j5Parameters.fields.eachKey(function(key) {
            if(key !== "id") {
                this.j5ParameterFields.push(key);
            }
        }, this);

        // Set tooltips of input fields automatically.
        Ext.each(this.j5ParameterFields, function(key) {
        });

        this.resetAutomationParams();
    }
});
