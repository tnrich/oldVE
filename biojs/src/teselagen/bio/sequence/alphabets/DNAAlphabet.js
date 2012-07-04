Ext.define("Teselagen.bio.sequence.alphabets.DNAAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	//singleton: true,
	constructor: function(){
		var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: ""});
		var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: ""}); 
		var c = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: ""}); 
		var t = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: ""}); 
		var m = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: [a, c]});
		var r = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;'}", value: "r", ambiguousMatches: [a, g]});
		var w = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;'}", value: "w", ambiguousMatches: [a, t]}); 
		var s = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;'}", value: "s", ambiguousMatches: [c, g]}); 
		var y = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 't;'}", value: "y", ambiguousMatches: [c, t]}); 
		var k = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 't;'}", value: "k", ambiguousMatches: [g, t]}); 
		var v = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'g'}", value: "v", ambiguousMatches: [a, c, g]}); 
		var h = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 't'}", value: "h", ambiguousMatches: [a, c, t]}); 
		var d = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;' or 't'}", value: "d", ambiguousMatches: [a, g, t]}); 
		var b = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;' or 't'}", value: "b", ambiguousMatches: [c, g, t] }); 
		var n = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;' or 'g' or 'c'}", value: "n", ambiguousMatches: [a, c, g, t] }); 
		
		this.getA = function(){ 
			return a; 
		}
		this.getG = function() { return g; }
		this.getC = function(){ return c; }
		this.getT = function(){ return t; }
		this.getM = function(){ return m; }
		this.getR = function(){ return r; }
		this.getW = function(){ return w; }
		this.getS = function(){ return s; }
		this.getY = function(){ return y; }
		this.getK = function(){ return k; }
		this.getV = function(){ return v; }
		this.getH = function(){ return h; }
		this.getD = function(){ return d; }
		this.getB = function(){ return b; }
		this.getN = function(){ return n; }
/*
					this.superclass.addSymbol(a);
					this.superclass.addSymbol(t);
					this.superclass.addSymbol(g);
					this.superclass.addSymbol(c);
					this.superclass.addSymbol(m);
					this.superclass.addSymbol(r);
					this.superclass.addSymbol(w);
					this.superclass.addSymbol(s);
					this.superclass.addSymbol(y);
					this.superclass.addSymbol(k);
					this.superclass.addSymbol(v);
					this.superclass.addSymbol(h);
					this.superclass.addSymbol(d);
					this.superclass.addSymbol(b);
					this.superclass.addSymbol(n);*/

		return this;
	}
});