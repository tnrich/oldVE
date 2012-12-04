/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {
	requires: ["Teselagen.event.ProjectEvent",
	,"Teselagen.store.UserStore"
	,'Vede.view.de.DeviceEditor'
	,'Teselagen.manager.SessionManager'
	,"Teselagen.manager.DeviceDesignManager"
	,"Teselagen.models.J5Bin",
	,"Teselagen.models.Part"
	,'Ext.window.MessageBox'],
	alias: "ProjectManager",
	mixins: {
		observable: "Ext.util.Observable"
	},
	singleton: true,
	projects: null,
	currentUser: null,
	workingProject: null,
	workingSequence: null,

	constructor: function (inData) {},

	/**
	 * Load User Info
	 */
	loadUser: function (cb) {
		//console.log('PM: Loading User');
		if(Ext.getCmp('headerUserIcon')) Ext.getCmp('headerUserIcon').setText(Teselagen.manager.AuthenticationManager.username);
		var users = Ext.create("Teselagen.store.UserStore");
		var self = this;
		users.load({
			callback: function (records,operation,success) {
				if(!records) {console.log('Error loading user'); return cb(false);}
				self.currentUser = users.first();
				self.currentUser.projects().load({
					callback: function(record,operation,success){
						self.projects = self.currentUser.projects();
						Vede.application.fireEvent("openProjectManagerWindow");
						if(Ext.getCmp('projectGrid_Panel')) Ext.getCmp('projectGrid_Panel').reconfigure(self.projects);
					}
				});
				if(cb) return cb(true);
			}
		});
	},

	/**
	 *	Load Project Child Resources
	 */	
	loadDesignAndChildResources: function () {
		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		var self = this;

		var deprojects = this.workingProject.deprojects();
		deprojects.load({
			callback: function (records,operation,success) {
				projectController.renderTree(deprojects);
			}
		});

		/*
		var veprojects = this.workingProject.veprojects();
		veprojects.load({
			callback: function (records,operation,success) {
				projectController.renderPartsSection(veprojects);
			}
		});
		*/

	},

	/**
	 * Open a Project
	 */
	openProject: function (project) {
		//console.log('PM: Opening a project ' + project.data.name);
		this.workingProject = project;

		Ext.getCmp('projectDesignPanel').setLoading(true);
		// Load Designs And Design Child Resources and Render into ProjectPanel
		this.loadDesignAndChildResources();
	},

	openDesign: function (item) {
		var id = item.data.id;
		var deprojects = this.workingProject.deprojects();
		var selectedDEProject = deprojects.getById(id);
		var tabPanel = Ext.getCmp('mainAppPanel');
		// First check tab is not already opened
		var tabs = Ext.getCmp('mainAppPanel').query('component[cls=DeviceEditorTab]');
		var duplicated = false;
	        var DEProjectId = selectedDEProject.data.id;
		tabPanel.items.items.forEach(function(tab,key){
			if(tab.model)
			{
			    if(tab.model.data.id == DEProjectId)
				{
					duplicated = true;
					tabPanel.setActiveTab(key);
				}
			}
		});
		if(!duplicated)
		{
			var self = this;
			Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Design');
			var selectedDesign = selectedDEProject.getDesign({
				callback: function (record,operation) {
					selectedDesign = selectedDEProject.getDesign();
					Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
				        tabPanel.add(Ext.create('Vede.view.de.DeviceEditor',{title: selectedDEProject.data.name+' Design',model:selectedDEProject,modelId:DEProjectId})).show();
					Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();		
				}
			});
		}	
	},

        deleteDEProject: function(deproject,tab){
            console.log("Deleting deproject");
            var self = this;
            this.workingProject.deprojects().remove(deproject);
            this.workingProject.deprojects().sync({
		callback: function(){
                    self.loadDesignAndChildResources();
                    Ext.getCmp('mainAppPanel').remove(tab);            
		}
            });
	},

	openVEProject: function (item) {
	console.log("Trying to open VE Project");
	
		var id = item.data.id;
		var veprojects = this.workingProject.veprojects();
		var selectedVEProject = veprojects.getById(id);
		var self = this;
		
		var selectedSequence = selectedVEProject.getSequenceFile({
			callback: function (record,operation) {
				selectedSequence = selectedVEProject.getSequenceFile();
				self.workingSequence = selectedSequence;
				var tabPanel = Ext.getCmp('mainAppPanel');
				tabPanel.setActiveTab( 1 );
				console.log(selectedSequence);
	            var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(selectedSequence.data.sequenceFileContent);
	            seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
	            Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
			}
		});		
		
	},

	createNewProject: function(){
		
		var onPromptClosed = function(answer,text) {

				if(text=='') return Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed ,this);

				var self = this;
				var project = Ext.create("Teselagen.models.Project", {
			        name: text,
			        dateCreated: new Date(),
			        dateModified: new Date()
			    });

			    this.currentUser.projects().add(project);
			    project.save({
			    	callback: function(){
			    		self.workingProject = project;
			    		self.loadDesignAndChildResources();
			    		Vede.application.fireEvent("closeProjectManagerWindow");
			    	}
			    });
		};

		Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed ,this);
	},
	createNewDeviceEditorProject: function(){

		var onPromptClosed = function(answer,text) {

			if(text=='') return Ext.MessageBox.prompt('Name', 'Please enter a design name:', onPromptClosed ,this);

		    var self = this;

		    if(this.workingProject) {
			    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
			        name: text,
			        dateCreated: new Date(),
			        dateModified: new Date()
			    });

	            var binsArray = [];
	            var parts = [];

	            for(var binIndex = 0;binIndex<1;binIndex++)
	            {
	                var newBin = Ext.create("Teselagen.models.J5Bin", {
	                    binName: "bin"+binIndex+1
	                });
	                var tempParts = [];
	                for(var i=0;i<2;i++)
	                {
	                    var newPart = Ext.create("Teselagen.models.Part", {
	                        name: "",
	                        genbankStartBP: 1,
	                        endBP: 7
	                    });
	                    parts.push(newPart);
	                    tempParts.push(newPart);
	                }
	                newBin.addToParts(tempParts);
	                binsArray.push(newBin);
	            }

	            var afterPartsSaved = function(){

		            var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
		            deproject.setDesign(design);
				    self.workingProject.deprojects().add(deproject);

				    deproject.save({
				        callback: function(){
				        	design.set( 'deproject_id', deproject.get('id') );
				        	design.save({
				        		callback: function(){
				        			self.loadDesignAndChildResources();
									self.openDesign(deproject);
				            	}});
				    }});
	        	};

	            parts.forEach(function(part,partIndex){
	            	part.save({
	            		callback:function(){
	            			if(partIndex == parts.length-1) afterPartsSaved();
	            		}
	            	});
	            });

			}
		};

		Ext.MessageBox.prompt('Name', 'Please enter a design name:', onPromptClosed ,this);

	},

	openSequenceFile: function(){
		var self = this;
		Ext.getCmp('ProjectPanel').setActiveTab(2);
		if(this.workingProject) {
	    var veproject = Ext.create("Teselagen.models.VectorEditorProject", {
	        name: "Untitled Project"
	    });
	    
	    this.workingProject.deprojects().add(veproject);

	    veproject.save({
	        callback: function(){
	        	console.log("VE project saved");
	        	var tabPanel = Ext.getCmp('mainAppPanel');
				tabPanel.setActiveTab( 1 );
				Vede.application.fireEvent("ImportSequenceToProject",veproject);
				self.loadDesignAndChildResources();

	            
	        }
	    });
		}

		/*
	    var self = this;

	    if(this.workingProject) {
		    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
		        name: "Untitled DE Project"
		    });
		    
		    this.workingProject.deprojects().add(deproject);

		    deproject.save({
		        callback: function(){
		        	self.loadDesignAndChildResources();
		            console.log("DE project saved");
		        }
		    });
		}
		*/
	},

	init: function() {
		this.callParent();
	}

});
