Ext.define("Vede.view.ve.VectorEditorPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.VectorEditorPanel",
    id: "VectorEditorPanel",
    layout: {
        type: "fit"
    },
    title: "Vector Editor",
    closable: true,
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
        id: "VectorEditorSubPanel",
        layout: {
            align: "stretch",
            type: "hbox"
        },
        items: [{
            xtype: "VectorPanel",
            flex: 0.45
        }, {
            xtype: "splitter",
            collapseTarget: "prev"
        }, {
            xtype: "AnnotatePanel",
            flex: 0.55
        }]
    }]
});