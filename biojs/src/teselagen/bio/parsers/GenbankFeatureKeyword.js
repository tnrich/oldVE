
    /**
    * GenbankFeatureKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFeatureKeyword', {
	/* */
	extend: 'Teselagen.bio.parsers.GenbankKeyword',
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		var that = this;
		
		var features = new Array();
		
		this.getFeatures = function() {
			return features;
		}
		this.setFeatures = function(pFeatures) {
			features = pFeatures;
		}
		
		this.addElement = function(pElement) {
			features.push(pElement);
		}
		
		this.toString = function() {
			var line = "FEATURES             Location/Qualifiers\n";
			
			for (var i=0; i < features.length; i++) {
				line += features[i].toString() + "\n";
			}
			
			return line;
		}
		
		this.toJSONString = function() {
			return JSON.stringify(that, null, '  ');
		}
		
		return this;
    }

});