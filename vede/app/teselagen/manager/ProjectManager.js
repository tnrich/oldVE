/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {
	require: ["Teselagen.event.ProjectEvent", "Teselagen.store.ProjectStore", "Teselagen.store.UserStore"],
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
	loadUser: function () {
		console.log('PM: Loading User');
		var users = Ext.create("Teselagen.store.UserStore");
		var self = this;
		users.load({
			callback: function (records,operation,success) {
				if(records.length != 1) return console.log('Error loading user');
				self.currentUser = users.first();
				self.loadProjects();
				//console.log(self.currentUser.getPreferences());
			}
		});
	},

	/**
	 * Load User Projects
	 */
	loadProjects: function () {
		console.log('PM: Showing projects');
		
		var projects = this.currentUser.projects().load({
			callback: function () {
				Ext.getCmp('projectsWidget').reconfigure(projects);
			}
		});
		
	},

	/**
	 *	Load Project Child Resources
	 */	
	DesignAndChildResources: function (designs) {

		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		var self = this;
		var designs = this.workingProject.designs().load({
			callback: function () {
				projectController.renderDesignsSection(designs);
				projectController.renderPartsSection(self.workingProject);
				projectController.renderJ5ResultsSection(designs);
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
		this.DesignAndChildResources(this.workingProject.designs());
	}
});