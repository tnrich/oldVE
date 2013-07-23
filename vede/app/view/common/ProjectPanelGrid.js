/**
 *Dashboard Grid panel view
 * @class Vede.view.common.ProjectPanelGrid
 */
Ext.define('Vede.view.common.ProjectPanelGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ProjectPanelGrid',
	xtype: 'grouped-grid', 
	width: 220,
	name: 'explorer',
    id: 'ProjectPanelGrid',
	features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}',
        hideGroupedHeader: true,
        startCollapsed: true,
    }],

    initComponent: function() {
    	this.columns = [{
    		text:'Type',
    		flex: 1,
    		dataIndex: 'name',
    		striped: false,
    	}];

    	this.callParent();

    }
});