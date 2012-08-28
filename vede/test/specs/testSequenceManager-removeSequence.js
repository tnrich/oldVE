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
    xdescribe("Testing Teselagen.manager.SequenceManager.js: SequenceManager Classes pt2: ", function() {

        // =============================================
        //  SequenceManager.removeSequence Testing Suite
        //  from SequenceProviderTestCase.as
        // =============================================


        describe("from 'SequenceProviderTestCases.as': ", function() {
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
                //tmp = Ext.create("Teselagen.bio.sequence.common.Location", {start:55, end:5});
                //feat2.getLocations().push(tmp);
                feat2.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:55, end:5}));

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

                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222----1111111111-----11111----------111111111-----11111111111
                // 0123456789012345678901234567890123456789012345678901234567890123

                expect(sm.getName()).toBe("test");
                expect(sm.getCircular()).toBeTruthy();
                expect(sm.getSequence()).toBe(seq);


                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations().length).toBe(2);
                expect(features[1].getLocations().length).toBe(2);

                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(40);
                expect(features[1].getLocations()[0].getEnd()).toBe(50);
                expect(features[1].getLocations()[1].getStart()).toBe(55);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn1FcSn1",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -----XXX--------------------------------------------------------
                sm.removeSequence(5, 8);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(7);
                expect(features[0].getLocations()[0].getEnd()).toBe(17);
                expect(features[0].getLocations()[1].getStart()).toBe(22);
                expect(features[0].getLocations()[1].getEnd()).toBe(27);

                expect(features[1].getLocations()[0].getStart()).toBe(37);
                expect(features[1].getLocations()[0].getEnd()).toBe(47);
                expect(features[1].getLocations()[1].getStart()).toBe(52);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn2",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -----------------------------------XXX--------------------------
                sm.removeSequence(35, 38);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(37);
                expect(features[1].getLocations()[0].getEnd()).toBe(47);
                expect(features[1].getLocations()[1].getStart()).toBe(52);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn3A",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // --------XXXXXXXXXXXXXXXXXXXXXXXX--------------------------------
                sm.removeSequence(8, 31);
                var features = sm.getFeatures();
                expect(features.length).toBe(1);
                expect(features[0].getLocations()[0].getStart()).toBe(17);
                expect(features[0].getLocations()[0].getEnd()).toBe(27);
                expect(features[0].getLocations()[1].getStart()).toBe(32);
                expect(features[0].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn4",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // ---------------XXXXXXXX-----------------------------------------
                sm.removeSequence(15, 22);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(15);
                expect(features[0].getLocations()[1].getStart()).toBe(18);
                expect(features[0].getLocations()[1].getEnd()).toBe(23);

                expect(features[1].getLocations()[0].getStart()).toBe(33);
                expect(features[1].getLocations()[0].getEnd()).toBe(43);
                expect(features[1].getLocations()[1].getStart()).toBe(48);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn5",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // --------XXXXXXXXXXXXXXX-----------------------------------------
                sm.removeSequence(8, 23);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(8);
                expect(features[0].getLocations()[0].getEnd()).toBe(15);

                expect(features[1].getLocations()[0].getStart()).toBe(25);
                expect(features[1].getLocations()[0].getEnd()).toBe(35);
                expect(features[1].getLocations()[1].getStart()).toBe(40);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFnSn6",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -------------------------XXXXXXXXX------------------------------
                sm.removeSequence(25, 33);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(25);
                //expect(features[0].getLocations()[1].getStart()).toBe(22);
                //expect(features[0].getLocations()[1].getEnd()).toBe(27);

                expect(features[1].getLocations()[0].getStart()).toBe(32);
                expect(features[1].getLocations()[0].getEnd()).toBe(42);
                expect(features[1].getLocations()[1].getStart()).toBe(47);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSn1",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // --------------------------------XXXXX---------------------------
                sm.removeSequence(32, 37);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(35);
                expect(features[1].getLocations()[0].getEnd()).toBe(45);
                expect(features[1].getLocations()[1].getStart()).toBe(50);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSn1b",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // ---------------------------------------X------------------------
                sm.removeSequence(39, 40);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(39);
                expect(features[1].getLocations()[0].getEnd()).toBe(49);
                expect(features[1].getLocations()[1].getStart()).toBe(54);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSn2",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // ---------------------------------------------XXXXXXXXXX---------
                sm.removeSequence(45, 55);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(40);
                //expect(features[1].getLocations()[0].getEnd()).toBe(50);
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                expect(features[1].getLocations()[0].getEnd()).toBe(5);
            });
            it("testRemoveSequenceFcSn3 direct delete",function(){
                //console.log("=================>DEBUG HERE");
                console.log(sm.getFeatures()[1].getStart() + " : " + sm.getFeatures()[1].getEnd());
                sm.getFeatures()[1].deleteAt(2, 2, 7, true);
                console.log(sm.getFeatures()[1].getStart() + " : " + sm.getFeatures()[1].getEnd());
               // console.log("=================>DEBUG HERE");
            });

            it("testRemoveSequenceFcSn3",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // --XX------------------------------------------------------------
                //console.log("FCSN3 =================>DEBUG HERE");
                sm.removeSequence(2, 4, 0);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(8);
                expect(features[0].getLocations()[0].getEnd()).toBe(18);
                expect(features[0].getLocations()[1].getStart()).toBe(23);
                expect(features[0].getLocations()[1].getEnd()).toBe(28);

                expect(features[1].getLocations()[0].getStart()).toBe(38);
                expect(features[1].getLocations()[0].getEnd()).toBe(48);
                expect(features[1].getLocations()[1].getStart()).toBe(53);
                expect(features[1].getLocations()[1].getEnd()).toBe(3);  //HERE 5 deleteAt(2, 2, 7, true)
                //console.log("=================>DEBUG HERE");
            });

            it("testRemoveSequenceFcSn4",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -----------------------------------XXXXXXXXXX-------------------
                sm.removeSequence(35, 45, 0);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(35);
                expect(features[1].getLocations()[0].getEnd()).toBe(40);
                expect(features[1].getLocations()[1].getStart()).toBe(45);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSn5--same as RcSn4?",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -----------------------------------XXXXXXXXXX-------------------
                sm.removeSequence(35, 45);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(35);
                expect(features[1].getLocations()[0].getEnd()).toBe(40);
                expect(features[1].getLocations()[1].getStart()).toBe(45);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);

            });

            it("testRemoveSequenceFcSn6 **",function(){   /// ALL WRONG
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // ---XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-------------------
                console.log("FCSN6 =================>DEBUG HERE");
                sm.removeSequence(3, 45);
                var features = sm.getFeatures();
                expect(features.length).toBe(1);
                expect(features[0].getLocations()[0].getStart()).toBe(3);    //5
                expect(features[0].getLocations()[0].getEnd()).toBe(8); //8
                expect(features[0].getLocations()[1].getStart()).toBe(13); //18
                expect(features[0].getLocations()[1].getEnd()).toBe(3); //4 

                //expect(features[1].getLocations()[0].getStart()).toBe(40);
                //expect(features[1].getLocations()[0].getEnd()).toBe(50);
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                //expect(features[1].getLocations()[1].getEnd()).toBe(5);
            console.log("=================>DEBUG HERE");
            });

            it("testRemoveSequenceFcSc1",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // XXX--------------------------------------------------XXXXXXXXXXX
                sm.removeSequence(53, 3);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(7);
                expect(features[0].getLocations()[0].getEnd()).toBe(17);
                expect(features[0].getLocations()[1].getStart()).toBe(22);
                expect(features[0].getLocations()[1].getEnd()).toBe(27);

                expect(features[1].getLocations()[0].getStart()).toBe(37);
                expect(features[1].getLocations()[0].getEnd()).toBe(47);
                expect(features[1].getLocations()[1].getStart()).toBe(0); //50
                expect(features[1].getLocations()[1].getEnd()).toBe(2); //5
            });

            it("testRemoveSequenceFcSc2",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // XXXXXXXX---------------------------------------------XXXXXXXXXXX
                sm.removeSequence(53, 8);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(2);
                expect(features[0].getLocations()[0].getEnd()).toBe(12);
                expect(features[0].getLocations()[1].getStart()).toBe(17);
                expect(features[0].getLocations()[1].getEnd()).toBe(22);

                expect(features[1].getLocations().length).toBe(1); //2
                expect(features[1].getLocations()[0].getStart()).toBe(32);
                expect(features[1].getLocations()[0].getEnd()).toBe(0); //42

                //expect(features[1].getLocations()[1].getStart()).toBe(undefined); //45
                //expect(features[1].getLocations()[1].getEnd()).toBe(undefined);
            });

            it("testRemoveSequenceFcSc3",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // XXX--------------------------------XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                sm.removeSequence(35, 3);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(7);
                expect(features[0].getLocations()[0].getEnd()).toBe(17);
                expect(features[0].getLocations()[1].getStart()).toBe(22);
                expect(features[0].getLocations()[1].getEnd()).toBe(27);

                expect(features[1].getLocations().length).toBe(1);
                expect(features[1].getLocations()[0].getStart()).toBe(0); //32
                expect(features[1].getLocations()[0].getEnd()).toBe(2); //5
                //The original test expects this feature to only contain one
                //location.
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                //expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSc4",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // XXXXXXXX---------------------------XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                sm.removeSequence(35, 8);
                var features = sm.getFeatures();
                expect(features.length).toBe(1);
                expect(features[0].getLocations()[0].getStart()).toBe(2);
                expect(features[0].getLocations()[0].getEnd()).toBe(12);
                expect(features[0].getLocations()[1].getStart()).toBe(17);
                expect(features[0].getLocations()[1].getEnd()).toBe(22);

                //expect(features[1].getLocations()[0].getStart()).toBe(40);
                //expect(features[1].getLocations()[0].getEnd()).toBe(50);
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                //expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSc5",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX----------XXXXXXXXXXXXX
                sm.removeSequence(51, 41);
                var features = sm.getFeatures();
                expect(features.length).toBe(1);
                expect(features[0].getLocations().length).toBe(1);
                expect(features[0].getName()).toBe("cds2");
                expect(features[0].getLocations()[0].getStart()).toBe(0);
                expect(features[0].getLocations()[0].getEnd()).toBe(10);

                //expect(features[0].getLocations()[1].getStart()).toBe(undefined); //4
                //expect(features[0].getLocations()[1].getEnd()).toBe(undefined); //9    

                //expect(features[1].getLocations()[0].getStart()).toBe(40);
                //expect(features[1].getLocations()[0].getEnd()).toBe(50);
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                //expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });

            it("testRemoveSequenceFcSc6: ***",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // X---XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                console.log("========================================" +
                            "        Start FcSc6 DEBUG               " +
                            "========================================");
              
                sm.removeSequence(4, 1);
                var features = sm.getFeatures();
                expect(features.length).toBe(1);
                expect(features[0].getLocations().length).toBe(1);
                expect(features[0].getLocations()[0].getStart()).toBe(0); //5
                expect(features[0].getLocations()[0].getEnd()).toBe(3);
                console.log("========================================" +
                            "        End FcSc6 DEBUG               " +
                            "========================================");
              
//expect(features[0].getLocations()[1].getStart()).toBe(25);
                //expect(features[0].getLocations()[1].getEnd()).toBe(30);

                //expect(features[1].getLocations()[0].getStart()).toBe(40);
                //expect(features[1].getLocations()[0].getEnd()).toBe(50);
                //expect(features[1].getLocations()[1].getStart()).toBe(55);
                //expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });
            /*
            it("",function(){
                // tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc
                // 22222-----1111111111-----11111----------2222222222-----222222222
                // 0123456789012345678901234567890123456789012345678901234567890123
                // -------------------------XXXXXXXXX------------------------------
                sm.removeSequence(5, 8);
                var features = sm.getFeatures();
                expect(features.length).toBe(2);
                expect(features[0].getLocations()[0].getStart()).toBe(10);
                expect(features[0].getLocations()[0].getEnd()).toBe(20);
                expect(features[0].getLocations()[1].getStart()).toBe(25);
                expect(features[0].getLocations()[1].getEnd()).toBe(30);

                expect(features[1].getLocations()[0].getStart()).toBe(40);
                expect(features[1].getLocations()[0].getEnd()).toBe(50);
                expect(features[1].getLocations()[1].getStart()).toBe(55);
                expect(features[1].getLocations()[1].getEnd()).toBe(5);
            });


            it("",function(){
            });*/

        });
    });
});
