
/**
 * GenbankFeaturesKeyword class. 
 * Class for GenbankFeaturesKeyword. Same level as  GenbankKeyword, GebankLocusKeyword, and GenbankOriginKeyword.
 * Simply holds GenbankFeatureElements in an array.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeaturesKeyword", {
	/* */
	extend: "Teselagen.bio.parsers.Keyword",

	/**
	 * Creates a new GenbankFeaturesKeyword from inData.
	 */
	constructor: function () {
		var that = this;
		
		that.keyword = "FEATURES";
		/**
		 *  @property [GenbankFeatureElements] featuresElements
		 */
		var featuresElements = new Array();
		
		
		/**
		 * Get featuresElements
		 * @returns {GenbankFeaturesKeyword
		 */
		this.getFeaturesElements = function() {
			return featuresElements;
		}
		/**
		 * Set featuresElements
		 * @param {GenbankFeaturesKeyword} pFeaturesElements
		 */
		this.setFeaturesElements = function(pFeaturesElements) {
			featuresElements = pFeaturesElements;
		}
		
		/**
		 * Add GenbankFeatureElement
		 * @param {GenbankFeatureElement} pElement
		 */
		this.addElement = function(pElement) {
			featuresElements.push(pElement);
		}
		
		/**
		 * Get Last GenbankFeatureElement in featuresElements array
		 * @returns {GenbankFeatureElement} element
		 */
		this.getLastElement = function() {
			if (featuresElements.length > 0) {
				return featuresElements[featuresElements.length-1];
			} else {
				return null;
			}
		}
		/**
		 * Converts this GenbankFeaturesKeyword to Genbank file format string
		 * @returns {String} line
		 */
		this.toString = function() {
			var line = "FEATURES             Location/Qualifiers\n";

			for (var i=0; i < featuresElements.length; i++) {
				line += featuresElements[i].toString() + "\n";
			}

			return line;
		}
		/**
		 * Converts to JSON format.
		 * @returns {Object} json
		 */
		this.toJSON = function() {
			var json = {
					keyword: that.keyword,
			}
			if (that.value  !== null) {
				json["value"] = that.value;
			}
			json["elements"] = [];
			for (var i=0; i <featuresElements.length; i++) {
				json["elements"].push(featuresElements[i]);
			}


			return json;
		}

		return this;
	}

});