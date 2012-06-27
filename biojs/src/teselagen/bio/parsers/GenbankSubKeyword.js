
/**
 * GenbankSubKeyword class 
 * @description 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankSubKeyword", {
	/* */

	/* 
	 * @constructor
	 * @param {String, String}
	 */
	constructor: function (inData) {
		var that = this;

		if (inData) {
			var keyword   = inData.keyword;
			var value = inData.value;
		} else {
			var keyword;
			var value;
		}

		this.getKeyword = function() {
			return keyword;
		}
		this.setKeyword = function(pKeyword) {
			keyword = pKeyword;
		}

		this.getValue = function() {
			return value;
		}
		this.setValue = function(pValue) {
			value = pValue;
		}
		
		this.toString = function() {
			var width = 80-12;
			var line = "" + keyword;
			line = line.rpad(" ", 10);
			line = line.lpad(" ", 2); // + this.value;
			line += value;
			/*line += value.substring(0,width)

			for (var i=width; i<value; i=i+width) {
				line += value.substring(i,width);
			}*/

			return line;
		}
		
		this.toJSON = function() {
			var json = {
					keyword: keyword,
					value: value
			}
		}
		
		
		return this;
	}

});