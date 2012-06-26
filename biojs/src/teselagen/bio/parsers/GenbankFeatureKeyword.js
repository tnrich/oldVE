
/**
 * GenbankFeatureKeyword class 
 * @description 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureKeyword", {
	/* */
	extend: "Teselagen.bio.parsers.GenbankKeyword",
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

		this.toJSON = function() {
			var json = {
					keyword: that.keyword,
			}
			if (that.value  !== null) {
				json["value"] = that.value;
			}
			json["elements"] = [];
			//json["ELEMENTS"] = {};
			//console.log(Ext.getClassName(features[0]));
			//console.log(JSON.stringify(features[0], null, "  "));
			for (var i=0; i <features.length; i++) {
				json["elements"].push(features[i]);
			}


			return json;
		}

		return this;
	}

});