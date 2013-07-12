/**
 * Vector Editor manin menu panel
 * @class Vede.view.ve.VectorEditorMainMenuPanel
 */
Ext.define("Vede.view.ve.VectorEditorMainMenuPanel", {
    extend: "Ext.panel.Panel",
    cls: "VectorEditorMainMenuPanel",
    alias: "widget.VectorEditorMainMenuPanel",
    dock: "top",
    layout: {
        align: "stretch",
        type: "vbox"
    },
    requires: [
        "Vede.view.ve.VectorEditorMainMenuBar",
        "Vede.view.ve.VectorEditorMainToolBar"
	],

    items: [{
        xtype: "VectorEditorMainMenuBar",
        flex: 1
    }, {
        xtype: "VectorEditorMainToolBar",
        flex: 2
    }]
});
