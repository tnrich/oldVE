/**
 * Project panel view
 * @class Vede.view.common.ProjectPanelView
 */
Ext.define('Vede.view.common.ProjectPanelView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ProjectPanelView',
    region: 'west',
    id: 'ProjectPanel',
    minWidth: 220,
    width: 220,
    collapseDirection: 'left',
    collapsible: true,
    hideCollapseTool: false,
    title: 'Explorer',
    margin: '0 10 0 0',
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    items: [
    {
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretch',
        },
        border: 0,
        width: 220,
        id: 'projectPanelOptions',
        items: [
            {
                xtype: 'container',
                layout:'hbox',
                items: [
                    {
                        xtype: 'button',
                        border: '0',
                        width: 220,
                        id: "openSequenceLibraryBtn",
                        text: 'My Sequences',
                        cls: 'sequenceLibraryBtn',
                        overCls: 'sequenceLibraryBtn-over',
                        textAlign: 'left',
                        margin: 0,
                        height: 30,
                    },
                    {
                        xtype: 'button',
                        border: '0',
                        cls: 'sequenceAddBtn',
                        overCls: 'sequenceAddBtn-over',
                        height: 20,
                        width: 20,
                        margin: 0
                    }
                ]
            },{
                xtype: 'button',
                border: '0',
                id: "openPartLibraryBtn",
                text: 'My Parts',
                cls: 'partsLibraryBtn',
                overCls: 'partsLibraryBtn-over',
                textAlign: 'left',
                margin: 0,
                height: 30,
            }]
    },
    {
        flex: 1,
        xtype: 'treepanel',
        border: false,
        id: 'projectTreePanel',
        title: 'My Projects',    
        width: 220,
        rootVisible: false,
        animate: false,
        tools: [{
            type: 'plus',
            tooltip: 'New Project',
            cls: 'projectAddBtn',
            overCls: 'projectAddBtn-over',
            handler: function(event, toolEl, panelHeader) {
                Teselagen.manager.ProjectManager.createNewProject();
            }
        }],
        listeners: {
            itemcontextmenu: function(view, record, item, index, event) {
    //          Register the context node with the menu so that a Menu Item's handler function can access
    //          it via its parentMenu property.
                var menu = Ext.create("Ext.menu.Menu", {
                    cls: 'explorerMenu',
                    items: [{
                        text: 'Rename',
                        cls: 'explorerMenuRenameBtn',
                        listeners: {
                            click: function(item, e, opt) {
                                Teselagen.manager.ProjectExplorerManager.onExplorerMenuItemClick(item, record);
                            }
                        }
                    },
                    {
                        text: 'Delete',
                        cls: 'explorerMenuDeleteBtn',
                        listeners: {
                            click: function(item, e, opt) {
                                Teselagen.manager.ProjectExplorerManager.onExplorerMenuItemClick(item, record);
                            }
                        }
                    }]
                });
                menu.showAt(event.getXY());
                event.stopEvent();
                event.preventDefault;
            }
        }

    }]
});
