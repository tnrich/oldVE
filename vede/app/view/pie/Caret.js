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

    svgObject: null,

    constructor: function(pConfig) {
        this.initConfig(pConfig);
    },

    applyAngle: function(pAngle) {
        var x = this.getRadius() * Math.cos(pAngle - Math.PI / 2) + 
                this.getCenter().x;
        var y = this.getRadius() * Math.sin(pAngle - Math.PI / 2) + 
                this.getCenter().y;

        if(this.pie.select(".pieCaret")[0][0] !== null) {
            this.svgObject.attr("x2", x)
                          .attr("y2", y);
        } else {
            this.svgObject = this.getPie().append("svg:line")
                  .attr("class", "pieCaret")
                  .attr("x1", this.getCenter().x)
                  .attr("y1", this.getCenter().y)
                  .attr("x2", x)
                  .attr("y2", y)
                  .attr("stroke", this.self.CARET_COLOR)
                  .attr("stroke-width", this.self.CARET_WIDTH)
                  .style("pointer-events", "none");

        }
        return pAngle;
    }
});
