/**
 * Point instance - used to manage a point in 2-D space, and compute distances, angles, polar and orbital positions, etc.
 * Obtained from [moagrius on Github](https://github.com/moagrius/Point).
 * @class Teselagen.bio.util.Point
 */
Ext.define("Teselagen.bio.util.Point", {

	/**
	* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
	* @constructor
	* @param {number} x - The position of the point along the horizontal axis
	* @param {number} y - The position of the point along the vertical axis
	*/
	constructor: function(x, y){
		this.x = x || 0;
		this.y = y || 0;
	},
	
	/**
	* @property {number} x - The position of the point along the horizontal axis
	*/
	x : null,
	
	/**
	* @property {number} y - The position of the point along the vertical axis
	*/
	y : null,

	/**
	* Adds the coordinates of another point to the coordinates of this point to create a new point.
	* @method
	* @param {Point} v The point to be added.
	* @returns Point
	*/
	add : function(v){
		return Ext.create(this.self.getName(), this.x + v.x, this.y + v.y);
	},
	
	/**
	* Creates a copy of this Point object.
	* @method
	* @returns Point
	*/
	clone : function(){
		return Ext.create(this.self.getName(), this.x, this.y);
	},
	
	/**
	* Returns the degrees of rotation facing the target point.
	* @method
	* @param {Point} v The point at the opposite end of the radial comparison.
	* @returns number
	*/
	degreesTo : function(v){
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var angle = Math.atan2(dy, dx); // radians
		return angle * (180 / Math.PI); // degrees
	},
	
	/**
	* Returns the distance between this and another Point.
	* @method
	* @param {Point} v The point at the opposite end of the distance comparison.
	* @returns number
	*/
	distance : function(v){
		var x = this.x - v.x;
		var y = this.y - v.y;
		return Math.sqrt(x * x + y * y);
	},
	
	/**
	* Determines whether two points are equal. Two points are equal if they have the same x and y values.
	* @method
	* @param {Point} toCompare The point to be compared.
	* @returns Boolean
	*/
	equals : function(toCompare){
		return this.x == toCompare.x && this.y == toCompare.y;
	},
	
	/**
	* Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to this and the end point (parameter v). The closer the value of the parameter f is to 1.0, the closer the interpolated point is to this. The closer the value of the parameter f is to 0, the closer the interpolated point is to the destination point (parameter v).
	* @method
	* @param {Point} v The point at the opposite end of the distance comparison.
	* @param {number} f The level of interpolation between the two points. Indicates where the new point will be, along the line between this and the destination point. If f=1, this is returned; if f=0, v is returned.
	* @returns Point
	*/
	interpolate : function(v, f){
		return Ext.create(this.self.getName(), (this.x + v.x) * f, (this.y + v.y) * f);
	},
	
	/**
	* Returns the length of the line segment from (0,0) to this point.
	* @method
	* @returns number
	*/
	length : function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	
	/**
	* Scales the line segment between (0,0) and the current point to a set length.
	* @method
	* @param thickness The scaling value. For example, if the current point is (0,5), and you normalize it to 1, the point returned is at (0,1).
	*/
	normalize : function(thickness){
		var l = this.length();
		this.x = this.x / l * thickness;
		this.y = this.y / l * thickness;
	},
	
	/**
	* Updates a Point to reflect the position based on the passed parameters describing an arc.
	* @method
	* @param {Point} origin The point from which to calculate the new position of this.
	* @param {number} arcWidth A number desribing the width of the arc definining the orbital path.
	* @param {number} arcHeight A number desribing the height of the arc definining the orbital path.
	* @param {number} degrees The position (0 to 360) describing the position along the arc to be computed.
	*/
	orbit : function(origin, arcWidth, arcHeight, degrees){
		var radians = degrees * (Math.PI / 180);
		this.x = origin.x + arcWidth * Math.cos(radians);
		this.y = origin.y + arcHeight * Math.sin(radians);
	},
	
	/**
	* Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value. The value of dy is added to the original value of y to create the new y value.
	* @method
	* @param {number} dx The amount by which to offset the horizontal coordinate, x.
	* @param {number} dy The amount by which to offset the vertical coordinate, y.
	*/
	offset : function(dx, dy){
		this.x += dx;
		this.y += dy;
	},
	
	/**
	* Subtracts the coordinates of another point from the coordinates of this point to create a new point.
	* @method
	* @param {Point} v The point to be subtracted.
	* @returns Point
	*/
	subtract : function(v){
		return Ext.create(this.self.getName(), this.x - v.x, this.y - v.y);
	},
	
	/**
	* Returns the Point object expressed as a String value.
	* @method
	* @returns string
	*/
	toString : function(){
		return "(x=" + this.x + ", y=" + this.y + ")";
	},
	 
	statics: {
    	/**
    	* Determines a point between two specified points. The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2. The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
    	* @method
    	* @static
    	* @param {Point} pt1 The first point.
    	* @param {Point} pt2 The second point.
    	* @param {number} f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
    	* @returns Point
    	*/
    	interpolate : function(pt1, pt2, f){
    		return Ext.create(this.self.getName(), (pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
    	},
    	
    	/**
    	* Converts a pair of polar coordinates to a Cartesian point coordinate.
    	* @method
    	* @static
    	* @param {number} len The length coordinate of the polar pair.
    	* @param {number} angle The angle, in radians, of the polar pair.
    	* @returns Point
    	*/
    	polar : function(len, angle){
    		return Ext.create(this.self.getName(), len * Math.sin(angle), len * Math.cos(angle));
    	},
    	
    	/**
    	* Returns the distance between pt1 and pt2.
    	* @method
    	* @static
    	* @returns Point
    	*/
    	distance : function(pt1, pt2){
    		var x = pt1.x - pt2.x;
    		var y = pt1.y - pt2.y;
    		return Math.sqrt(x * x + y * y);
    	}
	}
	
});