/**
 * Sequence editing controller
 * @class Vede.controller.VectorEditor.SequenceEditingController
 */
Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent", "Teselagen.manager.SequenceFileManager", "Teselagen.manager.ProjectManager"],

    editingDETab: null,
    sequenceFileManager: null,
    createPartWindow: null,

    onPartCreated: function (sequence, part) {
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
        /*
        this.createPartWindow = Ext.create('Vede.view.de.PartDefinitionDialog');
        this.createPartWindow.show();
        this.createPartWindow.setTitle('Create Part');


        var form = this.createPartWindow.down('form').getForm();
        var name = form.findField('partName');
        var partSource = form.findField('partSource');
        var sourceData = form.findField('sourceData');
        var specifiedSequence = form.findField('specifiedSequence');
        var startBP = form.findField('startBP');
        var stopBP = form.findField('stopBP');
        var revComp = form.findField('revComp');

        name.setValue('Untitled Part');
        partSource.setValue(veproject.get('name'));
        sourceData.setValue(sequence.get('sequenceFileContent'));

        specifiedSequence.setValue('Whole sequence');
        startBP.setValue(1);
        stopBP.setValue(sequence.getLength());


        this.createPartWindow.down('changePartDefinitionDoneBtn').hide();
        this.createPartWindow.down('saveDefinitionPartBtn').show();
        */
    },

    onVectorEditorProjectMode: function (seq) {
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setActiveTab(1);
        currentTabPanel.setLoading(true);
        self.editingSequence = seq;
        sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
        self.sequenceFileManager = sequenceFileManager;
        Teselagen.manager.ProjectManager.workingSequenceFileManager = sequenceFileManager;
        Vede.application.fireEvent("SequenceManagerChanged", sequenceFileManager);
//        Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="saveSequenceBtn"]')[0].show();
        currentTabPanel.setLoading(false);
    },

    onVectorEditorEditingMode: function (j5Part, DETab) {
        this.editingDETab = DETab;
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setActiveTab(1);
        currentTabPanel.setLoading(true);

        var self = this;

        j5Part.getSequenceFile({
            callback: function (seq) {
                console.log(seq);
                Teselagen.manager.ProjectManager.workingSequence = seq;
                self.sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
                Vede.application.fireEvent("SequenceManagerChanged", self.sequenceFileManager);
//                Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="saveSequenceBtn"]')[0].show();
                currentTabPanel.setLoading(false);
            }
        });

    },

//    onsaveSequenceBtnClick: function () {
//        var currentTabPanel = Ext.getCmp('mainAppPanel');
//        var editingSequence = Teselagen.manager.ProjectManager.workingSequence;
//        currentTabPanel.setLoading(true);
//
//        rawGenbank = this.sequenceFileManager.toGenbank().toString();
//        editingSequence.setSequenceFileContent(rawGenbank);
//
//        var self = this;
//
//        editingSequence.save({
//            callback: function () {
//                currentTabPanel.setLoading(false);
//                currentTabPanel.setActiveTab(self.editingDETab);
//            }
//        });
//    },

    onSequenceManagerChanged: function (newSequenceFileManager) {
        this.sequenceFileManager = newSequenceFileManager;
    },

    init: function () {

        this.control({
//            '#VectorEditorMainMenuBar > button[cls="saveSequenceBtn"]': {
//                click: this.onsaveSequenceBtnClick
//            },
            '#VectorEditorMainMenuBar > button[cls="createPartBtn"]': {
                click: this.onCreatePartBtnClick
            }
        });

        this.application.on("VectorEditorEditingMode", this.onVectorEditorEditingMode, this);
        this.application.on("VectorEditorProjectMode", this.onVectorEditorProjectMode, this);
        this.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);
        this.application.on("partCreated", this.onPartCreated, this);


    }
});