 /**
 * @class Teselagen.models.Ladder
 * Class describing a DNA Ladder
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 */

Ext.define("Teselagen.models.Ladder", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {String} name The name of the ladder..
	 * @param {Array<Int>} bandSizes A list of integers that specify ladder
     * band sizes
	 */
	fields: [
		{name: "bandSizes", type: "auto", defaultValue: null},
		{name: "name", type: "string", defaultValue: ""},
	]
});
