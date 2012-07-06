//Need to implement  singleton

Ext.define("Teselagen.bio.sequence.alphabets.RNAAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabets",
      singleton: true,

	a: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a", ambiguousMatches: ""}),
        g: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: ""}), 
        c: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: ""}), 
        u: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: ""}),
        m: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c'}", value: "m", ambiguousMatches: [a, c]}), 
        r: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g'}", value: "r", ambiguousMatches: [a, g] }), 
        w: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u'}", value: "s", ambiguousMatches: [a, u]}), 
        s: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g'}", value: "s", ambiguousMatches: [c, g]}), 
        y: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'u'}", value: "y", ambiguousMatches: [c, u]}), 
        k: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 'u'}", value: "k", ambiguousMatches: [g, u]}), 
        v: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c' or 'g'}", value: "v", ambiguousMatches: [a, c, g]}),
        h: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c' or 'u'}", value: "h", ambiguousMatches: [a, c, u]}), 
        d: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g' or 'u'}", value: "d", ambiguousMatches: [a, g, u]}),
        b: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g' or 'u'}", value: "b", ambiguousMatches: [c, g, u]}), 
        n: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u' or 'g' or 'c'}", value: "n", ambiguousMatches: [a, c, g, u]}),
        
        getA: function (){ return this.a; }
       getG: function (){ return this.g; }
       getC: function (){ return this.c; }
       getU: function (){ return this.u; }
       getM: function (){ return this.m; }
       getR: function (){ return this.r; }
       getW: function (){ return this.w; }
       getS: function (){ return this.s; }
       getY: function (){ return this.y; }
       getK: function (){ return this.k; }
       getV: function (){ return this.v; }
       getH: function (){ return this.h; }
       getD: function (){ return this.d; }
       getB: function (){ return this.b; }
       getN: function (){ return this.n; }
});