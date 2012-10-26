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
	//singleton: true,
	projects: null,
	currentUser: null,
	workingProject: null,

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
	designAndChildResources: function () {

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
		projectController.renderPartsSection(veprojects);
		
	},

	/**
	 * Open a Project
	 */
	openProject: function (project) {
		console.log('PM: Opening a project ' + project.data.name);
		this.workingProject = project;

		Ext.getCmp('projectDesignPanel').setLoading(true);

		// Load Designs And Design Child Resources and Render into ProjectPanel
		this.designAndChildResources();
	},

	openDesign: function (item) {
		var id = item.data.id;
		var deprojects = this.workingProject.deprojects();
		var selectedDEProject = deprojects.getById(id);
		
		var selectedDesign = selectedDEProject.getDesign({
			callback: function (record,operation) {
				console.log(operation);
				selectedDesign = selectedDEProject.getDesign();
				var tabPanel = Ext.getCmp('tabpanel');
				tabPanel.add(Ext.create('Vede.view.de.DeviceEditor',{title: selectedDEProject.data.name+' Design',model:selectedDEProject})).show();		
			
				var deController = Vede.application.getController('Vede.controller.DeviceEditor.DeviceEditorPanelController');
				deController.renderDesignInContext();

			}
		});		
	}
});