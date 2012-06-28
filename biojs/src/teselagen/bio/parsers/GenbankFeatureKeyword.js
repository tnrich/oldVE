
/**
 * GenbankFeatureKeyword class 
 * Class for GenbankFeatureKeyword. Simply holds GenbankFeatureElements.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureKeyword", {
	/* */
	extend: "Teselagen.bio.parsers.GenbankKeyword",

	/**
	 * Creates a new GenbankFeatureKeyword from inData.
	 */
	constructor: function () {
		var that = this;
		/**
		 *  @property [GenbankFeatureElements] features
		 */
		var features = new Array();
		
		
		/**
		 * Get Features
		 */
		this.getFeatures = function() {
			return features;
		}
		/**
		 * Set Features
		 */
		this.setFeatures = function(pFeatures) {
			features = pFeatures;
		}
		
		/**
		 * Add GenbankFeatureElement
		 * @param {GenbankFeatureElement} pElement
		 */
		this.addElement = function(pElement) {
			features.push(pElement);
		}
		
		/**
		 * Get Last GenbankFeatureElement in features array
		 * @returns {GenbankFeatureElement}
		 */
		this.getLastElement = function() {
			if (features.length > 0) {
				return features[features.length-1];
			} else {
				return null;
			}
		}
		/**
		 * Converts this GenbankFeaturesKeyword to Genbank file format string
		 */
		this.toString = function() {
			var line = "FEATURES             Location/Qualifiers\n";

			for (var i=0; i < features.length; i++) {
				line += features[i].toString() + "\n";
			}

			return line;
		}
		/**
		 * Converts to JSON format.
		 */
		this.toJSON = function() {
			var json = {
					keyword: that.keyword,
			}
			if (that.value  !== null) {
				json["value"] = that.value;
			}
			json["elements"] = [];
			for (var i=0; i <features.length; i++) {
				json["elements"].push(features[i]);
			}


			return json;
		}

		return this;
	}

});