/**
 * Unit Tests
 * @author Diana Wong
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
Ext.require("Teselagen.models.J5Parameters");
Ext.require("Teselagen.models.EugeneRule");

Ext.require("Teselagen.manager.SequenceFileManager");
Ext.require("Teselagen.manager.PartManager");
Ext.require("Teselagen.manager.EugeneRuleManager");
Ext.require("Teselagen.manager.DeviceDesignManager");

Ext.onReady(function() {

    Sha256              = Teselagen.bio.util.Sha256;
    SequenceFileManager = Teselagen.manager.SequenceFileManager;
    DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    describe("Testing Teselagen.managers", function() {

        xdescribe("Teselagen.manager.SequenceFileManager.js", function() {

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

        xdescribe("Teselagen.manager.EugeneRuleManager.js", function() {

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

        describe("Teselagen.manager.DeviceDesignManager.js", function() {

            describe("DeviceDesign Management", function() {
                it("createDeviceDesign()", function(){
                    var design = DeviceDesignManager.createDeviceDesign(3);

                    expect(design.getJ5Collection().isCircular()).toBe(true);
                    expect(design.getJ5Collection().get("combinatorial")).toBe(false);

                    var err = design.validate();
                    expect(err.length).toBe(0);
                });

                it("createDeviceDesignFromBins()", function(){
                    var part1 = Ext.create("Teselagen.models.Part");
                    var part2 = Ext.create("Teselagen.models.Part");
                    var bin = Ext.create("Teselagen.models.J5Bin", {
                        binName: "newBin"
                    });
                    bin.addToParts([part1, part2]);
                    var design = DeviceDesignManager.createDeviceDesignFromBins([bin]);

                    expect(design.getJ5Collection().binCount()).toBe(1);
                    expect(design.getJ5Collection().bins().getAt(0).get("binName")).toBe("newBin");

                    expect(design.getJ5Collection().isCircular()).toBe(true);
                    expect(design.getJ5Collection().get("combinatorial")).toBe(true);
                    expect(DeviceDesignManager.checkCombinatorial(design)).toBe(true);

                    var err = design.validate();
                    expect(err.length).toBe(0);
                });

                it("()", function(){
                });
            });

            describe("J5Collection Management", function() {

                beforeEach(function() {
                    design      = DeviceDesignManager.createDeviceDesign(2);
                });

                it("createEmptyJ5Collection()--overwrites existing collection", function(){
                    var coll = DeviceDesignManager.createEmptyJ5Collection(design, 3, false);

                    expect(design.getJ5Collection().binCount()).toBe(3);
                    expect(design.getJ5Collection().bins().getAt(0).get("binName")).toBe("No_Name0");
                    expect(DeviceDesignManager.binCount(design)).toBe(3);

                    expect(DeviceDesignManager.isCircular(design)).toBe(false);

                    expect(coll.validate().length).toBe(0);
                });

                it("isCircular()", function(){
                    expect(DeviceDesignManager.isCircular(design)).toBe(true);
                });

                it("setCircular()", function(){
                    expect(DeviceDesignManager.isCircular(design)).toBe(true);
                    DeviceDesignManager.setCircular(design, false);
                    expect(DeviceDesignManager.isCircular(design)).toBe(false);
                });

                it("binCount()", function(){
                    expect(DeviceDesignManager.binCount(design)).toBe(2);
                });

                it("checkCombinatorial()", function(){
                    expect(DeviceDesignManager.checkCombinatorial(design)).toBe(false);

                    // Make it combinatorial by manually going into the models to add a part to bin #0
                    var part1 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart1"
                    });
                    var part2 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart2"
                    });

                    var success = design.getJ5Collection().bins().getAt(0).addToParts([part1,part2], -1);
                    expect(success).toBe(true);

                    // Note that adding parts does not trigger a setting of Combinatorial
                    // Need to run DeviceDesignManager.checkCombinatorial() to set and check
                    expect(design.getJ5Collection().get("combinatorial")).toBe(false);

                    expect(DeviceDesignManager.checkCombinatorial(design)).toBe(true);

                    expect(design.getJ5Collection().get("combinatorial")).toBe(true);
                });

                it("setCombinatorial() *** Test Not written", function(){
                });

                it("findMaxNumParts()", function(){
                    expect(DeviceDesignManager.findMaxNumParts(design)).toBe(0);

                    var part1 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart1"
                    });
                    var success = design.getJ5Collection().bins().getAt(0).addToParts([part1], -1);
                    expect(DeviceDesignManager.findMaxNumParts(design)).toBe(1);

                    var part2 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart2"
                    });
                    success = design.getJ5Collection().bins().getAt(0).addToParts([part2], -1);

                    expect(DeviceDesignManager.findMaxNumParts(design)).toBe(2);

                });

                it("checkJ5Ready()", function(){
                    expect(DeviceDesignManager.checkJ5Ready(design)).toBe(false);

                    var part1 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart1"
                    });
                    var part2 = Ext.create("Teselagen.models.Part", {
                        name: "addedPart2"
                    });

                    design.getJ5Collection().bins().getAt(0).addToParts([part1], -1);
                    expect(DeviceDesignManager.checkJ5Ready(design)).toBe(false);

                    design.getJ5Collection().bins().getAt(1).addToParts([part2], -1);
                    expect(DeviceDesignManager.checkJ5Ready(design)).toBe(true);
                    // Adding a part in each of the two bins will make this Design ready
                });
            });

            describe("J5Bin Management", function() {

                beforeEach(function() {
                    design  = DeviceDesignManager.createDeviceDesign(2);
                    bin     = Ext.create("Teselagen.models.J5Bin", {
                        binName: "newBin"
                    });
                });

                it("createEmptyJ5Bin()", function(){
                    expect(design.getJ5Collection().bins().getAt(0).get("binName")).toBe("No_Name0");
                    expect(design.getJ5Collection().bins().count(0)).toBe(2);

                    var bin = DeviceDesignManager.createEmptyJ5Bin(design, "TestBin", 0);
                    var tmpBin = design.getJ5Collection().bins().getAt(0);

                    expect(tmpBin.get("binName")).toBe("TestBin");
                    expect(design.getJ5Collection().bins().count(0)).toBe(3);
                });

                it("getBinByIndex()", function(){
                    design.getJ5Collection().addToBin(bin, 0);

                    var tmpBin = DeviceDesignManager.getBinByIndex(design, 0);
                    expect(tmpBin.get("binName")).toBe("newBin");
                });

                it("getBinIndex()", function(){
                    var success = design.getJ5Collection().addToBin(bin, 1);
                    expect(success).toBe(true);

                    var index = DeviceDesignManager.getBinIndex(design, bin);
                    //console.log(DeviceDesignManager.getBinByIndex(design,1)===bin);
                    expect(index).toBe(1);
                });

                it("isUniqueBinName()", function(){
                    var success = design.getJ5Collection().addToBin(bin, 0);
                    expect(success).toBe(true);

                    console.log(design.getJ5Collection().bins().getAt(0));
                    var unique = DeviceDesignManager.isUniqueBinName(design, "newBin");
                    unique = design.getJ5Collection().isUniqueBinName("newBin");
                    expect(unique).toBe(false);

                    unique = DeviceDesignManager.isUniqueBinName(design, "blahblah");
                    expect(unique).toBe(true);
                });

                it("setBinName()***", function(){
                });

                it("addBin()", function(){
                });

                it("addEmptyBinByIndex()", function(){
                });

                it("removeBin()", function(){
                });

                it("removeBinByIndex()", function(){
                });

                it("countNonEmptyParts()", function(){
                });

                it("getPartByBin()", function(){
                });
            });

//LAST HERE  DW: 10.23.2012
            describe("SequenceFile Management", function() {

                it("createPart()", function(){
                    //var seq = DeviceDesignManager.createSequenceFile(design, )

                });

                it("createSequenceFile()", function(){
                });

                it(")", function(){
                });

                it("()", function(){
                });
            });

            describe("Part Management", function() {
                it("createPart()", function(){
                });

                it("createSequenceFile()", function(){
                });

                it(")", function(){
                });

                it("()", function(){
                });
            });

            describe("EugeneRules Management", function() {

                beforeEach(function() {
                    design      = DeviceDesignManager.createDeviceDesign(2);
                    name1       = "";
                    negOp       = true;
                    operand1    = DeviceDesignManager.createPart(design, 0, "operand1", 1, 10, false, true, "fas", null);
                    compOp      = true;
                    operand2    = DeviceDesignManager.createPart(design, 1, "operand2", 2, 20, false, true, "fas", null);
                });

                it("createEugeneRule()", function(){
                    //console.log(design);
                    var rule = DeviceDesignManager.createEugeneRule(design, name1, negOp, operand1, compOp, operand2);
                });


                it("()", function(){
                });
            });

            

            xdescribe("CSV", function() {

                it(")", function(){
                });

                it("()", function(){
                });
            });

            xdescribe("Helper Functions", function() {

                it("reverseComplement()", function(){
                });

                it("isLegalName()", function(){
                });
            });

            it("()", function(){
            });

        });

        xdescribe("Teselagen.manager..js", function() {

            it("()", function(){
            });
        });

    });

});