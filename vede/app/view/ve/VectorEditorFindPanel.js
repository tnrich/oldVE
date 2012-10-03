Ext.define("Vede.view.ve.VectorEditorFindPanel", {
    extend: "Ext.panel.Panel",
    id: "FindPanel",
    alias: "widget.VectorEditorFindPanel",
    height: 28,
    dock: "bottom",
    layout: {
        type: "hbox"
    },
    hidden: true,
    items: [{
        xtype: "textfield",
        id: "findField",
        hideLabel: true,
        emptyText: "Search...",
        width: 500,
        maxWidth: 600,
        margin: "2 4 2 4"
    }, {
        xtype: "button",
        id: "findNextBtn",
        text: "<b>Find Next</b>",
        margin: "2 4 2 4"
    }, {
        xtype: "combobox",
        id: "findInSelector",
        queryMode: "local",
        editable: false,
        value: "DNA",
        store: ["DNA", "Amino Acids"],
        margin: "2 4 2 4"
    }, {
        xtype: "combobox",
        id: "literalSelector",
        queryMode: "local",
        editable: false,
        value: "Literal",
        store: ["Literal", "Ambiguous"],
        margin: "2 4 2 4"
    }, {
        xtype: "button",
        id: "highlightAllBtn",
        text: "<b>Highlight All</b>",
        margin: "2 4 2 4"
    }]
});
