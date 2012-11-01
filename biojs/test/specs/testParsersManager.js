/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.common.StrandType");
Ext.require("Teselagen.bio.sequence.DNATools");
 
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");
Ext.onReady(function() {

    var LOG = true;

    GenbankManager = Teselagen.bio.parsers.GenbankManager;
    ParsersManager = Teselagen.bio.parsers.ParsersManager;

    describe("ParsersManager Unit Testing:", function() {
        describe("Teselagen.bio.parsers.ParsersManager.", function() {
            var seqStr, seq;
            var feat1, note1;
            var sm;
            var fastaStr, fasta;
            var gbStrl;
            var gb = null;
            //var gbA;
            var gbB;
            var jbeiXmlUrl;

            beforeEach(function() {
                seqStr = "GATTACA";
                seq = Teselagen.bio.sequence.DNATools.createDNA(seqStr);

                fastaStr = ">DummyName\n" +
                            "GATTACA\n";

                /*gbStrA = 'LOCUS       test                       7 bp ds-DNA     circular     30-JUL-2012\n' +
                        'FEATURES             Location/Qualifiers\n' +
                        '     feat1           1..3\n' +
                        '                     /note="note1value"\n' +
                        '     feat3           join(0..1,2..5)\n' +
                        'ORIGIN      \n' +
                        '        1 gattaca     \n';
                gbA = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(gbStrA);*/

                gbStrB = 'LOCUS       signal_pep                63 bp    DNA     linear       '+ Teselagen.bio.parsers.ParsersManager.todayDate() + '\n' +
                        'FEATURES             Location/Qualifiers\n' +
                        '     CDS             join(1..63,100..6300)\n' +
                        '                     /label="signal_peptide"\n' +
                        '                     /translation="GSKVYGKEQFLRMRQSMFPDR"\n' +
                        'ORIGIN      \n' +
                        '        1 GGCAGCAAGG TCTACGGCAA GGAACAGTTT TTGCGGATGC GCCAGAGCAT GTTCCCCGAT\n' +
                        '       61 CGC\n' +
                        '// ';
                gbB = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(gbStrB);

                //jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                jbeiXmlUrl = "/biojs/test/data/jbeiseq/test.xml";
            });
            
            it("check Genbank",function(){

                //var gb = null;
                gb = gbB;
                expect(gb.getLocus().getLocusName()).toBe("signal_pep");
                expect(gb.getLocus().getStrandType()).toBe("");
                expect(gb.getLocus().getSequenceLength()).toBe(63);
                expect(gb.getLocus().getNaType()).toBe("DNA");
                expect(gb.getLocus().getLinear()).toBe(true);
                expect(gb.getLocus().getDivisionCode()).toBe("");

                expect(gb.getFeatures().getFeaturesElements().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(63);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getStart()).toBe(100);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getEnd()).toBe(6300);
                expect(gb.getFeatures().getFeaturesElements()[0].getComplement()).toBe(false);
                expect(gb.getFeatures().getFeaturesElements()[0].getJoin()).toBe(true);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("signal_peptide");

                expect(gb.getOrigin().getSequence().length).toBe(63);
            });

            it("fastaToGenbank()", function() {
                var newGb = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(fastaStr);

                expect(newGb.getLocus().getLocusName()).toBe("DummyName");
                expect(newGb.getOrigin().getSequence()).toBe("gattaca");
                //if (LOG) console.log(newGb.toString());
                jasmine.log(newGb.toString());
            });

            it("genbankToFasta()", function() {

                var gb = gbB;
                var newFasta = Teselagen.bio.parsers.ParsersManager.genbankToFasta(gbB);
                //expect(newFasta).toBe(">dummy\ngattaca");
                expect(newFasta).toBe(">signal_pep\nGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGC");
                
            });

            it("loadFile(): wrong url and right url", function() {
                //wrong
                var jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal";
                var flag = false;
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                    //var jbeiXml = jasmine.getFixtures().read(url);
                } catch (bio) {
                    flag = true;
                    console.warn('Correctly Caught: ' + bio.message);
                }
                expect(flag).toBe(true);
                
                //right
                var jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var flag = false;
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                    //var jbeiXml = jasmine.getFixtures().read(url);
                } catch (bio) {
                    flag = true;
                    console.warn('Unexpectedly Caught: ' + bio.message);
                }
                expect(flag).toBe(false);
                
            });

            it("Can also load files using jasmine.getFixtures().read()", function() {
                var flag = false;
                try {
                    var jbeiXml = jasmine.getFixtures().read(jbeiXmlUrl);
                } catch (bio) {
                    console.warn("Correctly Caught: " + bio.message);
                    flag = true;
                }
                expect(flag).toBe(false);
            });

            /* // THIS DOES NOT WORK CORRECTLY, ONLY USE THE xml2json utility
            it("Can interchange xml<->json using Teselagen.bio.util.XmlToJson.js correctly", function() {
                var url      = "/biojs/test/data/jbeiseq/test.xml";
                var xmlStr   = Teselagen.bio.parsers.ParsersManager.loadFile(url);
                if (LOG) console.log(xmlStr);
                var json     = Teselagen.bio.util.XmlToJson.xml_str2json(xmlStr);
                //if (LOG) console.log(JSON.stringify(json, null, "  "));
                var xml2     = Teselagen.bio.util.XmlToJson.json2xml_str(json);
                if (LOG) console.log(xml2);
            });
            */
            it("jbeiseqXmlToJson(): Null case", function() {
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson("");
                    var flag = false;
                } catch (e) {
                    console.warn("Correctly Caught: " + e.message);
                    var flag = true;
                }
                expect(flag).toBe(true);
            });

            it("jbeiseqXmlToJson() & jbeiseqJsonToXml(): Does xml->json->xml2->json2 yield json===json2?", function() {
                var url      = "/biojs/test/data/jbeiseq/test.xml";
                //var url      = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                //var jbeiXml  = Teselagen.bio.parsers.ParsersManager.loadFile(url);
                var jbeiXml = jasmine.getFixtures().read(url);
                var jbeiJson = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson(jbeiXml);

                //console.log(jbeiXml);
                //console.log(JSON.stringify(XmlToJson.xml_str2json(jbeiXml), null, "  "));
                //console.log(JSON.stringify(jbeiJson, null, "  "));

                var jbeiXml2 = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToXml(jbeiJson);
                //if (LOG) console.log(jbeiXml2);

                var jbeiJson2 = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToJson(jbeiXml2);
                //if (LOG) console.log(JSON.stringify(jbeiJson2, null, "  "));
                expect(jbeiJson).toEqual(jbeiJson2);

            });
            
            it("jbeiseqXmlToGenbank()/jbeiseqJsonToGenbank(): Null case", function() {
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank("");
                    var flag = false;
                } catch (e) {
                    console.warn("Correctly Caught: " + e.message);
                    var flag = true;
                }
                expect(flag).toBe(true);
            });

            it("jbeiseqXmlToGenbank()/jbeiseqJsonToGenbank(): One record in .xml file", function() {

                url = "/biojs/test/data/jbeiseq/test.xml";

                //var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                var jbeiXml = jasmine.getFixtures().read(url);
                //console.log(jbeiXml);
                try {
                    //console.log(Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToJson(jbeiXml));
                    var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank(jbeiXml);
                    //if (LOG) console.log(gb.toString());
                    //if (LOG) console.log(JSON.stringify(gb, null, "    "));
                } catch (e) {
                    console.warn("Unexpectedly Caught: " + e.message);
                }
                expect(gb.getLocus().getLocusName()).toBe("signal_pep");
                expect(gb.getLocus().getStrandType()).toBe("");
                expect(gb.getLocus().getSequenceLength()).toBe(64);
                expect(gb.getLocus().getNaType()).toBe("DNA");
                expect(gb.getLocus().getLinear()).toBe(true);
                expect(gb.getLocus().getDivisionCode()).toBe("");

                expect(gb.getFeatures().getFeaturesElements().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(63);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getStart()).toBe(100);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getEnd()).toBe(6300);
                expect(gb.getFeatures().getFeaturesElements()[0].getComplement()).toBe(false);
                expect(gb.getFeatures().getFeaturesElements()[0].getJoin()).toBe(true);

                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(20);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(20);
                expect(gb.getFeatures().getFeaturesElements()[1].getComplement()).toBe(true);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("signal_peptide");

                expect(gb.getOrigin().getSequence().length).toBe(64);
            });
            
            it("jbeiseqXmlToGenbank()/jbeiseqJsonToGenbank(): Multiple records in .xml file using jbeiseqxmlsToXmlArray()", function() {
                var url1 = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var url2 = "/biojs/test/data/jbeiseq/test.xml";
                var gbArr = [];

                //alternative way to load it, not using jasmine
                //var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);

                //using jasmine to load
                var jbeiXml = jasmine.getFixtures().read(url1) + jasmine.getFixtures().read(url2);
                var xmlArr  = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlsToXmlArray(jbeiXml);
                try {
                    for (var i=0; i < xmlArr.length; i++ ) {
                        //if (LOG) console.log(xmlArr[i]);
                        var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank(xmlArr[i]);
                        gbArr.push(gb);
                        //if (LOG) console.log(gb.toString());
                        //if (LOG) console.log(JSON.stringify(gb, null, "    "));
                    }
                } catch (e) {
                    console.warn("Unexpectedly Caught: " + e.message);
                }
                expect(gbArr.length).toBe(2);
            });
            
            
            it("genbankToJbeiseqJson(): explicit json structure tests", function() {
                var gb = gbB;
                var json = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqJson(gb);

                expect(json["seq:seq"]["seq:name"]).toBe("signal_pep");
                expect(json["seq:seq"]["seq:circular"]).toBe(false);
                expect(json["seq:seq"]["seq:sequence"].length).toBe(63);
                expect(json["seq:seq"]["seq:features"].length).toBe(1);

                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:label"]).toBe("signal_peptide");
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:type"]).toBe("CDS");
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"].length).toBe(2);
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(1);
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(63);
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][1]["seq:genbankStart"]).toBe(100);
                expect(json["seq:seq"]["seq:features"][0]["seq:feature"]["seq:location"][1]["seq:end"]).toBe(6300);

                //expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:label"]).toBe("signal_peptide0");
                //expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:type"]).toBe("CDS2");
                //expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"].length).toBe(1);
                //expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:genbankStart"]).toBe(20);
                //expect(json["seq:seq"]["seq:features"][1]["seq:feature"]["seq:location"][0]["seq:end"]).toBe(20);
            });
            
            
            it("jbeiseqJsonToGenbank(): explicit genbank structure tests", function() {
                var gb = gbB;
                var json = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqJson(gb);

                var gb2      = Teselagen.bio.parsers.ParsersManager.jbeiseqJsonToGenbank(json);
                expect(gb).toEqual(gb2);

                var gb = gb2;
                expect(gb.getLocus().getLocusName()).toBe("signal_pep");
                expect(gb.getLocus().getStrandType()).toBe("");
                expect(gb.getLocus().getSequenceLength()).toBe(63);
                expect(gb.getLocus().getNaType()).toBe("DNA");
                expect(gb.getLocus().getLinear()).toBe(true);
                expect(gb.getLocus().getDivisionCode()).toBe("");

                expect(gb.getFeatures().getFeaturesElements().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation().length).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getStart()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[0].getEnd()).toBe(63);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getStart()).toBe(100);
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureLocation()[1].getEnd()).toBe(6300);
                expect(gb.getFeatures().getFeaturesElements()[0].getComplement()).toBe(false);
                expect(gb.getFeatures().getFeaturesElements()[0].getJoin()).toBe(true);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("signal_peptide");

                expect(gb.getOrigin().getSequence().length).toBe(63);
            });
            
            
            it("genbankToJbeiseqxml() & jbeiseqXmlToGenbank(): back and forth", function() {
                var gb   = gbB;
                var xml  = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqXml(gb);
                
                var gb2  = Teselagen.bio.parsers.ParsersManager.jbeiseqXmlToGenbank(xml);
                var xml2 = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqXml(gb);

                expect(gb).toEqual(gb2);
                expect(xml).toEqual(xml2);

            });

            it("sbolXmlToJson()--- THIS DOES NOT WORK", function() {
                var url = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
                var xml = jasmine.getFixtures().read(url);
                //console.log(xml);

                //var json = ParsersManager.sbolXmlToJson(xml);

                //console.log(JSON.stringify(json, null, "  "));

                
            });

            /*it("genbankToSbol()", function() {
                
            });

            it("sbolToGenbank()", function() {
                
            });*/

            
        });



//===============================================================================

        xdescribe("Toy Testing: Xml2Json", function() {

            it("XmlToJson: json2xml", function(){

                var xmlDoc = Teselagen.bio.util.XmlToJson.json2xml_str(
                    {
                        MyRoot : {
                            MyChild : 'my_child_value',
                            MyAnotherChild: 10,
                            MyArray : [ 'test', 'test2' ],
                            MyArrayRecords : [
                                {
                                    ttt : 'vvvv'
                                },
                                {
                                    ttt : 'vvvv2'
                                }
                            ]
                        }
                    }
                );

                console.log(xmlDoc);

                var jsonObj = Teselagen.bio.util.XmlToJson.xml_str2json(xmlDoc);
                console.log(JSON.stringify(jsonObj, null, "  "));

            });
        });

        describe("Toy Testing: Ext.data.Store", function() {

            it("xml testing", function() {
                var xml =Teselagen.bio.parsers.ParsersManager.loadFile("/biojs/src/teselagen/bio/enzymes/assets/common.xml");

                //console.log(xml);
                var enzymeList = [];
                
                // Define an Ext model "Enzyme" to make reading from XML data possible.
                Ext.define("Enzyme", {
                    extend: "Ext.data.Model",
                    fields: [{name: "name", mapping: "n"},
                             {name: "site", mapping: "s"},
                             {name: "forwardRegex", mapping: "fr"},
                             {name: "reverseRegex", mapping: "rr"},
                             {name: "cutType", type: "int", mapping: "c"},
                             {name: "dsForward", type: "int", mapping: "ds > df"},
                             {name: "dsReverse", type: "int", mapping: "ds > dr"},
                             {name: "usForward", type: "int", mapping: "us > uf"},
                             {name: "usReverse", type: "int", mapping: "us > ur"}]
                });
                
                var doc = new DOMParser().parseFromString(xml, "text/xml");
                //console.log(doc);
                // Define a store which will hold the data read from XML.
                var memstore = new Ext.data.Store({
                    autoLoad: true,
                    model: "Enzyme",
                    data : doc,
                    proxy: {
                        type: "memory",
                        reader: {
                            type: "xml",
                            record: "e",
                            root: "enzymes"
                        }
                    }
                });
                //console.log(memstore);
                //console.log(memstore.getCount());
            });
        });

        describe("Toy Testing: Ext.data.Store", function() {

            it("xml testing", function() {
                var url = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                //var xml = Teselagen.bio.parsers.ParsersManager.loadFile(url);
                var xml = jasmine.getFixtures().read(url);
                
                // Define an Ext model "Enzyme" to make reading from XML data possible.
                Ext.define("Jbei", {
                    extend: "Ext.data.Model",
                    //fields: [{name: "name",     mapping: "name"},
                    //         {name: "circular", mapping: "seq:circular"},
                    //         {name: "features", mapping: "seq:features"},
                    //         {name: "sequence", mapping: "seq:sequence"}
                    //         ]
                    fields: ["name", "circular", "features", "sequence"]
                });
                
                var doc = new DOMParser().parseFromString(xml, "text/xml");
                //console.log(doc);
                // Define a store which will hold the data read from XML.
                var memstore = new Ext.data.Store({
                    autoLoad: true,
                    model: "Jbei",
                    data : doc,
                    proxy: {
                        type: "memory",
                        //type: "ajax",
                        //url: url,
                        reader: {
                            type: "xml",
                            record: "seq:seq"//,
                            //root: "enzymes"
                        }
                    }
                });
                console.log(memstore.getCount());
                var tmp = memstore.getAt(0);
                console.log(tmp);
            });
        });

    });
});