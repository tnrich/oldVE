Ext.define('Vede.controller.DeviceEditor.J5Controller', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.utils.J5ControlsUtils",
               "Teselagen.manager.J5CommunicationManager",
               "Teselagen.manager.ProjectManager",
               "Teselagen.bio.parsers.GenbankManager",
               "Ext.MessageBox"],

    DeviceDesignManager: null,
    J5ControlsUtils: null,

    j5Window: null,
    j5ParamsWindow: null,
    automationParamsWindow: null,

    j5Parameters: null,
    j5ParameterFields: [],

    automationParameters: null,
    automationParameterFields: [],

    plasmidsListText: null,
    oligosListText: null,
    directSynthesesListText: null,

    onOpenJ5: function() {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var j5Window = Ext.create("Vede.view.de.j5Controls").show();
        currentTab.j5Window = j5Window;
        this.j5Window = j5Window;
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

    onSourcePlateListFileSelectorChange: function(me, value) {
        var sourcePlateFile = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processSourcePlateFile() {
            that.sourcePlateFileText = Base64.encode(fr.result);
        }

        fr.onload = processSourcePlateFile;
        fr.readAsText(sourcePlateFile.files[0]);
    },

    onZippedPlateFilesSelectorChange: function(me, value) {
        var zippedPlateFile = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processZippedPlateFile() {
            that.zippedPlateFilesSelector = fr.result.replace("data:application/zip;base64,","");
        }

        fr.onload = processZippedPlateFile;
        fr.readAsDataURL(zippedPlateFile.files[0]);
    },

    onAssemblyFileSelectorChange: function(me, value) {
        var assemblyFileSelector = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processAssemblyFileSelector() {
            that.assemblyFileText = Base64.encode(fr.result);
        }

        fr.onload = processAssemblyFileSelector;
        fr.readAsText(assemblyFileSelector.files[0]);
    },

    onUseServerPlasmidsRadioBtnChange: function(e) {
        // We only want to reset the file field if we are checking the radio button.
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='plasmidsListFileSelector']")[0].reset();
        }
    },

    onUseEmptyPlasmidsRadioBtnChange: function(e) {
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='plasmidsListFileSelector']")[0].reset();
        }
    },

    onPlasmidsListFileSelectorChange: function(me, value) {
        var plasmidsFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        Ext.ComponentQuery.query("radio[cls='useServerPlasmidsRadioBtn']")[0].setValue(false);
        Ext.ComponentQuery.query("radio[cls='useEmptyPlasmidsRadioBtn']")[0].setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        var that = this;

        function processPlasmidsFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if (headerFields.length != 5 || headerFields[0] != "Plasmid Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master plasmids list file.\n" +
                      "Please check the formatting of the file.");

                that.plasmidsListText = null;
            } else {
                that.plasmidsListText = result;
                console.log(that);
                console.log(this);
            }
        }

        fr.onload = processPlasmidsFile;
        fr.readAsText(plasmidsFile.files[0]);

    },

    onUseServerOligosRadioBtnChange: function(e) {
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='oligosListFileSelector']")[0].reset();
        }
    },

    onUseEmptyOligosRadioBtnChange: function(e) {
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='oligosListFileSelector']")[0].reset();
        }
    },

    onOligosListFileSelectorChange: function(me) {
        var oligosFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        Ext.ComponentQuery.query("radio[cls='useServerOligosRadioBtn']")[0].setValue(false);
        Ext.ComponentQuery.query("radio[cls='useEmptyOligosRadioBtn']")[0].setValue(false);
        
        me.inputEl.dom.value = this.getFileNameFromField(me);

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

        fr.onload = processOligosFile;
        fr.readAsText(oligosFile.files[0]);
    },

    onUseServerSynthesesRadioBtnChange: function(e) {
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='directSynthesesFileSelector']")[0].reset();
        }
    },

    onUseEmptySynthesesRadioBtnChange: function(e) {
        if(e.getValue()) {
            Ext.ComponentQuery.query("component[cls='directSynthesesFileSelector']")[0].reset();
        }
    },

    onDirectSynthesesFileSelectorChange: function(me) {
        var synthesesFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        Ext.ComponentQuery.query("radio[cls='useServerSynthesesRadioBtn']")[0].setValue(false);
        Ext.ComponentQuery.query("radio[cls='useEmptySynthesesRadioBtn']")[0].setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        function processSynthesesFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if (headerFields.length != 5 || headerFields[0] != "Direct Synthesis Name" ||
                headerFields[1] != "Alias" || headerFields[2] != "Contents" ||
                headerFields[3] != "Length" || headerFields[4] != "Sequence") {
             
                alert("Invalid headers in master syntheses list file.\n" +
                      "Please check the formatting of the file.");

                this.directSynthesesListText = null;
            } else {
                this.directSynthesesListText = result;
            }
        }

        fr.onload = processSynthesesFile;
        fr.readAsText(synthesesFile.files[0]);
    },

    onCustomizeAutomationParamsBtnClick: function() {
        this.automationParamsWindow = 
            Ext.create("Vede.view.de.j5AutomationParameters").show();
        this.populateAutomationParametersDialog();
    },

    onResetAutomationParamsBtnClick: function() {
        this.automationParameters.setDefaultValues();
        this.populateAutomationParametersDialog();
    },
    populateAutomationParametersDialog: function() {
        this.automationParameters.fields.eachKey(function(key) {
            console.log(key);
            if(key !== "id" && key !== "j5run_id") {
                Ext.ComponentQuery.query("component[cls='" + key + "']")[0].setValue(
                    this.automationParameters.get(key));
            }
        }, this);
    },

    saveAutomationParams: function() {
        this.automationParameters.fields.eachKey(function(key) {
            if(key !== "id" && key !== "j5run_id") {
                this.automationParameters.set(key,
                    Ext.ComponentQuery.query("component[cls='" + key + "']")[0].getValue());
            }
        }, this);
    },

    createLoadingMessage: function(){
        var msgBox = Ext.MessageBox.show({
           title: 'Please wait',
           msg: 'Preparing input parameters',
           progressText: 'Initializing...',
           width:300,
           progress:true,
           closable:false
       });

        return {
            close: function(){
                msgBox.close();
            },
            update: function(progress,msg){
                msgBox.updateProgress(progress/100, progress+'% completed',msg);
            }
        };
    },



    onRunJ5BtnClick: function(btn) {
        var loadingMessage = this.createLoadingMessage();

        var masterPlasmidsList;
        var masterPlasmidsListFileName;

        var masterOligosList;
        var masterOligosListFileName;

        var masterDirectSynthesesList;
        var masterDirectSynthesesListFileName;

        if(Ext.ComponentQuery.query("radio[cls='useServerPlasmidsRadioBtn']")[0].getValue()) {
            masterPlasmidsList = "";
            masterPlasmidsListFileName = "";
        } else if(Ext.ComponentQuery.query("radio[cls='useEmptyPlasmidsRadioBtn']")[0].getValue()) {
            masterPlasmidsList = this.J5ControlsUtils.generateEmptyPlasmidsList();
            masterPlasmidsListFileName = "j5_plasmids.csv";
        } else {
            masterPlasmidsList = this.plasmidsListText;
            masterPlasmidsListFileName = this.getFileNameFromField(
                Ext.ComponentQuery.query("component[cls='plasmidsListFileSelector']")[0]);
        }

        if(Ext.ComponentQuery.query("radio[cls='useServerOligosRadioBtn']")[0].getValue()) {
            masterOligosList = "";
            masterOligosListFileName = "";
        } else if(Ext.ComponentQuery.query("radio[cls='useEmptyOligosRadioBtn']")[0].getValue()) {
            masterOligosList = this.J5ControlsUtils.generateEmptyOligosList();
            masterOligosListFileName = "j5_oligos.csv";
        } else {
            masterOligosList = this.plasmidsListText;
            masterOligosListFileName = this.getFileNameFromField(
                Ext.ComponentQuery.query("component[cls='oligosListFileSelector']")[0]);
        }

        if(Ext.ComponentQuery.query("radio[cls='useServerSynthesesRadioBtn']")[0].getValue()) {
            masterDirectSynthesesList = "";
            masterDirectSynthesesListFileName = "";
        } else if(Ext.ComponentQuery.query("radio[cls='useEmptySynthesesRadioBtn']")[0].getValue()) {
            masterDirectSynthesesList = this.J5ControlsUtils.generateEmptyDirectSynthesesList();
            masterDirectSynthesesListFileName = "j5_directsyntheses.csv";
        } else {
            masterDirectSynthesesList = this.plasmidsListText;
            masterDirectSynthesesListFileName = this.getFileNameFromField(
                Ext.ComponentQuery.query("component[cls='directSynthesesListFileSelector']")[0]);
        }

        var masterFiles = {};
        masterFiles["masterPlasmidsList"]                 = masterPlasmidsList;
        masterFiles["masterPlasmidsListFileName"]         = masterPlasmidsListFileName;
        masterFiles["masterOligosList"]                   = masterOligosList;
        masterFiles["masterOligosListFileName"]           = masterOligosListFileName;
        masterFiles["masterDirectSynthesesList"]          = masterDirectSynthesesList;
        masterFiles["masterDirectSynthesesListFileName"]  = masterDirectSynthesesListFileName;

        var assemblyMethod = Ext.ComponentQuery.query("component[cls='assemblyMethodSelector']")[0].getValue();
        
        if(assemblyMethod == "Mock Assembly") assemblyMethod = "Mock";
        if(assemblyMethod == "SLIC/Gibson/CPEC") assemblyMethod = "SLIC/Gibson/CPEC";
        if(assemblyMethod == "Golden Gate") assemblyMethod = "GoldenGate";

        if(assemblyMethod == "Combinatorial Mock Assembly") assemblyMethod = "CombinatorialMock";
        if(assemblyMethod == "Combinatorial SLIC/Gibson/CPEC") assemblyMethod = "CombinatorialSLICGibsonCPEC";
        if(assemblyMethod == "Combinatorial Golden Gate") assemblyMethod = "CombinatorialGoldenGate";

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm = Teselagen.manager.J5CommunicationManager;
        currentTab.j5Window.j5comm.setParameters(this.j5Parameters,masterFiles,assemblyMethod);
        
        loadingMessage.update(30,"Saving design");

        Vede.application.fireEvent("saveDesignEvent",function(){
            loadingMessage.update(60,"Executing request");
            currentTab.j5Window.j5comm.generateAjaxRequest(function(success,responseData){
                if(success)
                {
                    loadingMessage.update(100,"Completed");
                    loadingMessage.close();
                }
                else
                {
                    console.log(responseData.responseText);
                    loadingMessage.close();
                    var messagebox = Ext.MessageBox.show({
                        title: "Execution Error",
                        msg: responseData.responseText,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                    Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                    },100);
                }
            });
        });
        
        

    },

    onDistributePCRBtn: function(){

        console.log("Distribute PCR Reactions");
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm = Teselagen.manager.J5CommunicationManager;
               
        data = {};
        data.sourcePlateFileText = this.sourcePlateFileText;
        data.zippedPlateFilesSelector = this.zippedPlateFilesSelector;
        data.assemblyFileText = this.assemblyFileText;
        data.params = this.automationParameters.data;
        data.reuse = Ext.ComponentQuery.query("component[name='automationParamsFileSource']")[0].getValue();

        var loadingMessage = this.createLoadingMessage();

        loadingMessage.update(60,"Executing request");
        currentTab.j5Window.j5comm.distributePCRRequest(data,function(success,responseData){
            if(success)
            {
                loadingMessage.update(100,"Completed");
                loadingMessage.close();
            }
            else
            {
                console.log(responseData.responseText);
                loadingMessage.close();
                var messagebox = Ext.MessageBox.show({
                    title: "Execution Error",
                    msg: responseData.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                messagebox.zIndexManager.bringToFront(messagebox);
                },100);
            }
        });

    },

    /**
     * Given a filefield Component, returns the name of the file selected,
     * filtering out the directory information.
     *
     * TODO: maybe move to a utils file so we can set the display value to this
     * whenever the onchange event of a file input field is fired? This would
     * prevent the 'fakepath' directory from showing up on some browsers.
     */
    getFileNameFromField: function(field) {
        var rawValue = field.getValue();
        var fileName;

        if(rawValue.indexOf("\\") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("\\") + 1);
        } else if (rawValue.indexOf("/") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("/") + 1);
        } else {
            fileName = rawValue;
        }

        return fileName;
    },

    onLoadAssemblyBtnClick: function() {
    },

    onAutomationParamsCancelClick: function() {
        this.automationParamsWindow.close();
    },

    onAutomationParamsOKClick: function() {
        this.saveAutomationParams();
        this.automationParamsWindow.close();
    },

    populateJ5ParametersDialog: function() {
        this.j5Parameters.fields.eachKey(function(key) {
            if(key !== "id" && key !== "j5run_id") {
                Ext.ComponentQuery.query("component[cls='" + key + "']")[0].setValue(
                    this.j5Parameters.get(key));
            }
        }, this);
    },

    saveJ5Parameters: function() {
        this.j5Parameters.fields.eachKey(function(key) {
            if(key !== "id") {
                this.j5Parameters.set(key,
                    Ext.ComponentQuery.query("component[cls='" + key + "']")[0].getValue());
            }
        }, this);
    },
    onDownloadj5Btn: function(button, e, options) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm.downloadResults(button);
    },

    onDownloadDownstreamAutomationBtn: function(button, e, options){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        currentTab.j5Window.j5comm.downloadDownstreamAutomationResults(button);
    },

    onPlasmidsItemClick: function( grid, record ){
        
        this.j5Window.close();

        console.log(record);
        
        var newSequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone(
            "GENBANK",
            record.data.fileContent,
            record.data.name,
            ""
        );
        
        Teselagen.manager.ProjectManager.openSequence(newSequence);
        
    },

    init: function() {
        this.control({
            "button[cls='editj5ParamsBtn']": {
                click: this.onEditJ5ParamsBtnClick
            },
            "button[cls='resetj5DefaultParamsBtn']": {
                click: this.resetDefaultj5Params
            },
            "button[cls='resetj5ServerParamsBtn']": {
                click: this.resetServerj5Params
            },
            "button[cls='j5ParamsCancelBtn']": {
                click: this.onj5ParamsCancelBtnClick
            },
            "button[cls='j5ParamsOKBtn']": {
                click: this.onj5ParamsOKBtnClick
            },
            "radio[cls='useServerPlasmidsRadioBtn']": {
                change: this.onUseServerPlasmidsRadioBtnChange
            },
            "radio[cls='useEmptyPlasmidsRadioBtn']": {
                change: this.onUseEmptyPlasmidsRadioBtnChange
            },
            "component[cls='plasmidsListFileSelector']": {
                change: this.onPlasmidsListFileSelectorChange
            },
            "radio[cls='useServerOligosRadioBtn']": {
                change: this.onUseServerOligosRadioBtnChange
            },
            "radio[cls='useEmptyOligosRadioBtn']": {
                change: this.onUseEmptyOligosRadioBtnChange
            },
            "component[cls='oligosListFileSelector']": {
                change: this.onOligosListFileSelectorChange
            },
            "radio[cls='useServerSynthesesRadioBtn']": {
                change: this.onUseServerSynthesesRadioBtnChange
            },
            "radio[cls='useEmptySynthesesRadioBtn']": {
                change: this.onUseEmptySynthesesRadioBtnChange
            },
            "component[cls='directSynthesesFileSelector']": {
                change: this.onDirectSynthesesFileSelectorChange
            },
            "button[cls='customizeAutomationParamsBtn']": {
                click: this.onCustomizeAutomationParamsBtnClick
            },
            "button[cls='runj5Btn']": {
                click: this.onRunJ5BtnClick
            },
            "button[cls='loadAssemblyBtn']": {
                click: this.onLoadAssemblyBtnClick
            },
            "button[cls='automationParamsCancelBtn']": {
                click: this.onAutomationParamsCancelClick
            },
            "button[cls='automationParamsOKBtn']": {
                click: this.onAutomationParamsOKClick
            },
            "button[cls='automationParamsResetBtn']": {
                click: this.onResetAutomationParamsBtnClick
            },
            "button[cls='downloadj5Btn']": {
                click: this.onDownloadj5Btn
            },
            "button[cls='downloadDownstreamAutomationBtn']": {
                click: this.onDownloadDownstreamAutomationBtn
            },
            "component[cls='sourcePlateListSelector']": {
                change: this.onSourcePlateListFileSelectorChange
            },
            "component[cls='zippedPlateFilesSelector']": {
                change: this.onZippedPlateFilesSelectorChange
            },
            "component[cls='assemblyFileSelector']": {
                change: this.onAssemblyFileSelectorChange
            },
            "button[cls='distributePCRBtn']": {
                click: this.onDistributePCRBtn
            },
            "gridpanel[title=Plasmids]": {
                itemclick: this.onPlasmidsItemClick
            }
        });
        
        this.application.on("openj5", this.onOpenJ5, this);

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.J5ControlsUtils = Teselagen.utils.J5ControlsUtils;

        this.j5Parameters = Ext.create("Teselagen.models.J5Parameters");
        this.j5Parameters.setDefaultValues();

        this.automationParameters = Ext.create("Teselagen.models.DownstreamAutomationParameters");
        this.automationParameters.setDefaultValues();
    }
});
