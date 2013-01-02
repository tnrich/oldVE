Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent", "Teselagen.manager.SequenceFileManager", "Teselagen.manager.ProjectManager"],

    editingDETab: null,
    sequenceFileManager: null,

    onVectorEditorProjectMode: function (seq) {
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setActiveTab(1);
        currentTabPanel.setLoading(true);
        self.editingSequence = seq;
        sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
        self.sequenceFileManager = sequenceFileManager;
        Teselagen.manager.ProjectManager.workingSequenceFileManager = sequenceFileManager;
        Vede.application.fireEvent("SequenceManagerChanged", sequenceFileManager);
        Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="saveSequenceBtn"]')[0].show();
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
                Teselagen.manager.ProjectManager.workingSequence = seq;
                self.sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
                Vede.application.fireEvent("SequenceManagerChanged", self.sequenceFileManager);
                Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="saveSequenceBtn"]')[0].show();
                currentTabPanel.setLoading(false);
            }
        });

    },

    onsaveSequenceBtnClick: function () {
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        var editingSequence = Teselagen.manager.ProjectManager.workingSequence;
        currentTabPanel.setLoading(true);

        rawGenbank = this.sequenceFileManager.toGenbank().toString();
        editingSequence.setSequenceFileContent(rawGenbank);

        var self = this;

        editingSequence.save({
            callback: function () {
                currentTabPanel.setLoading(false);
                currentTabPanel.setActiveTab(self.editingDETab);
            }
        });
    },

    onSequenceManagerChanged: function (newSequenceFileManager) {
        this.sequenceFileManager = newSequenceFileManager;
    },

    init: function () {

        this.control({
            '#VectorEditorMainMenuBar > button[cls="saveSequenceBtn"]': {
                click: this.onsaveSequenceBtnClick
            }
        });

        this.application.on("VectorEditorEditingMode", this.onVectorEditorEditingMode, this);
        this.application.on("VectorEditorProjectMode", this.onVectorEditorProjectMode, this);
        this.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);

    }
});