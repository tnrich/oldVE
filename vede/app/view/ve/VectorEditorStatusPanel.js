/**
 * Vector Editor status panel
 * @class Vede.view.ve.VectorEditorStatusPanel
 */
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
        },
        {
            xtype: "tbtext",
            id: "VectorEditorStatusBarAlert"
        },
        {
            xtype: "tbtext",
            cls: "meltingTemperatureText",
            text: ""
        },
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            text: "Read only"
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "caretPositionText",
            text: "0",
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "selectionPositionText",
            text: "- : -"
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "sequenceLengthText",
            text: "0"
        }]
    }]
});
