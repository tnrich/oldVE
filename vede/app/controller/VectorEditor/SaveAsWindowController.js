Ext.define("Vede.controller.VectorEditor.SaveAsWindowController", {
    extend: "Vede.controller.VectorEditor.SequenceEditingController",
    
    requires: ["Teselagen.manager.SequenceFileManager", "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager"],
               
    
    onWindowShow: function() {
    	var projectsGrid = Ext.getCmp('saveAsWindowProjectsGrid');
    },
    
    onProjectsGridItemClick: function(view,record,item,index) {
    	var sequences = record.sequences();
    	//sequences.getAt(0).get('name')
    	//Ext.getCmp('saveAsWindowSequencesGrid').store.removeAll();
        sequences.load({ // Load sequences store
            callback: function () {

                // Iterate over sequences
                sequences.each(function (sequence) {
                    Teselagen.manager.ProjectManager.sequenceStore.add(sequence); // Add sequence to sequences store
                    Ext.getCmp('saveAsWindowSequencesGrid').store.add(sequence);
                });
            }
        });
    	Ext.getCmp('saveAsWindowSequencesGrid').store.add(sequences);
    },
    
    init: function() {  	
    	this.control({
    		'#SaveAsWindow': {
    			show: this.onWindowShow
    		},
    		'#saveAsWindowProjectsGrid': {
    			itemclick: this.onProjectsGridItemClick
    		},
    	});
    } 
});