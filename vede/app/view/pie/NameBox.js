Ext.define("Vede.view.pie.NameBox", {
    extend: "Ext.draw.Sprite",

    config: {
        center: {},
        name: ""
    },

    constructor: function(inData) {
        this.initConfig(inData);

        this.callParent([{
            type: "text",
            text: inData.name,
            "font-size": "10px",
            "font-weight": "bold",
            x: this.center.x,
            y: this.center.y,
            "text-anchor": "middle"
        }]);
    }
});
