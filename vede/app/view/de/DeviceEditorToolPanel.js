Ext.define('Vede.view.de.DeviceEditorToolPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorToolPanel',

	dock: 'top',
	hidden: false,
	id: 'DeviceEditorToolPanel',
	width: 150,
	layout: {
		type: 'fit'
	},
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: [{
			xtype: 'button',
			id: 'add_column_Btn',
			icon: 'resources/images/icons/device/add_column.png',
			scale: 'large',
			tooltip: 'Add Column'
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			id: 'add_row_Btn',
			icon: 'resources/images/icons/device/add_row.png',
			scale: 'large',
			tooltip: 'Add Row'
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			id: 've_init_Btn',
			icon: 'resources/images/icons/device/ve_icon.png',
			scale: 'large',
			tooltip: 'Vector Editor',
			menu: {
				xtype: 'menu',
				id: 'de_ve_menu',
				minWidth: 160,
				width: 120,
				items: [{
					xtype: 'menuitem',
					text: 'Map From Clipboard'
				}, {
					xtype: 'menuitem',
					text: 'Map From Genbank'
				}, {
					xtype: 'menuitem',
					text: 'Go To Vector Editor'
				}]
			}
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			id: 'j5_init_Btn',
			icon: 'resources/images/icons/device/j5_icon.png',
			scale: 'large',
			tooltip: 'j5'
		}]
	}]
}

);