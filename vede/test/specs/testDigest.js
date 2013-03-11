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
    //console.log(Ext.Loader.getConfig());

    // ====================================
    //   Sequence Manager Unit Testing
    // ====================================

    describe("DigestionManager.js Tests", function() {
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
    	var sourceSM, destSM, dm;
    	beforeEach(function() {
	        var oSourceDNA = Teselagen.bio.sequence.DNATools.createDNA(sourceDNA);
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
	        destSM  = Ext.create("Teselagen.manager.SequenceManager", {
	            name: "target",
	            circular: false,
	            sequence: oDestinationDNA,
	            features: [feat3, feat4]
	        });
	        sourceSM  = Ext.create("Teselagen.manager.SequenceManager", {
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
	        var sourceRE = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
	            restrictionEnzymeGroup: reGroup,
	            sequenceManager: sourceSM
	        });
	        var digestionSequence = Ext.create("Teselagen.models.DigestionSequence", {
	            sequenceManager: sourceSM,
	            startRestrictionEnzyme: oSourceLeftRE,
	            endRestrictionEnzyme: oSourceRightRE,
	            startRelativePosition: sourceStart,
	            endRelativePosition: sourceStop
	        });
	
	        dm = Ext.create("Teselagen.manager.DigestionManager", {
	            sequenceManager: destSM,
	            start: destStart,
	            end: destStop,
	            digestionSequence: digestionSequence,
	            restrictionEnzymeManager: re
	        });
    	});
    	describe("Same ends", function() {
	    	sourceDNA = "ttacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
	    	destinationDNA = "tgattacgccaagcttgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
	    	sourceLeftRE = "HindIII";
	    	sourceRightRE ="EcoRI";
	    	destLeftRE = "HindIII";
	    	destRightRE ="EcoRI";
	    	sourceStart = 7;
	    	sourceStop = 37;
	    	destStart = 10;
	    	destStop = 67;
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
	            dm.digest(dm.self.matchNormalOnly);
	            expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgccaagcttaaaaaaaaaaaaaaaaaaaaaaaagaattcactggccgtc");
	        });
    	});
    	describe("Compatible ends", function() {
//	    	sourceDNA = "ttacgccggatccaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagaattcatccgacagag";
//	    	destinationDNA = "tgattacgccagatctgcatgcctgcaggtcgactctagaggatccccgggtaccgagctcgaattcactggccgtc";
//	    	sourceLeftRE = "BamHI";
//	    	sourceRightRE ="EcoRI";
//	    	destLeftRE = "BglII";
//	    	destRightRE ="EcoRI";
//	    	sourceStart = 8;
//	    	sourceStop = 36;
//	    	destStart = 10;
//	    	destStop = 67;
	        it("Compatible Ends DigestionManager exists", function(){
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
