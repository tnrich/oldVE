//Need to implement  singleton

Ext.define("Teselagen.bio.sequence.alphabets.RNAAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	singleton: true,

	a: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []}),
	g: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []}), 
	c: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: []}), 
	t: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}), 
	m: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: []}),
	r: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;'}", value: "r", ambiguousMatches: []}),
	w: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u;'}", value: "w", ambiguousMatches: []}), 
	s: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;'}", value: "s", ambiguousMatches: []}), 
	y: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'u}", value: "y", ambiguousMatches: []}), 
	k: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 'u;'}", value: "k", ambiguousMatches: []}), 
	v: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'g'}", value: "v", ambiguousMatches: []}), 
	h: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'u'}", value: "h", ambiguousMatches: []}), 
	d: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;' or 'u'}", value: "d", ambiguousMatches: []}), 
	b: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;' or 'u'}", value: "b", ambiguousMatches: []}), 
	n: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u;' or 'g' or 'c'}", value: "n", ambiguousMatches: [] }), 

	//A workaround to set ambiguous matches.
	constructor: function(){
		var that = this;
		that.m.setAmbiguousMatches([that.a, that.c]);
		that.r.setAmbiguousMatches([that.a, that.g]);
		that.w.setAmbiguousMatches([that.a, that.u]);
		that.s.setAmbiguousMatches([that.c, that.g]);
		that.y.setAmbiguousMatches([that.c, that.u]);
		that.k.setAmbiguousMatches([that.g, that.u]);
		that.v.setAmbiguousMatches([that.a, that.c, that.g]);
		that.h.setAmbiguousMatches([that.a, that.c, that.u]);
		that.d.setAmbiguousMatches([that.a, that.g, that.u]);
		that.b.setAmbiguousMatches( [that.c, that.g, that.u]);
		that.n.setAmbiguousMatches([that.a, that.c, that.g, that.u]);	
	},

	getA: function (){ return this.a; },
	getG: function (){ return this.g; },
	getC: function (){ return this.c; },
	getU: function (){ return this.u; },
	getM: function (){ return this.m; },
	getR: function (){ return this.r; },
	getW: function (){ return this.w; },
	getS: function (){ return this.s; },
	getY: function (){ return this.y; },
	getK: function (){ return this.k; },
	getV: function (){ return this.v; },
	getH: function (){ return this.h; },
	getD: function (){ return this.d; },
	getB: function (){ return this.b; },
	getN: function (){ return this.n; },
});