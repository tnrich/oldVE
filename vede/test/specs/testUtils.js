/**
 * Unit Tests
 * @author Diana Wong
 */

Ext.require("Ext.Ajax");

//Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
//Ext.require("Teselagen.bio.sequence.common.StrandType");
//Ext.require("Teselagen.bio.sequence.DNATools");
 

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");

Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");

Ext.require("Teselagen.utils.SequenceUtils");
Ext.require("Teselagen.utils.FormatUtils");
Ext.require("Teselagen.utils.DeXmlUtils");
Ext.require("Teselagen.utils.FileUtils");

Ext.onReady(function() {

    describe("Testing Teselagen.utils", function() {

        describe("Testing Teselagen.utils.FileUtils.js", function() {

            it("loadFile()", function() {
                var url = "/biojs/test/data/jbeiseq/signal_peptide.xml";

                var str = Teselagen.utils.FileUtils.loadFile(url);

                expect(str.match(/seq:seq/).length).toBe(1);
            });


        });
        describe("Testing Teselagen.utils.SequenceUtils.js", function() {

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

        describe("Testing Teselagen.utils.FormatUtils.js", function() {

            describe("Format2Format methods: Genbank, JbeiSeqXml, Fasta", function() {
                var sm;
                var mewGb;

                beforeEach(function() {
                    seq = Teselagen.bio.sequence.DNATools.createDNA("GATTACA");
                    feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                        name: "feat1",
                        start: 1,
                        end: 3,
                        type: "CDS",
                        strand: -1,
                        notes: null
                    });

                    feat3   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                        name: "feat3",
                        start: 2,
                        end: 5,
                        type: "gene",
                        strand: 1,
                        notes: null
                    });
                    feat3.getLocations().push(Ext.create("Teselagen.bio.sequence.common.Location", {start:0, end:1}));

                    sm  = Ext.create("Teselagen.manager.SequenceManager", {
                        name: "test",
                        circular: true,
                        sequence: seq,
                        features: [feat1, feat3]
                    });
                    //sm.addFeature(feat3, false);

                    var note1 = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                        name: "note",
                        value: "feat1Value",
                        quoted: true
                    });
                    var note3 = Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                        name: "name",
                        value: "feat3Blah",
                        quoted: true
                    });

                    sm.getFeatures()[0].addNote(note1);
                    sm.getFeatures()[1].addNote(note3);
                    

                    var smLine =  'LOCUS       test                       7 bp ds-DNA     circular     '+ Teselagen.bio.parsers.ParsersManager.todayDate() + '\n' +
                            'FEATURES             Location/Qualifiers\n' +
                            '     CDS             complement(1..3)\n' +
                            '                     /label="feat1"\n' +
                            '                     /note="feat11value"\n' +
                            '     gene            join(2..5,0..1)\n' +
                            '                     /label="feat3"\n' +
                            '                     /name="feat3Blah"\n' +
                            'ORIGIN      \n' +
                            '        1 gattaca     \n';
                    newGb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(smLine);
                });
                  
                it("check SequenceManager test object", function(){
                    expect(sm.getName()).toBe("test");
                    expect(sm.getCircular()).toBeTruthy();
                    expect(sm.getSequence().seqString().toUpperCase()).toBe("GATTACA");
                    expect(sm.getFeatures().length).toBe(2);
                    expect(sm.getFeatures()[0].getName()).toBe("feat1");
                    expect(sm.getFeatures()[0].getStart()).toBe(1);
                    expect(sm.getFeatures()[0].getEnd()).toBe(3);
                    expect(sm.getFeatures()[1].getName()).toBe("feat3");
                    expect(sm.getFeatures()[1].getLocations()[0].getStart()).toBe(2);
                    expect(sm.getFeatures()[1].getLocations()[0].getEnd()).toBe(5);
                    expect(sm.getFeatures()[1].getLocations()[1].getStart()).toBe(0);
                    expect(sm.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                });

                it("check Genbank test object",function(){
                    var gb = newGb;
                    
                    expect(gb.getLocus().getLocusName()).toBe("test");
                    expect(gb.getLocus().getStrandType()).toBe("ds");
                    expect(gb.getLocus().getSequenceLength()).toBe(7);
                    expect(gb.getLocus().getNaType()).toBe("DNA");
                    expect(gb.getLocus().getLinear()).toBe(false);
                    expect(gb.getLocus().getDivisionCode()).toBe("");

                    expect(gb.getFeatures().getFeaturesElements().length).toBe(2);

                    expect(gb.getFeatures().getFeaturesElements()[0].getComplement()).toBe(true);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(1);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(3);

                    expect(gb.getFeatures().getFeaturesElements()[1].getJoin()).toBe(true);
                    expect(gb.getFeatures().getFeaturesElements()[1].getComplement()).toBe(false);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(2);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(2);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(5);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(0);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(1);

                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("feat1");
                    
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureQualifier()[0].getName()).toBe("label");
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureQualifier()[0].getValue()).toBe("feat3");
                    
                    expect(gb.getOrigin().getSequence()).toBe("gattaca");
                    expect(gb.getOrigin().getSequence().length).toBe(7);

                    //console.log(gb.toString());
                });
                
                it("fastaToFeaturedDNASequence() ",function(){
                    var fasta = ">DummyName\n" +
                                "GATTACA\n";

                    var seqFeatDNASeq = Teselagen.utils.FormatUtils.fastaToFeaturedDNASequence(fasta);
                    expect(seqFeatDNASeq.get("name")).toBe("DummyName");
                    expect(seqFeatDNASeq.get("sequence")).toBe("gattaca");
                });

                it("fastaToSequenceManager() ",function(){
                    var fasta = ">DummyName\n" +
                                "GATTACA\n";

                    var newSM = Teselagen.utils.FormatUtils.fastaToSequenceManager(fasta);
                    expect(newSM.getName()).toBe("DummyName");
                    expect(newSM.getCircular()).toBe(false);
                    expect(newSM.getSequence().seqString()).toBe("gattaca");
                });

                it("sequenceManagerToFeaturedDNASequence() TESTS FOR FEATURES ARE FAULTY",function(){
                    var featDNASeq = Teselagen.utils.FormatUtils.sequenceManagerToFeaturedDNASequence(sm);
                    //expect(true).toBe(false);

                    expect(featDNASeq.get("name")).toBe("test");
                    expect(featDNASeq.get("sequence")).toBe("gattaca");
                    expect(featDNASeq.get("isCircular")).toBe(true);
                    expect(featDNASeq.get("features").length).toBe(2);
                    expect(featDNASeq.get("features")).toEqual(sm.getFeatures());
                });


                it("jbeiseqJsonToSequenceManager()",function(){
                    var json  = Teselagen.utils.FormatUtils.sequenceManagerToJbeiseqJson(sm);
                    var sm2   = Teselagen.utils.FormatUtils.jbeiseqJsonToSequenceManager(json);

                    //console.log(JSON.stringify(json, null, "  "));

                    expect(sm2.getName()).toBe("test");
                    expect(sm2.getCircular()).toBeTruthy();
                    expect(sm2.getSequence().seqString()).toBe("gattaca");
                    expect(sm2.getFeatures().length).toBe(2);
                    expect(sm2.getFeatures()[0].getName()).toBe("feat1");
                    expect(sm2.getFeatures()[0].getType()).toBe("CDS");
                    expect(sm2.getFeatures()[0].getLocations()[0].getStart()).toBe(1);
                    expect(sm2.getFeatures()[0].getLocations()[0].getEnd()).toBe(3);
                    expect(sm2.getFeatures()[1].getName()).toBe("feat3");
                    expect(sm2.getFeatures()[1].getType()).toBe("gene");
                    expect(sm2.getFeatures()[1].getLocations()[0].getStart()).toBe(2);
                    expect(sm2.getFeatures()[1].getLocations()[0].getEnd()).toBe(5);
                    expect(sm2.getFeatures()[1].getLocations()[1].getStart()).toBe(0);
                    expect(sm2.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                });

                it("sequenceManagerTojbeiseqJson() - double checked with jbeiseqJson2Genbank",function(){
                    var json  = Teselagen.utils.FormatUtils.sequenceManagerToJbeiseqJson(sm);

                    expect(json["seq:seq"]["seq:name"]).toBe("test");
                    expect(json["seq:seq"]["seq:circular"]).toBe(true);
                    expect(json["seq:seq"]["seq:sequence"]).toBe("gattaca");
                    expect(json["seq:seq"]["seq:features"].length).toBe(2);

                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:label"]).toBe("feat1");
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:type"]).toBe("CDS");
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"].length).toBe(1);
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(2); //toBe(1);
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(3);

                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:label"]).toBe("feat3");
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:type"]).toBe("gene");
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"].length).toBe(2);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(3);//toBe(2);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(5);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][1]["seq:genbankStart"]).toBe(1);//toBe(0);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][1]["seq:end"]).toBe(1);

                    var gb    = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(json);
                    expect(gb.toString()).toEqual(newGb.toString());
                });
                
                it("sequenceManagerToJbeiseqXml() - checked with jbeiseqXmlToJson",function(){
                    var xml  = Teselagen.utils.FormatUtils.sequenceManagerToJbeiseqXml(sm);
                    var json = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson(xml);

                    expect(json["seq:seq"]["seq:name"]).toBe("test");
                    expect(json["seq:seq"]["seq:circular"]).toBe(true);
                    expect(json["seq:seq"]["seq:sequence"]).toBe("gattaca");
                    expect(json["seq:seq"]["seq:features"].length).toBe(2);

                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:label"]).toBe("feat1");
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:type"]).toBe("CDS");
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"].length).toBe(1);
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(2);//toBe(1);
                    expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(3);

                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:label"]).toBe("feat3");
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:type"]).toBe("gene");
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"].length).toBe(2);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(3);//toBe(2);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(5);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][1]["seq:genbankStart"]).toBe(1);//toBe(0);
                    expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][1]["seq:end"]).toBe(1);

                    var gb    = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(json);
                    expect(gb.toString()).toEqual(newGb.toString());
                });

                it("jbeiseqXmlToSequenceManager() - checked with back and forth format change",function(){
                    var xml   = Teselagen.utils.FormatUtils.sequenceManagerToJbeiseqXml(sm);
                    var sm2   = Teselagen.utils.FormatUtils.jbeiseqXmlToSequenceManager(xml);

                    expect(sm2.getName()).toBe("test");
                    expect(sm2.getCircular()).toBeTruthy();
                    expect(sm2.getSequence().seqString()).toBe("gattaca");
                    expect(sm2.getFeatures().length).toBe(2);
                    expect(sm2.getFeatures()[0].getName()).toBe("feat1");
                    expect(sm2.getFeatures()[0].getType()).toBe("CDS");
                    expect(sm2.getFeatures()[0].getLocations()[0].getStart()).toBe(1);
                    expect(sm2.getFeatures()[0].getLocations()[0].getEnd()).toBe(3);
                    expect(sm2.getFeatures()[1].getName()).toBe("feat3");
                    expect(sm2.getFeatures()[1].getType()).toBe("gene");
                    expect(sm2.getFeatures()[1].getLocations()[0].getStart()).toBe(2);
                    expect(sm2.getFeatures()[1].getLocations()[0].getEnd()).toBe(5);
                    expect(sm2.getFeatures()[1].getLocations()[1].getStart()).toBe(0);
                    expect(sm2.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                });

                it("sequenceManagerToGenbank()",function(){
                    var gb  = Teselagen.utils.FormatUtils.sequenceManagerToGenbank(sm);

                    expect(gb.getLocus().getLocusName()).toBe("test");
                    //expect(gb.getLocus().getStrandType()).toBe("ds");
                    expect(gb.getLocus().getSequenceLength()).toBe(7);
                    expect(gb.getLocus().getNaType()).toBe("DNA");
                    expect(gb.getLocus().getLinear()).toBe(false);
                    expect(gb.getLocus().getDivisionCode()).toBe("");

                    expect(gb.getFeatures().getFeaturesElements().length).toBe(2);

                    expect(gb.getFeatures().getFeaturesElements()[0].getComplement()).toBe(true);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(1);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(2);//toBe(1);
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(3);

                    expect(gb.getFeatures().getFeaturesElements()[1].getJoin()).toBe(true);
                    expect(gb.getFeatures().getFeaturesElements()[1].getComplement()).toBe(false);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(2);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(3);//toBe(2);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(5);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(1);//toBe(0);
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(1);

                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                    expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("feat1");
                    
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureQualifier()[0].getName()).toBe("label");
                    expect(gb.getFeatures().getFeaturesElements()[1].getFeatureQualifier()[0].getValue()).toBe("feat3");
                    
                    expect(gb.getOrigin().getSequence()).toBe("gattaca");
                    expect(gb.getOrigin().getSequence().length).toBe(7);

                    //console.log(newGb.toString());
                    //console.log(gb.toString());
                });

                it("genbankToSequenceManager()",function(){
                    var sm2   = Teselagen.utils.FormatUtils.genbankToSequenceManager(newGb);

                    expect(sm2.getName()).toBe("test");
                    expect(sm2.getCircular()).toBeTruthy();
                    expect(sm2.getSequence().seqString()).toBe("gattaca");
                    expect(sm2.getFeatures().length).toBe(2);
                    expect(sm2.getFeatures()[0].getName()).toBe("feat1");
                    expect(sm2.getFeatures()[0].getType()).toBe("CDS");
                    expect(sm2.getFeatures()[0].getLocations()[0].getStart()).toBe(0);//toBe(1);
                    expect(sm2.getFeatures()[0].getLocations()[0].getEnd()).toBe(3);
                    expect(sm2.getFeatures()[1].getName()).toBe("feat3");
                    expect(sm2.getFeatures()[1].getType()).toBe("gene");
                    expect(sm2.getFeatures()[1].getLocations()[0].getStart()).toBe(1);//toBe(2);
                    expect(sm2.getFeatures()[1].getLocations()[0].getEnd()).toBe(5);
                    expect(sm2.getFeatures()[1].getLocations()[1].getStart()).toBe(-1);//toBe(0);
                    expect(sm2.getFeatures()[1].getLocations()[1].getEnd()).toBe(1);
                });

                
            });

            xdescribe("Blah", function() {
                it("blah",function(){
                    expect(false).toBe(false);
                });

            });
        });


        describe("Testing Teselagen.utils.DeXmlUtils.js", function() {

            describe("checkDeXmlToJson()", function() {
                it("Correctly Identifies a good file",function(){
                    var url = "/vede/test/data/dexml/DeviceEditor_forTest.xml";
                    var xml = jasmine.getFixtures().read(url);
                    var rawJson = Teselagen.bio.util.XmlToJson.xml_str2json(xml);

                    var okJson = {};
                    var valid = true;
                    try {
                        okJson   = Teselagen.utils.DeXmlUtils.validateRawDeJson(rawJson);
                    } catch (e) {
                        console.warn("Incorrectly caught: " + e.message);
                        valid = false;
                    }

                    expect(JSON.stringify(rawJson)).toBe(JSON.stringify(okJson));
                    expect(valid).toBe(true);
                });
            });

            describe("deXmlToJson()", function() {

                it("Correctly opens DeviceEditor_forTest.xml",function(){
                    var url = "/vede/test/data/dexml/DeviceEditor_forTest.xml";
                    var xml = jasmine.getFixtures().read(url);

                    var json = Teselagen.utils.DeXmlUtils.deXmlToJson(xml);

                    //console.log(xml);
                    //console.log(JSON.stringify(json, null, "    "));

                    expect(json["de:design"]["xsi:schemaLocation"]).toBe("http://jbei.org/device_editor design.xsd");
                    expect(json["de:design"]["de:sequenceFiles"]["de:sequenceFile"]).not.toBe(undefined);
                    //expect(json["de:design"]["de:sequenceFiles"]["de"])
                });

                it("Opens default examples from DE",function(){

                    var url = "/vede/test/data/dexml/Golden_Gate_example.xml";
                    //var url = "/vede/test/data/dexml/SLIC_Gibson_CPEC_example.xml";
                    //var url = "/vede/test/data/dexml/Combinatorial_Golden_Gate_example.xml";
                    //var url = "/vede/test/data/dexml/Combinatorial_SLIC_Gibson_CPEC_example.xml";
                    var xml = jasmine.getFixtures().read(url);

                    var json1 = Teselagen.bio.util.XmlToJson.xml_str2json(xml);
                    //console.log(json1);
                    var cleanJson1 = Teselagen.utils.DeXmlUtils.validateRawDeJson(json1);
                    //console.log(cleanJson1);
                    //expect(json1).toBe(cleanJson1);

                    var json = Teselagen.utils.DeXmlUtils.deXmlToJson(xml);
                    //console.log(JSON.stringify(json, null, "    "));
                    expect(json).not.toBe(null);
                });

            });
        });
        
        describe("Testing Teselagen.utils.NullableInt.js", function() {
            it("Creates Empty NullableInt",function(){
                var nullInt = Ext.create("Teselagen.utils.NullableInt");
                expect(nullInt).not.toBe(null);
            });
            it("Creates NullableInt",function(){
                var nullInt = Ext.create("Teselagen.utils.NullableInt", {
                    value: 10
                });
                expect(nullInt.getValue()).toBe(10);
            });
            it("toString()",function(){
                var nullInt = Ext.create("Teselagen.utils.NullableInt", {
                    value: 10
                });
                expect(nullInt.toString()).toBe("10");
            });

        });
    });
});