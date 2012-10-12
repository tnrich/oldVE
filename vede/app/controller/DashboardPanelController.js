Ext.define("Vede.controller.DashboardPanelController", {
	extend: "Ext.app.Controller",

	requires: [],

	onSomeButtonClick: function () {
	},

	loadProject: function () {
		console.log("Trying to load new project");
	},

	init: function () {
		this.control({
			"#someButton": {
				click: this.onSomeButtonClick
			}
		});

		//this.application.on(Teselagen.event.MenuItemEvent.SELECT_WINDOW_OPENED, this.onSelectWindowOpened, this);
	}
});