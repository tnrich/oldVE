Ext.define('MyApp.view.DeviceEditorMainMenuBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.DeviceEditorMainMenuBar',
    autoScroll: false,
    items: [
        {
            xtype: 'button',
            text: 'Designs',
            menu: {
                xtype: 'menu',
                floating: true,
                minWidth: 140,
                width: 120,
                collapsed: false,
                collapsible: false,
                hideCollapseTool: false,
                titleCollapse: false,
                plain: false,
                items: [
                    {
                        xtype: 'menuitem',
                        id: 'newDesign',
                        text: 'New'
                    },
                    {
                        xtype: 'menuitem',
                        id: 'openDesign',
                        text: 'Open'
                    },
                    {
                        xtype: 'menuitem',
                        id: 'save',
                        text: 'Save'
                    }
                ]
            }
        }
    ]
});