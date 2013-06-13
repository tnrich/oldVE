/**
 * Vector Editor vector panel
 * @class Vede.view.ve.VectorPanel
 */
Ext.define("Vede.view.ve.VectorPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.VectorPanel",
    id: "VectorPanel",
    /*layout: {
        type: "fit"
    },*/
    //autoScroll: true,
    scrollable: false,
    collapsible: true,
    collapseDirection: "left",
    title: "Map",
    titleCollapse: "true",
    items: [{
        xtype: "container",
        id: "PieContainer",
        style: {
            overflow: "auto"
        },
        layout: {
            type: "fit"
        }
    }, {
        xtype: "container",
        id: "RailContainer",
        style: {
            overflow: "auto"
        },
        layout: {
            type: "fit"
        }
    }]
});
