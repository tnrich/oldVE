/**
 * @class Teselagen.models.DNAFeatureLocation
 * Class for the location of a DNA feature.
 * @author Nick Elsbree
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.models.DNAFeatureLocation", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {Int} genbankStart The start location of the feature.
	 * @param {Int} end The end location of the feature.
	 * @param {Boolean} singleResidue Whether the feature is a single residue.
	 * @param {Boolean} inBetween Not entirely sure what this is? Anybody?
	 */
	fields: [
		{name: "genbankStart", type: "int",	defaultValue: 0},
		{name: "end", type: "int", defaultValue: 0},
		{name: "singleResidue", type: "boolean", defaultValue: false},
		{name: "inBetween", type: "boolean", defaultValue: false}
	]
});