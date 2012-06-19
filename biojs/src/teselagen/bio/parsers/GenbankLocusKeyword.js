
    /**
    * GenbankLocusKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankLocusKeyword', {
	/* */
	extend: 'Teselagen.bio.parsers.GenbankKeyword',
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		
		var locusName;
		var strandType;
		var sequenceLength;
		var naType;
		var linear; //boolean; cannot designate Tandem
		var circular; //boolean
		var divisionCode;
		var date;
		
		this.getLocusName = function() {
			return locusName;
		}
		this.setLocusName = function(pLocusName) {
			locusName = pLocusName;
		}
		
		this.getStrandType = function() {
			return strandType;
		}
		this.setStrandType = function(pStrandType) {
			strandType = pStrandType;
		}
		
		this.getSequenceLength = function() {
			return sequenceLength;
		}
		this.setSequenceLength = function(pSequenceLength) {
			sequenceLength = pSequenceLength;
		}
		
		this.getNaType = function() {
			return naType;
		}
		this.setNaType = function(pNaType) {
			naType = pNaType;
		}
		
		this.getLinear = function() {
			return linear;
		}
		this.setLinear = function(pLinear) {
			linear = pLinear;
		}
		
		this.getCircular = function() {
			return circular;
		}
		this.setCircular = function(pCircular) {
			circular = pCircular;
		}
		
		this.getDivisionCode = function() {
			return divisionCode;
		}
		this.setDivisionCode = function(pDivisionCode) {
			divisionCode = pDivisionCode;
		}
		
		this.getDate = function() {
			return date;
		}
		this.setDate = function(pDate) {
			date = pDate;
		}
		
		
		return this;
    }

});