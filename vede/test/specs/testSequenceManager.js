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
            var seq, feat1, feat2, sm;

            beforeEach(function() {
                seq = Teselagen.bio.sequence.DNATools.createDNA("GATTACA");
                feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "feat1",
                    start: 1,
                    end: 3,
                    _type: "CDS",
                    strand: 1,
                    notes: null
                });
                //feat1.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:1, end:2}));
                //console.log(feat1.getLocations());


                feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "feat2",
                    start: 3,
                    end: 5,
                    _type: "CDS",
                    strand: -1,
                    notes: null
                });


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
                expect(sm.getSequence().toString().toUpperCase()).toBe("GATTACA");
                expect(sm.getFeatures().length).toBe(1);
                expect(sm.getFeatures()[0].getName()).toBe("feat1");
                expect(sm.getFeatures()[0].getStart()).toBe(1);
                expect(sm.getFeatures()[0].getEnd()).toBe(3);
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
                expect(sm.getSequence().toString().toUpperCase()).toBe("GATTACAGATTACA");
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
                expect(sm2.getFeatures()[0].getName()).toBe("feat1");
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

            it("getComplementSequence()",function(){
                var tmp = sm.getComplementSequence();
                //console.log(tmp.getSymbolsLength());
                expect(tmp.getSymbolsLength()).toBe("GATTACA".length);
                expect(tmp.toString()).toBe("ctaatgt");
            });

            it("getReverseComplementSequence()",function(){
                var tmp = sm.getReverseComplementSequence();
                //console.log(tmp.getSymbolsLength());
                expect(tmp.getSymbolsLength()).toBe("GATTACA".length);
                expect(tmp.toString()).toBe("tgtaatc");
            });           

            it("subSequence(); Start => End behavior ????",function(){
                var tmp;
                //GATTACA
                tmp = sm.subSequence(-1,-2);
                expect(tmp).toBeFalsy();
                // start > end
                tmp = sm.subSequence(0,2);
                expect(tmp.toString()).toBe("ga"); // NOT SURE TRUE ANSWER
                // start > end
                tmp = sm.subSequence(1,9);
                //console.log(tmp.toString());  // ta of gattaca
                expect(tmp.toString()).toBe("attaca"); // NOT SURE TRUE ANSWER
                // start => end
                tmp = sm.subSequence(3,1);
                expect(tmp.toString()).toBe("gat"); // tacag NOT SURE TRUE ANSWER
            });

            it("subSequenceManager() THIS IS NOT COMPLETE",function(){
                var tmp = sm.subSequenceManager(0, 4);
                //console.log(feat1.getName());
                //console.log(tmp.getSequence().toString());
                expect(sm.getFeatures().length).toBe(1);
                //console.log(tmp.getFeatures().length);
                //console.log(tmp.getCircular());
            });

            it("addFeature()",function(){
                sm.addFeature(feat2, false);
                expect(sm.getFeatures().length).toBe(2);
                expect(sm.getFeatures()[0].getName()).toBe("feat1");
                expect(sm.getFeatures()[1].getName()).toBe("feat2");
                //CHECK FOR EVENT HANDLING
            });
            it("addFeatures()",function(){
                sm.addFeatures([feat2, feat1], false);
                expect(sm.getFeatures().length).toBe(3);
                expect(sm.getFeatures()[0].getName()).toBe("feat1");
                expect(sm.getFeatures()[1].getName()).toBe("feat2");
                expect(sm.getFeatures()[2].getName()).toBe("feat1");
                //CHECK FOR EVENT HANDLING
            });

            it("removeFeature()",function(){
                sm.removeFeature(feat1, false);
                expect(sm.getFeatures().length).toBe(0);
                //CHECK FOR EVENT HANDLING
            });
            it("removeFeatures()",function(){
                sm.addFeatures([feat2, feat1], false);
                sm.removeFeature(feat1, false);
                expect(sm.getFeatures().length).toBe(2);
                expect(sm.getFeatures()[0].getName()).toBe("feat2");
                expect(sm.getFeatures()[1].getName()).toBe("feat1");
                //CHECK FOR EVENT HANDLING
            });

            it("hasFeature()",function(){
                expect(sm.hasFeature(feat1)).toBeTruthy();
                expect(sm.hasFeature(feat2)).toBeFalsy();
            });
            it("insertSequence",function() {
                expect(sm.getFeatures()[0].getStart()).toBe(1);
                expect(sm.getFeatures()[0].getEnd()).toBe(3);


                var insSeq = Teselagen.bio.sequence.DNATools.createDNA("GGG");
                sm.insertSequence(insSeq, 2, false);

                expect(sm.getSequence().getSymbolsLength()).toBe(10);
                expect(sm.getSequence().toString()).toBe("gagggttaca");

                expect(sm.getFeatures().length).toBe(1);

                // Remember that it is [start, end) where end is noninclusive
                expect(sm.getFeatures()[0].getStart()).toBe(1);
                expect(sm.getFeatures()[0].getEnd()).toBe(6); // gaggg [1,6)
            });

            it("insertSequenceManager",function(){
                // gattaca
                // 11----- <= where Feat1 of sm is
                expect(sm.getFeatures()[0].getStart()).toBe(1); //1
                expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)

                seq2 = Teselagen.bio.sequence.DNATools.createDNA("GGGGGG");
                sm2  = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test2",
                    circular: true,
                    sequence: seq2,
                    features: [feat2]
                });
                // GGGGGG
                // --22-- <== where Feat2 is
                expect(sm.getSequence().toString()).toBe("gattaca");

                sm.insertSequenceManager(sm2, 2, false);

                // gaGGGGGGttaca
                // 11--22------- <=where Feat 1 and Feat 2 are now
                expect(sm.getSequence().toString()).toBe("gaggggggttaca");

                // Features[0] == feat1
                expect(sm.getFeatures()[0].getStart()).toBe(1); //1
                expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)
                // Features[1] == feat2
                expect(sm.getFeatures()[1].getStart()).toBe(5);
                expect(sm.getFeatures()[1].getEnd()).toBe(7); // gaggg [1,6)
            });

            it("insertSequenceManager v2",function(){
                // gattaca
                // 11----- <= where Feat1 of sm is
                expect(sm.getFeatures()[0].getStart()).toBe(1); //1
                expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)

                seq2 = Teselagen.bio.sequence.DNATools.createDNA("GGGGGG");
                sm2  = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test2",
                    circular: true,
                    sequence: seq2,
                    features: [feat2]
                });
                // GGGGGG
                // --22-- <== where Feat2 is
                expect(sm.getSequence().toString()).toBe("gattaca");

                sm.insertSequenceManager(sm2, 1, false); // insert between

                // gGGGGGGattaca
                // 1--22--1----- <=where Feat 1 and Feat 2 are now
                expect(sm.getSequence().toString()).toBe("gggggggattaca");

                // Features[0] == feat1
                expect(sm.getFeatures()[0].getStart()).toBe(1);
                expect(sm.getFeatures()[0].getEnd()).toBe(8);
                // Features[1] == feat2
                expect(sm.getFeatures()[1].getStart()).toBe(4);
                expect(sm.getFeatures()[1].getEnd()).toBe(6); 
            });

            it("removeSequence() THIS IS HARD COME BACK LATER",function(){
                //expect(true).toBeFalsy();
                sm.removeSequence(1,2,false);
            });

            it("featuresByRange() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            /*it("featuresAt() TEST ME",function(){
                expect(true).toBeFalsy();
            });


            it("manualUpdateStart()",function(){
                sm.manualUpdateStart();
                expect(sm.getManualUpdateStarted()).toBe(true);
            });

            it("manualUpdateEnd()",function(){
                sm.manualUpdateEnd();
                expect(sm.getManualUpdateStarted()).toBe(false);
            });

            it("clone() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("reverseSequence() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("reverseComplementSequence() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("rebaseSequence() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("toGenbank() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("fromGenbank() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("fromJbeiSeqXml() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("fromFasta() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("updateComplmementSequence() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it("updateReverseComplementSeuquence() TEST ME",function(){
                expect(true).toBeFalsy();
            });

            it(" ",function(){
                expect(false).toBeFalsy();
            });

            it("",function(){
                expect(false).toBeFalsy();
            });
            */
        });











        describe("Test cases from 'SequenceProviderTestCases.as'", function() {
            var seqStr, seq, feat1, feat2, sm, tmp;

            beforeEach(function() {
                seqStr  = "tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc"; //64bp
                seq     = Teselagen.bio.sequence.DNATools.createDNA(seqStr);
                //console.log(seqStr);

                feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "lacZalpha",
                    start: 10,
                    end: 20,
                    _type: "CDS",
                    strand: -1,
                    notes: null
                });
                //console.log(feat1.getLocations().length);
                feat1.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:25, end:30}));
                //console.log(feat1.getLocations().length);

                feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "cds2",
                    start: 40,
                    end: 50,
                    _type: "CDS",
                    strand: 1,
                    notes: null
                });
                //console.log(feat2.getLocations().length);
                tmp = Ext.create("Teselagen.bio.sequence.common.Location", {start:55, end:5});
                feat2.getLocations().push(tmp);
                //console.log(feat2.getLocations().length);

                sm      = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test",
                    circular: true,
                    sequence: seq,
                    features: [feat1, feat2]
                });
                //console.log(sm);

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
