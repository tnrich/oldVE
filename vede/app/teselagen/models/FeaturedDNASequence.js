/**
 * @class Teselagen.models.FeaturedDNASequence
 * Class for DNA sequences containing DNAFeatures.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.models.FeaturedDNASequence", {
	extend: "Ext.data.Model",

	/**
	 * Input parameters.
	 * @param {String} name The name of the DNA sequence.
	 * @param {String} sequence The DNA sequence in string form.
	 * @param {Boolean} isCircular Whether the DNA is circular.
	 * @param {Teselagen.models.DNAFeature[]} features DNA features on the sequence.
	 * @param {String} accessionNumber The DNA sequence's accession number.
	 * @param {String} identifier An identifier for the sequence.
	 */
	fields: [
		{name: "name", type: "string", defaultValue: ""},
		{name: "sequence", type: "string", defaultValue: ""},
		{name: "isCircular", type: "boolean", defaultValue: true},
		{name: "features", type: "auto", defaultValue: null},
		{name: "accessionNumber", type: "string", defaultValue: ""},
		{name: "identifier", type: "string", defaultValue: ""}
	]
});