/* 
 * @author Micah Lerner
 */

//Testing BioException class
//
Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandType");
/*
describe("Testing falsity", function(){
	var falsity = true; 
	var testEval = falsity || "False";
	console.log("TestEval: " + testEval);

	falsity = "";
	var testEval = falsity || "False";
	console.log("TestEval: " + testEval);

	falsity = [];
	var testEval = falsity || "False";
	console.log("TestEval: " + testEval);

	falsity = null;
	var testEval = falsity || "False";
	console.log("TestEval: " + testEval);

	var falsity1;
	var testEval = falsity1 || "False";
	console.log("TestEval: " + testEval);

	var falsity1 = {};
	var testEval = falsity1 || "False";
	console.log("TestEval: " + testEval);
});*/

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

		//Testing class teselagen/bio/sequence/alphabet/AbstractAlphabet.js (done)
		describe("AbstractAlphabet tests", function(){
			var abstractAlphabet;
			beforeEach(function(){
				abstractAlphabet = Ext.create("Teselagen.bio.sequence.alphabets.AbstractAlphabet");
			});

			it("getSymbols works", function(){
				var returned = abstractAlphabet.getSymbols();
				expect(returned).toMatch([]);
			});

			it("addSymbol", function(){
				var m = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
					name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: []});
				abstractAlphabet.addSymbol(m);
				expect(abstractAlphabet.getSymbols()).toMatch(m);
			});

			it("symbolByValue works", function(){
				var symbolByValue= abstractAlphabet.symbolByValue("-");
				
				expect(symbolByValue.getValue()).toBe("-");
			});

			it("getGap works", function(){
				expect(abstractAlphabet.getGap().getValue()).toBe("-");
			});

		});

		//Testing class teselagen/bio/sequence/alphabet/DNAAlphabet.js (done)
		describe("DNAAlphabet tests", function(){
			it("Accessing NucleotideSymbols works.", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.DNAAlphabet != undefined;
				});

				runs(function() {	
					var a = Teselagen.bio.sequence.alphabets.DNAAlphabet.getA();
					expect(a.getName()).toMatch("Adenine");
				});

			});

			it("Accessing ambiguousMatches works", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.DNAAlphabet != undefined;
				});

				runs(function() {	
					var a = Teselagen.bio.sequence.alphabets.DNAAlphabet.getA();
					var c = Teselagen.bio.sequence.alphabets.DNAAlphabet.getC();
					var t = Teselagen.bio.sequence.alphabets.DNAAlphabet.getT();
					var m = Teselagen.bio.sequence.alphabets.DNAAlphabet.getM();
					expect(m.getAmbiguousMatches()).toContain(a);
					expect(m.getAmbiguousMatches()).toContain(c);
					expect(m.getAmbiguousMatches()).not.toContain(t);
				});

			});		
		});

		//Testing class teselagen/bio/sequence/alphabet/DNAAlphabet.js (done)
		describe("ProteinAlphabet tests", function(){
			it("get{by abbreviation} works", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.ProteinAlphabet != undefined;
				});

				runs(function() {	
					var h = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getH();
					//console.log(Teselagen.bio.sequence.alphabets.DNAAlphabet.getA());
					expect(h.getValue()).toMatch("H");
					expect(h.getName()).toMatch("Histidine");
				});
			});

			it("get{by name} works", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.ProteinAlphabet != undefined;
				});

				runs(function() {	
					var histidine = Teselagen.bio.sequence.alphabets.ProteinAlphabet.getHistidine();
					expect(histidine.getValue()).toMatch("H");
				});
			});		
		});

		//Testing class teselagen/bio/sequence/alphabet/RNAAlphabet.js (done)
		describe("RNAAlphabet tests", function(){
			it("Accessing NucleotideSymbols works.", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.RNAAlphabet != undefined;
				});

				runs(function() {	
					var a = Teselagen.bio.sequence.alphabets.RNAAlphabet.getA();
					expect(a.getName()).toMatch("Adenine");			
				});

			});

			it("Accessing ambiguousMatches works", function(){
				waitsFor(function() {
					return Teselagen.bio.sequence.alphabets.RNAAlphabet != undefined;
				});

				runs(function() {	
					var a = Teselagen.bio.sequence.alphabets.RNAAlphabet.getA();
					var c = Teselagen.bio.sequence.alphabets.RNAAlphabet.getC();
					var u = Teselagen.bio.sequence.alphabets.RNAAlphabet.getU();
					var m = Teselagen.bio.sequence.alphabets.RNAAlphabet.getM();
					expect(m.getAmbiguousMatches()).toContain(a);
					expect(m.getAmbiguousMatches()).toContain(c);
					expect(m.getAmbiguousMatches()).not.toContain(u);
				});

			});		
		});

	});
    	
	//Testing classes in the teselagen/bio/sequence/common
	describe("Testing 'common' classes", function(){

		//Testing classes in the teselagen/bio/sequence/common/Annotation.js (WIP)
		describe("Annotation test", function(){
			var annotation;
			var annotationTest;
			var locations = [];
			var location1;
			var location2;
			var location3;
			
			beforeEach(function(){
				annotation = Ext.create("Teselagen.bio.sequence.common.Annotation", {
					start: 1,
					end: 1
				});

				annotationTest = Ext.create("Teselagen.bio.sequence.common.Annotation", {
					start: null,
					end: null
				});

				location1 = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 10,
					end: 20
				});

				location2 = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 30,
					end: 40
				});

				location3 = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 50,
					end: 60
				});

				locations.push(location1);
				locations.push(location2);
				locations.push(location3);

				annotationTest.setLocations(locations);


				
				this.addMatchers({
					//Test that locations are equal to each other
					equalLocation: function(expected){
						var equal;
						return ( (expected.getStart() === this.actual.getStart() ) && ( expected.getEnd() === this.actual.getStart() ) );
					}
				});
			});

			afterEach(function(){
				//resets locations
				locations = [];
				annotationTest.setLocations(locations);
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

			it(".contains() works!", function(){
				
				
				var baseAnnotation = Ext.create("Teselagen.bio.sequence.common.Annotation", {
					start: 4,
					end: 6
				});

				var containsAnnotation = Ext.create("Teselagen.bio.sequence.common.Annotation", {
					start:5,
					end: 5
				});
				//base annotation start:4
				//base annotation end: 6
				
				//case 1
				//annotation start <= annotation end
					//case 1a
					//contains annotaiton start < annotation end
						//case 1a result true
						//base annotation start:4 < annotation start 5 && base annotation end: 6 > annotation end: 5
						expect(baseAnnotation.contains(containsAnnotation)).toBe(true);
						//case 1a result false
						
						containsAnnotation.setOneStart(3);
						containsAnnotation.setOneEnd(5);
						//base annotation start:4 < annotation start 5 && base annotation end: 6 > annotation end: 7
						expect(baseAnnotation.contains(containsAnnotation)).toBe(false);
					
				baseAnnotation.setOneStart(8);
				console.log(baseAnnotation.getStart());
				baseAnnotation.setOneEnd(7);
				console.log(baseAnnotation.getEnd());
				//case 2: base annotaiton start > base annotation end
					containsAnnotation.setOneStart(6);
					console.log(containsAnnotation.getStart());
					containsAnnotation.setOneEnd(7);
					console.log(containsAnnotation.getEnd() <= baseAnnotation.getEnd());
					//2a: annotation start  < annotation end 
						//2a result true
						// annotation end <= base	annotation end || annotation start  >= base annotation start 
						expect(baseAnnotation.contains(containsAnnotation)).toBe(true);

						//2a result false
						// annotation end > base annotation end  || annotation start < base annotation start 
						containsAnnotation.setOneEnd(9);
						containsAnnotation.setOneStart(1);
						expect(baseAnnotation.contains(containsAnnotation)).toBe(false);

						//2b result true
						containsAnnotation.setOneEnd(1);
						containsAnnotation.setOneStart(9);
						expect(baseAnnotation.contains(containsAnnotation)).toBe(true);
			});


			
			it(".isMultiLocation() works!", function(){
				expect(annotation.isMultiLocation()).not.toBe(true);
				expect(annotationTest.isMultiLocation()).toBe(true);

			});

			//Extensive testing needed
			it(".shift() works!", function(){

				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 5,
					end: 5
				});
				annotation.setLocations([newLocation]);
				expect( function(){ annotation.shift(5, 1, true); } ).toThrow();
				

				var newLocation = Ext.create("Teselagen.bio.sequence.common.Location", {
					start: 5,
					end: 5
				});

				annotation.setLocations([newLocation]);
				annotation.shift(6, 100, false);
				var returnedLocations = annotation.getLocations();
				console.log(returnedLocations[0].getStart());
				expect(returnedLocations[0].getStart()).toEqual(6);

			});
		
			describe("Testing deleteAt", function(){

				it(".deleteAt() Before First", function(){
					annotationTest.deleteAt(-10, 5, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(5);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(15);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(25);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(35);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(45);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(55);


				});

				it(".deleteAt() Front Part First", function(){
					annotationTest.deleteAt(10, 5, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(15);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(25);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(35);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(45);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(55);
				});

				it(".deleteAt() Middle Part First", function(){
					annotationTest.deleteAt(12, 5, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(15);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(25);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(35);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(45);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(55);
				});

				it(".deleteAt() First and Gap", function(){
					annotationTest.deleteAt(10, 15, 100, false);
					expect(annotationTest.getLocations().length).toEqual(2);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(25);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(35);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(45);
				});

				it(".deleteAt() EndFirst", function(){
					annotationTest.deleteAt(15, 5, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(15);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(25);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(35);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(45);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(55);
				});

				it(".deleteAt() EndFirstPartGap", function(){
					annotationTest.deleteAt(15, 10, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(15);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(20);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(30);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(40);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(50);
				});

				it("testDeleteAtWithinGap", function(){
					annotationTest.deleteAt(22, 5, 100, false);
					expect(annotationTest.getLocations().length).toEqual(3);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(20);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(25);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(35);

					expect(annotationTest.getLocations()[2].getStart()).toEqual(45);
					expect(annotationTest.getLocations()[2].getEnd()).toEqual(55);
				});

				it("testDeleteAtPartialFirstSecond", function(){
					annotationTest.deleteAt(15, 20, 100, false);
					expect(annotationTest.getLocations().length).toEqual(2);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(20);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(30);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(40);

				});

				it("testDeleteAtSecondPartialThird", function(){
					annotationTest.deleteAt(15, 20, 100, false);
					expect(annotationTest.getLocations().length).toEqual(2);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(20);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(30);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(40);

				});

				it("testDeleteAtGapEnd", function(){
					annotationTest.deleteAt(45, 15, 100, false);
					expect(annotationTest.getLocations().length).toEqual(2);
					expect(annotationTest.getLocations()[0].getStart()).toEqual(10);
					expect(annotationTest.getLocations()[0].getEnd()).toEqual(20);

					expect(annotationTest.getLocations()[1].getStart()).toEqual(30);
					expect(annotationTest.getLocations()[1].getEnd()).toEqual(45);
				});
			});

			 
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
		describe("StrandType tests", function(){
			it("StrandTypes work", function(){

				waitsFor(function() {
					return Teselagen.bio.sequence.common.StrandType != undefined;
				});
				expect(Teselagen.bio.sequence.common.StrandType.FORWARD).toEqual(1);
				expect(Teselagen.bio.sequence.common.StrandType.BACKWARD).toEqual(-1);
				expect(Teselagen.bio.sequence.common.StrandType.UNKNOWN).toEqual(0);
			});
		})



		//SymbolList tests commeted out until 'alphabets' classes are completed.
		/*
		describe("SymbolList tests", function(){
			var symbolList;
			var testSymbol0 = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
				name: "testName0",
				value: "testValue0"
			});

			var testSymbol1 = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
				name: "testName1",
				value: "testValue1"
			});

			var testSymbol2 = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
				name: "testName2",
				value: "testValue2"
			});

			var testAlphabet = Ext.create("Teselagen.bio.sequence.alphabets.AbstractAlphabet");

			beforeEach(function(){

				symbolList = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
					symbols: [testSymbol0],
					alphabet: [testAlphabet]
				});

				this.addMatchers({
					//Test that alphabets are equal to each other
					toEqualAlphabet: function(expected){
						return ( (expected.getGap() === this.actual.getGap() ) && ( expected.getSymbols() === this.actual.getSymbols() ) );
					}
				});

			});

			it(".getAlphabet works?", function(){
				expect(symbolList.getAlphabet()).toEqualAlphabet(testAlphabet);

			});
			
			it(".setAlphabet works", function(){
				symbolList.setAlphabet([testAlphabet]);
				symbolList.getAlphabet().forEach( function(element){
					expect(testAlphabet).toContain(element);
				});
				
			});

			it(".getSymbols works?", function(){

				expect(symbolList.getSymbols()).toMatch([testSymbol0]);
			});

			it(".setSymbols works?", function(){
				symbolList.setSymbols([testSymbol1]);
				expect(symbolList.getSymbols()).toMatch([testSymbol1]);
			});
			
			it(".getSymbolsLength works", function(){
				expect(symbolList.getSymbolsLength()).toEqual(1);

			});

			it(".symbolAt works?", function(){
				expect(symbolList.symbolAt(0)).toMatch(testSymbol0);

			});
			
			//Implement alphabet!
			it(".hasGap works", function(){
				expect(testAlphabet.hasGap()).toBeTruthy();
			});


			it(".subList works?", function(){
				symbolList.setSymbols(["testset", "test1", "test2"]);
				var subListTest = symbolList.subList(0, 2);
				expect(subListTest.getSymbols()).toEqual(["testset", "test1"]);
			});
			
			//ponder this function some more
			it(".seqString works", function(){


			});

			it(".clear works?", function(){
				symbolList.clear();
				expect(symbolList.getSymbols()).toMatch([]);

			});
			
			it(".addSymbols works", function(){
				symbolList.addSymbols(["test1", "test2"]);
				expect(symbolList.getSymbols()).toEqual(["test", "test1", "test2"])

			});

			it(".deleteSymbols works?", function(){
				symbolList.setSymbols(["testset", "test1", "test2"]);
				symbolList.deleteSymbols(0, 3);
				expect(symbolList.getSymbols()).toMatch([]);
			});
			
			it(".insertSymbols works", function(){
				symbolList.insertSymbols(0, ["test3"]);
				expect(symbolList.getSymbols()).toContain(["test3"]);

			});

			it(".toString works", function(){
				expect(symbolList.toString()).toEqual("");

			});
		});*/
	});

	describe("Testing 'dna' classes", function(){

		describe("Testing 'DigestionFragment.js", function(){

			describe("", function(){

			});


			describe("", function(){

			});

			describe("", function(){

			});
			describe("", function(){

			});

			describe("", function(){

			});

			describe("", function(){

			});

			describe("", function(){

			});

			describe("", function(){

			});

			describe("", function(){

			});


		});


		describe("Testing 'DNASequence.js", function(){

			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
		});


		describe("Testing 'Feature.js", function(){
			describe("it exists?", function(){

			});

			describe(".getName()", function(){

			});


			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
			describe("", function(){

			});
		});


		describe("Testing 'FeatureNote.js", function(){
			describe("", function(){

			});
		});


		describe("Testing 'RichDNASequence.js", function(){
			describe("", function(){

			});
		});
	});

	//Teselagen.bio.sequence.symbol Tests
	describe("Testing 'symbol' classes", function(){

		//Teselagen.bio.sequence.symbol.AminoAcidSymbol Tests
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

		//GapSymbol tests
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

		//NucleotideSymbol tests
		describe("NucleotideSymbol tests", function(){
			var nucleotideSymbol;
			var a =  Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
			var c = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Cytosine", value: "c", ambiguousMatches: []});
			var ambiguousMatchesData =[a];
			beforeEach(function(){
				nucleotideSymbol =  Ext.create('Teselagen.bio.sequence.symbols.NucleotideSymbol', {
					name: "Test",
					value: "t",
					ambiguousMatches: ambiguousMatchesData
				});
			});
			it("Exists?", function(){
				
				expect(nucleotideSymbol).toBeDefined();
			});

			it(".getName() functions correctly", function(){
				var test= "test";

				expect(nucleotideSymbol.getName()).toEqual("Test");
			});

			it(".setName() functions correctly", function(){
				nucleotideSymbol.setName("changed");
				expect(nucleotideSymbol.getName()).toEqual("changed");
			});


			it(".getValue() functions correctly", function(){
				expect(nucleotideSymbol.getValue()).toEqual("t");
			});

			it(".setValue()) functions correctly", function(){
				nucleotideSymbol.setValue("changed");
				expect(nucleotideSymbol.getValue()).toEqual("changed");
			});

			it(".getAmbiguousMatches() functions correctly", function(){
				expect(nucleotideSymbol.getAmbiguousMatches()[0].getName()).toEqual(a.getName());
			});

			it(".setAmbiguousMatches()) functions correctly", function(){
				nucleotideSymbol.setAmbiguousMatches([c]);
				expect(nucleotideSymbol.getAmbiguousMatches()[0].getName()).toEqual(c.getName());
			});
		});
	});

	describe("Testing DNATools.js", function(){

			describe("createDNA", function(){

			});

			describe("createDNASequence", function(){

			});

			describe("complementSymbol", function(){

			});

			describe("complement", function(){

			});

			describe("reverseComplement", function(){

			});
	});

	describe("Testing TranslationUtils.js", function(){

			describe("dnaToRNASymbol", function(){

			});

			describe("rnaToDNASymbol", function(){

			});

			describe("dnaToRNA", function(){

			});

			describe("rnaToDNA", function(){

			});

			describe("rnaToProteinSymbol", function(){

			});

			describe("dnaToProteinSymbol", function(){

			});

			describe("rnaToProtein", function(){

			});

			describe("isStartCodon", function(){

			});

			describe("isStopCodon", function(){

			});
	});
});