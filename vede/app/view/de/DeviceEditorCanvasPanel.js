Ext.define('Vede.view.de.DeviceEditorCanvasPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorCanvasPanel',

	flex: 1,
	cls: 'DeviceEditorCanvas',
	layout: {
		type: 'fit'
	},
	animCollapse: false,
	dockedItems: [{
		xtype: 'InspectorPanel',
	}],
	items: [{
		xtype: 'container',
		title: 'Canvas container',
        cls: 'designGrid',
        border: 0,
        layout: {
            type: 'column'
        },
        padding: 10,
	}]
});
