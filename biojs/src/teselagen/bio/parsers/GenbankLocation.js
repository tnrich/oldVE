
    /**
    * GenbankLocation class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define("Teselagen.bio.parsers.GenbankLocation", {
	/* */

	/* 
	 * @constructor
	 * @param {int, int} Genbank Feature Start and End indices
	 */
	constructor: function (inData) {
		var that = this;
		
		if (inData) {
			var start	= inData.start;
			var end		= inData.end;
		} else {
			var start;
			var end;
		}
		
		
		this.getStart = function() {
			return start;
		}
		this.setStart = function(pStart) {
			start = pStart;
		}

		this.getEnd = function() {
			return end;
		}
		this.setEnd = function(pEnd) {
			end = pEnd;
		}

		this.toString = function() {
			var line = start + ".." + end;
			return line;
		}
		
		this.toJSON = function() {
			var json = {
				start: start,
				end: end
			}
			return json;
		}
		return this;
    }

});