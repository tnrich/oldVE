/**
 * Vector Editor panel
 * @class Vede.view.ve.VectorEditorPanel
 */
Ext.define("Vede.view.ve.VectorEditorPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.VectorEditorPanel",
    cls: "VectorEditorPanel",
    border: 0,
    closable: true,
    layout: {
        type: "fit"
    },
    requires: [
        "Vede.view.ve.AnnotatePanel",
        "Vede.view.ve.VectorEditorFindPanel",
        "Vede.view.ve.VectorEditorMainMenuPanel",
        "Vede.view.ve.VectorEditorStatusPanel",
        "Vede.view.ve.VectorPanel"
    ],
    dockedItems: [{
        xtype: "VectorEditorMainMenuPanel"
    }, {
        xtype: "VectorEditorStatusPanel"
    }, {
        xtype: "VectorEditorFindPanel"
    }],
    items: [{
        xtype: "panel",
        border: 0,
        cls: "VectorEditorSubPanel",
        layout: {
            align: "stretch",
            type: "hbox"
        },
        items: [{
            xtype: "VectorPanel",
            flex: 1,
            overflowY: "auto"
        }, {
            xtype: "splitter",
            collapseTarget: "prev"
        }, {
            xtype: "AnnotatePanel",
            flex: 1.2
        }]
    }]
});
