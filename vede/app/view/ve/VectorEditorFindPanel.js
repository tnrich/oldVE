/**
 * Vector Editor find panel
 * @class Vede.view.ve.VectorEditorFindPanel
 */
Ext.define("Vede.view.ve.VectorEditorFindPanel", {
    extend: "Ext.panel.Panel",
    cls: "FindPanel",
    alias: "widget.VectorEditorFindPanel",
    height: 28,
    dock: "bottom",
    layout: {
        type: "hbox"
    },
    hidden: true,
    items: [{
        xtype: "textfield",
        cls: "findField",
        hideLabel: true,
        emptyText: "Search...",
        enableKeyEvents: true,
        width: 500,
        maxWidth: 600,
        margin: "2 4 2 4",
        validator: function(value) {
            var literal = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='literalSelector']").getValue();
            var searchIn = Ext.getCmp("mainAppPanel").getActiveTab().down("component[cls='findInSelector']").getValue();
            var matches;

            if(searchIn === "DNA") {
                if(literal === "Literal") {
                    matches = value.toLowerCase().match(/[^atcgu]/g)
                } else {
                    matches = value.toLowerCase().match(/[^atcgunkmryswbvhd]/g)
                }
            } else {
                if(literal === "Literal") {
                    matches = value.toLowerCase().match(/[^arndcqeghilkmfpstwyv.]/g);
                } else {
                    matches = value.toLowerCase().match(/[^arndcqeghilkmfpstwyv.xbz]/g);
                }
            }

            if(!matches) {
                return true;
            } else {
                return "Invalid character(s): " + matches;
            }
        }
    }, {
        xtype: "button",
        cls: "findNextBtn",
        text: "<b>Find Next</b>",
        margin: "2 4 2 4"
    }, {
        xtype: "combobox",
        cls: "findInSelector",
        queryMode: "local",
        editable: false,
        value: "DNA",
        store: ["DNA", "Amino Acids"],
        margin: "2 4 2 4"
    }, {
        xtype: "combobox",
        cls: "literalSelector",
        queryMode: "local",
        editable: false,
        value: "Literal",
        store: ["Literal", "Ambiguous"],
        margin: "2 4 2 4"
    }, {
        xtype: "button",
        cls: "highlightAllBtn",
        enableToggle: true,
        text: "<b>Highlight All</b>",
        margin: "2 4 2 4"
    }]
});
