/* 
 * @author Diana Womg
 */

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandType");
Ext.require("Teselagen.bio.sequence.DNATools");
Ext.require("Teselagen.bio.sequence.TranslationUtils");


Ext.onReady(function() {
    describe("Testing SequenceManager Classes", function() {
        //console.log(Ext.Loader.getConfig());


        describe("Init SequenceManager.js", function() {
            var seq, feat1, sm;

            beforeEach(function() {
                seq = Teselagen.bio.sequence.DNATools.createDNA("GATTACA");
                feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "lacZalpha",
                    start: 10,
                    end: 20,
                    _type: "CDS",
                    strand: -1,
                    notes: null
                });
                feat1.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:25, end:30}));
                
                sm  = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test",
                    circular: true,
                    sequence: seq,
                    features: [feat1]
                });
            });

            it("Init?",function(){
                expect(sm.getName()).toBe("test");
                expect(sm.getCircular()).toBeTruthy();
                expect(sm.getSequence().seqString().toUpperCase()).toBe("GATTACA");
                expect(sm.getFeatures()[0].getName()).toBe("lacZalpha");
                expect(sm.getManualUpdateStarted()).toBeFalsy();

            });
            it("setName(), setCircular(), setFeatures() ",function(){
                sm.setName("boo");
                expect(sm.getName()).toBe("boo");
                sm.setCircular(false);
                expect(sm.getCircular()).toBeFalsy();
                sm.setFeatures([]);
                expect(sm.getFeatures().length).toBe(0);

            });
            it("setSequence() ",function(){
                var seq2 = Teselagen.bio.sequence.DNATools.createDNA("GATTACAGATTACA"); 
                sm.setSequence(seq2 );
                expect(sm.getSequence().seqString().toUpperCase()).toBe("GATTACAGATTACA");
            });

            it("getManualUpdateStarted(), manualUpdateStarted(), manualUpdateEnded()",function(){
                //console.log(sm.getManualUpdateStarted());
                expect(sm.getManualUpdateStarted()).toBeFalsy();
                sm.manualUpdateStart();
                expect(sm.getManualUpdateStarted()).toBeTruthy();
                sm.manualUpdateEnd();
                expect(sm.getManualUpdateStarted()).toBeFalsy();
            });

            it("createMemento()",function(){
                var sm2 = sm.createMemento();
                expect(sm2.getName()).toBe(sm.getName());
                expect(sm2.getFeatures().length).toBe(1);
                expect(sm2.getFeatures()[0].getName()).toBe("lacZalpha");
            });

            it("setMemento()",function(){
                var smNew = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "blah",
                    circular: true,
                    sequence: null,
                    features: []
                });
                sm.setMemento(smNew);
                expect(sm.getName()).toBe(smNew.getName());
                smNew.setName("foo");
                expect(sm.getName()).toNotBe(smNew.getName());

            });

            

            it("",function(){
                expect(false).toBeFalsy();
            });


        });








        describe("Test cases from 'SequenceProviderTestCases.as'", function() {
            var seqStr, seq, feat1, feat2, sm, tmp;

            beforeEach(function() {
                seqStr  = "tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc"; //64bp
                seq     = Teselagen.bio.sequence.DNATools.createDNA(seqStr);
                console.log(seqStr);

                feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "lacZalpha",
                    start: 10,
                    end: 20,
                    _type: "CDS",
                    strand: -1,
                    notes: null
                });
                console.log(feat1.getLocations().length);
                feat1.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:25, end:30}));
                console.log(feat1.getLocations().length);

                feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "cds2",
                    start: 40,
                    end: 50,
                    _type: "CDS",
                    strand: 1,
                    notes: null
                });
                console.log(feat2.getLocations().length);
                tmp = Ext.create("Teselagen.bio.sequence.common.Location", {start:55, end:5});
                feat2.getLocations().push(tmp);
                console.log(feat2.getLocations().length);

                sm      = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test",
                    circular: true,
                    sequence: seq,
                    features: [feat1, feat2]
                });
                console.log(sm);
                


            });
            it("Check Setup",function(){
                expect(sm.getName()).toBe("test");
                expect(sm.getCircular()).toBeTruthy();
                expect(sm.getSequence()).toBe(seq);
                expect(sm.getFeatures().length).toBe(2);
                expect(sm.getFeatures()[0].getLocations().length).toBe(2);
                expect(sm.getFeatures()[1].getLocations().length).toBe(2);
            });

            it("testRemoveSequenceFnSn1FcSn1",function(){
                //sm.removeSequence(5, 8);

            });

        });
    });
});
