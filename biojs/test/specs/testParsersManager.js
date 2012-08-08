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
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");
Ext.onReady(function() {

    GenbankManager: Teselagen.bio.parsers.GenbankManager,

    describe("ParsersManager Unit Testing:", function() {
        describe("Blah", function() {
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
                        '     feat3           join(2..5,0..1)\n' +
                        'ORIGIN      \n' +
                        '        1 gattaca     \n';
                gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(gbStr);

                jbeiXmlUrl = "/biojs/test/data/jbeiseq/signal_peptide.xml";
                //jbeiXmlUrl = "/biojs/test/data/jbeiseq/test.xml";
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
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getStart()).toBe(2);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[0].getEnd()).toBe(5);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getStart()).toBe(0);
                expect(gb.getFeatures().getFeaturesElements()[1].getFeatureLocation()[1].getEnd()).toBe(1);

                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getName()).toBe("note");
                expect(gb.getFeatures().getFeaturesElements()[0].getFeatureQualifier()[0].getValue()).toBe("note1value");
                
                expect(gb.getOrigin().getSequence()).toBe("gattaca");
                expect(gb.getOrigin().getSequence().length).toBe(7);
            });
            it("fastaToGenbank", function() {
                var newGb = Teselagen.bio.parsers.ParsersManager.fastaToGenbank(fastaStr);

                expect(newGb.getLocus().getLocusName()).toBe("DummyName");
                expect(newGb.getOrigin().getSequence()).toBe("gattaca");
            });

            it("genbankToFasta", function() {

                var newFasta = Teselagen.bio.parsers.ParsersManager.genbankToFasta(gb);
                expect(newFasta).toBe(">test\ngattaca");
                
            });

            it("loadXml", function() {

                var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadXml(jbeiXmlUrl);
                console.log(jbeiXml);

                var gbArr = Teselagen.bio.parsers.ParsersManager.parseJbeiseqxml(jbeiXml, jbeiXmlUrl);

                console.log(gbArr);

                /*gbArr.each(function(gb) {
                    console.log(gb.toString());
                })*/

                
            });

            it("jbeiseqxmlToGenbank", function() {

                //var jbeiXml = Teselagen.bio.parsers.ParsersManager.loadXml(jbeiXmlUrl);
                //console.log(jbeiXml);

                
            });

            it("genbankToSbol", function() {
                
            });

            it("sbolToGenbank", function() {
                
            });

            it("genbankToJbeiseqxml", function() {

            });

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