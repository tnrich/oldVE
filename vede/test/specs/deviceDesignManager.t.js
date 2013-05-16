/**
 * Unit Tests
 * @author Diana Wong
 */

/*global beforeEach, describe, expect, it*/
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
Ext.require("Teselagen.constants.SBOLIcons");

Ext.require("Teselagen.models.J5Parameters");
Ext.require("Teselagen.models.EugeneRule");

Ext.require("Teselagen.manager.SequenceFileManager");
//Ext.require("Teselagen.manager.PartManager");
//Ext.require("Teselagen.manager.EugeneRuleManager");

Ext.require("Teselagen.manager.DeviceDesignManager");

Ext.onReady(function() {

    var DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    describe("Teselagen.manager.DeviceDesignManager", function() {


        //================================================================
        // DeviceDesign management
        //================================================================
        describe("DeviceDesign Management", function() {
            it("createDeviceDesign()", function(){
                var design = DeviceDesignManager.createDeviceDesign(3);

                expect(design.getJ5Collection().binCount()).toBe(3);
                expect(design.getJ5Collection().isCircular()).toBe(true);
                expect(design.getJ5Collection().get("combinatorial")).toBe(false);

                var err = design.validate();
                //console.log(err);
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

                // Finding null part name fails so tests below fail
                expect(design.getJ5Collection().bins().getAt(0).parts().find("name","")).toBe(0);

                expect(design.getJ5Collection().isCircular()).toBe(true);
                expect(DeviceDesignManager.setCombinatorial(design)).toBe(true);
                expect(design.getJ5Collection().get("combinatorial")).toBe(true);

                var err = design.validate();
                expect(err.length).toBe(0);
            });

        });

        //================================================================
        // J5Collection management
        //================================================================
        describe("J5Collection Management", function() {
            var design;
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

            it("setCombinatorial() -- Checks and sets combinatorial flag", function(){
                expect(DeviceDesignManager.setCombinatorial(design)).toBe(false);

                // Make it combinatorial by manually going into the models to add a part to bin #0
                var part1 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart1"
                });
                var part2 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart2"
                });

                var success = design.getJ5Collection().bins().getAt(0).addToParts([part1,part2]);
                expect(success).toBe(true);

                // Note that adding parts does not trigger a setting of Combinatorial
                // Need to run DeviceDesignManager.setCombinatorial() to set and check
                expect(design.getJ5Collection().get("combinatorial")).toBe(false);

                expect(DeviceDesignManager.setCombinatorial(design)).toBe(true);

                expect(design.getJ5Collection().get("combinatorial")).toBe(true);
            });

            it("getCombinatorial()", function(){
                expect(DeviceDesignManager.setCombinatorial(design)).toBe(false);

                // Make it combinatorial by manually going into the models to add a part to bin #0
                var part1 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart1"
                });
                var part2 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart2"
                });

                var success = design.getJ5Collection().bins().getAt(0).addToParts([part1,part2]);
                expect(success).toBe(true);

                // Note that adding parts does not trigger a setting of Combinatorial
                // Need to run DeviceDesignManager.setCombinatorial() to set and check

                expect(DeviceDesignManager.getCombinatorial(design)).toBe(false);

                expect(DeviceDesignManager.setCombinatorial(design)).toBe(true);

                expect(DeviceDesignManager.getCombinatorial(design)).toBe(true);

            });

            it("findMaxNumParts()", function(){
                expect(DeviceDesignManager.findMaxNumParts(design)).toBe(0);

                var part1 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart1"
                });
                var success = design.getJ5Collection().bins().getAt(0).addToParts([part1]);
                expect(DeviceDesignManager.findMaxNumParts(design)).toBe(1);

                var part2 = Ext.create("Teselagen.models.Part", {
                    name: "addedPart2"
                });
                success = design.getJ5Collection().bins().getAt(0).addToParts([part2]);

                expect(DeviceDesignManager.findMaxNumParts(design)).toBe(2);

            });

            it("checkJ5Ready():", function(){
                expect(DeviceDesignManager.checkJ5Ready(design)).toBe(false);

                var part1 = Ext.create("Teselagen.models.Part", {
                    //name: "addedPart1",
                    fas: "PCR"
                });
                var part2 = Ext.create("Teselagen.models.Part", {
                    //name: "addedPart2",
                    fas: "PCR"
                });

                design.getJ5Collection().bins().getAt(0).addToParts([part1]);
                expect(DeviceDesignManager.checkJ5Ready(design)).toBe(false);

                design.getJ5Collection().bins().getAt(1).addToParts([part2]);
                expect(DeviceDesignManager.checkJ5Ready(design)).toBe(true);
                //console.log(design);
                // Adding a part in each of the two bins will make this Design ready
            });
        });

        //================================================================
        // J5Bin management
        //================================================================
        describe("J5Bin Management", function() {
            var design, bin1;
            beforeEach(function() {
                design  = DeviceDesignManager.createDeviceDesign(2);
                bin1     = Ext.create("Teselagen.models.J5Bin", {
                    binName: "bin1"
                });
            });

            it("createEmptyJ5Bin()", function(){
                expect(design.getJ5Collection().bins().getAt(0).get("binName")).toBe("No_Name0");
                expect(design.getJ5Collection().binCount()).toBe(2);

//                var bin = DeviceDesignManager.createEmptyJ5Bin(design, "TestBin", 0);
                var tmpBin = design.getJ5Collection().bins().getAt(0);

                expect(tmpBin.get("binName")).toBe("TestBin");
                expect(design.getJ5Collection().binCount()).toBe(3);

                // FIX THIS WHEN THE J5Bin VALIDATORS ARE DONE

                //expect(bin.validate().length).toBe(0);
                //console.log(bin.validate());
            });

            it("getBinIconIDByIndex/setBinIconIDByIndex()", function(){
                var success = design.getJ5Collection().addToBin(bin1, 0);
                expect(success).toBe(true);

                var iconID = DeviceDesignManager.getIconIDByBinIndex(design, 0);
                expect(iconID).toBe("USER-DEFINED");


                DeviceDesignManager.setIconIDByBinIndex(design, 0, "BLAH");
                iconID = DeviceDesignManager.getIconIDByBinIndex(design, 0);
                expect(iconID).toBe("BLAH");
                expect(DeviceDesignManager.getBinByIndex(design, 0).validate().length).toBe(1);

                DeviceDesignManager.setIconIDByBinIndex(design, 0, "ASSEMBLY_SCAR");
                iconID = DeviceDesignManager.getIconIDByBinIndex(design, 0);
                expect(iconID).toBe("ASSEMBLY_SCAR");
                expect(DeviceDesignManager.getBinByIndex(design, 0).validate().length).toBe(0);


                //console.log(DeviceDesignManager.getBinByIndex(design, 0));
                //console.log(DeviceDesignManager.getBinByIndex(design, 0).validate());
            });

            it("getBinByIndex()/getBinNameByIndex()", function(){
                design.getJ5Collection().addToBin(bin1, 0);

                var tmpBin = DeviceDesignManager.getBinByIndex(design, 0);
                expect(tmpBin.get("binName")).toBe("bin1");

                var name = DeviceDesignManager.getBinNameByIndex(design, 0);
                expect(name).toBe("bin1");
            });

            it("getBinIndex()", function(){
                var success = design.getJ5Collection().addToBin(bin1, 1);
                expect(success).toBe(true);

                var index = DeviceDesignManager.getBinIndex(design, bin1);
                //console.log(DeviceDesignManager.getBinByIndex(design,1)===bin);
                expect(index).toBe(1);
            });

            it("isUniqueBinName()", function(){
                var success = design.getJ5Collection().addToBin(bin1, 0);
                expect(success).toBe(true);

                var unique = DeviceDesignManager.isUniqueBinName(design, "bin1");
                unique = design.getJ5Collection().isUniqueBinName("bin1");
                expect(unique).toBe(false);

                unique = DeviceDesignManager.isUniqueBinName(design, "blahblah");
                expect(unique).toBe(true);
            });

            it("setBinName(): with unique and non-unique name", function(){
                var success = DeviceDesignManager.setBinName(design, 0, "newBinName");
                expect(DeviceDesignManager.getBinNameByIndex(design, 0)).toBe("newBinName");

                try {
                    DeviceDesignManager.setBinName(design, 0, "newBinName");
                } catch (bio) {
                    success = true;
                    expect(bio.message).toBe("Teselagen.models.J5Bin.setBinName(): File name already exists in Design.");
                }
                expect(success).toBe(true);
            });

            it("addBin()", function(){
                expect(design.getJ5Collection().binCount()).toBe(2);
                var success = DeviceDesignManager.addBin(design, bin1, 0);
                expect(design.getJ5Collection().binCount()).toBe(3);
                expect(success).toBe(true);

                try {
                    DeviceDesignManager.addBin(design, bin1, 0);
                } catch (bio) {
                    success = true;
                    //console.log(bio.message);
                }
                expect(success).toBe(true);
            });

            it("addEmptyBinByIndex()", function(){
                var success = DeviceDesignManager.addEmptyBinByIndex(design, 0);
                expect(design.getJ5Collection().binCount()).toBe(3);
                expect(design.getJ5Collection().bins().getAt(0).get("binName").match("Bin")).not.toBe(null);
                expect(success).toBe(true);
            });

            it("removeBin()", function(){
                design.getJ5Collection().addToBin(bin1);
                expect(design.getJ5Collection().binCount()).toBe(3);
                var success = DeviceDesignManager.removeBin(design, bin1);

                expect(design.getJ5Collection().binCount()).toBe(2);
                expect(success).toBe(true);
            });

            it("removeBinByIndex()", function(){
                expect(design.getJ5Collection().binCount()).toBe(2);
                var success = DeviceDesignManager.removeBinByIndex(design, 0);
                expect(design.getJ5Collection().binCount()).toBe(1);
                expect(success).toBe(true);
            });

            it("nonEmptyPartCount()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    name: "blah",
                    fas: "PCR"
                });
                design.getJ5Collection().bins().getAt(0).addToParts(part);

                var num = DeviceDesignManager.nonEmptyPartCount(design, 0);
                expect(num).toBe(1);

                num = DeviceDesignManager.nonEmptyPartCount(design, 1);
                expect(num).toBe(0);
            });

            it("partCount()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    name: "blah"
                });
                design.getJ5Collection().bins().getAt(0).addToParts(part);

                var num = DeviceDesignManager.partCount(design, 0);
                expect(num).toBe(1);

                num = DeviceDesignManager.partCount(design, 1);
                expect(num).toBe(0);
            });

            it("getPartByBin()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    name: "blah"
                });
                design.getJ5Collection().bins().getAt(0).addToParts(part);

                var tmpPart = DeviceDesignManager.getPartByBin(design, 0, 0);
                expect(tmpPart.get("name")).toBe("blah");
            });
        });

        //================================================================
        // Parts management
        //================================================================
        describe("Part Management", function() {
            var bin1, bin2, design, part1, part2, part3;
            // Depends on DeviceDesignManager.createDeviceDesignFromBins()
            bin1    = Ext.create("Teselagen.models.J5Bin", {
                binName: "newBin1"
            });
            bin2    = Ext.create("Teselagen.models.J5Bin", {
                binName: "newBin2"
            });

            design  = DeviceDesignManager.createDeviceDesignFromBins([bin1, bin2]);

            part1   = DeviceDesignManager.createPart(design, 0, "newPart1", 1, 10, false, true, null, "fas", "icon");
            part2 = Ext.create("Teselagen.models.Part", {
                name: "newPart2"
            });

            it("createPart()", function(){

                expect(part1.get("name")).toBe("newPart1");
                expect(part1.get("genbankStartBP")).toBe(1);

                // FIX THIS WHEN THE J5Bin VALIDATORS ARE DONE
//                var err = part1.validate();
                //expect(err.length).toBe(0);
            });

            it("isPartInCollection()", function(){
                var present = DeviceDesignManager.isPartInCollection(design, part1);
                //console.log(design.getJ5Collection().bins().getAt(0).hasPart(part));
                expect(present).toBe(true);

                present = DeviceDesignManager.isPartInCollection(design, part2);
                expect(present).toBe(false);
            });

            it("getBinAssignment()", function(){
                // is present
                var index = DeviceDesignManager.getBinAssignment(design, part1);
                expect(index).toBe(0);

                // is not present
                index = DeviceDesignManager.getBinAssignment(design, part2);
                expect(index).toBe(-1);
            });

            it("isUniquePartName()", function(){
                //Test an existing name
                var unique = DeviceDesignManager.isUniquePartName(design, "newPart1");
                expect(unique).toBe(false);

                //Test a unique name
                unique = DeviceDesignManager.isUniquePartName(design, "blah");
                expect(unique).toBe(true);
            });

            it("getPartById()**** UNTESTED until DB is done", function(){
            });

            it("getPartByName() should find part with given name", function(){
                var tmpPart = DeviceDesignManager.getPartByName(design, "newPart1");
                expect(tmpPart.get("endBP")).toBe(10);
            });

            describe("addPartToBin()", function(){
                var success;
                var design2 = DeviceDesignManager.createDeviceDesign(2);
                var bin20 = design2.getJ5Collection().bins().getAt(0);
                var bin21 = design2.getJ5Collection().bins().getAt(1);
                it("Append part to second bin", function() {
                    success = DeviceDesignManager.addPartToBin(design2, part2, 1);
                    expect(success).toBe(true);
                    expect (bin20.parts().count()).toBe(0);
                    expect (bin21.parts().count()).toBe(1);
                    expect(bin21.parts().getAt(0).get("name")).toBe("newPart2");
                    expect(bin21.get("fases").length).toBe(1);
                    expect(bin21.get("fases")[0]).toBe("None");
                });
                it("Insert part at index 0 of second bin", function() {
                    success = DeviceDesignManager.addPartToBin(design2, part1, 1, 0);
                    expect(success).toBe(true);
                    expect (bin21.parts().count()).toBe(2);
                    expect(bin21.parts().getAt(0).get("name")).toBe("newPart1");
                });
                it("Should return false if bin index greater than n-1", function() {
                    success = DeviceDesignManager.addPartToBin(design2, part2, 5, 0);
                    expect(success).toBe(false);
                });
                it("Should return false if bin index is < 0", function() {
                    success = DeviceDesignManager.addPartToBin(design2, part2, -1, 0);
                    expect(success).toBe(false);
                });
                it("Should return false if part index is < 0", function() {
                    success = DeviceDesignManager.addPartToBin(design2, part2, 0, -1);
                    expect(success).toBe(false);
                });
            });

            it("removePartFromBin()", function(){

                // Remove a part in a bin
                expect(design.getJ5Collection().bins().getAt(0).parts().count()).toBe(1);
                var success = DeviceDesignManager.removePartFromBin(design, part1, 0);
                expect(design.getJ5Collection().bins().getAt(0).parts().count()).toBe(0);
                expect(success).toBe(true);

                // Remove a nonexisting part in a bin
                success = DeviceDesignManager.removePartFromBin(design, part1, 1);
                expect(design.getJ5Collection().bins().getAt(1).parts().count()).toBe(0);
                expect(success).toBe(false);
            });


        });


        //================================================================
        // SequenceFile Management
        //================================================================
        describe("SequenceFile Management", function() {
            var bin1, design, part1, part2, seq1, seq2;
            // Depends on   DeviceDesignManager.createDeviceDesignFromBins()
            //              DeviceDesignManager.createPart()
            beforeEach(function() {

                bin1    = Ext.create("Teselagen.models.J5Bin", {
                    binName: "newBin1"
                });

                design  = DeviceDesignManager.createDeviceDesignFromBins([bin1]);

                part1   = DeviceDesignManager.createPart(design, 0, "newPart1", 1, 10, false, true, null, "fas", "icon");
                part2 = Ext.create("Teselagen.models.Part", {
                    name: "newPart2"
                });

                seq1    = DeviceDesignManager.createSequenceFile(design, part1, "FASTA", ">seq1\nGATTACA", null, null);
                seq2    = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: ">seq2\naaaaaaa"
                });
            });

            it("createSequenceFile()", function(){

                expect(seq1.get("sequenceFileName")).toBe("seq1.fas");
                expect(seq1.get("sequenceFileContent")).toBe(">seq1\nGATTACA");

                // FIX THIS WHEN THE J5Bin VALIDATORS ARE DONE
                var err = seq1.validate();
                expect(err.length).toBe(0);
            });

            it("getSequenceFileByPartName()", function(){
                var seq1 = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "Fasta",
                    sequenceFileContent: ">seq1\ngattaca"
                });
                part1.setSequenceFile(seq1);
                var tmpSeq = DeviceDesignManager.getSequenceFileByPartName(design, "newPart1");
                expect(tmpSeq.get("sequenceFileName")).toBe("seq1.fas");
            });

            it("getSequenceFileByPart()", function(){
                part1.setSequenceFile(seq1);
                var tmpSeq = DeviceDesignManager.getSequenceFileByPart(part1);

                expect(tmpSeq.get("sequenceFileName")).toBe("seq1.fas");
            });

            it("setSequenceFileByPart()", function(){
                var seq2 = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "Fasta",
                    sequenceFileContent: ">seq2NEW\naaaaaaa"
                });
                part1.setSequenceFile(seq1);
                var tmpSeq = DeviceDesignManager.getSequenceFileByPart(part1);
                expect(tmpSeq.get("sequenceFileName")).toBe("seq1.fas");

                // run this method
                DeviceDesignManager.setSequenceFileByPart(part1, seq2);
                tmpSeq = DeviceDesignManager.getSequenceFileByPart(part1);
                expect(tmpSeq.get("sequenceFileName")).toBe("seq2NEW.fas");
            });

            it("removeSequenceFileByPart()", function(){
                var tmpSeq = design.getJ5Collection().bins().getAt(0).parts().getAt(0).getSequenceFile();
                expect(tmpSeq.get("sequenceFileContent")).toBe(">seq1\nGATTACA");

                var success = DeviceDesignManager.removeSequenceFileByPart(part1);
                tmpSeq = design.getJ5Collection().bins().getAt(0).parts().getAt(0).getSequenceFile();
                expect(tmpSeq.get("sequenceFileContent")).toBe("");
                expect(success).toBe(true);
            });

            it("setSequenceFileContent()", function(){
                expect(seq1.get("sequenceFileContent")).toBe(">seq1\nGATTACA");
//                var tmpSeq = DeviceDesignManager.setSequenceFileContent(seq1, ">newSeq1\nttttt");
                expect(seq1.get("sequenceFileContent")).toBe(">newSeq1\nttttt");
            });

            it("setPartSource()", function(){
                expect(seq1.get("partSource")).toBe("seq1");

//                var tmpSeq = DeviceDesignManager.setPartSource(seq1, "newPartSource");
                expect(seq1.get("partSource")).toBe("newPartSource");
            });

            it("setPartStart()/getPartStart() (From Part section)", function(){

                expect(part1.getStart()).toBe(1);

                DeviceDesignManager.setPartStart(part1, 5);

                expect(part1.getStart()).toBe(5);
                expect(part1.getStart()).toBe(DeviceDesignManager.getPartStart(part1));
            });

            it("setPartEnd()/getPartEnd() (From Part section)", function(){

                //console.log(part1.getEnd());

                // Sets it to an incorrect length because that was given to the model
                expect(part1.getEnd()).toBe(10);

                // Sets it to the length of a sequence
                DeviceDesignManager.setPartEnd(part1);

                expect(part1.getEnd()).toBe(7);

                // Sets it to a length you choose
                DeviceDesignManager.setPartEnd(part1, 5);

                expect(part1.getEnd()).toBe(5);
                expect(part1.getEnd()).toBe(DeviceDesignManager.getPartEnd(part1));
            });

            it("setSequenceFileName()", function(){
                expect(seq1.get("sequenceFileName")).toBe("seq1.fas");

                var name = DeviceDesignManager.setSequenceFileName(seq1, "blah");
                expect(seq1.get("sequenceFileName")).toBe("blah");
                expect(name).toBe("blah");
            });

            it("setSequenceFileName()", function(){
                expect(seq1.get("sequenceFileName")).toBe("seq1.fas");

                var name = DeviceDesignManager.setSequenceFileName(seq1, "blah");
                expect(seq1.get("sequenceFileName")).toBe("blah");
                expect(name).toBe("blah");
            });

            it("getSequenceLength()", function(){
                var len = DeviceDesignManager.getSequenceLength(seq1);
                expect(len).toBe(7);
            });
        });

        //================================================================
        // EugeneRule Management
        //================================================================
        describe("EugeneRules Management", function() {
            var design, name1, negOp, operand1, compOp, operand2, rule1, rule2;
            beforeEach(function() {
                design      = DeviceDesignManager.createDeviceDesign(2);
                name1       = "rule1";
                negOp       = true;
                operand1    = DeviceDesignManager.createPart(design, 0, "operand1", 1, 10, false, true, null, "fas", null);
                compOp      = "AFTER";
                operand2    = DeviceDesignManager.createPart(design, 1, "operand2", 2, 20, false, true, null, "fas", null);

                // Rule that is already in the design, with 2 parts
                rule1 = DeviceDesignManager.createEugeneRule(design, name1, negOp, operand1, compOp, operand2);

                // Rule that is not in the design, with 1 part, 1 number
                rule2 = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule2",
                    negationOperator: true,
                    compositionalOperator: "BEFORE"
                });
                rule2.setOperand1(operand1);
                rule2.setOperand2(123);

            });

            it("createEugeneRule(): Two parts", function(){

                expect(rule1.generateText()).toBe("Rule rule1(NOT operand1 AFTER operand2);");

                expect(design.rules().count()).toBe(1);
                expect(design.rules().getAt(0).getOperand1().get("name")).toBe("operand1");
                expect(design.rules().getAt(0).getOperand2().get("name")).toBe("operand2");

                // FIX THIS WHEN THE EugeneRule VALIDATORS ARE DONE
                var err = rule1.validate();
                //console.log(err);
                expect(err.length).toBe(0);
            });

            it("addToRules()", function(){
                var success = DeviceDesignManager.addToRules(design, rule2);

                expect(success).toBe(true);
                expect(design.rules().count()).toBe(2);
            });

            it("removeFromRules()", function(){
                var success = DeviceDesignManager.removeFromRules(design, rule2);
                expect(success).toBe(false);
                expect(design.rules().count()).toBe(1);

                success = DeviceDesignManager.removeFromRules(design, rule1);
                expect(success).toBe(true);
                expect(design.rules().count()).toBe(0);
            });

            it("removeAllRules()", function(){
                DeviceDesignManager.addToRules(design, rule2);
                var success = DeviceDesignManager.removeAllRules(design, rule1);

                expect(success).toBe(true);
                expect(design.rules().count()).toBe(0);
            });

            it("getRulesInvolvingPart()", function(){

                DeviceDesignManager.addToRules(design, rule2);

                var rules = DeviceDesignManager.getRulesInvolvingPart(design, operand1);
                expect(rules.length).toBe(2);
                expect(rules[0].get("name")).toBe("rule1");

                rules = DeviceDesignManager.getRulesInvolvingPart(design, operand2);
                expect(rules.length).toBe(1);
                expect(rules[0].get("name")).toBe("rule1");
            });

            it("getRuleByName()", function(){
                DeviceDesignManager.addToRules(design, rule2);

                var rule = DeviceDesignManager.getRuleByName(design, "rule2");
                expect(rule.get("name")).toBe("rule2");
                expect(rule.getOperand2()).toBe(123);
            });

            it("isUniqueRuleName()", function(){
                DeviceDesignManager.addToRules(design, rule2);

                var unique = DeviceDesignManager.isUniqueRuleName(design, "rule1");
                expect(unique).toBe(false);

                unique = DeviceDesignManager.isUniqueRuleName(design, "blah");
                expect(unique).toBe(true);
            });

            it("generateRuleText()", function(){

                var text = DeviceDesignManager.generateRuleText(design, "rule1");
                expect(text).toBe("Rule rule1(NOT operand1 AFTER operand2);");

                text = DeviceDesignManager.generateRuleText(design, "ruleBLAH");
                expect(text).toBe(null);
            });
        });

    });

});