/**
 * @class Teselagen.models.Ladder
 * Class describing a ladder of a gel digest
 * @author Micah Lerner
 */
Ext.define("Teselagen.models.Ladder", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {Array <Int>} bandSizes an array of band sizes
	 * @param {String} name The name of the ladder.
	 */
	fields: [
		{name: "strand", type: "int", defaultValue: 0},
		{name: "name", type: "string", defaultValue: ""},
	]
});