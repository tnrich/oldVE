/**
 * @class Teselagen.models.DNAFeatureNote
 * Class describing a note on a DNA feature.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.DNAFeatureNote", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {String} name The name of the note.
	 * @param {String} aValue The text of the note.
	 * @param {Boolean} quoted Also not sure what this is.
	 */
	fields: [
		{name: "name", type: "string", defaultValue: ""},
		{name: "aValue", type: "string", defaultValue: ""},
		{name: "quoted", type: "boolean", defaultValue: false}
	]
});