Ext.define('Vede.view.common.DashboardPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DashboardPanelView',
	id: 'DashboardPanel',
	layout: {
		align: 'stretch',
	    type: 'hbox'
	},
	frameHeader: false,
	title: 'Dashboard',
	  items: [
                                {
                                    xtype: 'panel',
                                    flex: 1,
                                    layout: {
                                        align: 'stretch',
                                        type: 'vbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'panel',
                                            flex: 1,
                                            layout: {
                                                type: 'fit'
                                            },
                                            title: 'Project Info',
                                            items: [{
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
											}],
                                        },
                                        {
                                            xtype: 'panel',
                                            flex: 2,
                                            maxHeight: 300,
                                            layout: {
                                                type: 'fit'
                                            },
                                            title: 'Analysis'
                                        }]
                                        },
		                               {
		                                    xtype: 'panel',
		                                    flex: 2,
		                                    maxWidth: 200,
		                                    layout: {
		                                        type: 'fit'
		                                    },
		                                    title: 'Help'
		                                }
                            ],
		require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
		listeners: {
			itemclick: function (view, record, item, index, e, eOpts) {
				Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT,record);;
			}
		}
	
});