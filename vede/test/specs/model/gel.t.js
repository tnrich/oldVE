/*
 * @author Yuri Bendana, Doug Hershberger
 */
/*global describe, it, expect*/

Ext.require(["Teselagen.models.digest.Gel",
    "Teselagen.models.digest.GelLane",
    "Teselagen.models.digest.GelBand",
    "Teselagen.models.digest.Ladder",
    "Teselagen.bio.sequence.DNATools",
    "Teselagen.bio.enzymes.RestrictionEnzymeManager"]);

Ext.onReady(function() {
    var digestedSequence = null;
    var puc = "agcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgagcgcaacgcaattaatgtgagttagctcactcattaggcaccccaggctttacactttatgcttccggctcgtatgttgtgtggaattgtgagcggataacaatttcacacaggaaacagctatgaccatgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtcgttttacaacgtcgtgactgggaaaaccctggcgttacccaacttaatcgccttgcagcacatccccctttcgccagctggcgtaatagcgaagaggcccgcaccgatcgcccttcccaacagttgcgcagcctgaatggcgaatggcgcctgatgcggtattttctccttacgcatctgtgcggtatttcacaccgcatacgtcaaagcaaccatagtacgcgccctgtagcggcgcattaagcgcggcgggtgtggtggttacgcgcagcgtgaccgctacacttgccagcgccctagcgcccgctcctttcgctttcttcccttcctttctcgccacgttcgccggctttccccgtcaagctctaaatcgggggctccctttagggttccgatttagtgctttacggcacctcgaccccaaaaaacttgatttgggtgatggttcacgtagtgggccatcgccctgatagacggtttttcgccctttgacgttggagtccacgttctttaatagtggactcttgttccaaactggaacaacactcaaccctatctcgggctattcttttgatttataagggattttgccgatttcggcctattggttaaaaaatgagctgatttaacaaaaatttaacgcgaattttaacaaaatattaacgtttacaattttatggtgcactctcagtacaatctgctctgatgccgcatagttaagccagccccgacacccgccaacacccgctgacgcgccctgacgggcttgtctgctcccggcatccgcttacagacaagctgtgaccgtctccgggagctgcatgtgtcagaggttttcaccgtcatcaccgaaacgcgcgagacgaaagggcctcgtgatacgcctatttttataggttaatgtcatgataataatggtttcttagacgtcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtatgagtattcaacatttccgtgtcgcccttattcccttttttgcggcattttgccttcctgtttttgctcacccagaaacgctggtgaaagtaaaagatgctgaagatcagttgggtgcacgagtgggttacatcgaactggatctcaacagcggtaagatccttgagagttttcgccccgaagaacgttttccaatgatgagcacttttaaagttctgctatgtggcgcggtattatcccgtattgacgccgggcaagagcaactcggtcgccgcatacactattctcagaatgacttggttgagtactcaccagtcacagaaaagcatcttacggatggcatgacagtaagagaattatgcagtgctgccataaccatgagtgataacactgcggccaacttacttctgacaacgatcggaggaccgaaggagctaaccgcttttttgcacaacatgggggatcatgtaactcgccttgatcgttgggaaccggagctgaatgaagccataccaaacgacgagcgtgacaccacgatgcctgtagcaatggcaacaacgttgcgcaaactattaactggcgaactacttactctagcttcccggcaacaattaatagactggatggaggcggataaagttgcaggaccacttctgcgctcggcccttccggctggctggtttattgctgataaatctggagccggtgagcgtgggtctcgcggtatcattgcagcactggggccagatggtaagccctcccgtatcgtagttatctacacgacggggagtcaggcaactatggatgaacgaaatagacagatcgctgagataggtgcctcactgattaagcattggtaactgtcagaccaagtttactcatatatactttagattgatttaaaacttcatttttaatttaaaaggatctaggtgaagatcctttttgataatctcatgaccaaaatcccttaacgtgagttttcgttccactgagcgtcagaccccgtagaaaagatcaaaggatcttcttgagatcctttttttctgcgcgtaatctgctgcttgcaaacaaaaaaaccaccgctaccagcggtggtttgtttgccggatcaagagctaccaactctttttccgaaggtaactggcttcagcagagcgcagataccaaatactgtccttctagtgtagccgtagttaggccaccacttcaagaactctgtagcaccgcctacatacctcgctctgctaatcctgttaccagtggctgctgccagtggcgataagtcgtgtcttaccgggttggactcaagacgatagttaccggataaggcgcagcggtcgggctgaacggggggttcgtgcacacagcccagcttggagcgaacgacctacaccgaactgagatacctacagcgtgagctatgagaaagcgccacgcttcccgaagggagaaaggcggacaggtatccggtaagcggcagggtcggaacaggagagcgcacgagggagcttccagggggaaacgcctggtatctttatagtcctgtcgggtttcgccacctctgacttgagcgtcgatttttgtgatgctcgtcaggggggcggagcctatggaaaaacgccagcaacgcggcctttttacggttcctggccttttgctggccttttgctcacatgttctttcctgcgttatcccctgattctgtggataaccgtattaccgcctttgagtgagctgataccgctcgccgcagccgaacgaccgagcgcagcgagtcagtgagcgaggaagcggaag";
//  var puc119 = "agcgcccaatacgcaaaccgcctctccc";
    var enzymes = [];
    var Ladder = Teselagen.models.digest.Ladder;
    digestedSequence = Teselagen.bio.sequence.DNATools.createDNASequence("pUC119", puc);
    digestedSequence.setCircular(true);
    var testEnzymes = ["EcoRI", "BamHI"];
//  This array contains the actual RestrictionEnzyme datastructures.
    for (var i=0; i < testEnzymes.length; i++){
        enzymes.push(Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(testEnzymes[i]));
    }
    describe("Gel testing", function() {
        describe("Can create, insert and retrieve lanes.", function() {
            it("loads the testGel", function() {
                var testGel = Ext.create("Teselagen.models.digest.Gel", {name: "testGel"});
                expect(testGel).to.be.defined;
                testGel.clearLanes();
            });
            it("Creates a new lane for the gel.", function() {
                var testGel1 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel1"});
                testGel1.createLane("Ladder");
                expect(testGel1.getLanes()[0]).to.be.defined;
                testGel1.clearLanes();
            });
            it("Inserts new lanes properly.", function() {
                var testGel2 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel2"});
//              var testGel2 = new Teselagen.models.digest.Gel({name: "testGel2"});
                for (var i=1;i<=5;i++) {
                    testGel2.createLane("Test" + i);
                }
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA"});
                testGel2.insertLane(newLane, 2);
                expect(testGel2.getLanes()[2].getName()).to.equal("TestA");
//              step = 1;
            });
            it("Retrieves lanes from the gel by name.", function() {
                var testGel3 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel3"});
                testGel3.createLane("Sample");
                var sample = testGel3.getLane("Sample");
                expect(sample).to.be.defined;
            });
        });
        describe("Can create lanes from various inputs", function() {
            var testGel4 = Ext.create("Teselagen.models.digest.Gel", {name: "testGel4"});
            it("Creates a lane based on a ladder as input.", function() {
                //var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: Ladder.KB_LADDER_BANDS});
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestLadder", ladder: Ladder.BP_LADDER_BANDS});
                expect(newLane).to.be.defined;
                //expect(newLane.getBands()[0].getSize()).toBe(3000);
                //expect(newLane.getBands()[13].getSize()).toBe(100);
                expect(newLane.getBands()[0].getSize()).to.equal(20000);
                expect(newLane.getBands()[14].getSize()).to.equal(75);
                testGel4.insertLane(newLane);
            });
            it("Creates a lane based on a sequence and enzymes as input.", function() {
                var newLane = Ext.create("Teselagen.models.digest.GelLane", {name: "TestA", sequence: digestedSequence, enzymes: enzymes});
                newLane.refreshDigestion();
                expect(newLane).to.be.defined;
                expect(newLane.getBands()[0].getSize()).to.equal(27);
                expect(newLane.getBands()[1].getSize()).to.equal(3147);
                expect(newLane.getMin()).to.equal(27);
                expect(newLane.getMax()).to.equal(3147);
                testGel4.insertLane(newLane);
            });
            it("Pulls Max and Min from all of the fragments available.", function() {
                expect(testGel4).to.be.defined;
                expect(testGel4.getMin()).to.equal(27);
                expect(testGel4.getMax()).to.equal(20000);
            });
        });
    });
});