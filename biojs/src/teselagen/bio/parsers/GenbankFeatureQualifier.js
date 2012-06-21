
    /**
    * GenbankFeatureQualifier class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFeatureQualifier', {
	/* */

	/* 
	 * @constructor
	 * @param */
	constructor: function (pName, pValue, pQuoted) {
		var name = pName;
		var value = pValue;
		var quoted = pQuoted;
		
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


		return this;
    }

});