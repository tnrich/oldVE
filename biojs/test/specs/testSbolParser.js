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
            
            it("opens",function(){
                var url  = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
                var xml  = jasmine.getFixtures().read(url);
                var json = SbolParser.sbolXmlToJson(xml);
                console.log(JSON.stringify(json, null, "  "));
            });


        });

    });


    xdescribe("Toy Testing: Ext.data.Store && ", function() {

        it("xml testing", function() {
            var xml =Teselagen.bio.parsers.ParsersManager.loadXml("/biojs/src/teselagen/bio/enzymes/assets/common.xml");

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

});