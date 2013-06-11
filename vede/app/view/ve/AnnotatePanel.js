/**
 * Vector Editor annotate panel
 * @class Vede.view.ve.AnnotatePanel
 */
Ext.define("Vede.view.ve.AnnotatePanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.AnnotatePanel",
    id: "AnnotatePanel",
    //autoScroll: true,
    width: "645px",
    layout: {
        type: "fit"
    },
    collapsible: true,
    collapseDirection: "right",
    title: "Sequence",
    titleCollapse: true,
    items: [{
        xtype: "container",
        overflowY: "scroll",
        //overflowX: "scroll",
        id: "AnnotateContainer",
        layout: {
            type: "fit"
        }
    }],
});
