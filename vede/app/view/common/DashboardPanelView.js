/**
 * Dashboard panel view
 * @class Vede.view.common.DashboardPanelView
 */
Ext.define('Vede.view.common.DashboardPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DashboardPanelView',
    id: 'DashboardPanel',
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    frameHeader: false,
    border: 0,
    title: 'Dashboard',
    items: [
            {
            xtype: 'panel',
            flex: 1,
            border: 0,
            padding: 50,
            items: [
                {
                xtype: 'panel',
                flex: 1,
                id: 'welcome_splash',
                border: 0,
                html: '<div class="welcome_text">Welcome back!<div id="welcomeUserIcon"></div></div><div class="welcome_sub">Get started by selecting one of the options below.</div>',
                padding: 50, 
                },
                {
                xtype: 'panel',
                id: 'dashboardButtons',
                flex: 1,
                border: 0,
                padding: 50,
                items: [
                {
                    xtype: 'button',
                    cls: 'dashBtn',
                    id: 'projectStartBtn',
                    text: 'Start a New Project',
                    scale: 'large',
                    overCls: 'projectStartBtn-over',
                    height: '120px',
                    icon: 'resources/images/projectstart.png',
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
                    id: 'watchTutorialBtn',
                    scale: 'large',
                    overCls: 'watchTutorialBtn-over',
                    height: '120px',
                    icon: 'resources/images/watchtut.png',
                    iconAlign: 'top',
                    text: 'Watch a Tutorial',       
                },
                {
                    xtype: 'button',
                    cls: 'dashBtn',
                    id: 'readManualsBtn',
                    scale: 'large',
                    overCls: 'readManualsBtn-over',
                    height: '120px',
                    icon: 'resources/images/readman.png',
                    iconAlign: 'top',
                    text: 'Read the Manuals',
                    href: 'http://help.teselagen.com/manual/'
                }
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