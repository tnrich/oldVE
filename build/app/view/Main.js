Ext.define('Vede.view.Main', {
    extend: 'Ext.container.Container',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'Vede.view.ve.VectorEditorPanel'
    ],
    
    xtype: 'app-main',

    layout: {
        type: 'border'
    },

    items: [
        {
            //xtype: 'HeaderPanelView'
        },
        {
            //xtype: 'ProjectPanelView'
        },
        {
            xtype: 'tabpanel',
            id: 'mainAppPanel',
            region: 'center',
            border: 0,
            activeTab: 0,
            items: [
                //{
                //    //xtype: 'DashboardPanelView',
                //    hidden: true
                //},

                {
                    xtype: 'VectorEditorPanel'
                }
            ]
        }
    ]
});