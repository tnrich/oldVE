
    /**
    * GenbankFeatureElement class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFeatureElement', {
	/* */

	/* 
	 * @constructor
	 * @param */
	constructor: function (inData) {
		
		if (inData) {
			var key = inData.key;
			var strand = inData.strand;
			var featureQualifier;
			var featureLocation;
		} else {
			var key;
			var strand;
			var featureQualifier;
			var featureLocation;
		}
		
		this.getKeyword = function() {
			return key;
		}
		this.setKey = function(pKey) {
			key = pKey;
		}

		this.getStrand = function() {
			return strand;
		}
		this.setStrand = function(pStrand) {
			strand = pStrand;
		}
		
		this.getFeatureQualifier = function() {
			return featureQualifier;
		}
		this.setFeatureQualifier = function(pFeatureQualifier) {
			featureQualifier = pFeatureQualifier;
		}
		
		this.getFeatureLocation = function() {
			return FeatureLocation;
		}
		this.setFeatureLocation = function(pFeatureLocation) {
			featureLocation = pFeatureLocation;
		}
		
		
		this.toString = function() {
			var line = "     " + key.rpad(" ", 21);
			line += strand;
			return line;
		}
		
		this.toJSONString = function() {
			return JSON.stringify(that, null, '  ');
		}
		
		

		return this;
    }

});