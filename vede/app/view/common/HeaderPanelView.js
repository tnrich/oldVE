Ext.define('Vede.view.common.HeaderPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.HeaderPanelView',

	region: 'north',
	height: 50,
	id: 'headerPanel',
	layout: {
		align: 'stretch',
		type: 'hbox'
	},
	items: [{
		xtype: 'panel',
		flex: 1,
		id: 'headerMain',
		maxWidth: 220,
		items: [{
			xtype: 'image',
			height: 32,
			id: 'headerIcon',
			margin: 10,
			width: 201,
			src: 'resources/images/teselagen_toplogo.png'
		}]
	},
	{
		xtype: 'panel',
                            flex: 2,
                            id: 'headerButs',
                            items: [
                                {
                                    xtype: 'button',
                                    id: 'newProject_Btn',
                                    margin: 4,
                                    icon: 'resources/images/ux/add_project.png',
                                    scale: 'large',
                                    tooltip: 'New Project'
                                },
                                {
                                    xtype: 'button',
                                    id: 'newDE_Btn',
                                    icon: 'resources/images/ux/add_DE.png',
                                    scale: 'large',
                                    tooltip: 'New Device Editor Design'
                                },
                                {
                                    xtype: 'button',
                                    id: 'newVE_Btn',
                                    icon: 'resources/images/ux/add_DE.png',
                                    scale: 'large',
                                    tooltip: 'Import new sequence'
                                }
                            ]
	}],
	dockedItems: [{
		xtype: 'panel',
		dock: 'right',
		flex: 3,
		id: 'headerSub',
		layout: {
			type: 'fit'
		},
		items: [{
			xtype: 'button',
			id: 'username',
			styleHtmlContent: false,
			iconAlign: 'right',
			text: 'user_Name',
			id: 'headerUserIcon',
			menu: {
				xtype: 'menu',
				items: [{
					xtype: 'menuitem',
					id: 'auth-logout-btn',
					text: 'Logout'
				}]
			}
		}]
	}]
});