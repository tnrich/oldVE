/**
 * Device Editor panel controller
 * @class Vede.controller.DeviceEditor.DeviceEditorPanelController
 */
/*global $, toastr*/

Ext.define("Vede.controller.DeviceEditor.DeviceEditorPanelController", {
    extend: "Ext.app.Controller",
    requires: ["Ext.draw.*",
               "Teselagen.manager.DeviceDesignParsersManager",
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.DeviceDesignManager",
               "Teselagen.event.CommonEvent",
               "Teselagen.event.DeviceEvent",
               "Teselagen.event.GridEvent",
               "Teselagen.event.ProjectEvent",
               "Teselagen.models.J5Parameters"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    onLoadEugeneRulesEvent: function(){
        //console.log("Loading eugene rules");
        var currentProject = Ext.getCmp("mainAppPanel").getActiveTab().model;
        var deproject_id = currentProject.data.id;
        var self = this;

        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUserResUrl("/projects/"+currentProject.data.project_id+"/devicedesigns/"+currentProject.data.id+"/eugenerules", ""),
            method: "GET",
            params: {
                id: deproject_id
            },
            success: function (response) {
                response = JSON.parse(response.responseText);
                var rules = response.rules;
                var allParts = self.DeviceDesignManager.getAllPartsAsStore(currentProject);

                var savedRulesArray = [];

                rules.forEach(function(rule){
                    var newEugeneRule = Ext.create("Teselagen.models.EugeneRule", {
                        name: rule.name,
                        compositionalOperator: rule.compositionalOperator,
                        negationOperator: rule.negationOperator
                    });

                    if(!rule.operand1_id)
                    {
                        throw new Error("Operand 1 ID is missing");
                    }

                    if( !rule.operand2_id && !rule.operand2isNumber )
                    {
                        throw new Error("Operand 2 ID is missing");
                    }

                    newEugeneRule.setOperand1(allParts.getById(rule.operand1_id));


                    if(rule.operand2_id && !rule.operand2isNumber) { newEugeneRule.setOperand2(allParts.getById(rule.operand2_id)); }
                    if(rule.operand2isNumber)
                    {
                        newEugeneRule.set("operand2Number",rule.operand2Number);
                        newEugeneRule.set("operand2isNumber",true);
                    }

                    savedRulesArray.push(newEugeneRule);
                });

                currentProject.rules().add(savedRulesArray);
            },
            failure: function() {
                Ext.MessageBox.alert("Error","Problem while loading Eugene Rules");
            }
        });
    },

    /**
     * When opening a Device Editor project, store it in the "model" attribute of the active Device Editor panel.
     */
    openProject: function (project) {
        Ext.getCmp("mainAppPanel").getActiveTab().model = project;
    },

    onDeviceEditorRenameBtnClick: function () {
        var deproject = Ext.getCmp("mainAppPanel").getActiveTab().model;

        var project = Teselagen.manager.ProjectManager.projects.getById(deproject.get("project_id"));
        var projectNames = [];
        project.designs().load().each(function (design) {
            if(design!==deproject) projectNames.push(design.data.name);
        });

        var onPromptClosed = function (answer, text) {
            if(answer ==="ok") {
                text = Ext.String.trim(text);
                if(text === "") { return Ext.MessageBox.prompt("Rename Design", "New name:", onPromptClosed, this); }

                for (var j=0; j<projectNames.length; j++) {
                    if (projectNames[j]===text) {
                        Ext.MessageBox.show({
                            title: "Name",
                            msg: "A design with this name already exists in this project. <p> Please enter another name:",
                            buttons: Ext.MessageBox.OKCANCEL,
                            fn: onPromptClosed,
                            prompt: true,
                            cls: "sequencePrompt-box",
                            scope: this,
                            style: {
                                "text-align": "center"
                            },
                            scope: this,
                            layout: {
                                align: "center"
                            },
                            items: [
                                {
                                    xtype: "textfield",
                                    layout: {
                                        align: "center"
                                    },
                                    width: 50
                                }
                            ]
                        });
                        return Ext.MessageBox;

                    }
                }
                deproject.set("name", text);
                deproject.save({
                    callback: function () {
                        Ext.getCmp("mainAppPanel").getActiveTab().setTitle(text);
                        toastr.options.onclick = null;
                        
                        toastr.info("Design renamed");
                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                            Ext.getCmp("projectTreePanel").expandPath("/root/" + deproject.data.project_id + "/" + deproject.data.id);
                        });
                    }
                });
            } else {
                return false;
            }
        };

        Ext.MessageBox.prompt("Rename Design", "New name:", onPromptClosed, this, false, deproject.get("name"));
    },

    onDeviceEditorClearBtnClick: function () {
        var gridManager = Teselagen.manager.GridManager;

        function ClearDeviceDesignBtn (btn) {
            if (btn==="ok") {

                gridManager.setListenersEnabled(false);

                var existingDesign = Ext.getCmp("mainAppPanel").getActiveTab().model;
                existingDesign.bins().removeAll(true);
                existingDesign.rules().removeAll(true);
                existingDesign.parts().removeAll(true);

                var newBin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "Bin1"
                });

                var newCell = Ext.create("Teselagen.models.Cell", {
                    index: 0,
                    part_id: null
                });

                var newCell2 = Ext.create("Teselagen.models.Cell", {
                    index: 1,
                    part_id: null
                });

                newBin.cells().insert(0, [newCell,newCell2]);
                existingDesign.bins().insert(0, newBin);

                Vede.application.fireEvent(Teselagen.event.DeviceEvent.RERENDER_DE_CANVAS);
                gridManager.setListenersEnabled(true);

                Vede.application.fireEvent(Teselagen.event.DeviceEvent.SELECT_BIN, newBin, 0);

                toastr.options.onclick = null;
                
                toastr.info("Design Cleared");

            }
        }

        Ext.Msg.show({
             title:"Are you sure you want to clear this design?",
             msg: "WARNING: This will clear the current design. This action is not undoable!",
             cls: "messageBox",
             buttons: Ext.Msg.OKCANCEL,
             fn: ClearDeviceDesignBtn,
             icon: Ext.Msg.QUESTION
        });

    },

    onDeviceEditorDeleteBtnClick: function () {

        function DeleteDeviceDesignBtn (btn) {
            if (btn==="ok") {
                var activeTab = Ext.getCmp("mainAppPanel").getActiveTab();
                Teselagen.manager.ProjectManager.DeleteDeviceDesign(activeTab.model, activeTab);
                toastr.options.onclick = null;
                
                toastr.info("Design Deleted");
             }
         }

        Ext.Msg.show({
             title:"Are you sure you want to delete this design?",
             msg: "WARNING: This will remove the current design. This action is not undoable!",
             cls: "messageBox",
             buttons: Ext.Msg.OKCANCEL,
             fn: DeleteDeviceDesignBtn,
             icon: Ext.Msg.QUESTION
        });

    },

    onOpenExampleItemBtnClick: function (item) {
        var selectedItem = item.text;
        var examplesMap = {
            "SLIC/Gibson/CPEC": "resources/examples/SLIC_Gibson_CPEC.json",
            "Combinatorial SLIC/Gibson/CPEC": "resources/examples/Combinatorial_SLIC_Gibson_CPEC.json",
            "Golden Gate": "resources/examples/Golden_Gate.json",
            "Combinatorial Golden Gate": "resources/examples/Combinatorial_Golden_Gate.json"
        };

        Ext.Ajax.request({
            url: examplesMap[selectedItem],
            method: "GET",
            success: function (response) {
                //Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText, selectedItem.replace(" ", "_"));
                Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText);
            }
        });
    },

    createLoadingMessage: function () {
        var msgBox = Ext.MessageBox.show({
            title: "Please wait",
            msg: "Preparing input parameters",
            progressText: "Initializing...",
            width: 300,
            progress: true,
            closable: false
        });

        return {
            close: function () {
                msgBox.close();
            },
            update: function (progress, msg) {
                msgBox.updateProgress(progress / 100, progress + "% completed", msg);
            }
        };
    },

    analizeDesign: function(design,cb){

        function isValidObjectID(str) {
          if(!str) return false;
          var len = str.length;
          if (len == 12 || len == 24) {
            return /^[0-9a-fA-F]+$/.test(str);
          } else {
            return false;
          }
        }

        console.log("Analizing design...");

        var warnings = [];
        // Check data integrity
        design.bins().each(function(bin){
            bin.cells().each(function(cell){
                if(cell.data.part_id)
                {
                    var part = cell.getPart();
                    if(part && !isValidObjectID(part.data.sequencefile_id)) warnings.push("Part "+part.data.name+" with not mapped sequence");
                    var sequence = part.getSequenceFile();
                    if(sequence && !(sequence.data.sequenceFileContent!="")) warnings.push("Sequence "+sequence.data.name+" with empty sequence");

                }
            });
        });

        // Check for duplicated LOCUS NAME
        sequences = {};
        design.parts().each(function(part){
            var sequence = part.getSequenceFile();
            if(sequence)
            {
                var sequenceKey = sequences[sequence.data.serialize.inData.name];
                if(sequenceKey && sequenceKey.data.id!=sequence.data.id)
                {
                    warnings.push("Warning, Locus name conflict between "+sequenceKey.data.name+" and "+sequence.data.name);
                }
                else
                {
                    sequences[sequence.data.serialize.inData.name] = sequence;
                }
            }
        });

        setTimeout(function(){
            if(warnings.length===0) console.log("Everything is ok");
            else {
                console.log(warnings);
                var warningsWindow = Ext.create('Vede.view.de.WarningsWindow').show();

                errorStore = Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'messages', type: 'auto'}
                    ]
                });

                errorStore.add({
                    fileName: '',
                    partSource: '',
                    messages: 'test'
                });

                warningsWindow.down('gridpanel').reconfigure(errorStore);

            }
            cb();
        },2000);
    },

    /**
     * Saves the device design
     */
    saveDEProject: function (cb) {
        var self = this;
        var gridManager = Teselagen.manager.GridManager;

        gridManager.setListenersEnabled(false);

        Vede.application.fireEvent(this.GridEvent.SUSPEND_PART_ALERTS);
        var design = Ext.getCmp("mainAppPanel").getActiveTab().model;

        var saveAssociatedSequence = function (part, cb) {
            // Do not save sequence for an unmapped part.
            if(part.isMapped())
            {
                part.getSequenceFile({callback: function(associatedSequence){
                    if(associatedSequence)
                    {
                        var lastSequenceId = associatedSequence.get("id");
                        associatedSequence.set("dateCreated", new Date());
                        associatedSequence.set("dateModified", new Date());
                        if(Object.keys(associatedSequence.getChanges()).length > 0 || !lastSequenceId)
                        {
                            associatedSequence.save({
                                callback: function (sequencefile) {
                                    if(!lastSequenceId)
                                    {
                                        part.set("sequencefile_id", sequencefile.get("id"));
                                        part.save({
                                            callback: function () {
                                                cb();
                                            }
                                        });
                                    }
                                    else { cb(); }
                                }
                            });
                        }
                        else
                        {
                            cb();
                        }
                    }
                    else
                    {
                        cb();
                    }
                }});
            }
            else { cb(); }
        };

        var saveDesign = function () {
            design.rules().clearFilter(true);

            design.rules().each(function(rule) {
                rule.set("operand1_id", rule.getOperand1().getId());

                if(!rule.get("operand2isNumber")) {
                    rule.set("operand2_id", rule.getOperand2().getId());
                }
            });

            design.save({
                callback: function () {
                    Vede.application.fireEvent(self.GridEvent.RESUME_PART_ALERTS);
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                        Ext.getCmp("projectTreePanel").expandPath("/root/" + Teselagen.manager.ProjectManager.workingProject.data.id + "/" + design.data.id);
                        toastr.options.onclick = null;
                        
                        toastr.info("Design Saved");
                    });
                    gridManager.setListenersEnabled(true);
                    if(typeof (cb) === "function") { cb(); }
                }
            });
        };

        self.analizeDesign(design,function(){
            var countParts = 0;
            design.bins().each(function (bin) {
                bin.cells().each(function(cell) {
                    if(cell.getPart()) {
                        countParts++;
                    }
                });
            });

            if(countParts === 0) {
                saveDesign();
            } else {
                design.bins().each(function (bin) {
                    bin.cells().each(function (cell) {
                        var part = cell.getPart();
                        var sequenceFile;
                        var sequenceManager;

                        if(part) {
                            if(!part.data.project_id) { part.set("project_id",Teselagen.manager.ProjectManager.workingProject.data.id); }

                            if(Object.keys(part.getChanges()).length > 0 || !part.data.id) {
                                sequenceFile = part.getSequenceFile();
                                if(sequenceFile) {
                                    sequenceManager = sequenceFile.getSequenceManager();

                                    if(sequenceManager) {
                                        part.set("features", sequenceManager.featuresByRangeText(
                                            part.get("genbankStartBP"), part.get("endBP")).toString());
                                    }

                                    part.set("partSource", sequenceFile.get("name"));
                                }
                                saveAssociatedSequence(part, function() {
                                    if(countParts === 1) {
                                        saveDesign();
                                    }

                                    countParts--;
                               });
                            } else {
                                saveAssociatedSequence(part,function(){
                                    if(countParts === 1) { saveDesign(); }
                                    countParts--;
                                });
                            }
                        }
                    });
                });
            }
        });
    },

    onDeviceEditorSaveBtnClick: function() {
        var activeTab = Ext.getCmp("mainAppPanel").getActiveTab();
        activeTab.el.mask("Loading", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        this.saveDEProject(function() {
            activeTab.el.unmask();
        });

    },

    onDeviceEditorSaveEvent: function(arg) {
        this.saveDEProject(arg);
    },

    onDeviceEditorSaveAsBtnClick: function() {
        var saveAsWindow = Ext.create("Vede.view.de.SaveAsWindow").show();
        var nameField = saveAsWindow.down('textfield[cls="saveAsWindowDesignNameField"]');
        var design = Ext.getCmp("mainAppPanel").getActiveTab().model;

        nameField.setValue(design.get("name") + ' Copy');
    },

    onSaveDeviceAsWindowOKBtnClick: function() {
        var saveAsWindow = Ext.ComponentQuery.query('window[cls="deviceEditorSaveAsWindow"]')[0];
        var newName = saveAsWindow.down('textfield[cls="saveAsWindowDesignNameField"]').getValue();
        var oldDesign = Ext.getCmp("mainAppPanel").getActiveTab().model;
        var newDesign = oldDesign.copy();
        var currentProject = oldDesign.getProject();

        // If we don't do this, it calls the API with an auto-generated ID.
        currentProject.setId(oldDesign.get('project_id'));

        currentProject.designs().load({
            callback: function() {
                var duplicateIndex = currentProject.designs().find('name', newName);

                newDesign.set({
                    name: newName,
                    project: currentProject
                });

                newDesign.parts().add(oldDesign.parts().getRange());
                newDesign.rulesStore = oldDesign.rulesStore;
                newDesign.bins().add(oldDesign.bins().getRange());

                if(duplicateIndex === -1) {
                    newDesign.save({
                        success: function() {
                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
                            saveAsWindow.close();
                            Teselagen.manager.ProjectManager.openDeviceDesign(newDesign);
                        },
                        failure: function() {
                            Ext.MessageBox.alert('', 'Error saving sequence. Please try again.');
                        }
                    });
                } else {
                    Ext.Msg.show({
                        title: "Duplicate Design Name", 
                        msg: "A design already exists in this project with that name.<br>" +
                             "Continuing will create two designs with the same name. Are you sure?",
                        buttons: 10,
                        fn: function(button) {
                            if(button === "yes") {
                                newDesign.save({
                                    success: function() {
                                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
                                        saveAsWindow.close();
                                        Teselagen.manager.ProjectManager.openDeviceDesign(newDesign);
                                    },
                                    failure: function() {
                                        Ext.MessageBox.alert('', 'Error saving sequence. Please try again.');
                                    }
                                });
                            } else {
                                saveAsWindow.close();
                            }
                        }
                    });
                }
            }
        });
    },

    onAddRowAboveClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW_ABOVE);
    },

    onAddRowBelowClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW_BELOW);
    },

    onAddColumnLeftClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN_LEFT);
    },

    onAddColumnRightClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN_RIGHT);
    },

    onclearPartMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.CLEAR_PART);
    },

     onRemoveColumnMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.REMOVE_COLUMN);
    },

    onRemoveRowMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.REMOVE_ROW);
    },

    onJ5buttonClick: function () {
        Vede.application.fireEvent(this.CommonEvent.RUN_J5);
        toastr.options.onclick = null;

        toastr.info("Design Saved");
    },

    onImportEugeneRulesBtnClick: function(){

    },

    onJumpToJ5Run: function(data,jump) {
        var design_id = data.devicedesign_id;
        var project_id = data.project_id;
        console.log(design_id);
        console.log(project_id);
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);

        var self = this;
        var continueCode = function(){

            self.detailPanel = Ext.getCmp("mainAppPanel").getActiveTab().query("panel[cls='j5detailpanel']")[0];
            self.detailPanelFill = Ext.getCmp("mainAppPanel").getActiveTab().query("panel[cls='j5detailpanel-fill']")[0];
            self.detailPanel.show();
            self.detailPanelFill.hide();

            var j5runs = Teselagen.manager.ProjectManager.projects.getById(project_id).designs().getById(design_id).j5runs();

            j5runs.load({
                callback : function(){
                    var field;
                    j5runs = Teselagen.manager.ProjectManager.projects.getById(project_id).designs().getById(design_id).j5runs();

                    self.activeJ5Run = j5runs.getById(data._id);

                    for(var i=0; i<Ext.getCmp("mainAppPanel").getActiveTab().query("menuitem").length; i++) {
                        Ext.getCmp("mainAppPanel").getActiveTab().query("menuitem")[i].removeCls("j5-menuitem-active");
                    }

                    var assemblyMethod = self.activeJ5Run.get("assemblyMethod");
                    var status = self.activeJ5Run.get("status");
                    var startDate = new Date(self.activeJ5Run.get("date"));
                    var endDate = new Date(self.activeJ5Run.get("endDate"));
                    var elapsed = endDate - startDate;
                    elapsed = Math.round(elapsed/1000);
                    elapsed = self.elapsedDate(elapsed);
                    startDate = Ext.Date.format(startDate, "l, F d, Y g:i:s A");
                    endDate = Ext.Date.format(endDate, "l, F d, Y g:i:s A");
                    var assemblies    = self.activeJ5Run.getJ5Results().assemblies();
                    assemblies.sort("name", "ASC");


                    var j5parameters = Ext.create("Teselagen.models.J5Parameters");
                    j5parameters.loadValues(self.activeJ5Run.getJ5Input().getJ5Parameters().raw);
                    var J5parametersValues = j5parameters.getParametersAsStore();

                    Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").getForm().findField("j5AssemblyType").setValue(assemblyMethod);
                    Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").getForm().findField("j5RunStatus").setValue(status);
                    Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").getForm().findField("j5RunStart").setValue(startDate);
                    Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").getForm().findField("j5RunEnd").setValue(endDate);
                    Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").getForm().findField("j5RunElapsed").setValue(elapsed);

                    if(status==="Completed") {
                        field = Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").query("field[cls='j5RunStatusField']")[0].getId();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").enable();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").removeCls("btnDisabled");
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").enable();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").removeCls("btnDisabled");
                        $("#" + field + " .status-note").removeClass("status-note-warning");
                        $("#" + field + " .status-note").removeClass("status-note-failed");
                        $("#" + field + " .status-note").addClass("status-note-completed");
                    } else if (status==="Completed with warnings") {
                        field = Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").query("field[cls='j5RunStatusField']")[0].getId();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").enable();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").removeCls("btnDisabled");
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").enable();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").removeCls("btnDisabled");
                        $("#" + field + " .status-note").removeClass("status-note-completed");
                        $("#" + field + " .status-note").removeClass("status-note-failed");
                        $("#" + field + " .status-note").addClass("status-note-warning");
                    } else if (status==="Error") {
                        field = Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").query("field[cls='j5RunStatusField']")[0].getId();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").disable();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").addClass("btnDisabled");
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").disable();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").addClass("btnDisabled");
                        $("#" + field + " .status-note").removeClass("status-note-completed");
                        $("#" + field + " .status-note").removeClass("status-note-warning");
                        $("#" + field + " .status-note").addClass("status-note-failed");
                    } else if (status=="Canceled") {
                        field = Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").query("field[cls='j5RunStatusField']")[0].getId();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").disable();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='downloadResults']").addClass("btnDisabled");
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").disable();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("button[cls='buildBtn']").addClass("btnDisabled");
                        $("#" + field + " .status-note").removeClass("status-note-completed");
                        $("#" + field + " .status-note").removeClass("status-note-warning");
                        $("#" + field + " .status-note").addClass("status-note-failed");
                    } else if (status=="In progress") {
                        field = Ext.getCmp("mainAppPanel").getActiveTab().down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down('button[cls="downloadResults"]').disable();
                        //Ext.getCmp("mainAppPanel").getActiveTab().down('button[cls="downloadResults"]').addClass('btnDisabled');
                        Ext.getCmp("mainAppPanel").getActiveTab().down('button[cls="buildBtn"]').disable();
                        Ext.getCmp("mainAppPanel").getActiveTab().down('button[cls="buildBtn"]').addClass('btnDisabled');
                        $("#" + field + " .status-note").removeClass("status-note-completed");
                        $("#" + field + " .status-note").removeClass("status-note-warning");
                        $("#" + field + " .status-note").removeClass("status-note-failed");
                    }

                    var warnings = self.activeJ5Run.raw.warnings;
                    var errors = self.activeJ5Run.raw.error_list;
                    var warningsStore, errorsStore;

                    if(self.activeJ5Run.getJ5Results().raw.processedData) {
                        if(self.activeJ5Run.getJ5Results().raw.processedData.combinationPieces) {
                            var combinationPieces = self.activeJ5Run.getJ5Results().raw.processedData.combinationPieces;
                            for(i = 0; i<assemblies.getCount(); i++) {
                                var combinationParts = [];
                                for (var k =0; k<combinationPieces[i].partsContained.length; k++) {
                                    combinationParts.push(combinationPieces[i].partsContained[k].parts);
                                }
                                assemblies.getAt(i).set("parts", combinationParts.join());
                            }
                        }

                        if(self.activeJ5Run.getJ5Results().raw.processedData.targetParts) {
                            var targetParts = self.activeJ5Run.getJ5Results().raw.processedData.targetParts;
                            var targetPartNames=[];
                            for(i = 0; i<targetParts.length; i++) {
                                targetPartNames.push(targetParts[i].name);
                            }
                            assemblies.getAt(0).set("parts", targetPartNames);
                        }

                        if(self.activeJ5Run.getJ5Results().raw.processedData.combinationParts) {
                            var comboParts = self.activeJ5Run.getJ5Results().raw.processedData.combinationParts;
                            for(i = 0; i<assemblies.getCount(); i++) {
                                assemblies.getAt(i).set("parts", comboParts[i].parts);
                            }
                        }
                    }

                    if (warnings) {
                        warningsStore = Ext.create("Teselagen.store.WarningsStore", {
                        model: "Teselagen.models.j5Output.Warning",
                        data: warnings
                    });
                    }

                    if (errors) {
                        errorsStore = Ext.create("Teselagen.store.ErrorsStore", {
                        model: "Teselagen.models.j5Output.Error",
                        data: errors
                    });
                    }

                    if (warnings.length>0) {
                        Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='warnings']").show();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='warnings']").reconfigure(warningsStore);
                    } else {
                         Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='warnings']").hide();
                         warnings = null;
                         warningsStore = null;
                    }

                    if (errors.length>0) {
                        Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='errors']").show();
                        Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='errors']").reconfigure(errorsStore);
                        // Ext.getCmp('mainAppPanel').getActiveTab() .down("form[cls='j5RunInfo']").getForm().findField('j5RunStart').setValue("N/A");
                        // Ext.getCmp('mainAppPanel').getActiveTab() .down("form[cls='j5RunInfo']").getForm().findField('j5RunEnd').setValue("N/A");
                        // Ext.getCmp('mainAppPanel').getActiveTab() .down("form[cls='j5RunInfo']").getForm().findField('j5RunElapsed').setValue("N/A");
                    } else {
                         Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='errors']").hide();
                         errors = null;
                         errorsStore = null;
                    }
                    Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='assemblies']").reconfigure(assemblies);
                    Ext.getCmp("mainAppPanel").getActiveTab().down("gridpanel[name='j5parameters']").reconfigure(J5parametersValues);


                    Vede.application.fireEvent("resetJ5ActiveRun", self.activeJ5Run);
                    // Ext.getCmp('mainAppPanel').getActiveTab().down('button[cls="downloadResults"]').href = '/api/getfile/'+self.activeJ5Run.data.file_id;
                }
            });
        };
        if(jump==true) {
            project.designs().load({
                id: design_id,
                callback: function (loadedDesign) {
                    Teselagen.manager.ProjectManager.workingProject = project;
                    console.log(loadedDesign);
                    console.log(design_id);
                    var design = loadedDesign[0];
                    Teselagen.manager.ProjectManager.openj5Report(design,continueCode);
                }
            });
        }

    },

    elapsedDate: function (seconds)
    {
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        if (numdays>0) {
            return numdays + " days" + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
        }else if (numhours>0) {
            return numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
        }else if (numminutes>0) {
            return numminutes + " minutes " + numseconds + " seconds";
        } else {
        return numseconds + " seconds";
        }
    },

    onUndoMenuItemClick: function() {
        Teselagen.manager.GridCommandPatternManager.undo();
    },

    onRedoMenuItemClick: function() {
        Teselagen.manager.GridCommandPatternManager.redo();
    },

    onSuspendTabsEvent: function(){
        console.log("Suspending tabs");
        Ext.getCmp("mainAppPanel").items.items.forEach(function(tab){
            tab.disable();
        });
    },

    onResumeTabsEvent: function(){
        console.log("Resuming tabs");
        Ext.getCmp("mainAppPanel").items.items.forEach(function(tab){
            tab.enable();
        });        
    },

    /**
     * @member Vede.controller.DeviceEditor.DeviceEditorPanelController
     */
    init: function () {
        this.callParent();

        this.CommonEvent = Teselagen.event.CommonEvent;
        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.GridEvent = Teselagen.event.GridEvent;

        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);

        this.application.on(this.DeviceEvent.SAVE_DESIGN, this.onDeviceEditorSaveEvent, this);

        this.application.on(this.DeviceEvent.LOAD_EUGENE_RULES, this.onLoadEugeneRulesEvent, this);

        this.application.on(this.DeviceEvent.SUSPEND_TABS, this.onSuspendTabsEvent, this);

        this.application.on(this.DeviceEvent.RESUME_TABS, this.onResumeTabsEvent, this);

        this.application.on(this.CommonEvent.JUMPTOJ5RUN, this.onJumpToJ5Run, this);


        this.control({
            "button[cls='saveDeviceAsWindowOKButton']": {
                click: this.onSaveDeviceAsWindowOKBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Save Design']": {
                click: this.onDeviceEditorSaveEvent
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Save Design As']": {
                click: this.onDeviceEditorSaveAsBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Clear Design']": {
                click: this.onDeviceEditorClearBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Delete Design']": {
                click: this.onDeviceEditorDeleteBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Rename Design']": {
                click: this.onDeviceEditorRenameBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Import Eugene Rules']": {
                click: this.onImportEugeneRulesBtnClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Row Above']": {
                click: this.onAddRowAboveClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Row Below']": {
                click: this.onAddRowBelowClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column Left']": {
                click: this.onAddColumnLeftClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column Right']": {
                click: this.onAddColumnRightClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Undo']": {
                click: this.onUndoMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Redo']": {
                click: this.onRedoMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Clear Part']": {
                click: this.onclearPartMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Remove Column']": {
                click: this.onRemoveColumnMenuItemClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Remove Row']": {
                click: this.onRemoveRowMenuItemClick
            },
            "button[cls='examplesMenu'] > menu > menuitem": {
                click: this.onOpenExampleItemBtnClick
            },
            "button[cls='j5button']": {
                click: this.onJ5buttonClick
            }
        });

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
    }
});
