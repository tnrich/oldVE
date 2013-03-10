/**
 * Device Editor view
 * @class Vede.view.de.DeviceEditor
 */
Ext.define('Vede.view.de.DeviceEditor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPanel',
    requires: ["Vede.view.de.InspectorPanel", "Vede.view.de.DeviceEditorPartPanel", "Vede.view.de.DeviceEditorMenuPanel", "Vede.view.de.DeviceEditorToolPanel", "Vede.view.de.DeviceEditorStatusPanel", "Vede.view.de.DeviceEditorCanvasPanel", "Vede.view.de.DeviceEditorTitlePanel"],
    cls: 'DeviceEditorTab',
    //id: 'DeviceEditorPanel',
    layout: {
        type: 'fit'
    },
    frameHeader: false,
    closable: true,
    border: 0,
    title: 'Device Editor',
    dockedItems: [{
        xtype: 'DeviceEditorMenuPanel'
    },
    /*{
        xtype: 'DeviceEditorStatusPanel'
    },
    */
    {
        xtype: 'DeviceEditorPartPanel'
    },
    {
        xtype: 'InspectorPanel'
    }],
    items: [{
        xtype: 'panel',
        //id: 'DeviceEditorContainer',
        layout: {
            align: 'stretch',
            type: 'fit'
        },
        border: 0,
        items: [{
            xtype: 'DeviceEditorCanvasPanel',
            border: 0,
        }
        ]
    }],
    listeners: {
    afterrender: function(win) {
        win.down('InspectorPanel').doLayout();
    }
}
}

);