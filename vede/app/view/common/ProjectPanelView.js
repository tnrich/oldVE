var store = Ext.create('Ext.data.Store', {
    fields: ['name'],
    data: {
        'items': [
                {'name': 'psc001'},
                {'name': 'psc002'},
                {'name': 'psc003'},
                {'name': 'psc004'},
                {'name': 'psc005'},
                {'name': 'psc006'},
                {'name': 'psc007'},
                {'name': 'psc008'},
                {'name': 'psc009'},
                {'name': 'psc010'},
                {'name': 'psc011'},
                {'name': 'psc012'},
                {'name': 'psc013'},
                {'name': 'psc014'},
                {'name': 'psc015'},
                {'name': 'psc016'},
                {'name': 'psc017'},
                {'name': 'psc018'},
                {'name': 'psc019'},
                {'name': 'psc020'},
                {'name': 'psc021'},
                {'name': 'psc022'}
            ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

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
        flex: 1,
        xtype: 'gridpanel',
        store: store,
        width: 228,
        columns: [{
            text: 'Name',
            dataIndex: 'name',
            flex: 1
        }]
    }]

});