/**
 * @class Vede.view.pie.Caret
 * Selection line for circular DNA drawing
 */
Ext.define("Vede.view.pie.Caret", {
    config: {
        pie: null,
    	angle: null,
    	center: null,
    	radius: null
    },
    statics: {
    	CARET_COLOR : 'black',
    	CARET_WIDTH : 1
    },
    constructor: function(pConfig) {
        this.initConfig(pConfig);

        var x = pConfig.radius * Math.cos(pConfig.angle - Math.PI / 2) + 
                pConfig.center.x;
        var y = pConfig.radius * Math.sin(pConfig.angle - Math.PI / 2) + 
                pConfig.center.y;

        return pConfig.pie.append("svg:line")
                  .attr("class", "pieCaret")
                  .attr("x1", pConfig.center.x)
                  .attr("y1", pConfig.center.y)
                  .attr("x2", x)
                  .attr("y2", y)
                  .attr("stroke", this.self.CARET_COLOR)
                  .attr("stroke-width", this.self.CARET_WIDTH)
                  .style("pointer-events", "none");
    },
});
