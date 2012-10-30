Ext.define('Vede.view.de.DeviceEditorCanvasPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorCanvasPanel',

	flex: 1,
	cls: 'DeviceEditorCanvas',
	width: 159,
	layout: {
		type: 'fit'
	},
	animCollapse: false,
	dockedItems: [{
		xtype: 'DeviceEditorPartPanel',
	},{
		xtype: 'container',
		title: 'Canvas container',
        cls: 'designGrid',
        layout: {
            type: 'column'
        },
        padding: 10,
	}],
	items: [{
		title: 'Canvas',
		xtype: 'draw',
		layout: 'fit',
		cls: 'designCanvas'
	}]
});
