/**
 * @class Teselagen.bio.sequence.alphabets.ProteinAlphabet
 * 
 * Protein alphabet. Most general alphabet to build Protein sequences.  See Teselagen.bio.sequence.symbols.AminoAcidSymbol.
 * 
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.alphabets.ProteinAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	singleton: true,
	
	a: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Alanine', threeLettersName: 'Ala', value: 'A'}),
	r: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Arginine', threeLettersName: 'Arg', value: 'R'}),
	n: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Asparagine', threeLettersName: 'Asn', value: 'N'}),
	d: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Aspartic acid', threeLettersName: 'Asp', value: 'D'}),
	c: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Cysteine', threeLettersName: 'Cys', value: 'C'}),
	e: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Glutamic acid', threeLettersName: 'Glu', value: 'E'}),
	q: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Glutamine', threeLettersName: 'Gln', value: 'Q'}),
	g: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Glycine', threeLettersName: 'Gly', value: 'G'}),
	h: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Histidine', threeLettersName: 'His', value: 'H'}),
	i: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Isoleucine ', threeLettersName: 'Ile', value: 'I'}),
	l: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Leucine', threeLettersName: 'Leu', value: 'L'}),
	k: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Lysine', threeLettersName: 'Lys', value: 'K'}),
	m: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Methionine', threeLettersName: 'Met', value: 'M'}),
	f: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Phenylalanine', threeLettersName: 'Phe', value: 'F'}),
	p: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Proline', threeLettersName: 'Pro', value: 'P'}),
	s: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Serine', threeLettersName: 'Ser', value: 'S'}),
	t: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Threonine', threeLettersName: 'Thr', value: 'T'}),
	w: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Tryptophan', threeLettersName: 'Try', value: 'W'}),
	y: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Tyrosine', threeLettersName: 'Tyr', value: 'Y'}),
	v: Ext.create("Teselagen.bio.sequence.symbols.AminoAcidSymbol", {name:'Valine ', threeLettersName: 'Val', value: 'V'}),
	
	/* -----------------------------------------------------
	 * GETTERS - Get amino acid by Value
	 * -----------------------------------------------------*/
	
	/**
	* Returns data about the Alanine AminoAcidSymbol
	* @return AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getA: function() { return this.a; },
	
	/**
	* Returns data about the Arginine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getR: function() { return this.r; },
	
	/**
	* Returns data about the Asparagine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getN: function() { return this.n; },
	
	/**
	* Returns data about the Aspartic Acid AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getD: function() { return this.d; },
	
	/**
	* Returns data about the Cysteine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getC: function() { return this.c; },
	
	/**
	* Returns data about the Glutamic Acid AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getE: function() { return this.e; },
	
	/**
	* Returns data about the Glutamine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getQ: function() { return this.q; },
	
	/**
	* Returns data about the Glycine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getG: function() { return this.g; },
	
	/**
	* Returns data about the Histidine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getH: function() { return this.h; },
	
	/**
	* Returns data about the IsoLeucine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getI: function() { return this.i; },
	
	/**
	* Returns data about the Leucine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getL: function() { return this.l; },
	
	/**
	* Returns data about the Lysine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getK: function() { return this.k; },
	
	/**
	* Returns data about the Methionine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getM: function() { return this.m; },
	
	/**
	* Returns data about the Phenylalanine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getF: function() { return this.f; },
	
	/**
	* Returns data about the Proline AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getP: function() { return this.p; },
	
	/**
	* Returns data about the Serine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getS: function() { return this.s; },
	
	/**
	* Returns data about the Threonine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getT: function() { return this.t; },
	
	/**
	* Returns data about the Tryptophan AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getW: function() { return this.w; },
	
	/**
	* Returns data about the Tyrosine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getY: function() { return this.y; },
	
	/**
	* Returns data about the Valine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getV: function() { return this.v; },
	
	/* -----------------------------------------------------
	 * GETTERS - Get amino acid by Name
	 * -----------------------------------------------------*/

	 	/**
	* Returns data about the Alanine AminoAcidSymbol
	* @return AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getAlanine:  function (){ return this.a; },

		/**
	* Returns data about the Arginine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getArginine: function (){ return this.r; },

		/**
	* Returns data about the Asparagine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getAsparagine:  function (){ return this.n; },

		/**
	* Returns data about the Aspartic Acid AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getAspartic: function (){ return this.d; },

		/**
	* Returns data about the Cysteine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getCysteine:  function (){ return this.c; },

		/**
	* Returns data about the Glutamic Acid AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getGlutamic:  function (){ return this.e; },

		/**
	* Returns data about the Glutamine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getGlutamine:  function (){ return this.q; },

		/**
	* Returns data about the Glycine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getGlycine:  function (){ return this.g; },

		/**
	* Returns data about the Histidine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getHistidine:  function (){ return this.h; },

		/**
	* Returns data about the IsoLeucine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getIsoleucine:  function (){ return this.i; },

		/**
	* Returns data about the Leucine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getLeucine:  function (){ return this.l; },

	/**
	* Returns data about the Lysine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getLysine:  function (){ return this.k; },

		/**
	* Returns data about the Methionine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getMethionine:  function (){ return this.m; },

		/**
	* Returns data about the Phenylalanine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getPhenylalanine:  function (){ return this.f; },


	/**
	* Returns data about the Proline AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getProline:  function (){ return this.p; },

	/**
	* Returns data about the Serine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getSerine:  function (){ return this.s; },


	/**
	* Returns data about the Threonine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getThreonine:  function (){ return this.t; },


	/**
	* Returns data about the Tryptophan AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getTryptophan:  function (){ return this.w; },


	/**
	* Returns data about the Tyrosine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getTyrosine:  function (){ return this.y; },


	/**
	* Returns data about the Valine AminoAcidSymbol
	* @return {AminoAcidSymbol} returns the datastructure for the specified AminoAcidSymbol
	*/
	getValine:  function (){ return this.v; },
	
});