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
        layout: {
            type: "fit"
        }
    }, {
        xtype: "container",
        id: "RailContainer",
        layout: {
            type: "fit"
        }
    }]
});
