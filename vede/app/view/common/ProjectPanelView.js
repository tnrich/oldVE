/**
 * Project panel view
 * @class Vede.view.common.ProjectPanelView
 */
Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.panel.Panel',
    requires: ["Vede.view.common.ProjectPanelGrid"],
    alias: 'widget.ProjectPanelView',
    region: 'west',
    id: 'ProjectPanel',
    minWidth: 220,
    width: 220,
    collapseDirection: 'left',
    collapsible: true,
    hideCollapseTool: false,
    title: 'Project',
    margin: '0 10 0 0',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    items: [{
        xtype: 'ProjectPanelGrid',
        flex: 1,
    }, {
        hidden: true,
        flex: 1,
        xtype: 'treepanel',
        title: 'Part Library',
        id: 'projectPartsPanel',
        width: 220,
        rootVisible: false
    }]
});
