/**
 * Sequence editing controller
 * @class Vede.controller.VectorEditor.SequenceEditingController
 */
Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.constants.Constants",
               "Teselagen.event.DeviceEvent",
               "Teselagen.event.ProjectEvent",
               "Teselagen.event.SequenceManagerEvent", 
               "Teselagen.manager.SequenceFileManager", 
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager"],

    editingDETab: null,
    createPartWindow: null,
    VEManager: null,

    onPartCreated: function (sequence, part) {
        processPrompt = function(btn,text){
            part.set('name',text);
            executeRequest();
        };

        var self = this;

        executeRequest = function(){
            
          part.set('project_id', Teselagen.manager.ProjectManager.workingProject.data.id);

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
                            part.setSequenceFileModel(sequence);
                            part.set('sequencefile_id', sequence.data.id);
                            
                            part.save({
                                callback: function () {
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
                                part.setSequenceFileModel(sequence);
                                part.set('sequencefile_id', sequence.data.id);

                                part.save({
                                    callback: function () {
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
            partSource: '',
            genbankStartBP: 1,
            endBP: sequence.getLength()
        });

        Vede.application.fireEvent(this.DeviceEvent.CREATE_PART_DEFINITION, veproject, part, sequence);
    },

    onOpenVectorEditor: function(seq){
        var sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
        var self = this;

        Teselagen.manager.ProjectManager.checkDuplicatedTabs(seq, "VectorEditorPanel", function(tabPanel) {
            var newTab = Ext.create("Vede.view.ve.VectorEditorPanel", {
                title: sequenceFileManager.getName(),
                icon: "resources/images/ux/tab-circular-icon.png",
                iconCls: "tab-icon",
            });
            newTab.model = sequenceFileManager;
            newTab.sequenceFile = seq;
            newTab.options = Teselagen.constants.Constants.DEFAULT_VE_VIEW_OPTIONS;
            newTab.options.circular = sequenceFileManager.getCircular();

            self.VEManager = Ext.create("Teselagen.manager.VectorEditorManager", seq, sequenceFileManager);

            tabPanel.add(newTab).show();

            Teselagen.manager.ProjectManager.workingSequence = seq;
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
          
    	/*var self = this;
          var onPromptClosed = function (btn, sequenceName) {
                  var self = this;
                  var selectWindow = Ext.create('Ext.window.Window', {
                      title: 'Select Project',
                      height: 200,
                      width: 400,
                      layout: 'fit',
                      items: {
                          xtype: 'grid',
                          border: false,
                          columns: {
                              items: {
                                  text: "Name",
                                  dataIndex: "name"
                              },
                              defaults: {
                                  flex: 1
                              }
                          },
                          store: Teselagen.manager.ProjectManager.projects,
                          listeners: {
                              "itemclick": function (grid, project, item) {
                                  Teselagen.manager.ProjectManager.workingSequence.set('name', sequenceName);
                                  project.veprojects().add(Teselagen.manager.ProjectManager.workingSequence);
                                  project.save({
                                      callback: function () {
                                          Teselagen.manager.ProjectManager.workingSequence.save({
                                             callback: function () {
                                                  Teselagen.manager.ProjectManager.workingSequence.save({
                                                      callback: function () {
                                                          selectWindow.close();
                                                         Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
                                                          self.saveSequenceBtn.un('click',self);
                                                      }
                                                  });
                                              }
                                          });
                                      }
                                 });
                                  selectWindow.close();
                             }
                          }
                      }
                  }).show();
              };


          Ext.MessageBox.prompt('Name', 'Please enter a sequence name:', onPromptClosed, this);
    	*/
    },

    onTabChange: function(mainAppPanel, newTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);
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
