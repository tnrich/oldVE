/**
 * Unit Tests
 * @author Diana Womg
 */

//Ext.require("Ext.Ajax");

//Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
//Ext.require("Teselagen.bio.sequence.common.StrandType");
//Ext.require("Teselagen.bio.sequence.DNATools");
 
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");

Ext.require("Teselagen.utils.SequenceUtils");
Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.onReady(function() {

    describe("Testing SequenceUtil.", function() {

        describe("isCompatibleDNASequence(): ", function() {

            it("Detects letters: 'ATGCYRSWKMBVDHN' ",function(){
                var seq = "ATGCYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleDNASequence(seq);
                expect(compatible).toBe(true);
            });

        });
        describe("isCompatibleRNASequence(): ", function() {

            it("Detects letters: 'AUGCYRSWKMBVDHN' ",function(){
                var seq = "AUGCYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleRNASequence(seq);
                expect(compatible).toBe(true);
            });

        });

        describe("isCompatibleSequence().(DNA or RNA)", function() {
            //console.log(Teselagen.bio.sequence.alphabets.DNAAlphabet.symbolByValue("a").getValue());

            it("Detects letters: 'A(T/U)GCYRSWKMBVDHN' (either U OR T, not both!)",function(){
                var seq = "AGCUYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);

                var seq = "AGCTYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detect white space: ' \t\n\r'",function(){
                var seq = " \t\n\r";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detect numbers: '0123456789'",function(){
                var seq = "0123456789";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detects bad characters: 'FIJLOPQXZ' ",function(){
                var seq = "F";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
                var seq = "I";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
                var seq = "J";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
            });


        });

        describe("purifyCompatibleSequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': DNA or RNA",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe(("ATGCUYRSWKMBVDHN").toLowerCase());
            });

            it("Removes whitespace: ' \t\n\r'",function(){
                var seq  = " \t\n\r";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes numbers: '0123456789'",function(){
                var seq  = "0123456789";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: '!@#$%^&*'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: 'FIJLOPQXZ'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

        });
        
        describe("purifyCompatibleDNASequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': removes RNA U's",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe(("ATGCYRSWKMBVDHN").toLowerCase());
            });

            it("Removes whitespace: ' \t\n\r'",function(){
                var seq  = " \t\n\r";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes numbers: '0123456789'",function(){
                var seq  = "0123456789";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: '!@#$%^&*'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: 'FIJLOPQXZ'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

        });
        describe("purifyCompatibleRNASequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': removes RNA U's",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleRNASequence(seq);
                expect(pure).toBe(("AGCUYRSWKMBVDHN").toLowerCase());
            });
        });
	});

    describe("Testing FormatUtils.js", function() {

        describe("Format2Format methods: Genbank, JbeiSeqXml, Fasta", function() {
            var newGb;

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

                feat3   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                    name: "feat3",
                    start: 2,
                    end: 5,
                    _type: "CDS",
                    strand: 1,
                    notes: null
                });
                feat3.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:0, end:1}));

                sm  = Ext.create("Teselagen.manager.SequenceManager", {
                    name: "test",
                    circular: true,
                    sequence: seq,
                    features: [feat1]
                });

                var note1 = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                    name: "note",
                    value: "note1value",
                    quoted: true
                });

                sm.getFeatures()[0].addNote(note1);
                sm.addFeature(feat3, false);

                var smLine =  'LOCUS       test                       7 bp ds-DNA     circular     30-JUL-2012\n' + 
                        'FEATURES             Location/Qualifiers\n' +
                        '     feat1           1..3\n' +
                        '                     /note="note1value"\n' +
                        '     feat3           join(2..5,0..1)\n' +
                        'ORIGIN      \n' +
                        '        1 gattaca     \n';
                newGb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(smLine);
            });

            it("checkGenbank() ",function(){
                var gb = newGb;
                
                expect(gb.getLocus().getLocusName()).toBe("test");
                expect(gb.getLocus().getStrandType()).toBe("ds");
                expect(gb.getLocus().getSequenceLength()).toBe(7);
                expect(gb.getLocus().getNaType()).toBe("DNA");
                expect(gb.getLocus().getLinear()).toBe(false);
                expect(gb.getLocus().getDivisionCode()).toBe("");

                expect(gb.getFeatures().getFeaturesElements().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(3);

                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(5);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(0);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(1);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("note");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("note1value");
                
                expect(gb.getOrigin().getSequence()).toBe("gattaca");
                expect(gb.getOrigin().getSequence().length).toBe(7);

                //console.log(gb.toString());
            });

            it("toGenbank() ",function(){
                var gb = sm.toGenbank();
                
                expect(gb.getLocus().getLocusName()).toBe("test");
                expect(gb.getLocus().getStrandType()).toBe("ds");
                expect(gb.getLocus().getSequenceLength()).toBe(7);
                expect(gb.getLocus().getNaType()).toBe("DNA");
                expect(gb.getLocus().getLinear()).toBe(false);
                expect(gb.getLocus().getDivisionCode()).toBe("");

                expect(gb.getFeatures().getFeaturesElements().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(3);

                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(5);

                expect(sm.getFeatures()[1].getLocations()[1].getStart()).toBe(0);
                expect(sm.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(0); //"" <<<=== really broken...why???
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(1);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("note");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("note1value");
                
                expect(gb.findKeyword("ORIGIN").getSequence()).toBe("gattaca");
                expect(gb.findKeyword("ORIGIN").getSequence().length).toBe(7);

                //console.log(gb.toString());
            });

            it("fromGenbank() NOT SURE OF OUTPUT",function(){
                var newSM = Ext.create("Teselagen.manager.SequenceManager", {});

                newSM.fromGenbank(newGb);

                expect(newSM.getName()).toBe("test");
                expect(newSM.getCircular()).toBeTruthy();
                expect(newSM.getSequence().seqString()).toBe("gattaca");
                expect(newSM.getFeatures().length).toBe(2);

                expect(newSM.getFeatures()[0].getName()).toBe("note1value");
                expect(newSM.getFeatures()[0].getType()).toBe("feat1");
                expect(newSM.getFeatures()[0].getLocations().length).toBe(1);
                expect(newSM.getFeatures()[0].getStart()).toBe(1);
                expect(newSM.getFeatures()[0].getEnd()).toBe(3); //5
                expect(newSM.getFeatures()[0].getLocations()[0].getStart()).toBe(1);
                expect(newSM.getFeatures()[0].getLocations()[0].getEnd()).toBe(3);
                expect(newSM.getFeatures()[0].getNotes()[0].getValue()).toBe("note1value");

                expect(newSM.getFeatures()[1].getName()).toBe("feat3");
                expect(newSM.getFeatures()[1].getType()).toBe("feat3");
                expect(newSM.getFeatures()[1].getLocations().length).toBe(2);
                expect(newSM.getFeatures()[1].getLocations()[0].getStart()).toBe(2); // 1
                expect(newSM.getFeatures()[1].getLocations()[0].getEnd()).toBe(5);
                expect(newSM.getFeatures()[1].getLocations()[1].getStart()).toBe(0); // 1
                expect(newSM.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                expect(newSM.getFeatures()[1].getNotes().length).toBe(0);
                

            });

            it("fromJbeiSeqXml() THIS STILL NEEDS TO BE WRITTEN",function(){
                var newSM = Ext.create("Teselagen.manager.SequenceManager", {});

                jbeiSeq = "BLAH";

                //newSM.fromJbeiSeqXml(jbeiSeq);
            });

            it("fromFasta() ",function(){

                var fasta = ">DummyName\n" +
                            "GATTACA\n";

                var newSM = Ext.create("Teselagen.manager.SequenceManager", {});

                var seqFeatDNASeq = newSM.fromFasta(fasta);
                expect(seqFeatDNASeq.get("name")).toBe("DummyName");
                expect(seqFeatDNASeq.get("sequence")).toBe("gattaca");
            });
        });

        describe("Blah", function() {
            it("blah",function(){
                expect(false).toBe(false);
            });

        });
    });


    xdescribe("Testing XXXXXXX", function() {

        xdescribe("", function() {
            it("",function(){
                expect(false).toBe(false);
            });

        });
    });
});