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
        layout: "hbox",
        id: "VectorEditorStatusBar",
        items: [{
            xtype: "tbfill"
        },
        {
            xtype: "tbtext",
            id: "VectorEditorStatusBarAlert",
            shrinkWrap: false
        },
        {
            xtype: "tbtext",
            cls: "meltingTemperatureText",
            text: "",
            width: 50,
            shrinkWrap: false
        },
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "permissionText",
            width: 60,
            shrinkWrap: false
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "caretPositionText",
            text: "0",
            width: 30,
            shrinkWrap: false
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "selectionPositionText",
            text: "- : -",
            style: {
                "text-align": "center"
            },
            width: 110
        }, 
        {
            xtype: "tbseparator"
        }, 
        {
            xtype: "tbtext",
            cls: "sequenceLengthText",
            text: "0",
            width: 40,
            shrinkWrap: false
        }]
    }]
});
