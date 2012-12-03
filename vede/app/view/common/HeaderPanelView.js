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
		flex: 0,
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
            flex: 3,
            id: 'headerButs',
            floating: false,
	}, {
		xtype: 'panel',
		flex: 1,
		id: 'headerSub',
		margin: '15 10 10 10',
		layout: {
			align: 'stretch',
			type: 'hbox'
		},
		items: [
		{
			xtype: 'button',
			flex: 1,
			id: 'projectmanager_btn',
			text: 'Project',
			cls: 'header_btn',
			overCls: 'header_btn_over'
		},
		{
			xtype: 'button',
			flex: 1,
			styleHtmlContent: false,
			text: 'user_Name',
			cls: 'header_btn',
			overCls: 'header_btn_over',
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