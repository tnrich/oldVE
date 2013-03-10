/**
 * Device Editor canvas panel
 * @class Vede.view.de.DeviceEditorCanvasPanel
 */
Ext.define('Vede.view.de.DeviceEditorCanvasPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.DeviceEditorCanvasPanel',

	flex: 1,
	cls: 'DeviceEditorCanvas',
	border: 0,
	layout: {
		type: 'fit'
	},
	animCollapse: false,
	autoScroll: true,
	items: [
	{
		xtype: 'container',
		title: 'Canvas container',
        cls: 'designGrid',
        minWidth: 3000,
        autoScroll: true,
        border: 0,
        layout: {
            type: 'column'
        },
        padding: 10,
	}
 	]
});