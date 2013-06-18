    /**
 * j5 controller
 * @class Vede.controller.DeviceEditor.J5Controller
 */
Ext.define('Vede.controller.DeviceEditor.J5Controller', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants", 
               "Teselagen.manager.DeviceDesignManager", 
               "Teselagen.utils.J5ControlsUtils", 
               "Teselagen.manager.J5CommunicationManager", 
               "Teselagen.manager.ProjectManager", 
               "Teselagen.bio.parsers.GenbankManager", 
               "Ext.window.MessageBox",
               "Teselagen.manager.TasksMonitor"],

    DeviceDesignManager: null,
    J5ControlsUtils: null,

    j5Window: null,
    j5ParamsWindow: null,
    automationParamsWindow: null,
    inspector: null,

    j5Parameters: null,
    j5ParameterFields: [],

    automationParameters: null,
    automationParameterFields: [],

    plasmidsListText: null,
    oligosListText: null,
    directSynthesesListText: null,

    onOpenJ5: function () {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());

        var inspector = currentTab.down('InspectorPanel');

        // if(!currentTab) currentTab = Ext.create("Vede.view.de.j5Controls", {renderTo: currentTabEl}).show();
        // else currentTab.show();
        // this = currentTab;

        var self = this;

        Vede.application.fireEvent("checkj5Ready",function(combinatorial,j5ready){
            if(!j5ready)
            {

                var messagebox = Ext.MessageBox.show({
                    title: "Alert",
                    msg: "Not ready to run j5",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            } else {

            inspector.down("panel[cls='j5InfoTab']").setDisabled(false);
            inspector.setActiveTab(2);

            var store;
            if(combinatorial)
            {
                store = new Ext.data.ArrayStore({
                    fields: ['assemblyMethod'],
                    data : [['Combinatorial Mock Assembly'], ['Combinatorial SLIC/Gibson/CPEC'], ['Combinatorial Golden Gate']]
                });
            }
            else
            {
                store = new Ext.data.ArrayStore({
                    fields: ['assemblyMethod'],
                    data : [['Mock Assembly'], ['SLIC/Gibson/CPEC'], ['Golden Gate']]
                });            }

            var combobox = inspector.down('component[cls="assemblyMethodSelector"]');
            combobox.bindStore(store);
            combobox.setValue(store.first());
            }
        });

        // Set the currentTab's j5Window property to null when the window is closed.
        // This tells the onTabChange function whether the window should be open
        // or closed when the tab is switched.
        // this.on("close", function() {
        //     currentTab = null;
        // }, this);
    },

    /**
     * We render the j5Window to the current tab's el to allow the user to switch
     * between tabs while the window is open. When the tab is switched, however,
     * the modal mask remains, preventing the user from interacting with the tab
     * until the j5Window is hidden again. To fix this, add an event listener to
     * the mainAppPanel which hides the j5Window when the tab is switched away,
     * and re-shows it when the tab is switched back.
     */

     onTabChange: function(j5AdvancedTab, newTab, oldTab) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');
        var runj5Btn = inspector.down("button[cls='runj5Btn']");
        var condenseAssembliesBtn = inspector.down("button[cls='condenseAssembliesBtn']");
        var distributePCRBtn = inspector.down("button[cls='distributePCRBtn']");

        if(newTab.initialCls == "j5InfoTab-Basic") {
                runj5Btn.show();
                distributePCRBtn.hide();
                condenseAssembliesBtn.hide();
        } else {
            j5AdvancedTab.getActiveTab().setActiveTab(0);
            runj5Btn.hide();
            distributePCRBtn.hide();
            condenseAssembliesBtn.show();
        }
        
    },

    onTabChangeSub: function(j5AdvancedTab, newTab, oldTab) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');
        var runj5Btn = inspector.down("button[cls='runj5Btn']");
        var condenseAssembliesBtn = inspector.down("button[cls='condenseAssembliesBtn']");
        var distributePCRBtn = inspector.down("button[cls='distributePCRBtn']");

        if(newTab.initialCls == "condenseAssemblyFiles-box") {
                runj5Btn.hide();
                distributePCRBtn.hide();
                condenseAssembliesBtn.show();
            }else if(newTab.initialCls == "downstreamAutomation-box") {                    
                runj5Btn.hide();
                distributePCRBtn.show();
                condenseAssembliesBtn.hide();
            }
        
    },

    onEditJ5ParamsBtnClick: function () {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var currentTabEl = (currentTab.getEl());
        
        this.j5ParamsWindow = Ext.create("Vede.view.de.j5Parameters", {renderTo: currentTabEl}).show();

        this.populateJ5ParametersDialog();
    },

    resetDefaultj5Params: function () {
        this.j5Parameters.setDefaultValues();
        this.populateJ5ParametersDialog();
    },

    loadServerj5Params: function(){
        
    },

    resetServerj5Params: function () {

        // var loadingMessage = this.createLoadingMessage();

        // loadingMessage.update(60, "Executing request");

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("GetLastUpdatedUserFiles", ''),
            success: function (response) {
                // loadingMessage.update(100, "Completed");
                // loadingMessage.close();
                response = JSON.parse(response.responseText);
                self.j5Parameters.loadValues(response.j5parameters);
                self.populateJ5ParametersDialog();
                isCircular = response.j5parameters.ASSEMBLY_PRODUCT_TYPE == 'circular' ? true : false;
                Ext.getCmp('mainAppPanel').getActiveTab().model.getDesign().getJ5Collection().set('isCircular',isCircular);

            },
            failure: function(responseData, opts) {
                // loadingMessage.close();
                if(responseData)
                {
                    if(responseData.responseText)
                    {
                        var messagebox = Ext.MessageBox.show({
                            title: "Execution Error",
                            msg: responseData.responseText,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });

                        Ext.Function.defer(function () {
                            messagebox.zIndexManager.bringToFront(messagebox);
                        }, 100);       
                    }
                }
            }
        });
    },

    onj5ParamsCancelBtnClick: function () {
        this.j5ParamsWindow.close();
    },

    onj5ParamsOKBtnClick: function () {
        this.saveJ5Parameters();
        this.j5ParamsWindow.close();
    },

    onCondenseAssemblyFilesSelectorChange: function (me, value) {
        var condenseAssemblyFiles = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processCondenseAssemblyFiles() {
            that.condenseAssemblyFilesText = Base64.encode(fr.result);
        }

        fr.onload = processCondenseAssemblyFiles;
        fr.readAsText(condenseAssemblyFiles.files[0]);
    },

    onZippedAssemblyFilesSelectorChange: function (me, value) {
        var zippedAssemblyFiles = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processZippedAssemblyFiles() {
            that.zippedPlateFilesSelector = fr.result.replace("data:application/zip;base64,", "");
        }

        fr.onload = processZippedAssemblyFiles;
        fr.readAsDataURL(zippedAssemblyFiles.files[0]);
    },

    onSourcePlateListFileSelectorChange: function (me, value) {
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

    onZippedPlateFilesSelectorChange: function (me, value) {
        var zippedPlateFile = me.button.fileInputEl.dom;
        var fr = new FileReader();
        me.inputEl.dom.value = this.getFileNameFromField(me);
        var that = this;

        function processZippedPlateFile() {
            that.zippedPlateFilesSelector = fr.result.replace("data:application/zip;base64,", "");
        }

        fr.onload = processZippedPlateFile;
        fr.readAsDataURL(zippedPlateFile.files[0]);
    },

    onAssemblyFileSelectorChange: function (me, value) {
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

    onUseServerPlasmidsRadioBtnChange: function (e) {
        // We only want to reset the file field if we are checking the radio button.
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='plasmidsListFileSelector']").reset();
        }
    },

    onUseEmptyPlasmidsRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='plasmidsListFileSelector']").reset();
        }
    },

    onPlasmidsListFileSelectorChange: function (me, value) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        var plasmidsFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        inspector.down("radio[cls='useServerPlasmidsRadioBtn']").setValue(false);
        inspector.down("radio[cls='useEmptyPlasmidsRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        var that = this;

        function processPlasmidsFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || headerFields[0] != "Plasmid Name" || headerFields[1] != "Alias" || headerFields[2] != "Contents" || headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master plasmids list file.\n" + "Please check the formatting of the file.");

                that.plasmidsListText = null;
            } else {
                that.plasmidsListText = result;
            }
        }

        fr.onload = processPlasmidsFile;
        fr.readAsText(plasmidsFile.files[0]);

    },

    onUseServerOligosRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='oligosListFileSelector']").reset();
        }
    },

    onUseEmptyOligosRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='oligosListFileSelector']").reset();
        }
    },

    onOligosListFileSelectorChange: function (me) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        var oligosFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        inspector.down("radio[cls='useServerOligosRadioBtn']").setValue(false);
        inspector.down("radio[cls='useEmptyOligosRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        function processOligosFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || (headerFields[0] != "Oligo Name" && headerFields[0] != "Oigo Name") || //accounting for typo in example file
            headerFields[1] != "Length" || headerFields[2] != "Tm" || headerFields[3] != "Tm (3' only)" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master oligos list file.\n" + "Please check the formatting of the file.");

                this.oligosListText = null;
            } else {
                this.oligosListText = result;
            }
        }

        fr.onload = processOligosFile;
        fr.readAsText(oligosFile.files[0]);
    },

    onUseServerSynthesesRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='directSynthesesFileSelector']").reset();
        }
    },

    onUseEmptySynthesesRadioBtnChange: function (e) {
        if(e.getValue()) {
            currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
            var inspector = currentTab.down('InspectorPanel');

            inspector.down("component[cls='directSynthesesFileSelector']").reset();
        }
    },

    onDirectSynthesesFileSelectorChange: function (me) {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        var synthesesFile = me.button.fileInputEl.dom;
        var fr = new FileReader();

        inspector.down("radio[cls='useServerSynthesesRadioBtn']").setValue(false);
        inspector.down("radio[cls='useEmptySynthesesRadioBtn']").setValue(false);

        me.inputEl.dom.value = this.getFileNameFromField(me);

        function processSynthesesFile() {
            var result = fr.result;
            var linesArray = result.split(/\n/);
            var headerFields = linesArray[0].split(/,\s*/);

            if(headerFields.length != 5 || headerFields[0] != "Direct Synthesis Name" || headerFields[1] != "Alias" || headerFields[2] != "Contents" || headerFields[3] != "Length" || headerFields[4] != "Sequence") {

                alert("Invalid headers in master syntheses list file.\n" + "Please check the formatting of the file.");

                this.directSynthesesListText = null;
            } else {
                this.directSynthesesListText = result;
            }
        }

        fr.onload = processSynthesesFile;
        fr.readAsText(synthesesFile.files[0]);
    },

    onCustomizeAutomationParamsBtnClick: function () {
        this.automationParamsWindow = Ext.create("Vede.view.de.j5AutomationParameters").show();
        this.populateAutomationParametersDialog();
    },

    onResetAutomationParamsBtnClick: function () {
        this.automationParameters.setDefaultValues();
        this.populateAutomationParametersDialog();
    },
    populateAutomationParametersDialog: function () {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        this.automationParameters.fields.eachKey(function (key) {
            console.log(key);
            if(key !== "id" && key !== "j5run_id") {
                inspector.down("component[cls='" + key + "']").setValue(
                this.automationParameters.get(key));
            }
        }, this);
    },

    saveAutomationParams: function () {
        currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        this.automationParameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                this.automationParameters.set(key, inspector.down("component[cls='" + key + "']").getValue());
            }
        }, this);
    },

    abortJ5Run: function () {
        Ext.Function.defer(function () {
            Ext.Ajax.abort();
        }, 100);

    },

    createLoadingMessage: function () {
        var msgBox = Ext.MessageBox.show({
            title: 'Please wait',
            msg: 'Preparing input parameters',
            progressText: 'Initializing...',
            width: 300,
            progress: true,
            closable: false
        });

        return {
            close: function () {
                msgBox.close();
            },
            update: function (progress, msg) {
                msgBox.updateProgress(progress / 100, progress + '% completed', msg);
            }
        };
    },



    onRunJ5BtnClick: function (btn) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        // var loadingMessage = currentTab.down('container[cls="j5progressContainer"]').show();
        // var responseMessage = currentTab.down('displayfield[cls="j5ResponseTextField"]').show();

        var self = this;
        var masterPlasmidsList;
        var masterPlasmidsListFileName;

        var masterOligosList;
        var masterOligosListFileName;

        var masterDirectSynthesesList;
        var masterDirectSynthesesListFileName;

        if(inspector.down("radio[cls='useServerPlasmidsRadioBtn']").getValue()) {
            masterPlasmidsList = "";
            masterPlasmidsListFileName = "";
        } else if(inspector.down("radio[cls='useEmptyPlasmidsRadioBtn']").getValue()) {
            masterPlasmidsList = this.J5ControlsUtils.generateEmptyPlasmidsList();
            masterPlasmidsListFileName = "j5_plasmids.csv";
        } else {
            masterPlasmidsList = this.plasmidsListText;
            masterPlasmidsListFileName = this.getFileNameFromField(
            inspector.down("component[cls='plasmidsListFileSelector']"));
        }

        if(currentTab.down("radio[cls='useServerOligosRadioBtn']").getValue()) {
            masterOligosList = "";
            masterOligosListFileName = "";
        } else if(inspector.down("radio[cls='useEmptyOligosRadioBtn']").getValue()) {
            masterOligosList = this.J5ControlsUtils.generateEmptyOligosList();
            masterOligosListFileName = "j5_oligos.csv";
        } else {
            masterOligosList = this.plasmidsListText;
            masterOligosListFileName = this.getFileNameFromField(
            inspector.down("component[cls='oligosListFileSelector']"));
        }

        if(inspector.down("radio[cls='useServerSynthesesRadioBtn']").getValue()) {
            masterDirectSynthesesList = "";
            masterDirectSynthesesListFileName = "";
        } else if(inspector.down("radio[cls='useEmptySynthesesRadioBtn']").getValue()) {
            masterDirectSynthesesList = this.J5ControlsUtils.generateEmptyDirectSynthesesList();
            masterDirectSynthesesListFileName = "j5_directsyntheses.csv";
        } else {
            masterDirectSynthesesList = this.plasmidsListText;
            masterDirectSynthesesListFileName = this.getFileNameFromField(
            inspector.down("component[cls='directSynthesesFileSelector']"));
        }

        var masterFiles = {};
        masterFiles["masterPlasmidsList"] = Base64.encode(masterPlasmidsList);
        masterFiles["masterPlasmidsListFileName"] = masterPlasmidsListFileName;
        masterFiles["masterOligosList"] = Base64.encode(masterOligosList);
        masterFiles["masterOligosListFileName"] = masterOligosListFileName;
        masterFiles["masterDirectSynthesesList"] = Base64.encode(masterDirectSynthesesList);
        masterFiles["masterDirectSynthesesListFileName"] = masterDirectSynthesesListFileName;

        var assemblyMethod = inspector.down("component[cls='assemblyMethodSelector']").getValue()

        if(assemblyMethod == "Mock Assembly") assemblyMethod = "Mock";
        if(assemblyMethod == "SLIC/Gibson/CPEC") assemblyMethod = "SLIC/Gibson/CPEC";
        if(assemblyMethod == "Golden Gate") assemblyMethod = "GoldenGate";

        if(assemblyMethod == "Combinatorial Mock Assembly") assemblyMethod = "CombinatorialMock";
        if(assemblyMethod == "Combinatorial SLIC/Gibson/CPEC") assemblyMethod = "CombinatorialSLICGibsonCPEC";
        if(assemblyMethod == "Combinatorial Golden Gate") assemblyMethod = "CombinatorialGoldenGate";

        inspector.j5comm = Teselagen.manager.J5CommunicationManager;
        inspector.j5comm.setParameters(this.j5Parameters, masterFiles, assemblyMethod);

        //responseMessage.setValue("Saving design");

        Vede.application.fireEvent("saveDesignEvent", function () {
            //responseMessage.setValue("Executing j5 Run...Please wait...");
            if (!Teselagen.manager.TasksMonitor.disabled) {
                Teselagen.manager.TasksMonitor.start();
            }
            inspector.j5comm.generateAjaxRequest(function (success, responseData, warnings) {
                if(success) {
                    toastr.options.onclick = null;
                    toastr.info("j5 Run Submitted");
                } else {
                    //loadingMessage.hide();
                    //responseMessage.hide();
                    var messagebox = Ext.MessageBox.show({
                        title: "Execution Error",
                        msg: responseData.error,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });

                    Ext.Function.defer(function () {
                        messagebox.zIndexManager.bringToFront(messagebox);
                    }, 100);
                }
            });
        });
    },

    onDistributePCRBtn: function () {

        console.log("Distribute PCR Reactions");

        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        inspector.j5comm = Teselagen.manager.J5CommunicationManager;

        data = {};
        data.sourcePlateFileText = this.sourcePlateFileText;
        data.zippedPlateFilesSelector = this.zippedPlateFilesSelector;
        data.assemblyFileText = this.assemblyFileText;
        data.params = this.automationParameters.data;
        // data.reuse = inspector.down("component[name='automationParamsFileSource']").getValue();

        // var loadingMessage = this.createLoadingMessage();

        // loadingMessage.update(60, "Executing request");
        inspector.j5comm.distributePCRRequest(data, function (success, responseData) {
            if(success) {
                // loadingMessage.update(100, "Completed");
                // loadingMessage.close();
            } else {
                console.log(responseData.responseText);
                // loadingMessage.close();
                var messagebox = Ext.MessageBox.show({
                    title: "Execution Error",
                    msg: responseData.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            }
        });

    },

    /**
     * Given a field Component, returns the name of the file selected,
     * filtering out the directory information.
     *
     * TODO: maybe move to a utils file so we can set the display value to this
     * whenever the onchange event of a file input field is fired? This would
     * prevent the 'fakepath' directory from showing up on some browsers.
     */
    getFileNameFromField: function (field) {
        var rawValue = field.getValue();
        var fileName;

        if(rawValue.indexOf("\\") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("\\") + 1);
        } else if(rawValue.indexOf("/") != -1) {
            fileName = rawValue.substr(rawValue.lastIndexOf("/") + 1);
        } else {
            fileName = rawValue;
        }

        return fileName;
    },

    onLoadAssemblyBtnClick: function () {},

    onAutomationParamsCancelClick: function () {
        this.automationParamsWindow.close();
    },

    onAutomationParamsOKClick: function () {
        this.saveAutomationParams();
        this.automationParamsWindow.close();
    },

    populateJ5ParametersDialog: function () {
        this.j5Parameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                Ext.ComponentQuery.query("component[cls='" + key + "']")[0].setValue(
                this.j5Parameters.get(key));
            }
        }, this);
    },

    saveJ5Parameters: function () {
        this.j5Parameters.fields.eachKey(function (key) {
            if(key !== "id" && key !== "j5run_id") {
                this.j5Parameters.set(key, Ext.ComponentQuery.query("component[cls='" + key + "']")[0].getValue());
            }
        }, this);
    },
    onDownloadj5Btn: function (button, e, options) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        inspector.j5comm.downloadResults(button);
    },

    onDownloadDownstreamAutomationBtn: function (button, e, options) {
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        inspector.j5comm.downloadDownstreamAutomationResults(button);
    },

    onPlasmidsItemClick: function (grid, record) {
        var DETab = Ext.getCmp("mainAppPanel").getActiveTab();
        var j5Window = DETab;
        var mask = new Ext.LoadMask(j5Window);

        mask.setVisible(true, false);

        // Javascript waits to render the loading mask until after the call to
        // openSequence, so we force it to wait a millisecond before calling
        // to give it time to render the loading mask.
        Ext.defer(function() {
            var newSequence = Teselagen.manager.DeviceDesignManager.createSequenceFileStandAlone("GENBANK", record.data.fileContent, record.data.name, "");
            Teselagen.manager.ProjectManager.openSequence(newSequence);

            mask.setVisible(false);

            // This gets rid of the weird bug where the loading mask remains on
            // the mainAppPanel.
            Ext.getCmp("mainAppPanel").setLoading();
            Ext.getCmp("mainAppPanel").setLoading(false);
        }, 10, this);

        // Showing and hiding the loading mask on the mainAppPanel removes
        // the modal mask which prevented the user from interacting with the
        // Device Editor panel behind the modal j5Window, so re-display the
        // j5Window when it is in view. If you don't wait until the window is in
        // view, its layout gets all kinda screwed up.
        var refreshJ5Window = function(mainAppPanel, newTab, oldTab) {
            if(newTab === DETab) {
                j5Window.hide();
                j5Window.show();
                j5Window.doLayout();

                mainAppPanel.un("tabchange", refreshJ5Window, this);
            }
        };

        Ext.getCmp("mainAppPanel").on("tabchange", refreshJ5Window, this);
    },

    onCondenseAssembliesBtnClick: function (btn) {

        console.log("Condense Assembly Files");
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');

        inspector.j5comm = Teselagen.manager.J5CommunicationManager;

        condenseParams = {};
        condenseParams["assemblyFiles"] = {};
        condenseParams["assemblyFiles"]["name"] = this.getFileNameFromField(
        inspector.down("component[cls='condenseAssemblyFilesSelector']"));
        condenseParams["assemblyFiles"]["content"] = this.condenseAssemblyFilesText;

        condenseParams["zippedFiles"] = {};
        condenseParams["zippedFiles"]["name"] = this.getFileNameFromField(
        inspector.down("component[cls='zippedAssemblyFilesSelector']"));
        condenseParams["zippedFiles"]["content"] = this.zippedPlateFilesSelector;

        // var loadingMessage = this.createLoadingMessage();

        // loadingMessage.update(60, "Executing request");
        inspector.j5comm.condenseAssemblyFiles(condenseParams, function (success, responseData) {
            if(success) {
                // loadingMessage.update(100, "Completed");
                // loadingMessage.close();
            } else {
                console.log(responseData.responseText);
                // loadingMessage.close();
                var messagebox = Ext.MessageBox.show({
                    title: "Execution Error",
                    msg: responseData.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });

                Ext.Function.defer(function () {
                    messagebox.zIndexManager.bringToFront(messagebox);
                }, 100);
            }
        });

    },

    onDownloadCondenseAssemblyResultsBtnClick: function(button){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var inspector = currentTab.down('InspectorPanel');
        inspector.j5comm.downloadCondenseAssemblyResults(button);
    },

    init: function () {
        this.control({
            "panel[cls='j5InfoTab-Sub-Advanced']": {
                tabchange: this.onTabChangeSub
            },
            "panel[cls='j5InfoTab-Sub']": {
                tabchange: this.onTabChange
            },
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
            },
            "button[cls='condenseAssembliesBtn']": {
                click: this.onCondenseAssembliesBtnClick
            },
            "component[cls='condenseAssemblyFilesSelector']": {
                change: this.onCondenseAssemblyFilesSelectorChange
            },
            "component[cls='zippedAssemblyFilesSelector']": {
                change: this.onZippedAssemblyFilesSelectorChange
            },
            "button[cls='downloadCondenseAssemblyResultsBtn']": {
                click: this.onDownloadCondenseAssemblyResultsBtnClick
            },
            "button[cls='stopj5runBtn']": {
                click: this.abortJ5Run
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
