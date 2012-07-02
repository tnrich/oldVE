/* 
 * @author Micah Lerner
 */

//Testing BioException class
describe("Testing BioException", function(){
	var bioException;
	beforeEach(function(){
		bioException = Ext.create("Teselagen.bio.BioException", {
			message: "BioException message!",
		});
	});

	it("Exists?", function(){
		expect(bioException).toBeDefined();
	});

	it("BioException can be caught correctly.", function(){
		try{
			throw bioException;
		}
		catch(e){
			expect(e.getMessage()).toEqual("BioException message!");
		}
	});
});
//Testing classes in the teselagen/bio/sequence/
describe("Testing Sequence related classes ", function() {
	
	//Testing classes in the teselagen/bio/sequence/alphabet
	describe("Testing 'alphabet' classes", function(){

	});
    	
	//Testing classes in the teselagen/bio/sequence/common
	describe("Testing 'common' classes", function(){
		describe("Annotation test", function(){
			var annotation;
			
			beforeEach(function(){
				annotation = Ext.create("Teselagen.bio.sequence.common.Annotation", {
					start: 1,
					end: 1
				});
				
				this.addMatchers({
					//Test that locations are equal to each other
					equalLocation: function(expected){
						var equal;
						return ( (expected.getStart() === this.actual.getStart() ) && ( expected.getEnd() === this.actual.getStart() ) );
					}
				});
			});


			it("Constructor works correctly", function(){
				expect(annotation).toBeDefined();
			});
	
			
			it(".getStart() works!", function(){
				expect(annotation.getStart()).toEqual(1);
			});

			it(".setOneStart() works!", function(){
				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 2,
					end: 2
				});
				expect( function(){ annotation.setOneStart(1); } ).not.toThrow();

				var testLocations = annotation.getLocations();
				testLocations.push(newLocation);


				annotation.setLocations(testLocations);
				console.log(annotation.getLocations());
				expect(function(){ annotation.setOneStart(1)} ).toThrow();
			});

			it(".getEnd() works!", function(){
				expect(annotation.getEnd()).toEqual(1);
				var locations = annotation.getLocations();

				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 2,
					end: 2
				});

				locations.push(newLocation);
				expect(annotation.getEnd()).toEqual(2);
			});

			it(".setOneEnd() works!", function(){
				annotation.setOneEnd(3);
				expect(annotation.getEnd()).toEqual(3);
				console.log(annotation.getEnd());
				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 2,
					end: 2
				});

				var retrievedLocations = annotation.getLocations(); 
				retrievedLocations.push(newLocation);
				try{
					annotation.setOneEnd(3);
				} catch (e){
					console.log(e);
					expect( e.getMessage() ).toEqual("Cannot set end when multiple Locations exist");
				}
			});

			it(".setLocations() works!", function(){
				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 2,
					end: 2
				});
				var locationArray = [];
				locationArray.push(newLocation);
				annotation.setLocations(locationArray);
				expect(annotation.getLocations()).toEqual(locationArray);
			});

			it(".getLocations works!", function(){
				var testLocation =Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 1,
					end: 1
				});

				var locationList = annotation.getLocations();
				for (var i = 0; i < locationList.length; ++i){
					expect(locationList[i]).equalLocation(testLocation);
				}
				
			});

			/*

			it(".contains() works!", function(){
				//var testAnnotation = Ext.create("Teselagen.bio.sequence.common.annotation");
			});

			it(".isMultiLocation() works!", function(){
				expect(annotation.isMultiLocation()).not.toBe(true);
			});

			//Wait until getNormalized and deNormalized tests are written to write the meat of this test
			it(".shift() works!", function(){
				expect( function(){ annotation.shift(5, 1, true); } ).toThrow( Ext.create('Teselagen.bio.BioException', {
					message: "Cannot shift by greater than maximum length"
				}));
				annotation.shift();
			});

			//Wait
			it(".insertAt() works!", function(){

			});

			//Wait
			it(".deleteAt()", function(){
				
			});

			//Wait
			it(".reverseLocations() works!", function(){
				
			});


			it(".getNormalizedLocations()", function(){
				
			});
			
			it(".deNormalizeLocations() works!", function(){
				
			});


			it(".reverseNormalizedLocations()", function(){
				
			});

			it(".getOverlappingLocationIndex() works!", function(){
				
			});*/
			 
		});

		describe("StrandedAnnotation tests", function(){
			var strandedAnnotation;
			beforeEach(function(){
				strandedAnnotation = Ext.create("Teselagen.bio.sequence.common.StrandedAnnotation", {
					start: 1,
					end: 1,
					strand: 1
				});

			});

			it(".getStrand works?", function(){
				
				expect(strandedAnnotation.getStrand()).toEqual(1);
			});
			
			it(".setStrand works", function(){
				strandedAnnotation.setStrand(2);
				expect(strandedAnnotation.getStrand()).toEqual(2);
			});
		});
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