Ext.define('Vede.controller.VectorEditor.SequenceEditingController', {
    extend: 'Ext.app.Controller',

    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.manager.SequenceFileManager"],

    editingDETab : null,
    editingSequence:  null,
    sequenceFileManager : null,

    onVectorEditorEditingMode: function(j5Part,DETab) {
    this.editingDETab = DETab;
    var currentTabPanel = Ext.getCmp('mainAppPanel');
    currentTabPanel.setActiveTab(1);
    currentTabPanel.setLoading(true);

    var self = this;

    j5Part.getSequenceFile({
        callback: function(seq){
            self.editingSequence = seq;
            sequenceFileManager = Teselagen.manager.SequenceFileManager.sequenceFileToSequenceManager(seq);
            self.sequenceFileManager = sequenceFileManager;
            Vede.application.fireEvent("SequenceManagerChanged", sequenceFileManager);
            Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="doneEditingBtn"]')[0].show();
            currentTabPanel.setLoading(false);
        }
    });
    },

    onDoneEditingBtnClick: function(){
        var currentTabPanel = Ext.getCmp('mainAppPanel');
        currentTabPanel.setLoading(true);

        rawGenbank = this.sequenceFileManager.toGenbank().toString();
        this.editingSequence.setSequenceFileContent(rawGenbank);

        var self = this;

        this.editingSequence.save({
            callback: function(){
                currentTabPanel.setLoading(false);
                currentTabPanel.setActiveTab(self.editingDETab);
            }
        });
    },

    onSequenceManagerChanged: function(newSequenceFileManager){
        this.sequenceFileManager = newSequenceFileManager;
    },

    init: function () {

        this.control({
            '#VectorEditorMainMenuBar > button[cls="doneEditingBtn"]': {
            click: this.onDoneEditingBtnClick
        }});

        this.application.on("VectorEditorEditingMode", this.onVectorEditorEditingMode, this);
        this.application.on("SequenceManagerChanged", this.onSequenceManagerChanged, this);

    },
});

