/**
 * @class Teselagen.models.CutSite
 * Class describing a cut site on a DNA strand.
 * @author Evan Amato
 */
Ext.define("Teselagen.models.CutSite", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {String} name The name of the restriction enzyme.
	 * @param {NumCuts} numCuts The number of cuts.
	 * @param {Position} position The site of the cut.
	 * @param {Strand} strand Which strand the Cut Site acts upon. 1 for forward, -1 for backward.
	 */
	fields: [
		{name: "name", type: "string", defaultValue: ""},
		{name: "numCuts",	type: "auto", defaultValue: null},
		{name: "position", type: "auto", defaultValue: null},
		{name: "strand", type: "int", defaultValue: null}
	]
});