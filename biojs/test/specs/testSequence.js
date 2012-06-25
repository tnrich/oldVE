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
				expect(aminoAcidSymbol.getName()).toBe(test);
			});

			it(".setName() functions correctly", function(){
				aminoAcidSymbol.setName("changed");
				expect(aminoAcidSymbol.getName()).toBe("changed");
			});

			it(".getThreeLettersNameName() functions correctly", function(){
				expect(aminoAcidSymbol.getThreeLettersName()).toBe("test");
			});

			it(".setThreeLettersName() functions correctly", function(){
				aminoAcidSymbol.setThreeLettersName("changed");
				expect(aminoAcidSymbol.getThreeLettersName()).toBe("changed");
			});

			it(".getValue() functions correctly", function(){
				expect(aminoAcidSymbol.getThreeLettersName()).toBe("test");
			});

			it(".setValue()) functions correctly", function(){
				aminoAcidSymbol.setValue("changed");
				expect(aminoAcidSymbol.getValue()).toBe("changed");
			});
		});
	});

	describe("Testing DNATools.js", function(){

	});

	describe("Testing TranslationUtils.js", function(){

	});
});