/**
 * Device Editor panel controller
 * @class Vede.controller.DeviceEditor.DeviceEditorPanelController
 */
Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*", "Teselagen.manager.DeviceDesignParsersManager", "Teselagen.manager.ProjectManager", "Teselagen.event.DeviceEvent", "Teselagen.manager.DeviceDesignManager","Teselagen.event.ProjectEvent"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    onLoadEugeneRulesEvent: function(){
        //console.log("Loading eugene rules");
        var currentProject = Ext.getCmp('mainAppPanel').getActiveTab().model;
        var deproject_id = currentProject.data.id;
        var self = this;
        
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUserResUrl("/projects/"+currentProject.data.project_id+"/devicedesigns/"+currentProject.data.id+"/eugenerules", ''),
            method: 'GET',
            params: {
                id: deproject_id
            },
            success: function (response) {
                response = JSON.parse(response.responseText);
                rules = response.rules;

                var allParts = self.DeviceDesignManager.getAllPartsAsStore(currentProject.getDesign());

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
                    newEugeneRule.setOperand2(allParts.getById(rule.operand2_id));
                    currentProject.getDesign().addToRules(newEugeneRule);
                });
            },
            failure: function(response, opts) {
                Ext.MessageBox.alert('Error','Problem while loading Eugene Rules');
            }
        });
        
    },
    

    /**
     * When opening a Device Editor project, store it in the "model" attribute of the active Device Editor panel.
     */
    openProject: function (project) {
        Ext.getCmp('mainAppPanel').getActiveTab().model = project;
    },

    onDeviceEditorRenameBtnClick: function () {
        var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;

        var onPromptClosed = function (answer, text) {
                deproject.set('name', text);
                deproject.save({
                    callback: function () {
                        Ext.getCmp('mainAppPanel').getActiveTab().setTitle("Device Editor | "+text);

                        var parttext = Ext.getCmp('mainAppPanel').getActiveTab().down('DeviceEditorStatusPanel').down('tbtext[cls="DeviceEditorStatusBarAlert"]');
                        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Design renamed');
                        parttext.animate({duration: 5000, to: {opacity: 0}});

                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                            Ext.getCmp('projectTreePanel').expandPath('/root/' + deproject.data.project_id + '/' + deproject.data.id);
                        });
                    }
                });
            };

        Ext.MessageBox.prompt("Rename Design", 'New name:', onPromptClosed, this, false, deproject.get("name"));
    },

    onDeviceEditorDeleteBtnClick: function () {

        Ext.Msg.show({
             title:'Are you sure you want to delete this design?',
             msg: 'WARNING: This will remove the current design. This action is not undoable!',
             cls: 'messageBox',
             buttons: Ext.Msg.OKCANCEL,
             fn: DeleteDeviceDesignBtn,
             icon: Ext.Msg.QUESTION
        });

        function DeleteDeviceDesignBtn (btn) {
            if (btn=='ok') {
                var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
                Teselagen.manager.ProjectManager.DeleteDeviceDesign(activeTab.model, activeTab);
                $.jGrowl("Design Deleted");
             }
         }
    },

    onOpenExampleItemBtnClick: function (item, e, eOpts) {
        var selectedItem = item.text;
        var examplesMap = {
            "SLIC/Gibson/CPEC": "resources/examples/SLIC_Gibson_CPEC.json",
            "Combinatorial SLIC/Gibson/CPEC": "resources/examples/Combinatorial_SLIC_Gibson_CPEC.json",
            "Golden Gate": "resources/examples/Golden_Gate.json",
            "Combinatorial Golden Gate": "resources/examples/Combinatorial_Golden_Gate.json"
        };

        Ext.Ajax.request({
            url: examplesMap[selectedItem],
            method: 'GET',
            success: function (response) {
                Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText, selectedItem.replace(" ", "_"));
            }
        });
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

    saveDEProject: function (cb) {

        // var loadingMessage = this.createLoadingMessage();

        Vede.application.fireEvent("suspendPartAlerts");

        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var deproject = activeTab.model;

        var design = deproject.getDesign();
        // loadingMessage.update(30, "Saving design");
        //deproject.save({callback:function(){

        var saveAssociatedSequence = function (part, cb) {
                part.getSequenceFile({callback: function(associatedSequence){
                    if(associatedSequence)
                    {
                        var lastSequenceId = associatedSequence.get('id');
                        if(Object.keys(associatedSequence.getChanges()).length > 0 || !associatedSequence.get('id'))
                        {
                            associatedSequence.save({
                                callback: function (sequencefile) {
                                    if(!lastSequenceId)
                                    {
                                        part.set("sequencefile_id", sequencefile.get('id'));
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
            };

        var saveDesign = function () {
                //console.log("saving design");
                Ext.getCmp("mainAppPanel").getActiveTab().model.getDesign().rules().clearFilter();
                design = activeTab.model.getDesign();
                design.save({
                    callback: function (record, operation) {
                        // loadingMessage.close();
                        Vede.application.fireEvent("resumePartAlerts");
                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                            Ext.getCmp("projectTreePanel").expandPath("/root/" + Teselagen.manager.ProjectManager.workingProject.data.id + "/" + design.data.id);
                            $.jGrowl("Design Saved");
                        });
                        if(typeof (cb) == "function") cb();
                    }
                });
            };

        var countParts = 0;

        design.getJ5Collection().bins().each(function (bin, binKey) {
            bin.parts().each(function (part, partIndex) {
                countParts++;
            });
        });
        // loadingMessage.update(30, "Saving "+countParts+" parts");
        //console.log("Saving "+countParts+" parts");
        design.getJ5Collection().bins().each(function (bin, binKey) {
            bin.parts().each(function (part, partIndex) {

                    if(!part.data.project_id) part.set('project_id',Teselagen.manager.ProjectManager.workingProject.data.id);
                    if(part.data.name==="") part.set('phantom',true);
                    else part.set('phantom',false);
                
                    if(Object.keys(part.getChanges()).length > 0 || !part.data.id) {
                        part.save({
                            callback: function (part) {
                                saveAssociatedSequence(part, function () {
                                    if(countParts == 1) saveDesign();
                                    countParts--;
                                    // loadingMessage.update(30, "Saving "+countParts+" parts");
                                    //console.log("Saving "+countParts+" parts");
                                });
                            }
                        });
                    } else {
                        saveAssociatedSequence(part,function(){
                        if(countParts === 1) saveDesign();
                        countParts--;
                        // Vede.application.fireEvent("MapPart", part);
                        // loadingMessage.update(30, "Saving "+countParts+" parts");
                        });
                    }
                //}
            });
        });
        
        //}});
    },

    onDeviceEditorSaveBtnClick: function () {
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        activeTab.el.mask('Loading');
        this.saveDEProject(function () {
            activeTab.el.unmask();

        });

    },

    onDeviceEditorSaveEvent: function (arg) {
        this.saveDEProject(arg);
    },


    onAddRowClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW, null);
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

    onJ5buttonClick: function (button, e, options) {
        Vede.application.fireEvent("openj5");

        $.jGrowl("Design Saved");
    },

    onImportEugeneRulesBtnClick: function(){
        
    },

    onJumpToJ5Run: function(data) {
        var design_id = data.devicedesign_id;
        var project_id = data.project_id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);

        var self = this;
        var continueCode = function(){

        self.detailPanel = Ext.getCmp('mainAppPanel').getActiveTab().query('panel[cls="j5detailpanel"]')[0];
        self.detailPanelFill = Ext.getCmp('mainAppPanel').getActiveTab().query('panel[cls="j5detailpanel-fill"]')[0];
        self.detailPanel.show();
        self.detailPanelFill.hide();

        var j5runs = Teselagen.manager.ProjectManager.projects.getById(project_id).designs().getById(design_id).j5runs();

        j5runs.load({
            callback : function(){

                j5runs = Teselagen.manager.ProjectManager.projects.getById(project_id).designs().getById(design_id).j5runs();

                self.activeJ5Run = j5runs.getById(data.id);


        var assemblyMethod = self.activeJ5Run.get('assemblyMethod');
        var status = self.activeJ5Run.get('status');
        var startDate = new Date(self.activeJ5Run.get('date'));
        var endDate = new Date(self.activeJ5Run.get('endDate'));
        var elapsed = endDate - startDate;
        elapsed = Math.round(elapsed/1000);
        elapsed = self.elapsedDate(elapsed);
        startDate = Ext.Date.format(startDate, "l, F d, Y g:i:s A");
        endDate = Ext.Date.format(endDate, "l, F d, Y g:i:s A");
        var assemblies    = self.activeJ5Run.getJ5Results().assemblies();
        var combinatorial = self.activeJ5Run.getJ5Results().getCombinatorialAssembly();
        var j5parameters = self.activeJ5Run.getJ5Input().getJ5Parameters().getParametersAsStore();
        //console.log(self.activeJ5Run.getJ5Input().getJ5Parameters());
        //console.log(j5parameters);
        //console.log(self.activeJ5Run);

        Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").getForm().findField('j5AssemblyType').setValue(assemblyMethod);
        Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").getForm().findField('j5RunStatus').setValue(status);
        Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").getForm().findField('j5RunStart').setValue(startDate);
        Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").getForm().findField('j5RunEnd').setValue(endDate);
        Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").getForm().findField('j5RunElapsed').setValue(elapsed);

        if(status=="Completed") {
            var field = Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
            $("#" + field + " .status-note").removeClass("status-note-warning");
            $("#" + field + " .status-note").addClass("status-note-completed");
        } else if (status=="Completed with warnings") {
            var field = Ext.getCmp('mainAppPanel').getActiveTab().down("form[cls='j5RunInfo']").query('field[cls="j5RunStatusField"]')[0].getId();
            $("#" + field + " .status-note").removeClass("status-note-completed");
            $("#" + field + " .status-note").addClass("status-note-warning");
        }

        var warnings = self.activeJ5Run.raw.warnings;

        var warningsStore = Ext.create('Teselagen.store.WarningsStore', {
            model: 'Teselagen.models.j5Output.Warning',
            data: warnings,
        });

        if ((warnings.length>0)==true) {
            Ext.getCmp('mainAppPanel').getActiveTab().down('gridpanel[name="warnings"]').show();
            Ext.getCmp('mainAppPanel').getActiveTab().down('gridpanel[name="warnings"]').reconfigure(warningsStore);
        } else {
             Ext.getCmp('mainAppPanel').getActiveTab().down('gridpanel[name="warnings"]').hide();
             warnings = null;
             warningsStore = null;
        }

        Ext.getCmp('mainAppPanel').getActiveTab().down('gridpanel[name="assemblies"]').reconfigure(assemblies);
        Ext.getCmp('mainAppPanel').getActiveTab().down('gridpanel[name="j5parameters"]').reconfigure(j5parameters);
        Ext.getCmp('mainAppPanel').getActiveTab().down('textareafield[name="combinatorialAssembly"]').setValue(combinatorial.get('nonDegenerativeParts'));
        
        Vede.application.fireEvent("resetJ5ActiveRun", self.activeJ5Run);
        // Ext.getCmp('mainAppPanel').getActiveTab().down('button[cls="downloadResults"]').href = '/api/getfile/'+self.activeJ5Run.data.file_id;
            }
        });

        };

        project.designs().load({
            id: design_id,
            callback: function (loadedDesign) {
                Teselagen.manager.ProjectManager.workingProject = project;
                var design = loadedDesign[0];
                //console.log(design);
                //var j5report = loadedDesign[0].j5runs();
                Teselagen.manager.ProjectManager.openj5Report(design,continueCode);
            }
        });

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

    /**
     * @member Vede.controller.DeviceEditor.DeviceEditorPanelController
     */
    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);

        this.application.on("saveDesignEvent", this.onDeviceEditorSaveEvent, this);

        this.application.on("loadEugeneRules", this.onLoadEugeneRulesEvent, this);

        this.application.on("jumpToJ5Run", this.onJumpToJ5Run, this);

        this.control({
            "button[cls='fileMenu'] > menu > menuitem[text='Save Design']": {
                click: this.onDeviceEditorSaveEvent
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
            "button[cls='insertMenu'] > menu > menuitem[text='Row']": {
                click: this.onAddRowClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column Left']": {
                click: this.onAddColumnLeftClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column Right']": {
                click: this.onAddColumnRightClick
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
        this.DeviceEvent = Teselagen.event.DeviceEvent;
    }
});