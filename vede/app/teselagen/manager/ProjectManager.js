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
				if(records.length != 1) return console.log('Error loading user');
				self.currentUser = users.first();
				if(cb) self.loadProjects(cb); // For Testing
				self.loadProjects();
				//console.log(self.currentUser.getPreferences());
			}
		});
	},

	/**
	 * Load User Projects
	 */
	loadProjects: function (cb) {
		console.log('PM: Showing projects');
		
		this.projects = this.currentUser.projects().load({
			callback: function () {
				if(Ext.getCmp('projectsWidget')) Ext.getCmp('projectsWidget').reconfigure(this.projects);
				if(cb) return cb(); // For Testing
			}
		});
		
	},

	/**
	 *	Load Project Child Resources
	 */	
	designAndChildResources: function () {

		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		var self = this;
		var deprojects = this.workingProject.deprojects().load({
			callback: function () {
				projectController.renderDesignsSection(deprojects);
				//projectController.renderPartsSection(self.workingProject);
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
		var projects = this.workingProject.deprojects();
		var selectedDesign = projects.getById(id);
		var tabPanel = Ext.getCmp('tabpanel');
		tabPanel.add(Ext.create('Vede.view.de.DeviceEditor',{title: selectedDesign.data.name+' Design',model:selectedDesign})).show();		
	
		var deController = Vede.application.getController('Vede.controller.DeviceEditor.DeviceEditorPanelController');
		deController.renderDesignInContext();
	}
});