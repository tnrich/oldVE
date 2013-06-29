/**
 * VEDE application viewport
 * @class Vede.view.AppViewport
 */

Ext.define('Vede.view.AppViewport', {
    extend: 'Ext.container.Viewport',

    requires: ["Ext.layout.container.Border"],

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
                            title: null,
                            iconCls: 'home-dash-icon',
                            iconAlign: 'top',
                            listeners: {
                                tabchange: function () {
                                    Vede.application.fireEvent("PopulateStats");
                                }
                            }
                        },

                        {
                            xtype: 'VectorEditorPanel'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
