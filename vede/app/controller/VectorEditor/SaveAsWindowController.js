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
   
    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },
   
    onWindowShow: function() {
    	Ext.getCmp('saveAsWindowNewProjectButton').setPosition(10); 
    	
    	Ext.getCmp('saveAsWindowProjectsGrid').getSelectionModel().select(Teselagen.manager.ProjectManager.workingProject);
    	Ext.getCmp('saveAsWindowSequencesGrid').store.removeAll();
    	
    	var sequences = Teselagen.manager.ProjectManager.workingProject.sequences();
    	sequences.load({
            callback: function (records) {
                Ext.getCmp('saveAsWindowSequencesGrid').store.add(records);
            }
        });  	 	
    },
    
    onWindowResize: function() {
    	Ext.getCmp('saveAsWindowNewProjectButton').setPosition(10);
    },
    
    onProjectsGridItemClick: function(view,record,item,index) { 	
    	Ext.getCmp('saveAsWindowSequencesGrid').store.removeAll();
    	
    	var sequences = record.sequences();
    	sequences.load({
            callback: function (records) {
                Ext.getCmp('saveAsWindowSequencesGrid').store.add(records);
            }
        });  	
    },
    
    onSaveAsWindowNewProjectButtonClick: function() {
    	//Teselagen.manager.ProjectManager
        var onPromptClosed = function (btn, text) {
            if(btn === "ok") {
                if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, Teselagen.manager.ProjectManager); }
                Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Creating new project", "loader rspin");
                $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");
                var self = Teselagen.manager.ProjectManager;
                var project = Ext.create("Teselagen.models.Project", {
                    name: text,
                    dateCreated: new Date(),
                    dateModified: new Date()
                });

                Teselagen.manager.ProjectManager.currentUser.projects().add(project);
                project.save({
                    callback: function () {
                        self.workingProject = project;
                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                            Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id);
                            Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                        });
                    }
                });
                
            } else {
                return false;
            }
        };

        Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, Teselagen.manager.ProjectManager);    
    },
    
    onSaveAsWindowOKButtonClick: function() {  	
    	var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
    	
    	var name = Ext.getCmp('saveAsWindowSequenceNameField').getValue();
    	name = Ext.String.trim(name);
    	var selectedProjs = Ext.getCmp('saveAsWindowProjectsGrid').getSelectionModel().getSelection();
    	if(selectedProjs.length<1) {
    		console.error("ERROR: No project selected when OK button clicked. ["+this.$className+"]");
    		return;
    	} else if(selectedProjs.length>1) {
    		console.error("ERROR: Too many ("+selectedProjs.length+") projects selected when OK button clicked. ["+this.$className+"]");
    		return;
    	}
    	var selectedProj = selectedProjs[0];  	
    	if(name==null || name.match(/^\s*$/) || name.length==0) {
    		Ext.getCmp('saveAsWindowSequenceNameField').setFieldStyle("border-color:red");
    	} else {
    		var project_id = selectedProj.internalId;
    		var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
            var sequencesNames = [];
            project.sequences().load().each(function (sequence) {
                sequencesNames.push(sequence.data.name);
            });
            
            for (var j=0; j<sequencesNames.length; j++) {
                if (sequencesNames[j]===name) {
                	Ext.MessageBox.alert('','A sequence with the name "'+name+'" already exists in the project "'+selectedProj.data.name+'."\nPlease select another name.');
                	//alert('A sequence with the name "'+name+'" already exists in the project "'+selectedProj.data.name+'."\nPlease select another name.');
    				return;
                }
                	//{ return Ext.MessageBox.prompt("Name", "A sequence with this name already exists in this project. Please enter another name:", onPromptClosed, this); }
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
                name: name
            });

    		selectedProj.sequences().add(newSequenceFile);
            newSequenceFile.set("project_id",selectedProj.data.id);
            
            newSequenceFile.save({
                callback: function () {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                        Ext.getCmp("projectTreePanel").expandPath("/root/" + selectedProj.data.id + "/" + newSequenceFile.data.id);
                        Ext.getCmp("mainAppPanel").getActiveTab().el.unmask();
                        Teselagen.manager.ProjectManager.openSequence(newSequenceFile);
                    });
                }
            });    		
    		
    		Ext.getCmp('SaveAsWindow').close();
    	}	
    },
    
    init: function() {  	
    	this.control({
    		'#SaveAsWindow': {
    			show: this.onWindowShow,
    			resize: this.onWindowResize
    		},
    		'#saveAsWindowProjectsGrid': {
    			itemclick: this.onProjectsGridItemClick
    		},
    		'#saveAsWindowNewProjectButton': {
    			click: this.onSaveAsWindowNewProjectButtonClick
    		},
    		'#saveAsWindowOKButton': {
    			click: this.onSaveAsWindowOKButtonClick
    		},
    	});

    	this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                            this.onSequenceManagerChanged, this);
    } 
});






