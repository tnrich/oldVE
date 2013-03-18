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

        executeRequest = function(){
            Ext.Ajax.request({
                url: Teselagen.manager.SessionManager.buildUrl("checkDuplicatedPartName", ''),
                method: 'GET',
                params: {
                    name: part.get('name'),
                    part: JSON.stringify(part.data)
                },
                success: function (response) {
                    sequence.save({
                        callback: function () {
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
                },
                failure: function(response){
                    Ext.MessageBox.prompt('Name', 'There\'s another part in the library using the same name. Please choose a different name', processPrompt);
                }
            });
        };

        executeRequest();
    },

    onCreatePartBtnClick: function () {

        var veproject = Teselagen.manager.ProjectManager.workingVEProject;
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
        console.log("Using general Vector Editor Sequence Editing Controller");
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

    init: function () {

        this.control({
            '#VectorEditorMainToolBar > button[cls="saveSequenceBtn"]': {
                click: this.onsaveSequenceBtnClick
            },
            '#VectorEditorMainToolBar > button[cls="createPartBtn"]': {
                click: this.onCreatePartBtnClick
            }
        });

        this.application.on("openVectorEditor", this.onOpenVectorEditor, this);

        this.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);
        this.application.on("partCreated", this.onPartCreated, this);


    }
});
