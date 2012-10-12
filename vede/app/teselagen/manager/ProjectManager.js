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

	loadAndRenderProjectPanelCollection: function (collection, target) {
		collection.load();

		var projectController = Vede.application.getController('Vede.controller.ProjectController');

		if(collection.isLoading()) {
			collection.on('load', function () {
				projectController.renderProjectPaneSection(collection,target);
			});
		} else projectController.renderProjectPaneSection(collection,target);
	},

	/**
	 * Open a Project
	 */
	openProject: function (project) {
		console.log('PM: Opening a project ' + project.data.ProjectName);
		this.workingProject = project;

		Ext.getCmp('projectDesignPanel').setLoading(true);

		// Load Designs and Render into ProjectPanel
		this.loadAndRenderProjectPanelCollection(this.workingProject.designs(),'projectDesignPanel');

		// Load Parts and Render into ProjectPanel
		this.loadAndRenderProjectPanelCollection(this.workingProject.parts(),'projectPartsPanel');


	}
});