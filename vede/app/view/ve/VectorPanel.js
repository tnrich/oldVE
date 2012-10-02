Ext.define("Vede.view.ve.VectorPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.VectorPanel",
    id: "VectorPanel",
    layout: {
        type: "fit"
    },
    collapsible: true,
    collapseDirection: "left",
    title: "Vector",
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
