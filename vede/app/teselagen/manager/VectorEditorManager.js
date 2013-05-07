/**
 * @class Teselagen.manager.VectorEditorManager
 * Class describing a VectorEditorManager.
 *
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.VectorEditorManager", {

    sequenceFileManager: null,
    sequence: null,

    constructor: function(seq,mgr) {
        console.log("Teselagen.manager.VectorEditorManager created");
        this.sequenceManager = mgr;
        this.sequence = seq;
        Ext.getCmp("mainAppPanel").down('button[cls="saveSequenceBtn"]').show();
    },

    changeSequenceManager: function(newSequenceManager){
        console.log("SequenceManager changed!!");
        this.sequenceFileManager = newSequenceManager;
    },

    saveSequence : function(){
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setLoading(true);

        rawGenbank = this.sequenceFileManager.toGenbank().toString();
        this.sequence.setSequenceFileContent(rawGenbank);

        var self = this;

        saveToServer = function(){
            self.sequence.save({
                success: function (msg,operation) {
                    response = JSON.parse(operation.response.responseText);
                    currentTabPanel.setLoading(false);
                    parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
                    parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Successfully Saved');
                    parttext.animate({duration: 5000, to: {opacity: 0}});
                    if(response.info)
                    {
                        if(response.info == "duplicated")
                        {
                            Ext.MessageBox.alert('Warning', 'This sequence already exists in the part library, using existing sequence');
                        }
                    }
                    self.saveProject(response.sequence.id);
                },
                failure: function(response,operation) {
                    Ext.MessageBox.alert('Error', 'Duplicated sequence.');
                    currentTabPanel.setLoading(false);
                }
            });
        };

        if(!this.sequence.get('veproject_id'))
        {

            var self = this;
            msgPrompt = Ext.MessageBox.prompt('Name', 'Please enter a sequence name:', function(btn,text){
                if(btn==='ok')
                {
                    currentTab = Ext.getCmp('mainAppPanel').getActiveTab();
                    currentTabEl = (currentTab.getEl());
                    selectWindow = Ext.create('Ext.window.Window', {
                        title: 'Please choose a project',
                        height: 200,
                        width: 400,
                        layout: 'fit',
                        renderTo: currentTabEl,
                        items: {
                            xtype: 'grid',
                            border: false,
                            columns: {
                                items: {
                                    dataIndex: "name"
                                },
                                defaults: {
                                    flex: 1
                                }
                            },
                            store: Teselagen.manager.ProjectManager.projects,
                            listeners: {
                                "itemclick": function(grid, project, item){
                                    selectWindow.close();
                                    Teselagen.manager.ProjectManager.workingSequence.set('name',text);
                                    Teselagen.manager.ProjectManager.workingSequence.setProject(project);
                                    Teselagen.manager.ProjectManager.workingSequence.set('project_id',project.data.id);
                                    project.sequences().add(Teselagen.manager.ProjectManager.workingSequence);
                                    Teselagen.manager.ProjectManager.workingSequence.save({
                                        callback: function(){
                                            saveToServer();
                                            Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                                Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id + '/' + Teselagen.manager.ProjectManager.workingSequence.data.id);
                                            });
                                        }
                                    });
                                }
                            }
                        }

                    }).show();
                }
                else currentTabPanel.setLoading(false);
            },this,false,self.sequenceFileManager.name);
        }
        else saveToServer();

    },

    saveProject: function(sequencefile_id){
        veproject = Teselagen.manager.ProjectManager.workingSequence;
        if(!veproject) Teselagen.manager.ProjectManager.createNewVEProject(this.sequence);
        else {
            veproject.set('sequencefile_id',sequencefile_id);
            veproject.save();
        }
    }

});
