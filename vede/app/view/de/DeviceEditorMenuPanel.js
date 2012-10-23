Ext.define('Vede.view.de.DeviceEditorMenuPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorMenuPanel',

    dock: 'top',
    hidden: false,
    //id: 'DeviceEditorMenuPanel',
    width: 150,
    layout: {
        type: 'fit'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        //id: 'DeviceEditorMenuBar',
        items: [{
            xtype: 'button',
            text: 'New'
        }, {
            xtype: 'button',
            text: 'Load',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    text: 'Design XML'
                }, {
                    xtype: 'menuitem',
                    text: 'j5 File'
                }, {
                    xtype: 'menuitem',
                    text: 'Example Design',
                    menu: {
                        xtype: 'menu',
                        minWidth: 220,
                        width: 220,
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
                }]
            }
        }, {
            xtype: 'button',
            text: 'Save'
        }, {
            xtype: 'button',
            text: 'Export'
        }]
    }]
}

);