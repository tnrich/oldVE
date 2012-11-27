Ext.define('Vede.view.de.DeviceEditorMenuPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorMenuPanel',

    dock: 'top',
    hidden: false,
    cls: 'DeviceEditorMenuPanel',
    width: 150,
    layout: {
        type: 'fit'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
        {
            xtype: 'button',
            text: 'File',
            menu: {
                xtype: 'menu',
                items: [{
                    xtype: 'menuitem',
                    text: 'Open Design'
                }, {
                    xtype: 'menuitem',
                    text: 'Save Design'
                }]
            }
        },
        {
            xtype: 'button',
            text: 'Examples',
            menu: {
                xtype: 'menu',
                minWidth: 300,
                width: 300,
                items: [{
                    xtype: 'menuitem',
                    text: 'SLIC/Gibson/CPEC'
                }, {
                    xtype: 'menuitem',
                    text: 'Combinatorial SLIC/Gibson/CPEC'
                }, {
                    xtype: 'menuitem',
                    text: 'Golden Gate'
                }, {
                    xtype: 'menuitem',
                    text: 'Combinatorial Golden Gate'
                }]
            }
        }, {
            xtype: 'button',
            text: 'Import',
            cls: 'importMenu',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    cls: 'importXML',
                    text: 'XML file'
                }, {
                    xtype: 'menuitem',
                    cls: 'importJSON',
                    text: 'JSON file'
                }]
            }
        }]
    }]
}

);