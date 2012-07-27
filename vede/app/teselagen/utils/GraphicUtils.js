Ext.define("Teselagen.utils.GraphicUtils", {
    singleton: true,

    ARC_THRESHOLD: 8,

    drawArc: function(center, radius, startAngle, endAngle, reverseRendering, returnString) {
        var reverseRendering = reverseRendering || false;
        var returnString = returnString || false;

        var alpha;
        if(endAngle < startAngle) {
            alpha = 2 * Math.PI - startAngle + endAngle;
        } else {
            alpha = endAngle - startAngle;
        }

        var startPoint = {};
        var endPoint = {};

        var sprite;
        var path;
        if(!reverseRendering) {
            startPoint.x = center.x + radius * Math.sin(startAngle);
            startPoint.y = center.y + radius * Math.cos(startAngle);

            endPoint.x = center.x + radius * Math.sin(startAngle);
            endPoint.y = center.y - radius * Math.cos(startAngle);

            path = "M" + Math.floor(startPoint.x) + " " + Math.floor(startPoint.y) +
                   "A" + radius + " " + radius + " 0 0 0 " +
                   Math.floor(endPoint.x) + " " + Math.floor(endPoint.y)

            sprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: path
            });
        } else {
            startPoint.x = center.x + radius * Math.sin(endAngle);
            startPoint.y = center.y - radius * Math.sin(endAngle);

            endPoint.x = center.x + radius * Math.sin(endAngle);
            endPoint.y = center.y - radius * Math.cos(endAngle);

            path = "M" + Math.floor(startPoint.x) + " " + Math.floor(startPoint.y) +
                   "A" + radius + " " + radius + " 0 0 0 " +
                   Math.floor(endPoint.x) + " " + Math.floor(endPoint.y)

            sprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: path
            });
        }

        if(!returnString) {
            return sprite;
        } else {
            return path;
        }
    },

    drawPiePiece: function(center, radius, thickness, startAngle, endAngle, color) {
        var outerRadius = radius + thickness / 2;
        var innerRadius = radius - thickness / 2;

        var outerCorner = {}; 
        var innerCorner = {};
        
        outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
        outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
        
        innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
        innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

        return Ext.create("Ext.draw.Sprite", {
            type: "path",
            path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) + " " +
                  this.drawArc(center, outerRadius, startAngle, endAngle, false, true) +
                  "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) + " " +
                  this.drawArc(center, innerRadius, startAngle, endAngle, true, true) +
                  "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
            stroke: color
        });
    },

    drawDirectedPiePiece: function (center, radius, thickness, startAngle, endAngle, direction, color) {
        var outerRadius = radius + thickness / 2;
        var innerRadius = radius - thickness / 2;
        var arcLength;

        var outerCorner = {};
        var innerCorner = {};
        var middlePoint = {};

        var sprite;
        if(direction > 0) {
            if(startAngle == endAngle) {
                arcLength = 2 * Math.PI * radius;
            } else if(startAngle > endAngle) {
                arcLength = radius * (2 * Math.PI - (endAngle - startAngle));
            } else {
                arcLength = radius * (endAngle - startAngle);
            }

            // Draw triangle if arc is smaller than the threshold.
            if(arcLength > this.ARC_THRESHOLD) {
                var alpha = this.ARC_THRESHOLD / radius;

                if(direction == 1) {
                    middlePoint.x = center.x + radius * Math.sin(endAngle);
                    middlePoint.y = center.y - radius * Math.cos(endAngle);
                    
                    endAngle -= alpha;
                    
                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
                    
                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    sprite = Ext.create("Ext.draw.Sprite", {
                        type: "path",
                        path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) + " " +
                              this.drawArc(center, outerRadius, startAngle, 
                                           endAngle, false, true) + 
                              "L" + Math.floor(middlePoint.x) + " " + Math.floor(middlePoint.y) + " " +
                              "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) + " " +
                              this.drawArc(center, innerRadius, startAngle,
                                           endAngle, false, true) +
                              "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
                        stroke: color,
                    });
				} else if(direction == 2) {
                    middlePoint.x = center.x + radius * Math.sin(startAngle);
                    middlePoint.y = center.y - radius * Math.cos(startAngle);
                    
                    startAngle += alpha;
                    
                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
                    
                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    sprite = Ext.create("Ext.draw.Sprite", {
                        type: "path",
                        path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) + 
                              this.drawArc(center, outerRadius, startAngle,
                                           endAngle, false, true) + 
                              "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) +
                              this.drawArc(center, innerRadius, startAngle,
                                           endAngle, false, true) +
                              "L" + Math.floor(middlePoint.x) + " " + Math.floor(middlePoint.y) +
                              "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
                        stroke: color
                    });
				}
            } else {
                if(direction == 1) {
                    middlePoint.x = center.x + radius * Math.sin(endAngle);
                    middlePoint.y = center.y - radius * Math.cos(endAngle);
                    
                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
                    innerCorner.x = center.x + innerRadius * Math.sin(startAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(startAngle);

                    sprite = Ext.create("Ext.draw.Sprite", {
                        type: "path",
                        path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) +
                              "L" + Math.floor(middlePoint.x) + " " + Math.floor(middlePoint.y) +
                              "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) +
                              "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
                        stroke: color
                    });
                } else if(direction == 2) {
                    middlePoint.x = center.x + radius * Math.sin(startAngle);
                    middlePoint.y = center.y - radius * Math.cos(startAngle);
                    
                    outerCorner.x = center.x + outerRadius * Math.sin(endAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(endAngle);
                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    sprite = Ext.create("Ext.draw.Sprite", {
                        type: "path",
                        path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) +
                              "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) +
                              "L" + Math.floor(middlePoint.x) + " " + Math.floor(middlePoint.y) +
                              "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
                        stroke: color
                    });
                }
            }
        } else {
            outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
            outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
            
            innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
            innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

            sprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y) +
                      this.drawArc(center, outerRadius, startAngle, endAngle,
                                   false, true) + 
                      "L" + Math.floor(innerCorner.x) + " " + Math.floor(innerCorner.y) +
                      this.drawArc(center, innerRadius, startAngle, endAngle,
                                   false, true) +
                      "L" + Math.floor(outerCorner.x) + " " + Math.floor(outerCorner.y),
                stroke: color
            });
        }

        return sprite;
    },

    pointOnCircle: function(center, angle, radius) {
        if(angle > 2 * Math.PI) {
            angle = angle % (2 * Math.PI);
        }

        var point = {};

        if(angle < Math.PI / 2) {
            point.x = center.x + Math.sin(angle) * radius;
            point.y = center.y - Math.cos(angle) * radius;
        } else if((angle >= Math.PI / 2) && (angle < Math.PI)) {
            point.x = center.x + Math.sin(Math.PI - angle) * radius;
            point.y = center.y + Math.cos(Math.PI - angle) * radius;
        } else if((angle >= Math.PI) && (angle < 3 * Math.PI / 2)) {
            point.x = center.x - Math.sin(angle - Math.PI) * radius;
            point.y = center.y + Math.cos(angle - Math.PI) * radius;
        } else if((angle >= 3 * Math.PI / 2) && (angle <= 2 * Math.PI)) {
            point.x = center.x - Math.sin(2 * Math.PI - angle) * radius;
            point.y = center.y - Math.cos(2 * Math.PI - angle) * radius;
        }

        return point;
    }
});
