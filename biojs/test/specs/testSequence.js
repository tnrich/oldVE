/* 
 * @author Micah Lerner
 */

//Testing BioException class

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandType");
Ext.require("Teselagen.bio.sequence.DNATools");
Ext.require("Teselagen.bio.sequence.TranslationUtils");
Ext.onReady(function() {
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
    });

    describe("Testing BioException", function(){


        it("Raising exception", function() {
            //This stops all your tests!
            //Teselagen.bio.BioException.raise("This fails a test because it actually works!");
        });

        it("Catch thrown exception", function() {
            var bioException = Ext.create("Teselagen.bio.BioException", {
                message: "BioException message!",
            });
            try {
                throw bioException;
            }
            catch(pE) {
                flag = true;
                console.warn("Caught:" + pE.message);
            }
            expect(flag).toBe(true);
        });

    });

    //  Testing classes in the teselagen/bio/sequence/
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
                    expect(returned.length).toBe(1);
                });

                it("addSymbol", function(){
                    var m = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {
                        name: "Ambiguous {'a' or 'c;'}" , value: "m", ambiguousMatches: []});
                    abstractAlphabet.addSymbol(m);
                    expect(abstractAlphabet.getSymbols()[1].getName()).toMatch(m.getValue());
                });

                it("symbolByValue works", function(){
                    var symbolByValue = abstractAlphabet.symbolByValue("-");

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

                it("DNAAlphabet.symbolByValue()", function() {
                    console.log(Teselagen.bio.sequence.alphabets.DNAAlphabet.symbolByValue("a"));
                    var symA = Teselagen.bio.sequence.alphabets.DNAAlphabet.symbolByValue("a").getValue();
                    expect(symA).toBe("a");
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
                        expect(histidine.getValue()).toBe("H");
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
                    // annotation end <= base   annotation end || annotation start  >= base annotation start 
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

                    annotationTest.setLocations([newLocation]);
                    annotationTest.shift(1, 100, false);
                    var returnedLocations = annotationTest.getLocations();
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

                    it(".deleteAt() First and Gap <-- SOURCE OF BUG IN SequenceManager? -DW", function(){
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
            describe("SymbolList tests", function(){
                var symbolList;
                var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 
                var symbols = [a, g, u];
                beforeEach(function(){

                    symbolList = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: symbols,
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
                    });


                });

                it(".getAlphabet works?", function(){
                    expect(symbolList.getAlphabet()).toEqual("Teselagen.bio.sequence.alphabets.DNAAlphabet");

                });

                it(".setAlphabet works", function(){
                    symbolList.setAlphabet("test");
                    expect(symbolList.getAlphabet()).toEqual("test");

                });

                it(".getSymbols works?", function(){
                    symbolList.getSymbols().forEach(function(element){

                        expect(symbolList.getSymbols()).toContain(element);

                    });
                });

                it(".setSymbols works?", function(){
                    symbolList.setSymbols(a);
                    expect(symbolList.getSymbols()).toMatch(a);
                });

                it(".getSymbolsLength works", function(){
                    expect(symbolList.getSymbolsLength()).toEqual(3);

                });

                it(".symbolAt works?", function(){
                    expect(symbolList.symbolAt(0)).toMatch(a);
                    expect(symbolList.symbolAt(1)).toMatch(g);
                    expect(symbolList.symbolAt(2)).toMatch(u);

                });

                it(".hasGap works", function(){
                    expect(symbolList.hasGap()).toBe(false);
                    var testGap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol",{name: "Gap", value:"-"});
                    symbolList.setSymbols([testGap]);

                    expect(symbolList.hasGap()).toBe(true);
                });


                it(".subList works?", function(){
                    symbolList.setSymbols(["testset", "test1", "test2"]);
                    var subListTest = symbolList.subList(0, 2);
                    expect(subListTest.getSymbols()).toEqual(["testset", "test1"]);
                });

                it(".seqString works", function(){
                    expect(symbolList.seqString()).toMatch("agu");
                });

                it(".clear works?", function(){
                    symbolList.clear();
                    expect(symbolList.getSymbols()).toMatch([]);
                });

                it(".addSymbols works", function(){
                    symbolList.addSymbols(["test1", "test2"]);
                    expect(symbolList.getSymbols()[3]).toEqual("test1");
                    expect(symbolList.getSymbols()[4]).toEqual("test2");
                });

                it(".deleteSymbols works?", function(){
                    symbolList.setSymbols(["testset", "test1", "test2"]);
                    symbolList.deleteSymbols(0, 3);
                    expect(symbolList.getSymbols()).toMatch([]);
                });

                it(".insertSymbols works", function(){
                    symbolList.insertSymbols(1, ["test3"]);
                    expect(symbolList.getSymbols()).toContain("test3");
                    console.log(symbolList.getSymbols()[1]);

                    console.log(symbolList.getSymbols());
                    symbolList.insertSymbols(2, ["test3", "test4"]);
                    console.log(symbolList.getSymbols()[2]);
                    console.log(symbolList.getSymbols()[3]);

                });

                it(".toString works", function(){
                    symbolList.setSymbols(symbols);
                    expect(symbolList.toString()).toEqual("agu");
                });
            });
        });
        describe("Testing 'dna' classes", function(){

            describe("Testing 'DigestionFragment.js", function(){

                var testObj; 
                beforeEach(function(){
                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });

                });

                it(".getStart", function(){

                    expect(testObj.getStart()).toEqual(1);
                });


                describe(".setStart", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    testObj.setStart(5);
                    expect(testObj.getStart()).toEqual(5);
                });

                describe("getEnd", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    expect(testObj.getEnd()).toEqual(1);

                });
                describe("setEnd", function(){


                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    testObj.setEnd(5);
                    expect(testObj.getEnd()).toEqual(5);
                });

                describe("getLength", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    expect(testObj.getLength()).toEqual(1);
                });

                describe("setLenght", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    testObj.setLength(5);
                    expect(testObj.getLength()).toEqual(5);

                });

                describe("getStartRE", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    expect(testObj.getStartRE()).toMatch("Bam");
                });
                describe("setStartRE", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    testObj.setStartRE("TestRE");
                    expect(testObj.getStartRE()).toMatch("TestRE");
                });

                describe("getEndRE", function(){


                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    expect(testObj.getEndRE()).toMatch("Not");
                });

                describe("setEndRE", function(){

                    testObj = Ext.create("Teselagen.bio.sequence.dna.DigestionFragment",
                            {   start: 1,
                        end: 1,
                        length: 1,
                        startRE: "Bam",
                        endRE: "Not"
                            });
                    testObj.setEndRE("TestRE");
                    expect(testObj.getEndRE()).toMatch("TestRE");
                });


            });


            describe("Testing 'DNASequence.js", function(){

                describe("getters and setters function correctly", function(){
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var symbolList = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: [a],
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"});
                    var testDNA = Ext.create("Teselagen.bio.sequence.dna.DNASequence", 
                            {
                        symbolList: symbolList,
                        name: "Test",
                        circular: true,
                        accession: 1,
                        version: 1.0,
                        seqVersion: 5.0,
                            });

                    expect(testDNA.getAccession()).toEqual(1);
                    testDNA.setAccession(2);
                    expect(testDNA.getAccession()).toEqual(2);

                    expect(testDNA.getVersion()).toEqual(1.0);
                    testDNA.setVersion(2.0);
                    expect(testDNA.getVersion()).toEqual(2.0);

                    expect(testDNA.getSeqVersion()).toEqual(5.0);
                    testDNA.setSeqVersion(2.0);
                    expect(testDNA.getSeqVersion()).toEqual(2.0);

                    expect(testDNA.getCircular()).toBe(true);
                    testDNA.setCircular(false);
                    expect(testDNA.getCircular()).toBe(false);

                });
            });


            describe("Testing 'Feature.js", function(){
                var testFeature = Ext.create("Teselagen.bio.sequence.dna.Feature", 
                        {
                    name: "Test",
                    start: 1,
                    end: 1,
                    type: "DNA",
                    strand: 1,
                    notes: ["Dummy Notes"]
                        });
                it("it exists?", function(){
                    expect(testFeature).toBeDefined();
                });

                it(".get{ters} and set{ters} work", function(){
                    expect(testFeature.getName()).toMatch("Test");
                    testFeature.setName("Changed");
                    expect(testFeature.getName()).toMatch("Changed");

                    expect(testFeature.getType()).toMatch("DNA");
                    testFeature.setType("RNA");
                    expect(testFeature.getType()).toMatch("RNA");

                    expect(testFeature.getNotes()).toMatch("Dummy Notes");
                    testFeature.setNotes(["Test notes"]);
                    expect(testFeature.getNotes()).toMatch("Test notes");

                });

                it(".clone()", function(){
                    var featureNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote",
                            {
                        name: "Test Note",
                        value: "value",
                        quoted: true
                            });
                    testFeature.setNotes([featureNote]);
                    testFeature.setName("Test");
                    var cloned = testFeature.clone();
                    expect(cloned.getName()).toBe("Test");
                });
            });


            describe("Testing 'FeatureNote.js", function(){
                var featureNote = Ext.create("Teselagen.bio.sequence.dna.FeatureNote",
                        {
                    name: "Test Note",
                    value: "value",
                    quoted: true
                        });
                describe("it exists?", function(){
                    expect(featureNote).toBeDefined();
                });

                describe("clone() works", function(){
                    var clonedFeatureNote = featureNote.clone();
                    expect(clonedFeatureNote.getName()).toMatch("Test Note");
                    expect(clonedFeatureNote.getValue()).toMatch("value");
                });

                describe("get{ters} and set{ters} works", function(){
                    expect(featureNote.getName()).toMatch("Test Note");
                    featureNote.setName("test");
                    expect(featureNote.getName()).toMatch("test");

                    expect(featureNote.getValue()).toMatch("value");
                    featureNote.setValue("test");
                    expect(featureNote.getValue()).toMatch("test");

                    expect(featureNote.getQuoted()).toMatch(true);
                    featureNote.setValue(false);
                    expect(featureNote.getValue()).toMatch(false);
                });
            });


            describe("Testing 'RichDNASequence.js", function(){
                describe("it exists?", function(){

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

            it(".createDNA()) functions correctly", function(){
                waitsFor(function() {
                    return Teselagen.bio.sequence.DNATools != undefined;
                });

                runs(function() {   

                    var dna = Teselagen.bio.sequence.DNATools.createDNA("a");
                    expect(dna.getSymbols()[0].getName()).toEqual("Adenine")
                });

            });

            describe("createDNASequence", function(){
                waitsFor(function() {
                    return Teselagen.bio.sequence.DNATools != undefined;
                });

                runs(function() {   

                    var dna = Teselagen.bio.sequence.DNATools.createDNASequence("Test Sequence", "a");
                    expect(dna.getSymbols()[0].getName()).toEqual("Adenine")
                }); 
            });

            describe("complementSymbol", function(){
                waitsFor(function() {
                    return Teselagen.bio.sequence.DNATools != undefined;
                });

                runs(function() {   
                    var pSymbol = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var complementSymbol = Teselagen.bio.sequence.DNATools.complementSymbol(pSymbol);
                    expect(complementSymbol.getName()).toEqual("Thymine");
                }); 
            });

            describe("complement", function(){

                waitsFor(function() {
                    return Teselagen.bio.sequence.DNATools != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var testSymbolList = [a, g];
                    var inputSymbols = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: testSymbolList,
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
                    });
                    var complement = Teselagen.bio.sequence.DNATools.complement(inputSymbols);
                    //console.log(complement.getSymbols()[0].getName());
                    expect(complement.getSymbols()[0].getName()).toMatch("Thymine");
                    expect(complement.getSymbols()[1].getName()).toMatch("Cytosine");
                }); 
            });
            describe("reverseComplement", function(){

                waitsFor(function() {
                    return Teselagen.bio.sequence.DNATools != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var testSymbolList = [a, g];
                    var inputSymbols = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: testSymbolList,
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"
                    });
                    var complement = Teselagen.bio.sequence.DNATools.reverseComplement(inputSymbols);
                    //console.log(complement.getSymbols()[0].getName());
                    expect(complement.getSymbols()[0].getName()).toMatch("Cytosine");
                    expect(complement.getSymbols()[1].getName()).toMatch("Thymine");
                }); 
            });
        });

        describe("Testing TranslationUtils.js", function(){

            describe("dnaToRNASymbol", function(){

                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });
                //Add additional test for thymine
                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var rnaSymbol = Teselagen.TranslationUtils.dnaToRNASymbol(a);
                    expect(rnaSymbol.getName()).toMatch(a.getName());
                    var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
                        name: "Gap",
                        value: "-"
                    });
                    var gapSymbol = Teselagen.TranslationUtils.dnaToRNASymbol(gap);
                    expect(gapSymbol.getName()).toBe(gap.getName());
                }); 

            });


            describe("rnaToDNASymbol", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 
                    var dnaSymbol = Teselagen.TranslationUtils.rnaToDNASymbol(u);
                    expect(dnaSymbol.getName()).toMatch("Thymine");
                    var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
                        name: "Gap",
                        value: "-"
                    });
                    var gapSymbol = Teselagen.TranslationUtils.rnaToDNASymbol(gap);
                    expect(gapSymbol.getName()).toBe(gap.getName());
                });

            });
            describe("dnaToRNA", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var t = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: []}); 
                    var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
                        name: "Gap",
                        value: "-"
                    });
                    var testSymbolList = [a, g, t, gap];
                    var inputSymbols = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: testSymbolList,
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"});

                    var rnaSequence = Teselagen.TranslationUtils.dnaToRNA(inputSymbols);
                    expect(rnaSequence.getAlphabet()).toMatch("Teselagen.bio.sequence.alphabets.RNAAlphabet");
                    expect(rnaSequence.getSymbols()[0].getName()).toBe("Adenine");
                    expect(rnaSequence.getSymbols()[1].getName()).toBe("Guanine");
                    expect(rnaSequence.getSymbols()[2].getName()).toBe("Uracil");
                    expect(rnaSequence.getSymbols()[3].getName()).toBe("Gap");



                });

            });
            describe("rnaToDNA", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 
                    var gap = Ext.create("Teselagen.bio.sequence.symbols.GapSymbol", {
                        name: "Gap",
                        value: "-"
                    });
                    var testSymbolList = [a, g, u, gap];
                    var inputSymbols = Ext.create("Teselagen.bio.sequence.common.SymbolList", {
                        symbols: testSymbolList,
                        alphabet: "Teselagen.bio.sequence.alphabets.DNAAlphabet"});

                    var rnaSequence = Teselagen.TranslationUtils.rnaToDNA(inputSymbols);
                    expect(rnaSequence.getAlphabet()).toMatch("Teselagen.bio.sequence.alphabets.DNAAlphabet");
                    expect(rnaSequence.getSymbols()[0].getName()).toMatch("Adenine");
                    expect(rnaSequence.getSymbols()[1].getName()).toMatch("Guanine");
                    expect(rnaSequence.getSymbols()[2].getName()).toMatch("Thymine");
                    expect(rnaSequence.getSymbols()[3].getName()).toBe("Gap");
                });
            });

            describe("rnaToProteinSymbol", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 

                    var aminoAcidSymbol = Teselagen.TranslationUtils.rnaToProteinSymbol(a, g, u);
                    expect(aminoAcidSymbol.getName()).toMatch("Serine");

                });
            });

            describe("dnaToProteinSymbol", function(){
                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var t = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Thymine", value: "t", ambiguousMatches: []}); 

                    var aminoAcidSymbol = Teselagen.TranslationUtils.dnaToProteinSymbol(a, g, t);
                    expect(aminoAcidSymbol.getName()).toMatch("Serine");

                });
            });

            describe("rnaToProtein", function(){

                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 

                    var aminoAcidSymbol = Teselagen.TranslationUtils.rnaToProteinSymbol(a, u, g);
                    expect(aminoAcidSymbol.getName()).toMatch("Methionine");

                });
            });

            describe("isStartCodon", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 

                    var isStartCodon = Teselagen.TranslationUtils.isStartCodon(a, u, g);
                    expect(isStartCodon).toBe(true);

                });
            });

            describe("isStopCodon", function(){


                waitsFor(function() {
                    return Teselagen.bio.sequence.TranslationUtils != undefined;
                });

                runs(function() {   
                    var a = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Adenine", value: "a" , ambiguousMatches: []});
                    var g = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Guanine", value: "g", ambiguousMatches: []});
                    var u = Ext.create("Teselagen.bio.sequence.symbols.NucleotideSymbol", {name: "Uracil", value: "u", ambiguousMatches: []}); 

                    var isStopCodon = Teselagen.TranslationUtils.isStopCodon(u, g, a);
                    expect(isStopCodon).toBe(true);

                });
            });
        });
    });
});
