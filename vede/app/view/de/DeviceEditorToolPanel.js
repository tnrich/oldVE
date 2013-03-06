/**
 * Device Editor tool panel
 */
Ext.define('Vede.view.de.DeviceEditorToolPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorToolPanel',

	dock: 'top',
	hidden: false,
	cls: 'DeviceEditorToolPanel',
	width: 150,
	layout: {
		type: 'fit'
	},
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: [{
			xtype: 'button',
			cls: 'add_column_Btn',
			icon: 'resources/images/icons/device/add_column.png',
			scale: 'large',
			tooltip: 'Add Column'
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			cls: 'add_row_Btn',
			icon: 'resources/images/icons/device/add_row.png',
			scale: 'large',
			tooltip: 'Add Row'
		}, {
			xtype: 'tbseparator'
		}, {
			xtype: 'button',
			cls: 'j5_init_Btn',
			icon: 'resources/images/icons/device/j5_icon.png',
			scale: 'large',
			tooltip: 'j5'
		}]
	}]
}

);
