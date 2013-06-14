/**
 * Name box
 * @class Vede.view.rail.NameBox
 */
Ext.define("Vede.view.rail.NameBox", {
    statics: {
        FONT_SIZE: "10px",
        FONT_WEIGHT: "bold"
    },

    config: {
        rail: null,
        center: {x:150, y: 50},
        name: "",
        length: 0
    },

    constructor: function(inData) {
        this.initConfig(inData);

        this.callParent([{
            type: "text",
            text: inData.name , /*'\n(' + inData.length + ' bp)',*/
            "font-size": "10px",
            "font-weight": "bold",
            x: this.center.x,
            y: this.center.y,
            "text-anchor": "middle",
        }]);

        var text1;
        var text2;
        var group = inData.rail.append("svg:g")
                              .attr("class", "railNameBox")
                              .attr("text-anchor", "middle")
                              .attr("font-size", this.self.FONT_SIZE)
                              .attr("font-weight", this.self.FONT_WEIGHT);

        if(!inData.name) {
            text1 = '(' + inData.length + ' bp)';
            group.append("svg:text")
                 .text(text1)
                 .attr("x", this.center.x)
                 .attr("y", this.center.y);
        } else {
            text1 = inData.name;
            text2 = '(' + inData.length + 'bp)';

            group.append("svg:text")
                 .text(text1)
                 .attr("x", this.center.x)
                 .attr("y", this.center.y);

            group.append("svg:text")
                 .attr("dy", "1em")
                 .text(text2)
                 .attr("x", this.center.x)
                 .attr("y", this.center.y);
        }

        return group;
    }
});
