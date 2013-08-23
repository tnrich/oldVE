/**
 * @class Teselagen.models.ORF
 * Class describing an ORF for a DNA strand.
 * @author Evan Amato
 */
Ext.define("Teselagen.models.ORF", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {Number} start 1-based start index
	 * @param {Number} end 1-based end index
	 * @param {Number} length Length of the ORF.
	 * @param {Number} frame Reading frame (1, 2, or 3)
	 * @param {Number} strand Which strand the ORF is on. 1 for forward, -1 for backward.
	 */
	fields: [
		{name: "start", type: "int", defaultValue: 1},
		{name: "end", type: "int", defaultValue: 1},
		{name: "length", type: "int", defaultValue: 0},
		{name: "frame", type: "int", defaultValue: 1},
		{name: "strand", type: "int", defaultValue: 1}
	]
});