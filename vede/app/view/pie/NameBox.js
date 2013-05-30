/**
 * Name box
 * @class Vede.view.pie.NameBox
 */
Ext.define("Vede.view.pie.NameBox", {
    extend: "Ext.draw.Sprite",

    config: {
        center: {},
        name: "",
        length: 0
    },

    constructor: function(inData) {
        this.initConfig(inData);

        if(inData.name) {
            this.callParent([{
                type: "text",
                text: inData.name + '\n(' + inData.length + ' bp)',
                "font-size": "10px",
                "font-weight": "bold",
                x: this.center.x,
                y: this.center.y,
                "text-anchor": "middle",
            }]);
        } else {
            this.callParent([{
                type: "text",
                text: '(' + inData.length + ' bp)',
                "font-size": "10px",
                "font-weight": "bold",
                x: this.center.x,
                y: this.center.y,
                "text-anchor": "middle",
            }]);
        }
    }
});
