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
        'Vede.view.de.DeviceEditor',
        'Vede.view.de_legacy.DeviceEditor',
        'Vede.view.ve.VectorEditorPanel'
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
                    region: 'center',
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            title: 'Dashboard',
                            tabConfig: {
                                xtype: 'tab',
                                id: 'DashboardTab'
                            }
                        },
                        {
                            xtype: 'VectorEditorPanel'
                        },
                        {
                            xtype: 'DeviceEditorPanel'
                        },
                        {
                            xtype: 'DeviceEditorLegacyPanel'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});