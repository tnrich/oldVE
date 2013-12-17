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
    'Ext.tab.*',
    'Ext.ux.TabCloseMenu',
        'Vede.view.common.HeaderPanelView',
        'Vede.view.common.ProjectPanelView',
        'Vede.view.common.DashboardPanelView',
        'Vede.view.common.TaskMonitorView',
        'Vede.view.de.DeviceEditor',
        'Vede.view.ve.VectorEditorPanel',
        'Vede.view.j5.AnalysisPanel',
        'Vede.view.j5Report.j5ReportPanel',
        "Vede.view.HelpWindow",
        "Vede.view.common.dropZone"
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
                            cls: 'DashboardPanelTab',
                            iconCls: 'home-dash-icon',
                            iconAlign: 'top',
                            listeners: {
                                tabchange: function (panel, newTab, oldTab) {
                                    if(newTab.title === 'Dashboard' || panel.items.indexOf(newTab) === 0) {
                                        Vede.application.fireEvent("PopulateStats");
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'TaskMonitorView'
                }
            ]
        });

        me.callParent(arguments);
    }

});
