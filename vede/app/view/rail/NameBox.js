/**
 * Name box
 * @class Vede.view.rail.NameBox
 */
Ext.define("Vede.view.rail.NameBox", {
    extend: "Ext.draw.Sprite",

    config: {
        center: {x:150, y: 50},
        name: "",
        length: 0
    },

    constructor: function(inData) {
        this.initConfig(inData);

        this.callParent([{
            type: "text",
            text: inData.name /*+ '\n(' + inData.length + ' bp)'*/,
            "font-size": "10px",
            "font-weight": "bold",
            x: this.center.x,
            y: this.center.y,
            "text-anchor": "middle",
        }]);
    }
});
