/**
 * @class Teselagen.bio.sequence.alphabets.DNAAlphabet
 * 
 * DNA alphabet. Most general alphabet to build DNA sequences.
 * 
 * @see Teselagen.bio.sequence.symbols.NucleotideSymbol
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.sequence.alphabets.DNAAlphabet", {
	extend: "Teselagen.bio.sequence.alphabets.AbstractAlphabet",
	requires: ["Teselagen.bio.sequence.symbols.NucleotideSymbol"],
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
		
		/**
		 * Returns data about the Adenine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "a" nucleotide
		 */
		this.getA = function(){ 
			return a; 
		}

		/**
		 * Returns data about the Guanine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "g" nucleotide
		 */
		this.getG = function() { return g; }

		/**
		 * Returns data about the Cytosine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "c" nucleotide
		 */
		this.getC = function(){ return c; }

		/**
		 * Returns data about the Thymine NucleotideSymbol
		 * @return {NucleotideSymbol} [description]
		 */
		this.getT = function(){ return t; }

		/**
		  * Returns data about the "Ambiguous a or c" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c nucleotide
		 */
		this.getM = function(){ return m; }

		/**
		  * Returns data about the "Ambiguous a or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g nucleotide
		 */
		this.getR = function(){ return r; }

		/**
		  * Returns data about the "Ambiguous a or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t nucleotide
		 */
		this.getW = function(){ return w; }

		/**
		  * Returns data about the "Ambiguous c or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g nucleotide
		 */
		this.getS = function(){ return s; }

		/**
		  * Returns data about the "Ambiguous c or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or t nucleotide
		 */
		this.getY = function(){ return y; }

		/**
		  * Returns data about the "Ambiguous g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous g or t nucleotide
		 */
		this.getK = function(){ return k; }

		/**
		  * Returns data about the "Ambiguous a or c or g" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or g nucleotide
		 */
		this.getV = function(){ return v; }

		/**
		  * Returns data about the "Ambiguous a or c or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or t nucleotide
		 */
		this.getH = function(){ return h; }

		/**
		  * Returns data about the "Ambiguous a or g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g or t nucleotide
		 */
		this.getD = function(){ return d; }

		/**
		  * Returns data about the "Ambiguous c or g or t" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g or t nucleotide
		 */
		this.getB = function(){ return b; }

		/**
		  * Returns data about the "Ambiguous a or t or g or c" NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t or g or c nucleotide
		 */
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