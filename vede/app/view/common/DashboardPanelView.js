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
                flex: 1,
                border: 0,
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'button',
                        cls: 'dashBtn',
                        flex: 1,
                        id: 'projectStartBtn',
                        text: 'Start a New Project',
                        scale: 'medium',
                        overCls: 'projectStartBtn-over',
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
                        id: 'create',
                        scale: 'medium',
                        flex: 1,
                        overCls: 'watchTutorialBtn-over',
                        iconAlign: 'top',
                        text: 'Watch a Tutorial',       
                    },
                    {
                        xtype: 'button',
                        cls: 'dashBtn',
                        id: 'readManualsBtn',
                        scale: 'medium',
                        flex: 1,
                        overCls: 'readManualsBtn-over',
                        iconAlign: 'top',
                        text: 'Read the Manuals',
                        href: 'http://help.teselagen.com/manual/'
                    },
                    // {
                    //     xtype: 'button',
                    //     cls: 'dashBtn',
                    //     id: 'readManualsBtn',
                    //     scale: 'medium',
                    //     flex: 1,
                    //     overCls: 'readManualsBtn-over',
                    //     iconAlign: 'top',
                    //     text: 'Read the Manuals',
                    //     href: 'http://help.teselagen.com/manual/'
                    // }
                ]
                }
                ]
            }
        
            ]
    /*
    items: [{
        xtype: 'panel',
        flex: 1,
        id: 'dashboard_Panel',
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        items: [{
            xtype: 'panel',
            flex: 1,
            border: 0,
            id: 'dashboard_TopPanel',
            layout: {
                align: 'stretch',
                type: 'hbox'
            },
            items: [{
                xtype: 'gridpanel',
                flex: 1,
                id: 'designGrid_Panel',
                margin: 10,
                width: 100,
                title: 'Recent Designs',
                forceFit: true,
                columns: [{
                    xtype: 'gridcolumn',
                    id: 'designGrid_Name',
                    dataIndex: 'name',
                    text: 'Name'
                }, {
                    xtype: 'datecolumn',
                    id: 'designGrid_DateCreated',
                    dataIndex: 'dateCreated',
                    text: 'Date Created'
                }, {
                    xtype: 'datecolumn',
                    id: 'designGrid_DateModified',
                    dataIndex: 'dateModified',
                    text: 'Last Modified'
                }],
                viewConfig: {
                    id: 'designGridView'
                },
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    height: 40,
                    layout: {
                        pack: 'end',
                        type: 'hbox'
                    }
                }]
            }]
        }, {
            xtype: 'panel',
            flex: 1,
            border: 0,
            id: 'dashboard_BottomPanel',
            layout: {
                type: 'fit'
            },
            items: [{
                xtype: 'panel',
                id: 'dashboard_StatsPanel',
                margin: 10,
                layout: {
                    type: 'fit'
                },
                title: 'Analytics'
            }]
        }]
    }, {
        xtype: 'panel',
        flex: 1,
        border: 0,
        id: 'dashboard_TaskPanel',
        hidden: true,
        maxWidth: 250,
        width: 250,
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        items: [{
            xtype: 'menu',
            border: 0,
            floating: false,
            width: 120,
            title: 'Common Tasks',
            items: [{
                xtype: 'menuitem',
                text: 'New Project'
            }, {
                xtype: 'menuitem',
                id: 'openSequenceFile_Btn',
                text: 'Open Sequence File'
            }, {
                xtype: 'menuitem',
                text: 'New Design'
            }]
        }, {
            xtype: 'menu',
            flex: 2,
            border: 0,
            floating: false,
            width: 120,
            title: 'Help',
            items: [{
                xtype: 'menuitem',
                text: 'j5 Manual'
            }, {
                xtype: 'menuitem',
                text: 'Vector Editor Manual'
            }, {
                xtype: 'menuitem',
                text: 'Device Editor Manual'
            }, {
                xtype: 'menuitem',
                text: 'Tutorials'
            }, {
                xtype: 'menuitem',
                text: 'Get Support'
            }, {
                xtype: 'menuitem',
                text: 'Submit Feedback'
            }]
        }]
    }],
    require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
    listeners: {
        itemclick: function (view, record, item, index, e, eOpts) {
            Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT, record);;
        }
    }
    */

});
