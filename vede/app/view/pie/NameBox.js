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
        length: 0,
        // listeners: {
        //     click: {
        //         element: "pieNameBox",
        //         fn: function(){ console.log('hey pieNameBox'); }
        //     }
        // }
    },

    constructor: function(inData) {
        this.initConfig(inData);

        var text1;
        var text2;
        var group = inData.pie.append("svg:g")
                              .attr("class", "pieNameBox")
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
