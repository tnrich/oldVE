Ext.define('Vede.view.common.DashboardPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DashboardPanelView',
	id: 'DashboardPanel',
	layout: {
		type: 'fit'
	},
	frameHeader: false,
	title: 'Dashboard',
	dockedItems: [{
		xtype: 'gridpanel',
		title: 'My Projects',
		id: 'projectsWidget',
		columns: [{
			xtype: 'gridcolumn',
			dataIndex: 'name',
			text: 'Name'
		}, {
			xtype: 'datecolumn',
			dataIndex: 'DateCreated',
			text: 'Date Created'
		}, {
			xtype: 'datecolumn',
			dataIndex: 'DateModified',
			text: 'Date Modified'
		}],
		require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
		listeners: {
			itemclick: function (view, record, item, index, e, eOpts) {
				Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT,record);;
			}
		}
	}]
});