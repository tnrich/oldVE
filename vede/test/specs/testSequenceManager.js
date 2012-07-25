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
    describe("Testing SequenceManager Classes pt1", function() {
        //console.log(Ext.Loader.getConfig());

        // ====================================
        //   Sequence Manager Unit Testing
        // ====================================

        describe("Init SequenceManager.js", function() {
            var seq, feat1, feat2, feat3, sm;

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

                feat3   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "feat3",
                    start: 2,
                    end: 5,
                    _type: "CDS",
                    strand: 1,
                    notes: null
                });


                sm  = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test",
                    circular: true,
                    sequence: seq,
                    features: [feat1]
                });

                //-GATTACA
                //=-12----  <- feat1 (added to sm)
                //=---34--  <- feat2, complment, not added to sm yet
                //=--245--  <- feat3, not added to sm
            });

            it("Init?",function(){
                expect(sm.getName()).toBe("test");
                expect(sm.getCircular()).toBeTruthy();
                expect(sm.getSequence().toString().toUpperCase()).toBe("GATTACA");
                expect(sm.getFeatures().length).toBe(1);
                expect(sm.getFeatures()[0].getName()).toBe("feat1");
                expect(sm.getFeatures()[0].getStart()).toBe(1);
                expect(sm.getFeatures()[0].getEnd()).toBe(3);
                //console.log(sm.getFeatures()[0].toString());
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


            // TALK TO MICAH ABOUT INCLUSIVE/NONINCLUSIVE 7/23/2012

            it("subSequence(): Start is non-inclusive, END IS INCLUSIVE (WEIRD)",function(){
                var tmp;
                //-GATTACA
                //impossible values case
                tmp = sm.subSequence(-1,-2);
                expect(tmp).toBeFalsy();

                // start > end
                //=GATTACA
                //=01-----
                tmp = sm.subSequence(0,2);
                expect(tmp.toString()).toBe("ga");

                // start > end: FEAT1
                //=GATTACA
                //=-12----
                tmp = sm.subSequence(1,3);
                expect(tmp.toString()).toBe("at");

                // start > end: FEAT2
                //=GATTACA
                //=---34--
                tmp = sm.subSequence(3,5);
                expect(tmp.toString()).toBe("ta");

                // start > end
                //=GATTACA
                //=-12345678
                tmp = sm.subSequence(1,9);
                expect(tmp.toString()).toBe("attaca");

                // start => end
                //=GATTACA
                //=0--3456
                tmp = sm.subSequence(3,1);
                expect(tmp.toString()).toBe("tacag"); // tacag NOT SURE TRUE ANSWER
            });

            describe("subSequence(): Multiple Tests", function() {
                it("subSequenceManager(): #0 NULL case",function(){
                    //console.log("===> Begin subSequenceManagerTesting");
                    //=GATTACA
                    //=FF-----
                    var tmp = sm.subSequenceManager(-1, 4);
                    expect(tmp).toBe(null);
                    var tmp = sm.subSequenceManager(1, -4);
                    expect(tmp).toBe(null);
                    var tmp = sm.subSequenceManager(9, 10); // THIS DOESNT EVEN GIVE BACK NULL WHEN IT SHOULD
                    //expect(tmp).toBe(null);
                });

                // TALK TO MICAH ABOUT INCLUSIVE/NONINCLUSIVE 7/23/2012
                it("subSequenceManager(): #1 One Feature case,",function(){
                    //console.log("===> Begin subSequenceManagerTesting");
                    //=GATTACA
                    //=FF-----
                    //=-123---
                    var tmp = sm.subSequenceManager(1, 4);
                    expect(tmp.getName()).toBe("Dummy");
                    expect(tmp.getCircular()).toBe(false);
                    expect(tmp.getSequence().seqString()).toBe("att");
                    expect(tmp.getFeatures().length).toBe(1);
                    //console.log("===> End subSequenceManagerTesting");
                });

                it("subSequenceManager(): #2 Two Feature case",function(){
                    sm.addFeature(feat2, false);
                    expect(sm.getFeatures().length).toBe(2);
                    //=GATTACA
                    //=-12----   * feat1 [1,3)
                    //=---34--   * feat2 [3,5)
                    //=-1234--  <-- New selection [1,5)
                    //...get sub Sequence Manager -- ie cut out a chunk (1,5]
                    //=ATTA     <-- New Sequence
                    //=1122     <-- Where Feat 1 and 2 live now

                    var tmp = sm.subSequenceManager(1, 5);
                    expect(tmp.getName()).toBe("Dummy");
                    expect(tmp.getCircular()).toBe(false);
                    expect(tmp.getSequence().seqString()).toBe("atta");
                    expect(tmp.getFeatures().length).toBe(2);
                    expect(tmp.getFeatures()[0].getStart()).toBe(0);
                    expect(tmp.getFeatures()[0].getEnd()).toBe(2);
                    expect(tmp.getFeatures()[1].getStart()).toBe(2);
                    expect(tmp.getFeatures()[1].getEnd()).toBe(4);
                });

                it("subSequenceManager(): #3 select middle of feature--DOES NOT INCLUDE THE SUB-FEATURE (Is that right?)",function(){
                    //sm.setFeatures(feat3);
                    //expect(sm.getFeatures().length).toBe(1);
                    //=GATTACA
                    //=---34--   * feat2 (3,5]
                    //=----4--  <-- New selection (4,5]
                    //...get sub Sequence Manager -- ie cut out a chunk (4,5]
                    //=A     <-- New Sequence
                    //=2     <-- Where part of Feat 2 live now

                    var tmp = sm.subSequenceManager(4, 5);
                    expect(tmp.getName()).toBe("Dummy");
                    expect(tmp.getCircular()).toBe(false);
                    expect(tmp.getSequence().seqString()).toBe("a");
                    expect(tmp.getFeatures().length).toBe(1);
                    //expect(tmp.getFeatures()[0].getStart()).toBe(0);
                    //expect(tmp.getFeatures()[0].getEnd()).toBe(1);
                });
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
                expect(sm.getFeatures().length).toBe(1);
                sm.removeFeature(feat1, false);
                expect(sm.getFeatures().length).toBe(0);
                //CHECK FOR EVENT HANDLING
            });
            it("removeFeatures()",function(){
                sm.addFeatures([feat2, feat3], false);
                sm.removeFeature(feat1, false);
                expect(sm.getFeatures().length).toBe(2);
                expect(sm.getFeatures()[0].getName()).toBe("feat2");
                expect(sm.getFeatures()[1].getName()).toBe("feat3");
                //expect(sm.getFeatures()[2].getName()).toBe("feat3");
                //CHECK FOR EVENT HANDLING
            });

            it("hasFeature()",function(){
                expect(sm.hasFeature(feat1)).toBeTruthy();
                expect(sm.hasFeature(feat2)).toBeFalsy();
            });

            describe("InsertSequence(): Multiple Tests", function() {
                it("insertSequence(): before a feature-->SOMETHING WRONG WITH FEATURES.INSERTAT()",function() {
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);

                    //=GATTACA
                    //=-FF----
                    //=0------
                    var insSeq = Teselagen.bio.sequence.DNATools.createDNA("CCC");
                    sm.insertSequence(insSeq, 0, false);

                    expect(sm.getSequence().getSymbolsLength()).toBe(10);
                    expect(sm.getSequence().toString()).toBe("cccgattaca");

                    expect(sm.getFeatures().length).toBe(1);

                    //=gggGATTACA
                    //=----45----
                    // Remember that it is [start, end) where end is noninclusive
                    expect(sm.getFeatures()[0].getStart()).toBe(4);
                    expect(sm.getFeatures()[0].getEnd()).toBe(6); // gaggg [1,6)
                    //CHECK FOR EVENT HANDLING
                });

                it("insertSequence(): after a feature",function() {
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);

                    //=GATTACA
                    //=-FF----
                    //=----4--
                    var insSeq = Teselagen.bio.sequence.DNATools.createDNA("CCC");
                    sm.insertSequence(insSeq, 4, false);

                    expect(sm.getSequence().getSymbolsLength()).toBe(10);
                    expect(sm.getSequence().toString()).toBe("gattcccaca");

                    expect(sm.getFeatures().length).toBe(1);
                    //=GATTgggACA
                    //=-12-------
                    // Remember that it is [start, end) where end is noninclusive
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)
                    //CHECK FOR EVENT HANDLING
                });

                it("insertSequence(): inside of a feature",function() {
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);

                    //=GATTACA
                    //=-FF----
                    //=--2----
                    var insSeq = Teselagen.bio.sequence.DNATools.createDNA("GGG");
                    sm.insertSequence(insSeq, 2, false);

                    expect(sm.getSequence().getSymbolsLength()).toBe(10);
                    expect(sm.getSequence().toString()).toBe("gagggttaca");

                    expect(sm.getFeatures().length).toBe(1);

                    // Remember that it is [start, end) where end is noninclusive
                    //=GAGGGTTACA
                    //=-FfffF----
                    //=-12345----
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(6); // agggt [1,6)
                    //CHECK FOR EVENT HANDLING
                });
            });
            describe("insertSequenceManager(): Multiple Tests", function() {

                it("insertSequenceManager(): before a feature: see insertSequence() Problem",function(){
                    
                    console.log("==============> DEBUGGING HERE");

                    //=gattaca
                    //=-11---- <= where Feat1 is in sm
                    expect(sm.getFeatures()[0].getStart()).toBe(1); //1
                    expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)
                    console.log(sm.subSequence(1,3).toString());

                    seq2 = Teselagen.bio.sequence.DNATools.createDNA("CCCCC");
                    sm2  = Ext.create("Teselagen.manager.SequenceManager", {
                        name: "test2",
                        circular: true,
                        sequence: seq2,
                        features: [feat2]
                    });
                    //=GGGCCG
                    //=---22- <== where Feat2 is in seq2/sm2
                    expect(sm.getSequence().toString()).toBe("gattaca");

                    sm.insertSequenceManager(sm2, 1, true);  // <<=== EXCEUTE THIS CODE
                    expect(sm.getFeatures().length).toBe(2);

                    var insert = sm.getFeatures()[1].clone();
                    insert.shift(1,sm.getSequence().length, true);
                    console.log("insert: " + insert.getStart());
                    console.log("insert: " + insert.getEnd());


                    //=gGGGCCGattaca
                    //=----22-11---- <=where Feat 1 and Feat 2 are now
                    expect(sm.getSequence().seqString()).toBe("gccccccattaca");

                    // Features[0] == feat1
                    //=gCCCCCCattaca
                    //=-------FF----
                    //=-------78----
                    console.log(sm.subSequence(1,3).toString());
                    console.log(sm.subSequence(7,9).toString());
                    expect(sm.getFeatures()[0].getStart()).toBe(7);
                    expect(sm.getFeatures()[0].getEnd()).toBe(9);
                    // Features[1] == feat2
                    //=gGGGCCGattaca
                    //=----FF-------
                    //=----45-------
                    expect(sm.getFeatures()[1].getStart()).toBe(4);
                    expect(sm.getFeatures()[1].getEnd()).toBe(6); 
                    //CHECK FOR EVENT HANDLING
                });

                it("insertSequenceManager(): inside of a feature",function(){
                    //=gattaca
                    //=-11---- <= where Feat1 of sm is
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);


                    // GGGCCG
                    // ---22- <== where Feat2 is in seq2
                    seq2 = Teselagen.bio.sequence.DNATools.createDNA("GGGCCG");
                    sm2  = Ext.create("Teselagen.manager.SequenceManager", {
                        name: "test2",
                        circular: true,
                        sequence: seq2,
                        features: [feat2]
                    });
                    expect(sm.getSequence().toString()).toBe("gattaca");

                    sm.insertSequenceManager(sm2, 2, false);
                    expect(sm.getFeatures().length).toBe(2);

                    // gaGGGGGGttaca
                    // -1---22-1---- <=where Feat 1 and Feat 2 are now
                    expect(sm.getSequence().toString()).toBe("gagggccgttaca");

                    // Features[0] == feat1
                    //=gaGGGCCGttaca
                    //=-FFFFFFFF---- 
                    //=-12345678----
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(9);
                    // Features[1] == feat2
                    //=gaGGGCCGttaca
                    //=-----FF---- 
                    //=-----56------
                    expect(sm.getFeatures()[1].getStart()).toBe(5);
                    expect(sm.getFeatures()[1].getEnd()).toBe(7); 
                    //CHECK FOR EVENT HANDLING
                });
                
                it("insertSequenceManager(): after a feature: see insertSequence()",function(){
                    //=gattaca
                    //=-11---- <= where Feat1 is in sm
                    expect(sm.getFeatures()[0].getStart()).toBe(1); //1
                    expect(sm.getFeatures()[0].getEnd()).toBe(3); // gaggg [1,6)
                    console.log(sm.subSequence(1,3).toString());

                    seq2 = Teselagen.bio.sequence.DNATools.createDNA("CCCCCC");
                    sm2  = Ext.create("Teselagen.manager.SequenceManager", {
                        name: "test2",
                        circular: true,
                        sequence: seq2,
                        features: [feat2]
                    });
                    //=CCCCCC
                    //=---22- <== where Feat2 is in seq2/sm2
                    expect(sm.getSequence().toString()).toBe("gattaca");

                    sm.insertSequenceManager(sm2, 4, false);
                    expect(sm.getFeatures().length).toBe(2);

                    //=gattCCCCCCaca
                    //=-11----22--- <=where Feat 1 and Feat 2 are now
                    expect(sm.getSequence().seqString()).toBe("gattccccccaca");

                    // Features[0] == feat1
                    //=gattCCCCCCaca
                    //=-FF----------
                    //=-12----------
                    //console.log(sm.subSequence(1,3).toString());
                    //console.log(sm.subSequence(7,9).toString());
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);
                    // Features[1] == feat2
                    //=gattCCCCCCaca
                    //=-------FF----
                    //=-------78----
                    expect(sm.getFeatures()[1].getStart()).toBe(7);
                    expect(sm.getFeatures()[1].getEnd()).toBe(9); 
                    //CHECK FOR EVENT HANDLING
                });
            });
            describe("removeSequence(): normal Feature, normal Selection", function() {
                it("removeSequence() -- Fn,Sn1 -- selection before feature",function(){
                    //GATTACA
                    //-FF----
                    //X
                    //ATTACA
                    //FF---
                    sm.removeSequence(0,1,false);
                    expect(sm.getSequence().seqString()).toBe("attaca");
                    expect(sm.getFeatures()[0].getStart()).toBe(0);
                    expect(sm.getFeatures()[0].getEnd()).toBe(2); 
                    //CHECK FOR EVENT HANDLING
                });
                it("removeSequence() -- Fn,Sn2 -- selection after feature",function(){
                    //GATTACA
                    //-FF----
                    //     XX
                    //GATTA
                    //-----
                    sm.removeSequence(5,7,false);
                    expect(sm.getSequence().seqString()).toBe("gatta");
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3); 
                    //CHECK FOR EVENT HANDLING
                });

                it("removeSequence() -- Fn,Sn3 -- selection overlaps all of feature",function(){
                    //GATTACA
                    //-FF----
                    //XXXX---
                    //ACA
                    //---
                    sm.removeSequence(0,4,false);
                    expect(sm.getSequence().seqString()).toBe("aca");
                    expect(sm.getFeatures().length).toBe(0);
                    expect(sm.getFeatures()[0].getStart()).toBe(100);
                    expect(sm.getFeatures()[0].getEnd()).toBe(100); 
                    //CHECK FOR EVENT HANDLING
                });

                it("removeSequence() -- Fn,Sn4 -- selection inside of feature",function(){
                    //GATTACA
                    //-FF----
                    //-X-----
                    //GTTACA
                    //-F----
                    sm.removeSequence(1,2,false);
                    expect(sm.getSequence().seqString()).toBe("gttaca");
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(2); 
                    //CHECK FOR EVENT HANDLING
                });

                it("removeSequence() -- Fn,Sn5 -- selection overlaps first part of feature",function(){
                    //GATTACA
                    //-FF----
                    //XX-----
                    //TTACA
                    //F----
                    sm.removeSequence(0,2,false);
                    expect(sm.getSequence().seqString()).toBe("ttaca");
                    expect(sm.getFeatures()[0].getStart()).toBe(0);
                    expect(sm.getFeatures()[0].getEnd()).toBe(1); 
                    //CHECK FOR EVENT HANDLING
                });

                it("removeSequence() -- Fn,Sn6 -- selection overlaps feature",function(){
                    //GATTACA
                    //-FF----
                    //--XXX--
                    //GACA
                    //---
                    sm.removeSequence(2,5,false);
                    expect(sm.getSequence().seqString()).toBe("gaca");
                    expect(sm.getFeatures().length).toBe(1);
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(2);
                    //CHECK FOR EVENT HANDLING
                });
            });

            it("featuresByRange() TEST ME",function(){
                //expect(true).toBeFalsy();
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









    });
});
