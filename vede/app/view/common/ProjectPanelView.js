Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ProjectPanelView',
    region: 'west',
    id: 'ProjectPanel',
    minWidth: 228,
    width: 228,
    collapseDirection: 'left',
    collapsible: true,
    frameHeader: false,
    hideCollapseTool: false,
    preventHeader: false,
    title: 'Project',
    plain: false,
    margin: '0 10 0 0',

    layout: {
        type: 'vbox',
        pack: 'center'
    },
    items: [{
        flex: 1,
        xtype: 'treepanel',
        border: 0,
        id: 'projectTreePanel',
        rootVisible: false
    }, {
        //xtype: 'panel',
        flex: 1,
        //items: [{
        xtype: 'treepanel',
        title: 'Parts',
        id: 'projectPartsPanel',
        width: 228,
        rootVisible: false
        //}]
    }]

});