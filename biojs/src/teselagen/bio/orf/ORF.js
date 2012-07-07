/**
 * @class Teselagen.bio.orf.ORF
 *
 * Open Read Frame sequence annotation.
 * 
 * @author Nick Elsbree
 * @author Zinovii Dmytriv
 */
Ext.define("Teselagen.bio.orf.ORF", {
	extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

	/**
	 * Constructor.
	 * 
	 * @param {Int} start Frame start location.
	 * @param {Int} end Frame end location.
	 * @param {Teselagen.StrandType} strand Frame strand.
	 * @param {Int} frame The frame. Can be 0, 1, or 2.
	 * @param {Array} startCodons List of start codons for ORF.
	 * 
	 * @return {Teselagen.bio.orf.ORF}
	 */
	constructor: function(inData) {
		var frame;
		var startCodons;

		this.callParent([inData]);

		if(typeof(inData.frame) === "undefined") {
			frame = 0;
		} else {
			frame = inData.frame;
		}

		if(typeof(inData.startCodons) === "undefined") {
			startCodons = null;
		} else {
			startCodons = inData.startCodons;
		}

		/**
		 * Get the frame.
		 * @return {Int}
		 */
		this.getFrame = function() {
			return frame;
		};
		/**
		 * Set the frame.
		 * @param {Int} pFrame The value to set frame to.
		 */
		this.setFrame = function(pFrame) {
			frame = pFrame;
		};
		/**
		 * Get the start codons.
		 * @return {Array}
		 */
		this.getStartCodons = function() {
			return startCodons;
		};
		/**
		 * Set the start codons.
		 * @param {Array} pStartCodons
		 */
		this.setStartCodons = function(pStartCodons) {
			startCodons = pStartCodons;
		};

		return this;
	}
});