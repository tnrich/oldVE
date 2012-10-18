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
		                                    	align: 'stretch',
		                                    	padding: 10,
		                                        type: 'vbox'
		                                    },
		                                    title: 'Help',
		                                    items: [
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'j5_Manual_Btn',
                                            text: 'j5 Manual'
                                        },
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'VE_Manual_Btn',
                                            text: 'Vector Editor Manual'
                                        },
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'DE_Manual_Btn',
                                            text: 'Device Editor Manual'
                                        },
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'tutorials_Btn',
                                            text: 'Tutorials'
                                        },
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'support_Btn',
                                            text: 'Get Support'
                                        },
                                        {
                                            xtype: 'button',
                                            margins: '5',
                                            id: 'feedback_Btn',
                                            text: 'Submit Feedback'
                                        }
                                    ]
		                                }
                            ],
		require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
		listeners: {
			itemclick: function (view, record, item, index, e, eOpts) {
				Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT,record);;
			}
		}
	
});