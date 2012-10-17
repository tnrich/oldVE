Ext.define('Vede.view.de.DeviceEditor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.DeviceEditorPanel',
    requires: ["Vede.view.de.InspectorPanel", "Vede.view.de.DeviceEditorPartPanel", "Vede.view.de.DeviceEditorMenuPanel", "Vede.view.de.DeviceEditorToolPanel", "Vede.view.de.DeviceEditorStatusPanel", "Vede.view.de.DeviceEditorCanvasPanel"],

    //id: 'DeviceEditorPanel',
    layout: {
        type: 'fit'
    },
    frameHeader: false,
    closable: true,
    title: 'Device Editor',
    dockedItems: [{
        xtype: 'DeviceEditorMenuPanel'
    }, {
        xtype: 'DeviceEditorToolPanel'
    }, {
        xtype: 'DeviceEditorStatusPanel'
    }],
    items: [{
        xtype: 'container',
        //id: 'DeviceEditorContainer',
        layout: {
            align: 'stretch',
            type: 'hbox'
        },
        items: [{
            xtype: 'DeviceEditorCanvasPanel'
        },
        //Ext.create('Vede.view.de.InspectorPanel') 
        { xtype: 'InspectorPanel', flex: 2 }
        ]
    }],
    listeners: {
    afterrender: function(win) {
        win.down('InspectorPanel').doLayout();
    }
}
}

);