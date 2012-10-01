Ext.define('Vede.view.common.ProjectPanelView', {
	extend: 'Ext.TreePanel',
	alias: 'widget.ProjectPanelView',

	floatable: false,
	region: 'west',
	draggable: false,
	floating: false,
	frame: false,
	id: 'ProjectPanel',
	width: 250,
	resizeHandles: 'e',
	closable: false,
	collapseDirection: 'left',
	collapsed: true,
	collapsible: true,
	title: 'Project',
	titleCollapse: true,
	viewConfig: {
		draggable: false
	}
});