Ext.define("Teselagen.renderer.pie.SelectionLayer", {
    extend: "Teselagen.renderer.pie.Layer",

    statics: {
        SELECTION_COLOR: "#0099FF",
        SELECTION_TRANSPARENCY: 0.3,
        SELECTION_FRAME_COLOR: "#CCCCCC"
    },

    drawSelectionPie: function(fromIndex, endIndex, direction) {
        var seqLen = this.sequenceManager.getSequence().toString().length;
        if(seqLen == 0 || this.start == fromIndex && this.end == endIndex) {
            return;
        }

        if(this.selectionSprite) {
            this.selectionSprite.destroy();
        }

        var startAngle = fromIndex * 2 * Math.PI / seqLen;
        var endAngle = endIndex * 2 * Math.PI / seqLen;

        var startPoint = Ext.create("Teselagen.bio.util.Point");
        startPoint.x = this.center.x + this.radius * Math.sin(startAngle);
        startPoint.y = this.center.y - this.radius * Math.cos(startAngle);

        var endPoint = Ext.create("Teselagen.bio.util.Point");
        endPoint.x = this.center.x + this.radius * Math.sin(endAngle);
        endPoint.y = this.center.y - this.radius * Math.cos(endAngle);

        // Adjust endangle and startangle to be relative to startangle so we
        // can use the same logic as in GraphicUtils to determine SVG arc flags.

        if(endAngle > startAngle) {
            endAngle -= startAngle;
        } else {
            endAngle += 2 * Math.PI - startAngle;
        }

        startAngle = 0;

        var sweepFlag = 0;
        if(endAngle > startAngle) {
            sweepFlag = 1;
        }

        var largeArcFlag = 0;
        if(Math.abs(endAngle - startAngle) > Math.PI) {
            largeArcFlag = 1;
        }

        this.selectionSprite = Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + this.center.x + " " + this.center.y + " " +
                  "L" + startPoint.x + " " + startPoint.y + " " + 
                  "A" + this.radius + " " + this.radius + " 0 " + largeArcFlag +
                  " " + sweepFlag + " " + endPoint.x + " " + endPoint.y +
                  "L" + this.center.x + " " + this.center.y,
            stroke: this.self.SELECTION_FRAME_COLOR,
            "stroke-opacity": this.self.STROKE_OPACITY,
            fill: this.self.SELECTION_COLOR,
            "fill-opacity": this.self.SELECTION_TRANSPARENCY
        });

        return this.selectionSprite;
    }
});
