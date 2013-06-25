/**
 * Dashboard panel controller
 * @class Vede.controller.DashboardPanelController
 */
Ext.define("Vede.controller.DashboardPanelController", {
	extend: "Ext.app.Controller",

	requires: ["Teselagen.manager.ProjectManager"],


	onLastDEProjectsItemClick: function (item,record) {
		Teselagen.manager.ProjectManager.openDeviceDesign(record);
	},

	populateStatisticts: function () {
		Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("getStats", ''),
            // params: {
            //     data: data
            // },
            success: function (response) {
                response = JSON.parse(response.responseText);
                console.log(response);
               	var projectsData = Ext.getCmp('dashboardStats').down('field[cls="projectsCountBox-num"]');
               	var projectsLabel = Ext.getCmp('dashboardStats').down('field[cls="projectsCountBox-desc"]');
               	var designsData = Ext.getCmp('dashboardStats').down('field[cls="designsCountBox-num"]');
               	var designsLabel = Ext.getCmp('dashboardStats').down('field[cls="designsCountBox-desc"]');
               	var sequencesData = Ext.getCmp('dashboardStats').down('field[cls="sequencesCountBox-num"]');
               	var sequencesLabel = Ext.getCmp('dashboardStats').down('field[cls="sequencesCountBox-desc"]');
               	var partsData = Ext.getCmp('dashboardStats').down('field[cls="partsCountBox-num"]');
               	var partsLabel = Ext.getCmp('dashboardStats').down('field[cls="partsCountBox-desc"]');

               	projectsData.setValue(response.numberProjects);
                designsData.setValue(response.numberDesigns);
                sequencesData.setValue(response.numberSequences);
                partsData.setValue(response.numberParts);

                if (response.numberProjects == 1) {
                	projectsLabel.setValue("Project");
                }
                else {
               		projectsLabel.setValue("Projects");
                }
                if (response.numberDesigns == 1) {
                	designsLabel.setValue("Design");
                }
                else {
               		designsLabel.setValue("Designs");
                }if (response.numberSequences == 1) {
                	sequencesLabel.setValue("Sequence");
                }
                else {
               		sequencesLabel.setValue("Sequences");
                }if (response.numberProjects == 1) {
                	partsLabel.setValue("Part");
                }
                else {
               		partsLabel.setValue("Parts");
                }
            },
            failure: function(response) {
                console.log('getting stats failed');
            }
        });
	},

	onRender: function () {
		this.populateStatisticts();
	},

	init: function () {
		this.control({
			"#designGrid_Panel": {
				itemclick: this.onLastDEProjectsItemClick
			},
            "#DashboardPanel": {
                afterrender: this.onRender
            }
		});
		//this.application.on(Teselagen.event.MenuItemEvent.SELECT_WINDOW_OPENED, this.onSelectWindowOpened, this);
	}
});