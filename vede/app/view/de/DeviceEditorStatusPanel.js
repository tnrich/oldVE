/**
 * Device Editor status panel
 * @class Vede.view.de.DeviceEditorStatusPanel
 */
Ext.define("Vede.view.de.DeviceEditorStatusPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.DeviceEditorStatusPanel",
    dock: "bottom",
    border: "0 1 1 1",
    height: 23,
    layout: {
        type: "fit"
    },
    headerPosition: "bottom",
    dockedItems: [{
        xtype: "toolbar",
        dock: "top",
        id: "DeviceEditorStatusBar",
        items: [{
            xtype: "tbfill"
        }, {
            xtype: "tbtext",
            id: "DeviceEditorStatusBarAlert"
        }]
    }]
}
);