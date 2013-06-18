/**
 * Sequence editing controller
 * @class Vede.controller.VectorEditor.SequenceEditingController
 */
Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent", "Teselagen.manager.SequenceFileManager", "Teselagen.manager.ProjectManager",
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
            /*
            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("checkDuplicatedPartName", ''),
                method: 'GET',
                params: {
                    name: part.get('name'),
                    part: JSON.stringify(part.data)
                },
                success: function (response) {
            */
            self.VEManager.saveSequence(function(){
                    //sequence.save({
                      //  callback: function () {
                            part.setSequenceFileModel(sequence);
                            part.set('sequencefile_id', sequence.data.id);
                            part.set('project_id', Teselagen.manager.ProjectManager.workingProject.data.id);
                            part.save({
                                callback: function () {
                                    var now = new Date();
                                    nowTime = Ext.Date.format(now, "g:i:s A  ");
                                    nowDate = Ext.Date.format(now, "l, F d, Y");
                                    var parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
                                    parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Part created at ' + nowTime + ' on ' + nowDate);
                                    toastr.options.onclick = null;
                                    toastr.info("Part Sucessfully Created");
                                }
                            });
                    //    }
                    //});
            });
            /*
                },
                failure: function(response){
                    response = JSON.parse(response.responseText);
                    if(response.type==='error') Ext.MessageBox.prompt('Name', 'There\'s another part in the library using the same name. Please choose a different name', processPrompt);
                    if(response.type==='warning')
                    {
                        Ext.MessageBox.confirm('Confirm', 'The part already exist. Are you sure you want to do that?',
                        function(btn){
                            if(btn==='yes')
                            {
                                part.setSequenceFileModel(sequence);
                                part.set('sequencefile_id', sequence.data.id);
                                part.save({
                                    callback: function () {
                                        var parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
                                        parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Part created');
                                        parttext.animate({duration: 5000, to: {opacity: 0}});
                                    }
                                });
                            }
                        });
                    }
                }
            });
            */
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

        Vede.application.fireEvent("createPartDefinition", veproject, part, sequence);
    },

    onOpenVectorEditor: function(seq){
        //console.log("Using general Vector Editor Sequence Editing Controller");
        currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setActiveTab(1);
        Teselagen.manager.ProjectManager.workingSequence = seq;
        sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);

        this.VEManager = Ext.create("Teselagen.manager.VectorEditorManager",seq,sequenceFileManager);

        Vede.application.fireEvent("SequenceManagerChanged", sequenceFileManager);
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
    
    init: function () {

        this.control({
            '#VectorEditorMainToolBar > button[cls="saveSequenceBtn"]': {
                click: this.onsaveSequenceBtnClick
            },
            '#VectorEditorMainToolBar > button[cls="createPartBtn"]': {
                click: this.onCreatePartBtnClick
            },
            "#exportToFileMenuItem": {
                click: this.onExportToFileMenuItemClick
            },
            "#saveMenuItem": {
                click: this.onSaveMenuItemClick
            },
            "#saveAsMenuItem": {
                //click: this.onSaveAsMenuItemClick
            }
        });

        this.application.on("openVectorEditor", this.onOpenVectorEditor, this);
        this.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);
        this.application.on("partCreated", this.onPartCreated, this);


    }
});
