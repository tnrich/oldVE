/**
 * Vector Editor vector panel
 * @class Vede.view.ve.VectorPanel
 */
Ext.define("Vede.view.ve.VectorPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.VectorPanel",
    cls: "VectorPanel",
    scrollable: false,
    collapsible: true,
    collapseDirection: "left",
    title: "Map",
    titleCollapse: true,
    items: [{
        xtype: "container",
        cls: "PieContainer",
        style: {
            overflow: "auto",
            height: "100%"
        },
        layout: {
            type: "fit"
        }
    }, {
        xtype: "container",
        cls: "RailContainer",
        style: {
            overflow: "auto",
            height: "100%"
        },
        layout: {
            type: "fit"
        }
    }]
});
