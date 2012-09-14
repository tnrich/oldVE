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

    describe("Testing Teselagen.bio.parsers.SbolParser:", function() {


        describe("sbolXmlToJson()", function() {
            
            it("opens",function(){
                var url  = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
                var xml  = jasmine.getFixtures().read(url);
                var json = SbolParser.sbolXmlToJson(xml);
                console.log(JSON.stringify(json, null, "  "));
            });


        });

    });

});