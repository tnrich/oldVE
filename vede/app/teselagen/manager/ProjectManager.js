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
//		console.log('PM: Loading User');
		if(Ext.getCmp('headerUserIcon')) Ext.getCmp('headerUserIcon').setText(Teselagen.manager.AuthenticationManager.username);
		var users = Ext.create("Teselagen.store.UserStore");
		var self = this;
		users.load({
			callback: function (records,operation,success) {
				if(!success || records && records.length != 1) {
				    console.log('Error loading user');
				    return cb(false);
				}
				else {
				    self.currentUser = users.first();
				    self.currentUser.projects().load({
				        callback: function(record,operation,success){
				            self.projects = self.currentUser.projects();
				            if(Ext.getCmp('projectGrid_Panel')) {
				                Ext.getCmp('projectGrid_Panel').reconfigure(self.projects);
				            }
				        }
				    });
				    if(cb) { 
				        return cb(true);
				    }
				}
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
				projectController.renderDesignsSection(deprojects);
				projectController.renderJ5ResultsSection(deprojects);
			}
		});

		var veprojects = this.workingProject.veprojects();
		veprojects.load({
			callback: function (records,operation,success) {
				projectController.renderPartsSection(veprojects);
			}
		});

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
		tabPanel.items.items.forEach(function(tab,key){
			if(tab.model)
			{
				if(tab.model.internalId == selectedDEProject.internalId) 
				{
					duplicated = true;
					tabPanel.setActiveTab(key);
				}
			}
		});
		if(!duplicated)
		{
			var self = this;
			var selectedDesign = selectedDEProject.getDesign({
				callback: function (record,operation) {
					selectedDesign = selectedDEProject.getDesign();
					tabPanel.add(Ext.create('Vede.view.de.DeviceEditor',{title: selectedDEProject.data.name+' Design',model:selectedDEProject})).show();		
				
					var deController = Vede.application.getController('Vede.controller.DeviceEditor.DeviceEditorPanelController');
					//deController.renderDesignInContext();
				}
			});
		}	
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
	            var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(selectedSequence.data.sequenceFileContent);
	            seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
	            Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
			}
		});		
		
	},

	createNewProject: function(){
		
		var onPromptClosed = function(answer,text) {
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
			    	}
			    });
		};

		Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed ,this);
	},
	createNewDeviceEditorProject: function(){

		var onPromptClosed = function(answer,text) {
		    var self = this;

		    if(this.workingProject) {
			    deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
			        name: text,
			        dateCreated: new Date(),
			        dateModified: new Date()
			    });
			    
	            var bin = Ext.create("Teselagen.models.J5Bin", {
	                binName: "Empty bin"
	            });

	            var part1a = Ext.create("Teselagen.models.Part", {
	                name: "part1a",
	                genbankStartBP: 1,
	                endBP: 7
	            });

	            var part1b = Ext.create("Teselagen.models.Part", {
	                name: "part1b",
	                genbankStartBP: 1,
	                endBP: 7
	            });

	            part1a.save({callback: function(){
		            part1b.save({callback: function(){

			            bin.addToParts([part1a, part1b]);

			            var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins([bin]);
			            
			            deproject.setDesign(design);

					    self.workingProject.deprojects().add(deproject);

					    deproject.save({
					        callback: function(){
					        	//console.log("DE Project saved");
					        	design.set( 'deproject_id', deproject.get('id') );
					        	design.save({
					        		callback: function(){
					        			//console.log("DESIGN SAVED");
					        			self.loadDesignAndChildResources();
					            	}});
					    }});

		            }});	            	
	            }});
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
