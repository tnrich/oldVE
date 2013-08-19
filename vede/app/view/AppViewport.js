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
                                tabchange: function () {
                                    Vede.application.fireEvent("PopulateStats");
                                }
                            }
                        }
                    ],
                    /*
                    listeners: {
                        add: function( tabpanel, tab, index, eOpts )
                        {   
                            tab.tab.on("render",function(){
                                arguments[0].getEl().on("contextmenu",function(){
                                    tab = Ext.getCmp(yourelement.id);
                                });
                            });
                        }
                    },
                    // WAITING FOR EXT PEOPLE FIX THIS PLUGIN
                    plugins: Ext.create('Ext.ux.TabCloseMenu', {
                        extraItemsTail: [
                            '-',
                            {
                                text: 'Closable',
                                checked: true,
                                hideOnClick: true,
                                handler: function (item) {
                                    currentItem.tab.setClosable(item.checked);
                                }
                            },
                            '-',
                            {
                                text: 'Enabled',
                                checked: true,
                                hideOnClick: true,
                                handler: function(item) {
                                    currentItem.tab.setDisabled(!item.checked);
                                }
                            }
                        ],
                        listeners: {
                            beforemenu: function (menu, item) {
                                var enabled = menu.child('[text="Enabled"]'); 
                                menu.child('[text="Closable"]').setChecked(item.closable);
                                if (item.tab.active) {
                                    enabled.disable();
                                } else {
                                    enabled.enable();
                                    enabled.setChecked(!item.tab.isDisabled());
                                }

                                currentItem = item;
                            }
                        }
                    })
                    */
                       
                }
            ]
        });

        me.callParent(arguments);
    }

});
