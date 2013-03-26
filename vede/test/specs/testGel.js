/*
 * @author Doug Hershberger
 */


Ext.require("Ext.app.Application");
Ext.require("Teselagen.models.digest.Gel");
Ext.require("Teselagen.models.digest.GelLane");
Ext.require("Teselagen.models.digest.GelBand");
Ext.require("Teselagen.bio.sequence.DNATools");
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");

var Application = null, ctlr = null, store = null, digestedSequence = null;
var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
//var puc119 = "agcgcccaatacgcaaaccgcctctccc";
var temp = 0;
var step = 0;
var ladderDefs = null;
var oRE = null;
var enzymes = [];

Ext.onReady(function() {
	digestedSequence = Teselagen.bio.sequence.DNATools.createDNASequence("pUC119", puc);
	digestedSequence.setCircular(true);
	var testEnzymes = ["EcoRI", "BamHI"];
	//This array contains the actual RestrictionEnzyme datastructures.
	for (var enzyme in testEnzymes){
		var temp = testEnzymes[enzyme];
	    enzymes.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(testEnzymes[enzyme]));
	};
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
				Ladder = Teselagen.models.digest.Ladder;
			});
		});
		describe("Basic Assumptions", function() {
	
		    it("Has ExtJS4 loaded.", function() {
		        expect(Ext).toBeDefined();
		        expect(Ext.getVersion()).toBeTruthy();
		        expect(Ext.getVersion().major).toEqual(4);
		    });
	
		    it("Has loaded Vede code.",function(){
		        expect(Vede).toBeDefined();
		    });
		});
		describe("Can create, insert and retrieve lanes.", function() {
            it("loads the testGel", function() {
				var testGel = Ext.create("Teselagen.models.digest.Gel", {name: "testGel"});
                expect(testGel).toBeDefined();
                testGel.clearLanes();
            });
            it("Creates a new lane for the gel.", function() {
				var testGel1 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel1"});
                testGel1.createLane("Ladder");
                expect(testGel1.getLanes()[0]).toBeDefined();
                testGel1.clearLanes();
            });
            it("Inserts new lanes properly.", function() {
				var testGel2 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel2"});
				//var testGel2 = new Teselagen.models.digest.Gel({name: "testGel2"});
                for (var i=1;i<=5;i++) {
                    testGel2.createLane("Test" + i);
                }
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA"});
                testGel2.insertLane(newLane, 2);
                expect(testGel2.getLanes()[2].getName()).toBe("TestA");
//                step = 1;
            });
        	it("Retrieves lanes from the gel by name.", function() {
				var testGel3 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel3"});
        		testGel3.createLane("Sample");
        		var sample = testGel3.getLane("Sample");
        		expect(sample).toBeDefined();
        	});
		});
        describe("Can create lanes from various inputs", function() {
			var testGel4 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel4"});
        	it("Creates a lane based on a ladder as input.", function() {
                //var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: Ladder.KB_LADDER_BANDS});
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: Ladder.BP_LADDER_BANDS});
        		expect(newLane).toBeDefined();
        		//expect(newLane.getBands()[0].getSize()).toBe(3000);
        		//expect(newLane.getBands()[13].getSize()).toBe(100);
        		expect(newLane.getBands()[0].getSize()).toBe(20000);
        		expect(newLane.getBands()[14].getSize()).toBe(75);
        		testGel4.insertLane(newLane);
        	});
        	it("Creates a lane based on a sequence and enzymes as input.", function() {
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA", sequence: digestedSequence, enzymes: enzymes});
                newLane.refreshDigestion();
        		expect(newLane).toBeDefined();
        		expect(newLane.getBands()[0].getSize()).toBe(27);
        		expect(newLane.getBands()[1].getSize()).toBe(3147);
        		expect(newLane.getMin()).toBe(27);
        		expect(newLane.getMax()).toBe(3147);
        		testGel4.insertLane(newLane);
        	});
        	it("Pulls Max and Min from all of the fragments available.", function() {
        		expect(testGel4).toBeDefined();
        		expect(testGel4.getMin()).toBe(27);
        		expect(testGel4.getMax()).toBe(20000);
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


//just for testing
//var digestedSequence = null;
//var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
//var enzymes = [];
//
//var Ladder = Teselagen.models.digest.Ladder;
//digestedSequence = Teselagen.bio.sequence.DNATools.createDNASequence("pUC119", puc);
//digestedSequence.setCircular(true);
//var testEnzymes = ["EcoRI", "BamHI"];
////This array contains the actual RestrictionEnzyme datastructures.
//for (var enzyme in testEnzymes){
//	var temp = testEnzymes[enzyme];
//	enzymes.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(testEnzymes[enzyme]));
//};
//just for testing