/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");
 
Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");
Ext.require("Teselagen.bio.parsers.SbolParser");
Ext.onReady(function() {

    var LOG = true;

    GenbankManager  = Teselagen.bio.parsers.GenbankManager;
    ParsersManager  = Teselagen.bio.parsers.ParsersManager;
    SbolParser      = Teselagen.bio.parsers.SbolParser;
    XmlToJson       = Teselagen.bio.util.XmlToJson;

    describe("Testing Teselagen.bio.parsers.SbolParser:", function() {

        beforeEach(function() {
            var url = null;
            var xml = null;
            var json = null;
        });


        describe("sbolXmlToJson()", function() {
            
            it("opens and reads /biojs/test/data/sbol/signal_peptide_SBOL.xml",function(){
                var url  = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
                var xml  = jasmine.getFixtures().read(url);
                var json = SbolParser.sbolXmlToJson(xml);
                console.log(JSON.stringify(json, null, "  "));

                expect(json["rdf:RDF"]["_xmlns"]).toBe("http://sbols.org/v1#");

                expect(json["rdf:RDF"]["DnaComponent"][0]["_rdf:about"]).toBe("http://j5.jbei.org/dc#97A98D05-96EF-489F-B338-0B30B1AB59BC");
                expect(json["rdf:RDF"]["DnaComponent"][0]["displayId"]).toBe("signal_pep");
                expect(json["rdf:RDF"]["DnaComponent"][0]["dnaSequence"]["DnaSequence"]["_rdf:about"]).toBe("http://j5.jbei.org/ds#172ECA24-1557-4870-939E-D7C699B09170");
                expect(json["rdf:RDF"]["DnaComponent"][0]["dnaSequence"]["DnaSequence"]["nucleotides"]).toBe("ggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgc");

                expect(json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"][0]["_rdf:about"]).toBe("http://j5.jbei.org/sa#7B75111D-08BC-4FB9-AA59-03EDFEFC314E");
                expect(json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"][0]["bioStart"]).toBe(1);
                expect(json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"][0]["bioEnd"]).toBe(63);
                expect(json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"][0]["strand"]).toBe("+");
                expect(json["rdf:RDF"]["DnaComponent"][0]["annotation"]["SequenceAnnotation"][0]["subComponent"]["displayId"]).toBe("signal_peptide");

                console.log(Ext.typeOf(123));
            });


        });

    });


    xdescribe("Toy Testing: Ext.data.Store && ", function() {

        it("xml testing", function() {
            var url  = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
            var xml  = Teselagen.bio.parsers.ParsersManager.loadFile(url);
            
            // Define an Ext model "Enzyme" to make reading from XML data possible.
            Ext.define("Sbol", {
                extend: "Ext.data.Model",
                fields: ["RDF", "_xmlns"]
            });
            
            var doc = new DOMParser().parseFromString(xml, "text/xml");
            //console.log(doc);
            // Define a store which will hold the data read from XML.
            var memstore = new Ext.data.Store({
                autoLoad: true,
                model: "Sbol",
                data : doc,
                proxy: {
                    type: "memory",
                    reader: {
                        type: "xml",
                        record: "RDF"
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