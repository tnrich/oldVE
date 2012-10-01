Ext.define('Vede.view.common.HeaderPanelView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.HeaderPanelView',

	region: 'north',
	height: 50,
	id: 'headerPanel',
	layout: {
		type: 'fit'
	},
	items: [{
		xtype: 'panel',
		id: 'headerMain',
		items: [{
			xtype: 'image',
			height: 32,
			id: 'headerIcon',
			margin: 10,
			width: 201,
			src: 'resources/images/teselagen_toplogo.png'
		}]
	}],
	dockedItems: [{
		xtype: 'panel',
		dock: 'right',
		id: 'headerSub',
		layout: {
			type: 'fit'
		},
		items: [{
			xtype: 'button',
			styleHtmlContent: false,
			iconAlign: 'right',
			text: 'user_Name',
			menu: {
				xtype: 'menu',
				items: [{
					xtype: 'menuitem',
					text: 'Menu Item'
				}]
			}
		}]
	}]
});