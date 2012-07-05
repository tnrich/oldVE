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
	singleton: true,
	
		a: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: ""}),
		/*g: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: ""}), 
		c: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: ""}), 
		t: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: ""}), 
		m: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: [a, c]}),
		r: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;'}", value: "r", ambiguousMatches: [a, g]}),
		w: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;'}", value: "w", ambiguousMatches: [a, t]}), 
		s: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;'}", value: "s", ambiguousMatches: [c, g]}), 
		y: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 't;'}", value: "y", ambiguousMatches: [c, t]}), 
		k: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'g' or 't;'}", value: "k", ambiguousMatches: [g, t]}), 
		v: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 'g'}", value: "v", ambiguousMatches: [a, c, g]}), 
		h: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'c;' or 't'}", value: "h", ambiguousMatches: [a, c, t]}), 
		d: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 'g;' or 't'}", value: "d", ambiguousMatches: [a, g, t]}), 
		b: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'c' or 'g;' or 't'}", value: "b", ambiguousMatches: [c, g, t] }), 
		n: Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Ambiguous {'a' or 't;' or 'g' or 'c'}", value: "n", ambiguousMatches: [a, c, g, t] }), */
		
		/**
		 * Returns data about the Adenine NucleotideSymbol
		 * @return {NucleotideSymbol} returns the datastructure for the "a" nucleotide
		 */
		
		testlog: function() {
			console.log("Test Singleton");
		}

		// getA: function() { 
		// 	return a; 
		// }

		// /**
		//  * Returns data about the Guanine NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the "g" nucleotide
		//  */
		// getG: function() { return g; }

		// /**
		//  * Returns data about the Cytosine NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the "c" nucleotide
		//  */
		// getC: function(){ return c; }

		// /**
		//  * Returns data about the Thymine NucleotideSymbol
		//  * @return {NucleotideSymbol} [description]
		//  */
		// getT: function(){ return t; }

		// /**
		//   * Returns data about the "Ambiguous a or c" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c nucleotide
		//  */
		// getM: function(){ return m; }

		// /**
		//   * Returns data about the "Ambiguous a or g" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g nucleotide
		//  */
		// getR: function(){ return r; }

		// /**
		//   * Returns data about the "Ambiguous a or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t nucleotide
		//  */
		// getW: function(){ return w; }

		// /**
		//   * Returns data about the "Ambiguous c or g" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g nucleotide
		//  */
		// getS: function(){ return s; }

		// *
		//   * Returns data about the "Ambiguous c or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or t nucleotide
		 
		// getY: function(){ return y; }

		// /**
		//   * Returns data about the "Ambiguous g or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous g or t nucleotide
		//  */
		// getK: function(){ return k; }

		// /**
		//   * Returns data about the "Ambiguous a or c or g" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or g nucleotide
		//  */
		// getV: function(){ return v; }

		// /**
		//   * Returns data about the "Ambiguous a or c or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or c or t nucleotide
		//  */
		// getH: function(){ return h; }

		// /**
		//   * Returns data about the "Ambiguous a or g or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or g or t nucleotide
		//  */
		// getD: function(){ return d; }

		// /**
		//   * Returns data about the "Ambiguous c or g or t" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous c or g or t nucleotide
		//  */
		// getB: function(){ return b; }

		// /**
		//   * Returns data about the "Ambiguous a or t or g or c" NucleotideSymbol
		//  * @return {NucleotideSymbol} returns the datastructure for the ambiguous a or t or g or c nucleotide
		//  */
		// getN: function(){ return n; }

	
});
