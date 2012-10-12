/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {
	require: ["Teselagen.event.ProjectEvent","Teselagen.store.ProjectStore"],
	alias: "ProjectManager",
	mixins: {
		observable: "Ext.util.Observable"
	},

	projects: null,
	workingProject: null,

	constructor: function (inData) {
	},

	/**
	 * Render User Projects
	 */
	loadProjects: function () {
		console.log('PM: Showing projects');

	    this.projects = Ext.create("Teselagen.store.ProjectStore");
	    this.projects.load();
	},

	/**
	 * Open a Project
	 */
	openProject: function (project) {
		console.log('PM: Opening a project '+ project.data.ProjectName);
		this.workingProject = project;

		Ext.getCmp('projectDesignPanel').setLoading(true);

		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		// Load Designs
		var designs = this.workingProject.designs();
		designs.load();

		if(designs.isLoading()) {
        	designs.on('load', function () {
        		projectController.renderDesigns(designs);
        	});
        }
        else projectController.renderDesigns(designs);
	}
});