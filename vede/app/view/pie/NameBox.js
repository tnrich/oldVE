/**
 * Name box
 * @class Vede.view.pie.NameBox
 */
Ext.define("Vede.view.pie.NameBox", {
    statics: {
        FONT_SIZE: "10px",
        FONT_WEIGHT: "bold"
    },

    config: {
        pie: null,
        center: {},
        name: "",
        length: 0
    },

    constructor: function(inData) {
        this.initConfig(inData);

        var text;

        if(inData.name) {
            text = inData.name + '\n(' + inData.length + ' bp)';
        } else {
            text = '(' + inData.length + ' bp)';
        }

        return inData.pie.append("svg:text")
                         .attr("class", "pieNameBox")
                         .attr("x", this.center.x)
                         .attr("y", this.center.y)
                         .attr("text-anchor", "middle")
                         .attr("font-size", this.self.FONT_SIZE)
                         .attr("font-weight", this.self.FONT_WEIGHT)
                         .attr("text", text);
    }
});
