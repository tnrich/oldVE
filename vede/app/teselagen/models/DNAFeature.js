/**
 * @class Teselagen.models.DNAFeature
 * Class describing a feature on a DNA strand.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.DNAFeature", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {Int} strand Which strand the DNA feature is on. 1 for forward, -1 for backward.
	 * @param {String} name The name of the feature.
	 * @param {String} type The type of the feature.
	 * @param {String} annotationType The type of the annotation.
	 * @param {Teselagen.models.DNAFeatureNote[]} notes Any notes associated with the feature.
	 * @param {Teselagen.models.DNAFeatureLocation[]} locations The location(s) of the feature.
	 */
	fields: [
		{name: "strand", type: "int", defaultValue: 0},
		{name: "name", type: "string", defaultValue: ""},
		{name: "type", type: "string", defaultValue: ""},
		{name: "annotationType", type: "string", defaultValue: ""},
		{name: "notes",	type: "auto", defaultValue: null},
		{name: "locations", type: "auto", defaultValue: null}
	]
});
