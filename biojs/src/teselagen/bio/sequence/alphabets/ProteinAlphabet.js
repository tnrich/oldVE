/**
 * @class Teselagen.bio.sequence.alphabets.ProteinAlphabet
 * 
 * Protein alphabet. Most general alphabet to build Protein sequences.
 * 
 * @see Teselagen.bio.sequence.symbols.AminoAcidSymbol
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
	
	getA: function() { return this.a; },
	getR: function() { return this.r; },
	getN: function() { return this.n; },
	getD: function() { return this.d; },
	getC: function() { return this.c; },
	getE: function() { return this.e; },
	getQ: function() { return this.q; },
	getG: function() { return this.g; },
	getH: function() { return this.h; },
	getI: function() { return this.i; },
	getL: function() { return this.l; },
	getK: function() { return this.k; },
	getM: function() { return this.m; },
	getF: function() { return this.f; },
	getP: function() { return this.p; },
	getS: function() { return this.s; },
	getT: function() { return this.t; },
	getW: function() { return this.w; },
	getY: function() { return this.y; },
	getV: function() { return this.v; },
	
	getAlanine:  function (){ return this.a; },
	getArginine: function (){ return this.r; },
	getAsparagine:  function (){ return this.n; },
	getAspartic: function (){ return this.d; },
	getCysteine:  function (){ return this.c; },
	getGlutamic:  function (){ return this.e; },
	getGlutamine:  function (){ return this.q; },
	getGlycine:  function (){ return this.g; },
	getHistidine:  function (){ return this.h; },
	getIsoleucine:  function (){ return this.i; },
	getLeucine:  function (){ return this.l; },
	getLysine:  function (){ return this.k; },
	getMethionine:  function (){ return this.m; },
	getPhenylalanine:  function (){ return this.f; },
	getProline:  function (){ return this.p; },
	getSerine:  function (){ return this.s; },
	getThreonine:  function (){ return this.t; },
	getTryptophan:  function (){ return this.w; },
	getTyrosine:  function (){ return this.y; },
	getValine:  function (){ return this.v; },
	
});