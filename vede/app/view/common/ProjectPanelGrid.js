/**
 *Dashboard Grid panel view
 * @class Vede.view.common.ProjectPanelGrid
 */
Ext.define('Vede.view.common.ProjectPanelGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.ProjectPanelGrid',
	xtype: 'grouped-grid', 
	width: 220,
	features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        hideGroupedHeader: true,
        id: 'ProjectPanelGrid'
    }],

    initComponent: function() {
    	this.columns = [{
    		text:'Type',
    		flex: 1,
    		dataIndex: 'name'
    	}];

    	this.callParent();

    }
});