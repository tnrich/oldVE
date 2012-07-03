Ext.define("Teselagen.bio.sequence.alphabets.RNAAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabets",

	var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a", ambiguousMatches: ""});
        var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: ""}); 
        var c = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: ""}); 
        var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: ""});
        var m = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c'}", value: "m", ambiguousMatches: [a, c]}); 
        var r = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g'}", value: "r", ambiguousMatches: [a, g] }); 
        var w = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u'}", value: "s", ambiguousMatches: [a, u]}); 
        var s = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g'}", value: "s", ambiguousMatches: [c, g]}); 
        var y = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'u'}", value: "y", ambiguousMatches: [c, u]}); 
        var k = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 'u'}", value: "k", ambiguousMatches: [g, u]}); 
        var v = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c' or 'g'}", value: "v", ambiguousMatches: [a, c, g]});
        var h = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c' or 'u'}", value: "h", ambiguousMatches: [a, c, u]}); 
        var d = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g' or 'u'}", value: "d", ambiguousMatches: [a, g, u]});
        var b = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g' or 'u'}", value: "b", ambiguousMatches: [c, g, u]}); 
        var n = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'u' or 'g' or 'c'}", value: "n", ambiguousMatches: [a, c, g, u]});
        
              this.getA = function (){ return a; }
       this.getG = function (){ return g; }
       this.getC = function (){ return c; }
       this.getU = function (){ return u; }
       this.getM = function (){ return m; }
       this.getR = function (){ return r; }
       this.getW = function (){ return w; }
       this.getS = function (){ return s; }
       this.getY = function (){ return y; }
       this.getK = function (){ return k; }
       this.getV = function (){ return v; }
       this.getH = function (){ return h; }
       this.getD = function (){ return d; }
       this.getB = function (){ return b; }
       this.getN = function (){ return n; }
});