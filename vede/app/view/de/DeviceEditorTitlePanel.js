/**
 * Device Editor title panel
 * @class Vede.view.de.DeviceEditorTitlePanel
 */
Ext.define('Vede.view.de.DeviceEditorTitlePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorTitlePanel',

    dock: 'top',
    hidden: false,
    cls: 'DeviceEditorTitlePanel',
    width: 150,
    layout: {
        type: 'fit'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'label',
            margins: '0 0 0 7',
            style: '{font-weight:bold;}',
            text: 'Device Editor'
        }, {
            xtype: 'tbseparator',
            margins: '0 0 20 8'
        }, {
            xtype: 'label',
            margins: '0 0 0 10',
            style: '{font-weight:light;}',
            cls: 'designName',
            text: ''
        }]
    }]
}

);