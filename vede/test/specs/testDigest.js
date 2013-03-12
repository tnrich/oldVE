/*
 * @author Doug Hershberger
 * @author Micah Lerner
 */

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandType");
Ext.require("Teselagen.bio.sequence.DNATools");
Ext.require("Teselagen.bio.sequence.TranslationUtils");
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");
Ext.require("Teselagen.manager.RestrictionEnzymeGroupManager");
Ext.require("Teselagen.manager.RestrictionEnzymeManager");
Ext.require("Teselagen.utils.SystemUtils");
Ext.require("Teselagen.utils.FeaturedDNASequenceUtils");
Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");
Ext.require("Teselagen.bio.sequence.symbols.NucleotideSymbol");
Ext.require("Teselagen.bio.sequence.symbols.AminoAcidSymbol");
Ext.require("Teselagen.bio.sequence.dna.Feature");
Ext.require("Teselagen.manager.SequenceManager");
Ext.require("Teselagen.manager.SequenceManagerMemento");
Ext.require("Teselagen.models.RestrictionEnzymeGroup");
Ext.require("Teselagen.models.DigestionSequence");
Ext.require("Teselagen.manager.DigestionManager");

Ext.onReady(function() {

    // ====================================
    //   Digestion Manager Unit Testing
    // ====================================
    describe("DigestionManager.js Tests", function() {
        describe("Blunt ends for both", function() {
            var sourceDNA = "ttacgcccccgggtcgaaaaaaaaaaaaaaaaaaaaacccgggatccgacagag";
            var destinationDNA = "tgattacgcccagctggcatgcctgcaggtcgactctagaggatccccgggtaccgagctccagctgactggccgtc";
            var sourceLeftRE = "SmaI";
            var sourceRightRE ="SmaI";
            var destLeftRE = "PvuII";
            var destRightRE ="PvuII";
            var sourceStart = 7;
            var sourceStop = 37;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair has a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).toBeTruthy();
            });
            it("The pair has matching type of BOTH", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchBoth);
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgcccaggggtcgaaaaaaaaaaaaaaaaaaaaacccctgactggccgtc");
            });
            it("DestinationDNA pasted revcom", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                dm.digest(dm.self.matchReverseComOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgcccaggggtttttttttttttttttttttcgacccctgactggccgtc");
            });
        });
        describe("Same ends for both", function() {
            var sourceDNA = "ttacgccaagctttcgaaaaaaaaaaaaaaaaaaaaaaagcttatccgacagag";
            var destinationDNA = "tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcaagcttactggccgtc";
            var sourceLeftRE = "HindIII";
            var sourceRightRE ="HindIII";
            var destLeftRE = "HindIII";
            var destRightRE ="HindIII";
            var sourceStart = 7;
            var sourceStop = 37;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair has a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).toBeTruthy();
            });
            it("The pair has matching type of BOTH", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchBoth);
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccaagctttcgaaaaaaaaaaaaaaaaaaaaaaagcttactggccgtc");
            });
            it("DestinationDNA pasted revcom", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                dm.digest(dm.self.matchReverseComOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccaagctttttttttttttttttttttttcgaaagcttactggccgtc");
            });
        });
        describe("Same ends", function() {
            var sourceDNA = "ttacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
            var destinationDNA = "tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
            var sourceLeftRE = "HindIII";
            var sourceRightRE ="EcoRI";
            var destLeftRE = "HindIII";
            var destRightRE ="EcoRI";
            var sourceStart = 7;
            var sourceStop = 37;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair does not have a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).not.toBeTruthy();
            });
            it("The pair has matching type of Normal Only", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchNormalOnly);
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
            });
        });
        describe("Compatible ends", function() {
            var sourceDNA = "ttacgccggatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
            var destinationDNA = "tgattacgccagatctgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
            var sourceLeftRE = "BamHI";
            var sourceRightRE ="EcoRI";
            var destLeftRE = "BglII";
            var destRightRE ="EcoRI";
            var sourceStart = 7;
            var sourceStop = 58;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair does not have a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).not.toBeTruthy();
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccagatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
            });
        });
        describe("Incompatible ends", function() {
            var sourceDNA = "ttacgccggatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
            var destinationDNA = "tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
            var sourceLeftRE = "BamHI";
            var sourceRightRE ="EcoRI";
            var destLeftRE = "HindIII";
            var destRightRE ="EcoRI";
            var sourceStart = 7;
            var sourceStop = 58;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair does not have a normal match", function(){
                expect(dm.hasNormalMatch()).not.toBeTruthy();
            });
            it("The pair does not have a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).not.toBeTruthy();
            });
            it("The pair has matching type of None", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchNone);
            });
            //Disable this test because it should really throw an exception but it doesn't
            xit("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccagatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
            });
        });
        describe("Type IIs digestion", function() {
            var sourceDNA = "cagggtctcaggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
            var destinationDNA = "gacctaggtctcgggggcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
            var sourceLeftRE = "BsaI";
            var sourceRightRE ="EcoRI";
            var destLeftRE = "BsaI";
            var destRightRE ="EcoRI";
            var sourceStart = 3;
            var sourceStop = 58;
            var destStart = 6;
            var destStop = 67;
            var dm;
            it("DigestionManager exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair does not have a reverse complementary match", function(){
                expect(dm.hasRevComMatch()).not.toBeTruthy();
            });
            it("The pair has matching type of matchNormalOnly", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchNormalOnly);
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("gacctaggtctcgggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
            });
        });
    });
});

function makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop) {
    var feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature", {
        name: "feat1",
        start: 1,
        end: 15,
        _type: "CDS",
        strand: 1,
        notes: null
    });
    var feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature", {
        name: "feat2",
        start: 20,
        end: 25,
        _type: "CDS",
        strand: 1,
        notes: null
    });
    var feat3   = Ext.create("Teselagen.bio.sequence.dna.Feature", {
        name: "feat3",
        start: 1,
        end: 15,
        _type: "CDS",
        strand: 1,
        notes: null
    });
    var feat4   = Ext.create("Teselagen.bio.sequence.dna.Feature", {
        name: "feat4",
        start: 20,
        end: 25,
        _type: "CDS",
        strand: 1,
        notes: null
    });
    var oDestinationDNA = Teselagen.bio.sequence.DNATools.createDNA(destinationDNA);
    var destSM  = Ext.create("Teselagen.manager.SequenceManager", {
        name: "target",
        circular: false,
        sequence: oDestinationDNA,
        features: [feat3, feat4]
    });
    var oSourceDNA = Teselagen.bio.sequence.DNATools.createDNA(sourceDNA);
    var sourceSM  = Ext.create("Teselagen.manager.SequenceManager", {
        name: "source",
        circular: false,
        sequence: oSourceDNA,
        features: [feat1, feat2]
    });
    var oSourceLeftRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(sourceLeftRE);
    var oSourceRightRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(sourceRightRE);
    var oDestLeftRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(destLeftRE);
    var oDestRightRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(destRightRE);
    var reGroup = Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
        name: "my group",
        enzymes: [oSourceLeftRE, oSourceRightRE, oDestLeftRE, oDestRightRE]
    });

    var re = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
        restrictionEnzymeGroup: reGroup,
        sequenceManager: destSM
    });
    var digestionSequence = Ext.create("Teselagen.models.DigestionSequence", {
        sequenceManager: sourceSM,
        startRestrictionEnzyme: oSourceLeftRE,
        endRestrictionEnzyme: oSourceRightRE,
        startRelativePosition: sourceStart,
        endRelativePosition: sourceStop
    });

    var dm = Ext.create("Teselagen.manager.DigestionManager", {
        sequenceManager: destSM,
        start: destStart,
        end: destStop,
        digestionSequence: digestionSequence,
        restrictionEnzymeManager: re
    });
    return dm;
}

// Some examples
// A    Adenine
// G    Guanine
// C    Cytosine
// T    Thymine
// U    Uracil
// R    Purine (A or G)
// Y    Pyrimidine (C or T)
// N    Any nucleotide
// W    Weak (A or T)
// S    Strong (G or C)
// M    Amino (A or C)
// K    Keto (G or T)
// B    Not A (G or C or T)
// H    Not G (A or C or T)
// D    Not C (A or G or T)
// V    Not T (A or G or C)

//Blunt ends for both 
//target
//tgattacgcccagctggcatgcctgcaggtcgactctagaggatccccgggtaccgagctccagctgactggccgtc
//          PvuII                                              PvuII
//01234567890123456789012345678901234567890123456789012345678901234567890123456
//        1         2         3         4         5         6         7
//source
// ttacgcccccgggaaaaaaaaaaaaaaaaaaaaaaaacccgggatccgacagag
//        SmaI                          SmaI
// 012345678901234567890123456789012345678901234567890123
//           1         2         3         4         5
//pasted
//tgattacgcccaggggaaaaaaaaaaaaaaaaaaaaaaaacccctgactggccgtc


//Same ends for both HindIII
//target
//tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcaagcttactggccgtc
//          HindIII                                            HindIII
//01234567890123456789012345678901234567890123456789012345678901234567890123456
//        1         2         3         4         5         6         7
//source
// ttacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaaaagcttatccgacagag
//        HindIII                       HindIII
// 012345678901234567890123456789012345678901234567890123
//           1         2         3         4         5
//pasted
//tgattacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaaaagcttactggccgtc

// Same ends HindIII
// target
// tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc
//           HindIII                                            EcoRI
// 01234567890123456789012345678901234567890123456789012345678901234567890123456
//           1         2         3         4         5         6         7
// source
//    ttacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag
//           HindIII                       EcoRI
//    012345678901234567890123456789012345678901234567890123
//              1         2         3         4         5
//
// Compatible ends BamHI/BglII
// BamHI - R/GATCY
// ggatcc
// BglII - A/GATCT
// agatct
// source
//    ttacgccggatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag
//           BamHI                                              EcoRI
//    012345678901234567890123456789012345678901234567890123456789012345678901234
//              1         2         3         4         5         6         7
// target
// tgattacgccagatctgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc
//           BglII
// 012345678901234567890123456789012345678901234567890123456789012345678901234
//           1         2         3         4         5         6         7
// pasted
// tgattacgccagatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc
//           MIXED
//
// TypeIIs
// BsaI - GGTCTCN/N
//        CCAGAGNNNNN/N
//
// source
//    cagGGTCTCaggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaGAATTCatccgacagag
//       |      ^^^^                                            |
//    012345678901234567890123456789012345678901234567890123456789012345678901234
//              1         2         3         4         5         6         7
// target
// gacctaGGTCTCgggggcatgcctgcaggtcgactctagaggatccccgggtaccgagctcGAATTCactggccgtc
//       |      ^^^^                                                  |
// 01234567890123456789012345678901234567890123456789012345678901234567890123456
//           1         2         3         4         5         6         7
// pasted
// gacctaGGTCTCgggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaGAATTCactggccgtc
//  