/**
 * @class Teselagen.models.ORF
 * Class describing an ORF for a DNA strand.
 * @author Evan Amato
 */
Ext.define("Teselagen.models.ORF", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {Postion} position The position of the ORF.
	 * @param {length} length The length of the ORF.
	 * @param {frame} frame.
	 * @param {strand} strand Which strand the ORF is on. 1 for forward, -1 for backward.
	 */
	fields: [
		{name: "position", type: "auto", defaultValue: null},
		{name: "length", type: "int", defaultValue: 0},
		{name: "frame", type: "int", defaultValue: 0},
		{name: "strand", type: "int", defaultValue: ''}
	]
});