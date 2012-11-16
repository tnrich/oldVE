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

    describe("Diana's Toy Testing:", function() {
//===============================================================================

        describe("Toy Testing: Xml2Json", function() {

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