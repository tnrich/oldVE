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

Ext.onReady(function() {
    //console.log(Ext.Loader.getConfig());

    // ====================================
    //   Sequence Manager Unit Testing
    // ====================================

    describe("DigestionManager.js Tests", function() {
        var reSequence, feat1, feat2, feat3, sm, digestionSequence,
            restrictionEnzymeMapper, agcEnz, gntEnz, reGroup, dm, re, firstCut, lastCut;

        beforeEach(function() {
            reSequence = Teselagen.bio.sequence.DNATools.createDNA("tagccccgctaaagccccccccctctctgatccgc");
            feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "feat1",
                start: 1,
                end: 3,
                _type: "CDS",
                strand: 1,
                notes: null
            });


            sm  = Ext.create("Teselagen.manager.SequenceManager", {
                name: "test",
                circular: false,
                sequence: reSequence,
                features: [feat1]
            });
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
                enzymes: [agcEnz, gntEnz]
            });

           re = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
                restrictionEnzymeGroup: reGroup,
                sequenceManager: sm
            });
           digestionSequence = Ext.create("Teselagen.models.DigestionSequence", {
               sequenceManager: sm,
               startRestrictionEnzyme: agcEnz,
               endRestrictionEnzyme: gntEnz,
               startRelativePosition: 0,
               endRelativePosition: 1,

           });
            dm = Ext.create("Teselagen.manager.DigestionManager", {
                sequenceManager: sm,
                start: 1,
                end: 31,
                digestionSequence: digestionSequence,
                restrictionEnzymeManager: re,
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
            dm.digest(dm.self.matchNormalOnly);
            expect(dm.sequenceManager).toBeDefined();
        });
    });
});
