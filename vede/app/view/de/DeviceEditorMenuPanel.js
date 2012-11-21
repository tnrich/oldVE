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
        items: [{
            xtype: 'label',
            margins: '0 0 0 10',
            style: '{font-weight:bold;}',
            text: 'Device Editor'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'label',
            margins: '0 0 0 10',
            style: '{font-weight:light;}',
            cls: 'designName',
            text: ''
        }

        , {
            xtype: 'tbfill'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            cls: 'DeviceEditorSaveBtn',
            text: 'Save current design'
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Load example design',
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
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Import File',
            menu: {
                xtype: 'menu',
                minWidth: 140,
                width: 140,
                items: [{
                    xtype: 'menuitem',
                    cls: 'importXML',
                    text: 'Design XML'
                }, {
                    xtype: 'menuitem',
                    cls: 'importJSON',
                    text: 'j5 File'
                }]
            }
        }]
    }]
}

);