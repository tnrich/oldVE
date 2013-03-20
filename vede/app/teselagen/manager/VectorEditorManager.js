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
                            Ext.MessageBox.alert('Warning', 'This sequence already exists in the part library, using existing copy of sequence');
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
            Ext.MessageBox.prompt('Name', 'Please enter a sequence name:', function(btn,text){
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
                                    Teselagen.manager.ProjectManager.workingVEProject.set('name',text);
                                    project.veprojects().add(Teselagen.manager.ProjectManager.workingVEProject);
                                    Teselagen.manager.ProjectManager.workingVEProject.save({
                                        callback: function(){
                                            Teselagen.manager.ProjectManager.workingSequence.set('veproject_id',Teselagen.manager.ProjectManager.workingVEProject.data.id);
                                            saveToServer();
                                            Vede.application.fireEvent("renderProjectsTree", function () {
                                                Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id + '/' + Teselagen.manager.ProjectManager.workingVEProject.data.id);
                                            });
                                        }
                                    });
                                }
                            }
                        }

                    }).show();
                }
            });
        }
        else saveToServer();

    },

    saveProject: function(sequencefile_id){
        veproject = Teselagen.manager.ProjectManager.workingVEProject;
        if(!veproject) Teselagen.manager.ProjectManager.createNewVEProject(this.sequence);
        else {
            veproject.set('sequencefile_id',sequencefile_id);
            veproject.save();
        }
    }

});
