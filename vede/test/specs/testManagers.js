/**
 * Unit Tests
 * @author Diana Womg
 */

Ext.require("Ext.Ajax");

Ext.require("Teselagen.bio.util.StringUtil");
Ext.require("Teselagen.bio.util.XmlToJson");
Ext.require("Teselagen.bio.util.Sha256");

Ext.require("Teselagen.bio.parsers.GenbankManager");
Ext.require("Teselagen.bio.parsers.ParsersManager");

Ext.require("Teselagen.utils.SequenceUtils");
Ext.require("Teselagen.utils.FormatUtils");
Ext.require("Teselagen.utils.DeXmlUtils");

Ext.require("Teselagen.constants.Constants");
//Ext.require("Teselagen.models.J5Parameters");

Ext.require("Teselagen.manager.SequenceFileManager");

Ext.onReady(function() {

    Sha256              = Teselagen.bio.util.Sha256;
    SequenceFileManager = Teselagen.manager.SequenceFileManager;

    describe("Testing Teselagen.managers", function() {


        describe("Teselagen.manager.SequenceFileManager.js", function() {


            it("createSequenceFile()", function(){
                var seq = SequenceFileManager.createSequenceFile();
                expect(seq.get("hash")).toBe(Teselagen.bio.util.Sha256.hex_sha256(""));
            });

            it("createSequenceFile(data)", function(){
                var data = {
                    sequenceFileFormat: "blah",
                    sequenceFileContent: "blah"
                };
                var seq = SequenceFileManager.createSequenceFile(data);
                console.log(seq);
                expect(seq.get("hash")).toBe(Teselagen.bio.util.Sha256.hex_sha256("blah"));
            });
        });


    });

});