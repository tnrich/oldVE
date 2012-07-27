Ext.define("Teselagen.utils.GraphicUtils", {
    singleton: true,

    drawDashedLine: function(from, to, length, gap) {
        var length = length || 5;
        var gap = gap || 5;

        var dashArray = [];
        var segmentLength = length + gap;

        var dx = to.x - from.x;
        var dy = to.y - from.y;

        var distance = Math.sqrt((dx * dx) + (dy * dy));

        var moved = 0;
        while(moved < distance) {
            dashArray.push(length, gap);
            moved += segmentLength;
        }

        return Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + from.x + " " + from.y + " L" + to.x + " " + to.y,
            "stroke-dasharray": dashArray
        });
    },

    drawDashedRectangle: function(from, to, length, gap) {
        var length = length || 5;
        var gap = gap || 5;

        var leftSprite = this.drawDashedLine(from, {x: to.x, y: from.y}, )
    },

    drawArc: function(center, radius, startAngle, endAngle, reverseRendering) {
        var reverseRendering = reverseRendering || false;

        var alpha;
        if(endAngle < startAngle) {
            alpha = 2 * Math.PI - startAngle + endAngle;
        } else {
            alpha = endAngle - startAngle;
        }

        var gamma = alpha / parts;

        var startPoint = {};
        var endPoint = {};

        var sprite;
        if(!reverseRendering) {
            startPoint.x = center.x + radius / Math.cos(gamma / 2) * 
                           Math.sin(startAngle + gamma / 2);
            startPoint.y = center.y + radius / Math.cos(gamma / 2) *
                           Math.cos(startAngle + gamma / 2);

            endPoint.x = center.x + radius * Math.sin(startAngle + gamma);
            endPoint.y = center.y - radius * Math.cos(startAngle + gamma);

            sprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + startPoint.x + " " + startPoint.y +
                      "A" + radius + " " + radius + " 0 0 0 " +
                      endPoint.x + " " + endPoint.y
            });
        } else {
            startPoint.x = center.x + radius / Math.cos(gamma / 2) * 
                           Math.sin(endAngle - gamma / 2);
            startPoint.y = center.y - radius / Math.cos(gamma / 2) *
                           Math.sin(endAngle - gamma / 2);

            endPoint.x = center.x + radius * Math.sin(endAngle - gamma);
            endPoint.y = center.y - radius * Math.cos(endAngle - gamma);

            sprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + startPoint.x + " " + startPoint.y +
                      "A" + radius + " " + radius + " 0 0 0 " +
                      endPoint.x + " " + endPoint.y
            });
        }

        return sprite;
    },

    drawPiePiece: function(center, radius, thickness, startAngle, endAngle) {
        var innerRadius = radius + thickness / 2;
        var outerRadius = radius - thickness / 2;

        return Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + center.x + ""
        });
    },
});
