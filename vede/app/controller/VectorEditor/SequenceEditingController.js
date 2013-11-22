/**
 * Sequence editing controller
 * @class Vede.controller.VectorEditor.SequenceEditingController
 */
Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants",
               "Teselagen.event.DeviceEvent",
               "Teselagen.event.ProjectEvent",
               "Teselagen.event.SelectionEvent",
               "Teselagen.event.SequenceManagerEvent", 
               "Teselagen.manager.SequenceFileManager", 
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager"],

    editingDETab: null,
    createPartWindow: null,
    VEManager: null,

    onPartCreated: function (sequence, part) {
        if(sequence.getId()) {
            part.setSequenceFile(sequence);
        }

        processPrompt = function(btn,text){
            part.set('name',text);
            executeRequest();
        };

        var self = this;

        executeRequest = function(){
            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("checkDuplicatedPartName", ''),
                method: 'GET',
                params: {
                    name: part.get('name'),
                    part: JSON.stringify(part.data)
                },
                success: function (res) {
                    var response = JSON.parse(res.responseText);

                    if(response.type === 'success') {
                        self.VEManager.saveSequence(function(){
                            part.setSequenceFile(sequence);
                            part.set('sequencefile_id', sequence.data.id);
                            part.save({
                                success: function () {
                                    var now = new Date();
                                    nowTime = Ext.Date.format(now, "g:i:s A  ");
                                    nowDate = Ext.Date.format(now, "l, F d, Y");
                                    var parttext = Ext.getCmp('mainAppPanel').getActiveTab().down('tbtext[cls="VectorEditorStatusBarAlert"]');
                                    parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Part created at ' + nowTime + ' on ' + nowDate);
                                    toastr.options.onclick = null;
                                    
                                    toastr.info("Part Successfully Created");
                                }
                            });
                        });
                    } else if(response.type === 'error') {
                        Ext.Msg.alert('Duplicate Part', 'That exact part already exists in the Part Library.');
                    } else if(response.type === 'warning') {
                        Ext.Msg.confirm('Duplicate Part Name', 'A different part with the same name ("' + part.get("name") + '") already exists in the Part Library. Continue to create a new part using this name?', function(btn) {
                            if(btn === 'yes') {
                                part.setSequenceFile(sequence);
                                part.set('sequencefile_id', sequence.data.id);

                                part.save({
                                    success: function () {
                                        var now = new Date();
                                        nowTime = Ext.Date.format(now, "g:i:s A  ");
                                        nowDate = Ext.Date.format(now, "l, F d, Y");
                                        var parttext = Ext.getCmp('mainAppPanel').getActiveTab().down('tbtext[cls="VectorEditorStatusBarAlert"]');
                                        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Part created at ' + nowTime + ' on ' + nowDate);
                                        toastr.options.onclick = null;
                                        
                                        toastr.info("Part Sucessfully Created");
                                    }
                                });
                            }
                        });
                    }
                }
            });
        };

        executeRequest();
    },

    onCreatePartBtnClick: function () {
        var veproject = Teselagen.manager.ProjectManager.workingSequence;
        var sequence = Teselagen.manager.ProjectManager.workingSequence;
        var part = Ext.create("Teselagen.models.Part", {
            name: '',
            partSource: sequence.get("name"),
            genbankStartBP: 1,
            endBP: sequence.getLength()
        });

        Vede.application.fireEvent(this.DeviceEvent.CREATE_PART_DEFINITION, veproject, part, sequence);
    },

    onOpenVectorEditor: function(seq, part){
        var currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var sequenceFileManager;
        if(seq.get("serialize")) {
            sequenceFileManager = seq.getSequenceManager();
        } else {
            sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
        }

        if(!sequenceFileManager) {
            return;
        }

        var self = this;

        Teselagen.manager.ProjectManager.checkDuplicatedTabs(seq, "VectorEditorPanel", function(tabPanel) {
            var newTab = Ext.create("Vede.view.ve.VectorEditorPanel", {
                title: sequenceFileManager.getName(),
                icon: "resources/images/ux/tab-circular-icon.png",
                iconCls: "tab-icon"
            });
            newTab.model = sequenceFileManager;
            newTab.sequenceFile = seq;

            // Set VE tab options. Use JSON.parse and JSON.stringify on the default
            // options object to prevent all tabs from sharing the options object.
            // Gotta love pass-by-reference.
            newTab.options = JSON.parse(JSON.stringify(Teselagen.constants.Constants.DEFAULT_VE_VIEW_OPTIONS));
            newTab.options.circular = sequenceFileManager.getCircular();

            if(part) {
                newTab.options.selection = {
                    start: part.get("genbankStartBP") - 1,
                    end: part.get("endBP")
                };
            }

            if(!self.VEManager) {
                self.VEManager = Ext.create("Teselagen.manager.VectorEditorManager", seq, sequenceFileManager);
            } else {
                self.VEManager.sequence = seq;
            }

            tabPanel.add(newTab).show();

            Teselagen.manager.ProjectManager.workingSequence = seq;
        }, function(duplicatedTab) {
            if(duplicatedTab) {
                if(part) {
                    duplicatedTab.options.selection = {
                        start: part.get("genbankStartBP") - 1,
                        end: part.get("endBP")
                    };
                }

                duplicatedTab.show();
            }
        });
    },

    onsaveSequenceBtnClick: function(){
        this.VEManager.saveSequence();
    },

    onSequenceManagerChanged: function (newSequenceFileManager) {
        this.VEManager.changeSequenceManager(newSequenceFileManager);
    },

    onExportToFileMenuItemClick: function(){
        this.VEManager.saveSequenceToFile();
    },

    onSaveMenuItemClick: function() {
        this.VEManager.saveSequence();
    },

    onSaveAsMenuItemClick: function() {
        var saveAsWindow = Ext.create("Vede.view.ve.SaveAsWindow");

        saveAsWindow.show();
        saveAsWindow.center();

    },

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        if(oldTab && oldTab.initialCls === "VectorEditorPanel") {
            oldTab.model = this.VEManager.sequenceFileManager;
        }

        if(newTab && newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);
            this.VEManager.sequence = newTab.sequenceFile;
        }
    },

    init: function () {
        this.DeviceEvent = Teselagen.event.DeviceEvent;
        this.ProjectEvent = Teselagen.event.ProjectEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.control({
            '#mainAppPanel': {
                tabchange: this.onTabChange
            },
            'component[cls="VectorEditorMainToolBar"] > button[cls="saveSequenceBtn"]': {
                click: this.onsaveSequenceBtnClick
            },
            'component[cls="VectorEditorMainToolBar"] > button[cls="createPartBtn"]': {
                click: this.onCreatePartBtnClick
            },
            "component[identifier='exportToFileMenuItem']": {
                click: this.onExportToFileMenuItemClick
            },
            "component[identifier='saveMenuItem']": {
                click: this.onSaveMenuItemClick
            },
            "component[identifier='saveAsMenuItem']": {
                click: this.onSaveAsMenuItemClick
            }
        });

        this.application.on(this.ProjectEvent.OPEN_SEQUENCE_IN_VE, this.onOpenVectorEditor, this);
        this.application.on(this.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, this.onSequenceManagerChanged, this);
        this.application.on(this.DeviceEvent.PART_CREATED, this.onPartCreated, this);
    }
});
