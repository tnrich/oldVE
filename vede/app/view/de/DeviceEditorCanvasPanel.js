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
        cls: 'designGrid',
        style: {
            overflow: 'auto',
        },
        layout: {
            type: 'fit'
        },
        padding: 10
	}
 	]
});
