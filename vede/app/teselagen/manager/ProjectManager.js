/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {
	require: ["Teselagen.event.ProjectEvent", "Teselagen.store.ProjectStore"],
	alias: "ProjectManager",
	mixins: {
		observable: "Ext.util.Observable"
	},

	projects: null,
	workingProject: null,

	constructor: function (inData) {},

	/**
	 * Render User Projects
	 */
	loadProjects: function () {
		console.log('PM: Showing projects');

		this.projects = Ext.create("Teselagen.store.ProjectStore");
		this.projects.load();
	},
	DesignAndChildResources: function(designs){

		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		var self = this;
		var designs = this.workingProject.designs().load({
    		callback: function() {
    			projectController.renderDesignsSection(designs);
    			projectController.renderPartsSection(self.workingProject);
    			projectController.renderJ5ResultsSection(designs);
    	}});

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

		// Load j5 Results
		//this.loadAndRenderj5Results();

	}
});