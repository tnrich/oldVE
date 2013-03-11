/*
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
                runs(function() {
                    dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                    expect(dm).toBeDefined();
                    waitsFor(function() {
                        return Ext.isDefined(Vede.application);
                    }, "Ext.application defined", 500);
                });
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
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
         it("Compatible Ends DigestionManager exists", function(){
             dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
             expect(dm).toBeDefined();
         });
         it("Source DNA initialized", function(){
             expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
         });
         it("Destination DNA initialized", function(){
             expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
         });
         it("DestinationDNA digested", function(){
             dm.digest(dm.self.matchNormalOnly);
             expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccagatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
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
// BsaI - GGTCTCN/N
//        CCAGAGNNNNN/N
// ggtctagggg
//
// TypeIIs
// source
//    cagggtctaggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag
//             ^^^^
// target
// gacctaggtctcgggggcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc
//             ^^^^
// pasted
// gacctaggtctcggggaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc
//             ^^^^
