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
    title: 'Device Editor',
    dockedItems: [{
        xtype: 'DeviceEditorTitlePanel'
    }, {
        xtype: 'DeviceEditorMenuPanel'
    }, {
        xtype: 'DeviceEditorToolPanel'
    }, {
        xtype: 'DeviceEditorStatusPanel'
    }, {
        xtype: 'DeviceEditorPartPanel'
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
            xtype: 'DeviceEditorCanvasPanel'
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
