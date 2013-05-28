/**
 * Device Editor panel controller
 * @class Vede.controller.DeviceEditor.DeviceEditorPanelController
 */
Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*", "Teselagen.manager.DeviceDesignParsersManager", "Teselagen.manager.ProjectManager", "Teselagen.event.DeviceEvent", "Teselagen.manager.DeviceDesignManager"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    onLoadEugeneRulesEvent: function(){
        console.log("Trying to load eugene rules");
    },

    /*
    onLoadEugeneRulesEvent: function(){
        var currentProject = Ext.getCmp('mainAppPanel').getActiveTab().model;
        var deproject_id = currentProject.data.id;
        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUserResUrl("/projects/000/devicedesigns/000/eugenerules", ''),
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

                    if(!rule.operand1_id || !rule.operand2_id)
                    {
                        console.log(rule);
                        throw new Error("Some operand id is null.");
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
        deproject.save({callback:function(){

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
            });
        });

        }});
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

    onAddColumnClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN);
    },


    onclearPartMenuItemClick: function() {
        this.application.fireEvent(this.DeviceEvent.CLEAR_PART);
    },

    onJ5buttonClick: function (button, e, options) {
        Vede.application.fireEvent("openj5");
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);

        this.application.on("saveDesignEvent", this.onDeviceEditorSaveEvent, this);

        //this.application.on("loadEugeneRules", this.onLoadEugeneRulesEvent, this);

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
            "button[cls='insertMenu'] > menu > menuitem[text='Row']": {
                click: this.onAddRowClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column']": {
                click: this.onAddColumnClick
            },
            "button[cls='editMenu'] > menu > menuitem[text='Clear Part']": {
                click: this.onclearPartMenuItemClick
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