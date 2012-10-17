Ext.define('Vede.view.de.DeviceEditorCanvasPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorCanvasPanel',

	flex: 1,
	//id: 'DeviceEditorCanvas',
	width: 159,
	layout: {
		type: 'fit'
	},
	animCollapse: false,
	dockedItems: [{
		xtype: 'DeviceEditorPartPanel',
	},{
		xtype: 'container',
		title: 'Canvas container'
	}],
	items: [{
		title: 'Canvas',
		xtype: 'draw',
		layout: 'fit',
		cls: 'designCanvas',
	}]
}

);