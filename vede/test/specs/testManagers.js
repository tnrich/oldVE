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
Ext.require("Teselagen.models.EugeneRule");

Ext.require("Teselagen.manager.SequenceFileManager");
Ext.require("Teselagen.manager.PartManager");
Ext.require("Teselagen.manager.EugeneRuleManager");

Ext.onReady(function() {

    Sha256              = Teselagen.bio.util.Sha256;
    SequenceFileManager = Teselagen.manager.SequenceFileManager;

    xdescribe("Testing Teselagen.managers", function() {

        describe("Teselagen.manager.SequenceFileManager.js", function() {

            /*it("createSequenceFile()", function(){
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
            });*/

            it("addSequenceFile(): add to empty SequenceFileManager array", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

                seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                expect(seqFileMan.getSequenceFiles().length).toBe(1);

                var seq = seqFileMan.getSequenceFiles()[0];
                expect(seq.get("sequenceFileFormat")).toBe(Teselagen.constants.Constants.self.GENBANK);
                expect(seq.get("sequenceFileContent")).toBe("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n");
                expect(seq.get("sequenceFileName")).toBe("filename");
                expect(seq.get("partSource")).toBe("pj5_00028");
            });

            it("addSequenceFile(): no filename", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});
                seqFileMan.deleteAllItems();
                expect(seqFileMan.getSequenceFiles().length).toBe(0);

                seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r");

                var seq = seqFileMan.getSequenceFiles()[0];
                expect(seq.get("sequenceFileName")).toBe("pj5_00028.gb");
            });

            it("addSequenceFile(): filename with whitespace", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});
                seqFileMan.deleteAllItems();
                expect(seqFileMan.getSequenceFiles().length).toBe(0);

                var flag = false;
                try {
                    seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "file name");
                } catch (e) {
                    flag = true;
                }
                expect(flag).toBe(true);
            });

            it("addSequenceFile(): add to SequenceFileManager array containing sequenceFile", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

                var tmp = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                var tmp2 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                expect(seqFileMan.getSequenceFiles().length).toBe(1);
                expect(tmp).toBe(tmp2);
            });

            it("addSequenceFile(): add to SequenceFileManager array containing non-unique filename ", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

                var tmp = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                var flag = false;
                try {
                    var tmp2 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               BLAH", "filename");
                } catch (e) {
                    flag = true;
                }

                expect(seqFileMan.getSequenceFiles().length).toBe(1);
                expect(flag).toBe(true);
            });

            it("deleteItem()", function(){
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "Genbank",
                    sequenceFileContent: "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r"
                });

                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {
                    sequenceFiles: [seq]
                });
                expect(seqFileMan.getSequenceFiles().length).toBe(1);
                seqFileMan.deleteItem(seq);
                expect(seqFileMan.getSequenceFiles().length).toBe(0);
            });

            it("deleteAllItems(): no filename", function(){
                //var seqFileMan = null;
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {
                    sequenceFiles: ["a", "b"]
                });
                //console.log(seqFileMan.getSequenceFiles());

                expect(seqFileMan.getSequenceFiles().length).toBe(2);
                seqFileMan.deleteAllItems();
                expect(seqFileMan.getSequenceFiles().length).toBe(0);
            });

            it("getItemByPartSource():", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

                var tmp1 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                var tmp2 = seqFileMan.getItemByPartSource("pj5_00028");
                expect(tmp1).toBe(tmp2);
            });

            it("getItemByHash():", function(){
                var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

                var tmp1 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

                var tmp2 = seqFileMan.getItemByHash(Teselagen.bio.util.Sha256.hex_sha256("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n"));
                expect(tmp1).toBe(tmp2);
            });
        });

//LAST HERE  DW: 10.4.2012

        describe("Teselagen.manager.PartManager.js", function() {

            it("getPartVOs()", function(){
            });

            it("getPartById()", function(){
            });

            it("getParVOByName()", function(){
            });

            it("getParVOById()", function(){
            });

            it("deleteItem()", function(){
            });

            it("deleteAllItems()", function(){
            });

            it("createPart()", function(){
            });

            it("isUniquePartName()", function(){
            });
        });


        describe("Teselagen.manager.EugeneRuleManager.js", function() {

            it("getDefaultNamePattern()", function(){

                //console.log(Teselagen.models.EugeneRule.MORETHAN);
                //console.log((typeof(123) === "number"));
                //console.log(Teselagen.constants.Constants.self.GENBANK);
            });

            it("getDefaultNamePattern()", function(){
            });

            it("addRule()", function(){
            });

            it("deleteItem()", function(){
            });

            it("deleteAllItems()", function(){
            });

            it("generateRuleText()", function(){
                
                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    operand1: Ext.create("Teselagen.models.PartVO", { name: "partvo"}),
                    compositionalOperator: "compOp",
                    operand2: 123
                });
                var tmp = Ext.create("Teselagen.manager.EugeneRuleManager",{
                    eugeneRules: [eug]
                });
                var str = tmp.generateRuleText(eug);
                expect(str).toBe("Rule eug(partvo compOp 123);");
            });

            it("getRuleByName()", function(){
            });

            it("getRulesByPartVO()", function(){
            });

            it("getRulesInvolvingPartVO()", function(){
            });

            it("isUniqueRuleName()", function(){
            });

            it("()", function(){
            });
        });

        xdescribe("Teselagen.manager.J5Manager.js", function() {

            it("()", function(){
            });

        });

        xdescribe("Teselagen.manager..js", function() {

            it("()", function(){
            });
        });

    });

});