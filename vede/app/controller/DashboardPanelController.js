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

	init: function () {
		this.control({
			"#designGrid_Panel": {
				itemclick: this.onLastDEProjectsItemClick
			}
		});

		//this.application.on(Teselagen.event.MenuItemEvent.SELECT_WINDOW_OPENED, this.onSelectWindowOpened, this);
	}
});