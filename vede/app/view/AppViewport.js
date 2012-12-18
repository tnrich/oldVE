/*
 * File: app/view/AppViewport.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
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
                            xtype: 'DashboardPanelView'
                        },
                        {
                            xtype: 'VectorEditorPanel',
                            hidden: true
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
