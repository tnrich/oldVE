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
		xtype: 'DeviceEditorPartPanel'
	}],
	items: [{
		title: 'Canvas',
		xtype: 'draw',
		cls: 'designCanvas',
		margin: 10
	}]
}

);