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
            var fastaStr, fasta
            var gbStr, gb;
            var jbeiXmlUrl;

            beforeEach(function() {
                seqStr = "GATTACA";
                seq = Teselagen.bio.sequence.DNATools.createDNA(seqStr);

                fastaStr = ">DummyName\n" +
                            "GATTACA\n";

                gbStr = 'LOCUS       test                       7 bp ds-DNA     circular     30-JUL-2012\n' + 
                        'FEATURES             Location/Qualifiers\n' +
                        '     feat1           1..3\n' +
                        '                     /note="note1value"\n' +
                        '     feat3           join(0..1,2..5)\n' +
                        'ORIGIN      \n' +
                        '        1 gattaca     \n';
                gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(gbStr);

                //jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                jbeiXmlUrl = "/biojs/test/data/jbeiseq/test.xml";
            });
            
            it("checkGenbank() ",function(){
                
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
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(0);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(5);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("note");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("note1value");
                
                expect(gb.getOrigin().getSequence()).toBe("gattaca");
                expect(gb.getOrigin().getSequence().length).toBe(7);
            });

            it("fastaToGenbank()", function() {
                var newGb = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(fastaStr);

                expect(newGb.getLocus().getLocusName()).toBe("DummyName");
                expect(newGb.getOrigin().getSequence()).toBe("gattaca");
                //if (LOG) console.log(newGb.toString());
                jasmine.log(newGb.toString());
            });

            it("genbankToFasta()", function() {

                var newFasta = Teselagen.bio.parsers.ParsersManager.genbankToFasta(gb);
                expect(newFasta).toBe(">test\ngattaca");
                
            });

            it("loadFile(): wrong url and right url", function() {
                //wrong
                var jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal";
                var flag = false;
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                } catch (bio) {
                    flag = true;
                    console.warn('Caught: ' + bio.message);
                }
                expect(flag).toBe(true);
                
                //right
                var jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var flag = false;
                try {
                    var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                } catch (bio) {
                    flag = true;
                    console.warn('Caught: ' + bio.message);
                }
                expect(flag).toBe(false);
                
            });

            it("Can also load files using jasmine.getFixtures().read()", function() {
                
                try {
                    var jbeiXml = jasmine.getFixtures().read(jbeiXmlUrl);
                    var flag = false;
                } catch (bio) {
                    console.warn("Caught: " + bio.message);
                    var flag = true;
                }
                expect(flag).toBe(false);
            });

            it("jbeiseqxmlToGenbank(): One record in .xml file", function() {

                jbeiXmlUrl = "/biojs/test/data/jbeiseq/test.xml";

                //var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                var jbeiXml = jasmine.getFixtures().read(jbeiXmlUrl);
                //console.log(jbeiXml);
                try {
                    var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXml);
                    if (LOG) console.log(gb.toString());
                    if (LOG) console.log(JSON.stringify(gb, null, "    "));
                } catch (e) {
                    console.warn("Caught: " + e.message);
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

                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation().length).toBe(1);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(20);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(20);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("label");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("signal_peptide");

                expect(gb.getOrigin().getSequence().length).toBe(64);
            });

            it("jbeiseqxmlToGenbank(): Multiple records in .xml file", function() {
                jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                gbArr = [];

                //var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                var jbeiXml = jasmine.getFixtures().read(jbeiXmlUrl);
                jbeiXml += jbeiXml;
                //console.log(jbeiXml);
                var xmlArr  = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlsToXmlArray(jbeiXml);
                //console.log(xmlArr);
                try {
                    for (var i=0; i < xmlArr.length; i++ ) {
                        var gb      = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXml);
                        gbArr.push(gb);
                        //if (LOG) console.log(gb.toString());
                        //if (LOG) console.log(JSON.stringify(gb, null, "    "));
                    }
                } catch (e) {
                    console.warn("Caught: " + e.message);
                }
                expect(gbArr.length).toBe(2);
            });

            it("genbankToJbeiseqxml() --- NEEDS TESTS", function() {
                var jbeiXmlUrl  = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var jbeiXmlStr  = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                //var jbeiXmlJson = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToJson(jbeiXmlStr);

                if (LOG) console.log(jbeiXmlStr);
               // if (LOG) console.log(JSON.stringify(jbeiXmlJson, null, "    "));

                var gb          = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXmlStr);
                console.log(gb.toString());
                var gb2xml      = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqxml(gb);
                console.log(gb2xml);

            });

            it("genbankToJbeiseqJson() ---- NEEDS TESTS", function() {
                var jbeiXmlUrl  = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var jbeiXmlStr  = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                //var jbeiXmlJson = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToJson(jbeiXmlStr);

                var gb          = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXmlStr);
                console.log(gb.toString());
                var gb2jbeiJSON      = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqJson(gb);
                console.log(gb2jbeiJSON);

            });

            it("jbeiseqxmlToJson() -- cleaned NEEDS TESTS", function() {
                var jbeiXmlUrl  = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                var jbeiXmlStr  = Teselagen.bio.parsers.ParsersManager.loadFile(jbeiXmlUrl);
                var jbeiXmlJson = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToJson(jbeiXmlStr);

                if (LOG) console.log(jbeiXmlStr);
                if (LOG) console.log(JSON.stringify(jbeiXmlJson, null, "    "));

                var gb          = Teselagen.bio.parsers.ParsersManager.jbeiseqxmlToGenbank(jbeiXmlStr);
                console.log(gb.toString());
                var gb2xml      = Teselagen.bio.parsers.ParsersManager.genbankToJbeiseqxml(gb);
                console.log(gb2xml);

            });

            it("genbankToSbol()", function() {
                
            });

            it("sbolToGenbank()", function() {
                
            });

            
        });



//===================================================================================================

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

        xdescribe("Toy Testing: Ext.data.Store", function() {

            it("xml testing", function() {
                var xml =Teselagen.bio.parsers.ParsersManager.loadXml("/biojs/src/teselagen/bio/enzymes/assets/common.xml");

                //console.log(xml);
                var enzymeList = new Array();
                
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

            it("xml testing", function() {
                var xml =Teselagen.bio.parsers.ParsersManager.loadXml("/biojs/test/data/jbeiseq/signal_peptide.xml");

                //console.log(xml);
                var enzymeList = new Array();
                
                // Define an Ext model "Enzyme" to make reading from XML data possible.
                Ext.define("Jbei", {
                    extend: "Ext.data.Model",
                    fields: [{name: "name",     mapping: "seq:name"},
                             {name: "circular", mapping: "seq:circular"},
                             {name: "features", mapping: "seq:features"},
                             {name: "sequence", mapping: "seq:sequence"}
                             ]
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
                        reader: {
                            type: "xml",
                            record: "seq:seq"//,
                            //root: "enzymes"
                        }
                    }
                });
                //console.log(memstore.getCount());



            });

        });


    });
});