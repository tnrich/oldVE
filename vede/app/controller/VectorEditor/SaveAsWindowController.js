Ext.define("Vede.controller.VectorEditor.SaveAsWindowController", {
    extend: "Vede.controller.VectorEditor.SequenceEditingController",
    
    requires: ["Teselagen.manager.SequenceFileManager", 
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.VectorEditorManager", 
               "Teselagen.event.ProjectEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.bio.parsers.ParsersManager", 
               "Teselagen.constants.Constants"],
               
    sequenceManager: null,
    sequenceGrid: null,
    sequenceNameField: null,
   
    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },
   
    onWindowShow: function() {
    	this.sequenceGrid = Ext.getCmp('saveAsWindowSequencesGrid');
        this.sequenceNameField = Ext.getCmp('saveAsWindowSequenceNameField');

        this.sequenceGrid.reconfigure(Teselagen.manager.ProjectManager.sequences);
    	
        this.sequenceNameField.setValue(this.sequenceManager.getName());
    },

    onGridItemClick: function(grid, sequence, el) {
        this.sequenceNameField.setValue(sequence.get('name'));
    },
    
    onSaveAsWindowOKButtonClick: function() {  	
    	var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
    	var sequencesNames = [];
    	var name = Ext.String.trim(this.sequenceNameField.getValue());

    	if(name==null || name.match(/^\s*$/) || name.length==0) {
    		this.sequenceNameField.setFieldStyle("border-color:red");
    	} else {
            Teselagen.manager.UserManager.getUser().sequences().load().each(function (sequence) {
                sequencesNames.push(sequence.data.name);
            });
            
            for (var j=0; j<sequencesNames.length; j++) {
                if (sequencesNames[j]===name) {
                	Ext.MessageBox.alert('','A sequence with the name "'+name+'" already exists. \nPlease select another name.');
    				return;
                }
            }
            
    		/*var sequenceStore = Teselagen.manager.ProjectManager.sequenceStore;
    		for(var i=0;i<sequenceStore.data.items.length;i++) {
    			if(name==sequenceStore.data.items[i].data.name && selectedProj.internalId==sequenceStore.data.items[i].data.project_id) {
    				//Actually, just do the same thing here as regular "save" file. (I think)
    				
    				// Put better way of alerting user. The following line of code is just temporary.
    				// ProjectManager seems to have a similiar message.
    				alert('A sequence with the name "'+name+'" already exists in the project "'+selectedProj.data.name+'."\nPlease select another name.');
    				return;
    			}
    		}*/
    		
    		/*var parser = Teselagen.bio.parsers.ParsersManager;
    		var constants = Teselagen.constants.Constants;
    		var format = workingSequence.data.sequenceFileFormat;
    		
    		if (format === constants.GENBANK) {
    			
    		} else if (format === constants.FASTA) {
    			
    		} else if (format === constants.JBEISEQ) {
    			
    		} else if (format === constants.SBOLXML) {
    			
            } else {
            	console.error("ERROR: Invalid file format");
            }*/
    		
    		var genbank = this.sequenceManager.toGenbank();
    		var locus = genbank.getLocus();
    		locus.locusName = name;
    		genbank.setLocus(locus);
    		
    		// May not work with non-genbank files.
    		var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: workingSequence.data.sequenceFileFormat,
                sequenceFileContent: genbank.toString(),
                sequenceFileName: workingSequence.data.sequenceFileName,
                partSource: workingSequence.data.partSource,
                dateModified: new Date(),
                name: name
            });

    		            
            newSequenceFile.save({
                callback: function () {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                        Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                        Teselagen.manager.ProjectManager.openSequence(newSequenceFile);
                    });
                }
            });    		
    		
    		Ext.getCmp('SaveAsWindow').close();
    	}	
    },

    onTabChange: function(mainAppPanel, newTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);
        }
    },
    
    init: function() {  	
    	this.control({
            '#mainAppPanel': {
                tabchange: this.onTabChange
            },
    		'#SaveAsWindow': {
    			show: this.onWindowShow,
    		},
            '#saveAsWindowSequencesGrid': {
                itemclick: this.onGridItemClick,
            },
    		'#saveAsWindowOKButton': {
    			click: this.onSaveAsWindowOKButtonClick
    		}
    	});

    	this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                            this.onSequenceManagerChanged, this);
    } 
});
