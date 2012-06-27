
    /**
    * GenbankFeatureQualifier class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define("Teselagen.bio.parsers.GenbankFeatureQualifier", {
	/* */

	/* 
	 * @constructor
	 * @param */
	constructor: function (inData) {
		var that = this;
		
		if (inData) {
			var name = inData.name;
			var value = inData.value;
			var quoted = inData.quoted; // boolean
		} else {
			var name;
			var value;
			var quoted;
		}
		
		this.getName = function() {
			return name;
		}
		this.setName = function(pName) {
			name = pName;
		}
		
		this.getValue = function() {
			return value;
		}
		this.setValue = function(pValue) {
			value = pValue;
		}
		
		this.getQuoted = function() {
			return quoted;
		}
		this.setQuoted = function(pQuoted) {
			quoted = pQuoted;
		}
		
		this.appendValue = function(append){
			value += append;
		}

		this.toString = function() {
			var line;
			if (quoted) {
				line = "/".lpad(" ", 22) + name + "=\"" + value + "\"";
			} else {
				line = "/".lpad(" ", 22) + name + "=" + value ;
			}
			return line;
		}
		
		this.toJSON = function() {
			var json = {
				name: name,
				value: value
			}
			return json;
		}
		return this;
    }

});