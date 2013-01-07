Ext.define("Vede.view.ve.VectorEditorStatusPanel", {
    extend: "Ext.panel.Panel",
    id: "VectorEditorStatusPanel",
    alias: "widget.VectorEditorStatusPanel",
    dock: "bottom",
    border: '0 1 1 1',
    height: 23,
    layout: {
        type: "fit"
    },
    headerPosition: "bottom",
    dockedItems: [{
        xtype: "toolbar",
        dock: "top",
        id: "VectorEditorStatusBar",
        items: [{
            xtype: "tbfill"
        }, {
            xtype: "tbseparator"
        }, {
            xtype: "tbtext",
            text: "Read only"
        }, {
            xtype: "tbseparator"
        }, {
            xtype: "tbspacer",
            width: 10
        }, {
            xtype: "tbseparator"
        }, {
            xtype: "tbtext",
            text: "- : -"
        }, {
            xtype: "tbseparator"
        }, {
            xtype: "tbtext",
            text: "0"
        }]
    }]
});
