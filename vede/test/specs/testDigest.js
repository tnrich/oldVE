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

Ext.onReady(function() {
    //console.log(Ext.Loader.getConfig());

    // ====================================
    //   Sequence Manager Unit Testing
    // ====================================

    describe("DigestionManager.js Tests", function() {
        var reSequence, feat1, feat2, feat3, feat4, sm, digestionSequence,
            restrictionEnzymeMapper, agcEnz, gntEnz, reGroup, dm, re, firstCut, 
            lastCut, sourceDNA, targetDNA, sourceSM, EcoRI, hinDIII, sourceRE;

        beforeEach(function() {
            targetDNA = Teselagen.bio.sequence.DNATools.createDNA("tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc");
//                                                                "          HindIII                                            EcoRI           "
//                                                                "01234567890123456789012345678901234567890123456789012345678901234567890123456"
            sourceDNA = Teselagen.bio.sequence.DNATools.createDNA("ttacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag");
//                                                                "      HindIII                        EcoRI           "
//                                                                "012345678901234567890123456789012345678901234567890123"
// Some examples
// A  	Adenine
// G	Guanine
// C	Cytosine
// T	Thymine
// U	Uracil
// R	Purine (A or G)
// Y	Pyrimidine (C or T)
// N	Any nucleotide
// W	Weak (A or T)
// S	Strong (G or C)
// M	Amino (A or C)
// K	Keto (G or T)
// B	Not A (G or C or T)
// H	Not G (A or C or T)
// D	Not C (A or G or T)
// V	Not T (A or G or C)
// 
// Compatible ends BamHI/BglII
// BamHI - R/GATCY
// ggatcc
// BglII - A/GATCT
// agatct
// source
//    ttacgccggatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag
//           BamHI
// target
// tgattacgccagatctgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc
//           BglII
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
            reSequence = Teselagen.bio.sequence.DNATools.createDNA("tagccccgctaaagccccccccctctctgatccgc");
            feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "feat1",
                start: 1,
                end: 15,
                _type: "CDS",
                strand: 1,
                notes: null
            });
            feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "feat2",
                start: 20,
                end: 25,
                _type: "CDS",
                strand: 1,
                notes: null
            });
            feat3   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "feat3",
                start: 1,
                end: 15,
                _type: "CDS",
                strand: 1,
                notes: null
            });
            feat4   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "feat4",
                start: 20,
                end: 25,
                _type: "CDS",
                strand: 1,
                notes: null
            });
            sm  = Ext.create("Teselagen.manager.SequenceManager", {
                name: "target",
                circular: false,
                sequence: targetDNA,
                features: [feat1, feat2]
            });
            sourceSM  = Ext.create("Teselagen.manager.SequenceManager", {
                name: "source",
                circular: false,
                sequence: sourceDNA,
                features: [feat3, feat4]
            });
            ecoRI = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme("EcoRI");
            hinDIII = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme("HindIII");
            kpnI = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme("KpnI");
            agcEnz = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
                name: "agc enzyme",
                site: "agc",
                cutType: 1,
                forwardRegex: "agc",
                reverseRegex: "agc",
                dsForward: 1,
                dsReverse: 2,
                usForward: 1,
                usReverse: 2
            });

            gntEnz = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
                name: "gnt enzyme",
                site: "gnt",
                cutType: 1,
                forwardRegex: "g.t",
                reverseRegex: "g.t",
                dsForward: 1,
                dsReverse: 2,
                usForward: 1,
                usReverse: 2
            });
             reGroup = Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
                name:"my group",
                enzymes: [ecoRI, hinDIII]
                //enzymes: [ecoRI, hinDIII, agcEnz, gntEnz]
            });

           re = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
                restrictionEnzymeGroup: reGroup,
                sequenceManager: sm
            });
           sourceRE = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
               restrictionEnzymeGroup: reGroup,
               sequenceManager: sourceSM
           });
         });
        it("DigestionManager exists", function(){
            expect(dm).toBeDefined();
        });
        it("Source DNA initialized", function(){
            expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
        });
        it("Destination DNA initialized", function(){
            expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
        });
        it("DestinationDNA digested", function(){
            digestionSequence = Ext.create("Teselagen.models.DigestionSequence", {
                sequenceManager: sourceSM,
                startRestrictionEnzyme: hinDIII,
                endRestrictionEnzyme: ecoRI,
                startRelativePosition: 7,
                endRelativePosition: 37,

            });
             dm = Ext.create("Teselagen.manager.DigestionManager", {
                 sequenceManager: sm,
                 start: 10,
                 end: 67,
                 digestionSequence: digestionSequence,
                 restrictionEnzymeManager: re,
             });
            dm.digest(dm.self.matchNormalOnly);
            expect(dm.sequenceManager.sequence.toString() === "tgattacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc").toBeTruthy();
        });
        runDigest: function(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop){
        	oSourceLeftRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(sourceLeftRE);
        	oSourceRightRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(sourceRightRE);
        	oDestLeftRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(destLeftRE);
        	oDestRightRE = Teselagen.bio.enzymes.RestrictionEnzymeManager.getRestrictionEnzyme(destRightRE);
        	digestionSequence = Ext.create("Teselagen.models.DigestionSequence", {
                sequenceManager: sourceSM,
                startRestrictionEnzyme: hinDIII,
                endRestrictionEnzyme: ecoRI,
                startRelativePosition: 7,
                endRelativePosition: 37,

            });
        }
    });
});
