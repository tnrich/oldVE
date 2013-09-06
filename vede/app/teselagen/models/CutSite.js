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
	 * @param {Number} numCuts The number of cuts.
	 * @param {Number} start The starting position of the cut.
	 * @param {Number} end The ending position of the cut.
	 * @param {String} position Cut site position for display in Properties.
	 * @param {Number} strand Which strand the Cut Site acts upon. 1 for forward, -1 for backward.
	 */
	fields: [
		{name: "name", type: "string", defaultValue: ""},
		{name: "numCuts",	type: "auto", defaultValue: null},
		{name: "start", type: "auto", defaultValue: null},
		{name: "end", type: "auto", defaultValue: null},
		{name: "position", type: "auto", defaultValue: null},
		{name: "strand", type: "auto", defaultValue: null}
	]
});