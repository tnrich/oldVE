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

        this.sequence.save({
            success: function (msg,operation) {
                currentTabPanel.setLoading(false);
                parttext = Ext.getCmp('VectorEditorStatusPanel').down('tbtext[id="VectorEditorStatusBarAlert"]');
                parttext.animate({duration: 1000, to: {opacity: 1}}).setText('Sequence Successfully Saved');
                parttext.animate({duration: 5000, to: {opacity: 0}});
                //veproject = JSON.parse(operation.response.responseText).veproject;
                //self.saveProject(veproject);
            },
            failure: function(response,operation) {
                Ext.MessageBox.alert('Error', 'Duplicated sequence.');
                currentTabPanel.setLoading(false);
            }
        });
    },

    saveProject: function(veproject){
        console.log(Teselagen.manager.ProjectManager.workingVEProject);
        if(!veproject) Teselagen.manager.ProjectManager.createNewVEProject(this.sequence);
    }

});
