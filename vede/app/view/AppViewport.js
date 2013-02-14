/**
 * VEDE application viewport
 * @class Vede.view.AppViewport
 */

Ext.define('Vede.view.AppViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    requires: [
        'Vede.view.common.HeaderPanelView',
        'Vede.view.common.ProjectPanelView',
        'Vede.view.common.DashboardPanelView',
        'Vede.view.de.DeviceEditor',
        'Vede.view.ve.VectorEditorPanel',
        'Vede.view.j5.AnalysisPanel',
        'Vede.view.j5Report.j5ReportPanel',
        "Vede.view.HelpWindow"
    ],

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'HeaderPanelView'
                },
                {
                    xtype: 'ProjectPanelView'
                },
                {
                    xtype: 'tabpanel',
                    id: 'mainAppPanel',
                    region: 'center',
                    border: 0,
                    activeTab: 0,
                    items: [
                        
                        {
                            xtype: 'DashboardPanelView',
                            hidden: true
                        },

                        {
                            xtype: 'VectorEditorPanel',
                            hidden: false
                        },
                        {
                            xtype: 'DeviceEditorPanel',
                            hidden: true
                        },
                        {
                           xtype: 'AnalysisPanel',
                           hidden: true
                        },
                        {
                            xtype: 'j5ReportPanel',
                            hidden: true
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
