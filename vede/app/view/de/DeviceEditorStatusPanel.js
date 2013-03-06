/**
 * Device Editor status panel
 * @class Vede.view.de.DeviceEditorStatusPanel
 */
Ext.define('Vede.view.de.DeviceEditorStatusPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorStatusPanel',

        dock: 'bottom',
        height: 23,
        //id: 'StatusPanel',
        layout: {
            type: 'fit'
        },
        headerPosition: 'bottom',
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            //id: 'StatusBar',
            items: [{
                xtype: 'tbfill'
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: 'Read only'
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbspacer',
                width: 10
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: '- : -'
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: '0'
            }]
        }]
    }

);