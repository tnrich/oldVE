Ext.define('Vede.view.ProjectManagerWindow', {
    extend: 'Ext.window.Window',

    height: 250,
    id: 'ProjectManagerWindow',
    width: 500,
    layout: {
        align: 'stretch',
        type: 'hbox'
    },
    title: 'Project Manager',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
        items: [
            {
                xtype: 'gridpanel',
                flex: 1,
                id: 'projectGrid_Panel',
                title: 'Your Projects',
                forceFit: true,
                columnLines: false,
                columns: [
                    {
                        xtype: 'gridcolumn',
                        id: 'projectGrid_Name',
                        dataIndex: 'name',
                        hideable: false,
                        text: 'Name'
                    },
                    {
                        xtype: 'datecolumn',
                        id: 'projectGrid_DateCreated',
                        dataIndex: 'dateCreated',
                        text: 'Date Created'
                    },
                    {
                        xtype: 'datecolumn',
                        id: 'projectGrid_DateModified',
                        dataIndex: 'dateModified',
                        text: 'Last Modified'
                    }
                ],
                viewConfig: {
                    id: 'projectGridView'
                },
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        height: 40,
                        items: [
                            {
                                xtype: 'button',
                                id: 'newProject_Btn',
                                margin: 3,
                                icon: 'resources/images/add_project.png',
                                scale: 'medium',
                                tooltip: 'New Project'
                            },
                            {
                                xtype: 'button',
                                id: 'removeProject_Btn',
                                icon: 'resources/images/ux/remove.png',
                                scale: 'medium'
                            }
                        ]
                    }
                ],
                require: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],
                listeners: {
                    itemclick: function (view, record, item, index, e, eOpts) {
                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_PROJECT,record);
                    }
                }
            }
            ]
        });
        
        me.callParent (arguments);
    }
});