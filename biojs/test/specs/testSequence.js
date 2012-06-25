/* 
 * @author Micah Lerner
 */

describe("Testing Sequence related classes ", function() {
	describe("Testing 'alphabet' classes", function(){

	});

	describe("Testing 'common' classes", function(){

	});

	describe("Testing 'dna' classes", function(){

	});

	describe("Testing 'symbol' classes", function(){
		describe("AminoAcidSymbol tests", function(){
			var aminoAcidSymbol;
			beforeEach(function(){
				aminoAcidSymbol =  Ext.create('Teselagen.bio.sequence.symbols.AminoAcidSymbol', {
					name: "test",
					threeLettersName: "test",
					value: "test"
				});
			});
			it("Exists?", function(){
				
				expect(aminoAcidSymbol).toBeDefined();
			});

			it(".getName() functions correctly", function(){
				var test= "test";
				var aminoAcidSymbol =  Ext.create('Teselagen.bio.sequence.symbols.AminoAcidSymbol', {
					name: "test",
					threeLettersName: "test",
					value: "test"
				});
				expect(aminoAcidSymbol.getName()).toEqual(test);
			});

			it(".setName() functions correctly", function(){
				aminoAcidSymbol.setName("changed");
				expect(aminoAcidSymbol.getName()).toEqual("changed");
			});

			it(".getThreeLettersNameName() functions correctly", function(){
				expect(aminoAcidSymbol.getThreeLettersName()).toEqual("test");
			});

			it(".setThreeLettersName() functions correctly", function(){
				aminoAcidSymbol.setThreeLettersName("changed");
				expect(aminoAcidSymbol.getThreeLettersName()).toEqual("changed");
			});

			it(".getValue() functions correctly", function(){
				expect(aminoAcidSymbol.getThreeLettersName()).toEqual("test");
			});

			it(".setValue()) functions correctly", function(){
				aminoAcidSymbol.setValue("changed");
				expect(aminoAcidSymbol.getValue()).toEqual("changed");
			});
		});

		describe("GapSymbol tests", function(){
			var gapSymbol;
			beforeEach(function(){
				gapSymbol =  Ext.create('Teselagen.bio.sequence.symbols.GapSymbol', {
					name: "test",
					value: "test"
				});
			});
			it("Exists?", function(){
				
				expect(gapSymbol).toBeDefined();
			});

			it(".getName() functions correctly", function(){
				var test= "test";

				expect(gapSymbol.getName()).toEqual(test);
			});

			it(".setName() functions correctly", function(){
				gapSymbol.setName("changed");
				expect(gapSymbol.getName()).toEqual("changed");
			});


			it(".getValue() functions correctly", function(){
				expect(gapSymbol.getValue()).toEqual("test");
			});

			it(".setValue()) functions correctly", function(){
				gapSymbol.setValue("changed");
				expect(gapSymbol.getValue()).toEqual("changed");
			});
		});

		describe("NucleotideSymbol tests", function(){
			var nucleotideSymbol;
			var ambiguousMatchesData =["a", "b", "c"];
			beforeEach(function(){
				nucleotideSymbol =  Ext.create('Teselagen.bio.sequence.symbols.NucleotideSymbol', {
					name: "test",
					value: "test",
					ambiguousMatches: ambiguousMatchesData
				});
			});
			it("Exists?", function(){
				
				expect(nucleotideSymbol).toBeDefined();
			});

			it(".getName() functions correctly", function(){
				var test= "test";

				expect(nucleotideSymbol.getName()).toEqual(test);
			});

			it(".setName() functions correctly", function(){
				nucleotideSymbol.setName("changed");
				expect(nucleotideSymbol.getName()).toEqual("changed");
			});


			it(".getValue() functions correctly", function(){
				expect(nucleotideSymbol.getValue()).toEqual("test");
			});

			it(".setValue()) functions correctly", function(){
				nucleotideSymbol.setValue("changed");
				expect(nucleotideSymbol.getValue()).toEqual("changed");
			});

			it(".getAmbiguousMatches() functions correctly", function(){
				expect(nucleotideSymbol.getAmbiguousMatches()).toEqual(["a", "b", "c"]);
			});

			it(".setAmbiguousMatches()) functions correctly", function(){
				nucleotideSymbol.setAmbiguousMatches(["d", "e", "f"]);
				expect(nucleotideSymbol.getAmbiguousMatches()).toEqual(["d", "e", "f"]);
			});
		});
	});

	describe("Testing DNATools.js", function(){

	});

	describe("Testing TranslationUtils.js", function(){

	});
});