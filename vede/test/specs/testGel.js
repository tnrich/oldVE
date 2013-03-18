/*
 * @author Doug Hershberger
 */


Ext.require("Ext.app.Application");
//Ext.require("Teselagen.bio.sequence.DNATools");

var Application = null, ctlr = null, store = null, oDestinationDNA = null;
//var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
//var puc119 = "agcgcccaatacgcaaaccgcctctccc";
var temp = 0;

Ext.onReady(function() {
    var testGel = null;
	describe("Gel testing", function() {
		beforeEach(function(){
			waitsFor( function(){
					return (Vede.app !== null); 
				},
				"Vede never loaded",
				400
			);
			runs( function(){
				Application = Vede.app;
				testGel = Ext.create("Teselagen.models.digest.Gel", {});
			});
			//oDestinationDNA = Teselagen.bio.sequence.DNATools.createDNA(puc);
		});
		describe("Basic Assumptions", function() {
	
		    it("has ExtJS4 loaded", function() {
		        expect(Ext).toBeDefined();
		        expect(Ext.getVersion()).toBeTruthy();
		        expect(Ext.getVersion().major).toEqual(4);
		    });
	
		    it("has loaded Vede code",function(){
		        expect(Vede).toBeDefined();
		    });
		});
		describe("Initializes objects to be tested", function() {
            it("loads the testGel", function() {
                expect(testGel).toBeDefined();
            });
            it("Creates a new lane for the gel", function() {
                testGel.createLane("Ladder");
                expect(testGel.getLanes()[0]).toBeDefined();
            });
            it("inserts new lanes properly", function() {
                testGel.clearLanes();
                for (var i=1;i<=5;i++) {
                    testGel.createLane("Test" + i);
                }
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA"});
                testGel.insertLane(newLane, 2);
                expect(testGel.getLanes()[2].getName()).toBe("TestA");
            });
		});
        describe("Can create objects from the requesite parts", function() {
            it("loads the testGel", function() {
                testGel.createLane("Sample");
                var sample = testGel.getlane("Sample");
                expect(sample).toBeDefined();
            });
        });
	});
});

//function makeEnzymeList(enzymeNameArray) {
//    var oEnzymeArray = [];
//    for (var i = 0; i < enzymeNameArray.length; ++i){
//        oEnzymeArray.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(enzymeNameArray[i]));
//    }
//    return oEnzymeArray;
//}