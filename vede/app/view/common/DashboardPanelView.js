/**
 * Dashboard panel view
 * @class Vede.view.common.DashboardPanelView
 */
Ext.define('Vede.view.common.DashboardPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DashboardPanelView',
    id: 'DashboardPanel',
    layout: {
        type: 'fit'
    },
    frameHeader: false,
    border: 0,
    title: 'Dashboard',
    items: [
            {
            xtype: 'panel',
            border: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                    {
                        xtype: 'container',
                        flex: 0.1,
                        id: 'welcome_splash',
                        border: 0,
                    },
                    {
                        xtype: 'container',
                        id: 'dashboardButtons',
                        margin: '0 100 0 100',
                        flex: 0.4,
                        border: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                xtype: 'button',
                                height: 100,
                                cls: 'dashBtn',
                                flex: 1,
                                id: 'projectStartBtn',
                                text: 'New Project',
                                scale: 'medium',
                                overCls: 'projectStartBtn-over',
                                iconAlign: 'top',
                                listeners: {
                                    click: function () {
                                        Teselagen.manager.ProjectManager.createNewProject();
                                    }
                                }

                            },{
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                flex: 1,
                                id: 'createSequence',
                                text: 'Create Sequence',
                                scale: 'medium',
                                overCls: 'createSequence-over',
                                iconAlign: 'top',
                                listeners: {
                                    click: function () {
                                        Teselagen.manager.ProjectManager.createNewProject();
                                    }
                                }

                            },
                            {
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                id: 'readManualsBtn',
                                scale: 'medium',
                                flex: 1,
                                overCls: 'readManualsBtn-over',
                                iconAlign: 'top',
                                text: 'Manuals',
                                href: 'http://help.teselagen.com/manual/'
                            },
                            {
                                xtype: 'button',
                                cls: 'dashBtn',
                                height: 100,
                                id: 'tourBtn',
                                scale: 'medium',
                                flex: 1,
                                overCls: 'tourBtn-over',
                                iconAlign: 'top',
                                text: 'Take a Tour',
                                href: 'http://help.teselagen.com/manual/'
                            }
                        ]
                    }, 
                    {
                        xtype: 'container',
                        id: 'dashboardStats',
                        margin: '10 100 40 100',
                        flex: 0.6,
                        border: 0,
                        layout: {
                            type: 'hbox'
                        },
                        items: [ 
                            {
                                xtype: 'container',
                                cls: 'dashboardStats-container',
                                margin: '0 50 0 0',
                                border: 0,
                                layout: {
                                    type: 'vbox'
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'dashStatBox',
                                        height: 100,
                                        id: 'projectsCountBox',
                                        flex: 1
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'dashStatBox',
                                        height: 100,
                                        id: 'designsCountBox',
                                        flex: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            // require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
            // listeners: {
            //     itemclick: function (view, record, item, index, e, eOpts) {
            //         Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT, record);;
            //     }
            // }
        
            ]

    

});
