/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {
	requires: ["Teselagen.event.ProjectEvent","Teselagen.store.UserStore",'Vede.view.de.DeviceEditor'],
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
		console.log('PM: Loading User');
		var users = Ext.create("Teselagen.store.UserStore");
		var self = this;
		users.load({
			callback: function (records,operation,success) {
				if(records.length != 1) console.log('Error loading user');
				self.currentUser = users.first();
				self.currentUser.projects().load({
					callback: function(record,operation,success){
						self.projects = self.currentUser.projects();
						if(Ext.getCmp('projectsWidget')) Ext.getCmp('projectsWidget').reconfigure(self.projects);
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
		console.log("Project panel update fired?");
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
		console.log('PM: Opening a project ' + project.data.name);
		this.workingProject = project;

		Ext.getCmp('projectDesignPanel').setLoading(true);

		// Load Designs And Design Child Resources and Render into ProjectPanel
		this.loadDesignAndChildResources();
	},

	openDesign: function (item) {
		var id = item.data.id;
		var deprojects = this.workingProject.deprojects();
		var selectedDEProject = deprojects.getById(id);
		var self = this;
		var selectedDesign = selectedDEProject.getDesign({
			callback: function (record,operation) {
				selectedDesign = selectedDEProject.getDesign();
				var tabPanel = Ext.getCmp('tabpanel');
				tabPanel.add(Ext.create('Vede.view.de.DeviceEditor',{title: selectedDEProject.data.name+' Design',model:selectedDEProject})).show();		
			
				var deController = Vede.application.getController('Vede.controller.DeviceEditor.DeviceEditorPanelController');
				deController.renderDesignInContext();
				self.experiment(selectedDEProject);
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
				var tabPanel = Ext.getCmp('tabpanel');
				tabPanel.setActiveTab( 1 );
	            var gb      = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(selectedSequence.data.sequenceFileContent);
	            seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
	            Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
			}
		});		
		
	},

	experiment:function(deproject){

		/*

		console.log("Experiment Start here\n------------");
		var binsStore = deproject.getDesign().getJ5Collection().bins();
		//console.log(binsStore);
		binsStore.on("update",function( record, operation, modifiedFieldNames, eOpts ){
			console.log("Update event triggered!");
			console.log(record);
			console.log(operation);
			console.log(modifiedFieldNames);
		});

		binsStore.getAt(0).set('name','asdadasd');
		
        var bin1 = Ext.create("Teselagen.models.J5Bin", {
            binName: "bin21313"
        });
		

		//binsStore.add(bin1);
		//console.log(binsStore);

		*/
	},
	createNewProject: function(){
		var self = this;
	    var project = Ext.create("Teselagen.models.Project", {
	        name: "Untitled project",
	        DateCreated: new Date(),
	        DateModified: new Date()
	    });

	    this.currentUser.projects().add(project);
	    project.save({
	    	callback: function(){
	    		self.workingProject = project;
	    		self.loadDesignAndChildResources();
	    	}
	    });

	},
	createNewDeviceEditorProject: function(){
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
	},

	createNewVectorEditorProject: function(){
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
	        	var tabPanel = Ext.getCmp('tabpanel');
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
