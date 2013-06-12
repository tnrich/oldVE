/**
 * Project panel view
 * @class Vede.view.common.ProjectPanelView
 */
Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.panel.Panel',
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
        flex: 1,
        xtype: 'treepanel',
        border: false,
        id: 'projectTreePanel',
        width: 220,
        rootVisible: false,
        animate: false
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
