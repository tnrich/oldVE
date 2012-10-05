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

Ext.onReady(function() {

    Sha256          = Teselagen.bio.util.Sha256;

    describe("Testing Teselagen.models", function() {

        describe("Teselagen.models.SequenceFile.js", function() {

            it("Test encodeUriComponent()", function(){
                var test    = "GATTACA@#$%^&*()";
                var encode  = encodeURIComponent(test);
                var decode  = decodeURIComponent(encode);
                //console.log(encode);
                //console.log(decode);

                expect(test).toBe(decode);
            });

            it("Testing which encryption to use: Sha256.hex_sha256(content)", function() {

                // This is from /vede/test/data/dexml/DeviceEditor_example.xml
                /*    <de:sequenceFile hash="7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3">
                      <de:format>FASTA</de:format>
                      <de:content><![CDATA[>ssrA_tag_enhance
                GCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG
                ]]></de:content>
                      <de:fileName>ssrA_tag_enhance.fas</de:fileName>
                    </de:sequenceFile>*/
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var contentByte = encodeURIComponent(content);

                var hash1 = Sha256.hex_sha256(content); // <--- This is what the j5 data models use
                var hash2 = Sha256.b64_sha256(content);
                var hash3 = Sha256.hex_sha256(contentByte);
                var hash4 = Sha256.b64_sha256(contentByte);

                expect(hash1).toBe(trueHash);
                expect(hash2).not.toBe(trueHash);
                expect(hash3).not.toBe(trueHash);
                expect(hash4).not.toBe(trueHash);
            });

            it("Creates empty SequenceFile", function(){
                var seq = Ext.create("Teselagen.models.SequenceFile");
                expect(seq).not.toBe(null);

                expect(seq.get("sequenceFileFormat")).toBe("");
                expect(seq.get("hash")).toBe(Teselagen.bio.util.Sha256.hex_sha256(""));
            });

            it("Creates SequenceFile", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var tmp = Ext.create("Teselagen.models.SequenceFile");

                tmp.setSequenceFileContent(content);

                expect(tmp.get("hash")).toBe(trueHash);
                //console.log("SequenceFile init");
                //console.log(tmp);
            });
        });

        describe("Teselagen.models.PartVO.js", function() {

            it("Creates Empty PartVO", function(){
                var part = Ext.create("Teselagen.models.PartVO");

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(true);

                expect(part.get("name")).toBe("");
                expect(part.get("revComp")).toBe(false);
                expect(part.get("genbankStartBP")).toBe(0);
                expect(part.get("id")).not.toBe("");

            });

            it("Creates PartVO", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });

                expect(part.isEqual(part)).toBe(true);
                expect(part.isEmpty()).toBe(false);

                //console.log("PartVO init");
                //console.log(part);
            });

            it("Creates PartVO: setId()", function(){
                var part = Ext.create("Teselagen.models.PartVO", {
                    name: "name1"
                });
                expect(part.get("id").length).toBe(16);
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
            });
        });

        describe("Teselagen.models.Part.js", function() {

            it("Creates Empty Part", function(){
                var part = Ext.create("Teselagen.models.Part");

                expect(part.isEmpty()).toBe(true);

                expect(part.get("partVO")).toBe(null);
                expect(part.get("fas")).toBe("");
                expect(part.get("id")).not.toBe("");
            });

            it("Creates Part", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });

                expect(part.isEmpty()).toBe(false);
                expect(part.get("fas")).toBe("fas1");

                //console.log("Part init");
                //console.log(part);
            });

            it("Creates Part: setId()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });
                //console.log(part.get("id"));
                expect(part.get("id").length).toBe(16); //toBe(13); // Date.now()
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
                //console.log(part.get("id"));
            });
        });


        describe("Teselagen.models.EugeneRule.js", function() {

            it("Creates empty EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule");
                expect(eugene).not.toBe(null);

                expect(eugene.get("name")).toBe("");
                expect(eugene.get("negationOperator")).toBe(false);
            });

            it("Creates EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "name1",
                    operand2: 123
                });
                expect(eugene).not.toBe(null);

                var flag = false;
                try {
                    eugene.setOperand2("bad string");
                } catch (e) {
                    flag = true;
                    //console.log("Correctly caught: " + e.message);
                }
                expect(eugene.get("name")).toBe("name1");
                expect(eugene).not.toBe(null);
                expect(flag).toBe(true);

                //console.log("EugeneRule init");
                //console.log(eugene);

            });
        });

        describe("Teselagen.models.SBOLvIconInfo.js", function() {

            it("Creates SBOLvIconInfo", function(){
                var sbol = Ext.create("Teselagen.models.SBOLvIconInfo", {
                    id: "id1"
                });
                expect(sbol).not.toBe(null);
                //console.log("SBOLvIconInfo init");
                //console.log(sbol);
                
                // check
                expect(sbol.get("id")).toBe("id1");
                expect(sbol.get("name")).toBe("");
                expect(sbol.get("forwardPath")).toBe("");
                expect(sbol.get("reversePath")).toBe("");
            });

            it("setFields()", function(){
                var sbol = Ext.create("Teselagen.models.SBOLvIconInfo", {});

                //console.log("SBOLvIconInfo init");
                //console.log(sbol);

                sbol.setFields("id1", "name1", "fwd1", "rev1");

                // check
                expect(sbol.get("id")).toBe("id1");
                expect(sbol.get("name")).toBe("name1");
                expect(sbol.get("forwardPath")).toBe("fwd1");
                expect(sbol.get("reversePath")).toBe("rev1");
            });
        });
        
        describe("Teselagen.models.DownstreamAutomationParameters.js", function() {

            it("Creates DownstreamAutomationParameters", function(){
                var down = Ext.create("Teselagen.models.DownstreamAutomationParameters", {
                    maxDeltaTemperatureAdjacentZonesValue: "100"
                });

                expect(down).not.toBe(null);
                expect(down.get("maxDeltaTemperatureAdjacentZonesValue")).toBe(100);
                expect(down.get("maxDeltaTemperatureReactionOptimumZoneAcceptableValue")).toBe(down.self.MDTROZA_DEFAULT);
                expect(down.get("maxMcStepsPerZoneValue")).toBe(down.self.MMCSPZ_DEFAULT);
                expect(down.get("maxWellVolumeMultiwellPlateValue")).toBe(down.self.MWVMP_DEFAULT);

                expect(down.get("wellsPerThermocyclerZoneValue")).toBe(down.self.WPTZ_DEFAULT);
                expect(down.get("zonesPerThermocyclerBlockValue")).toBe(down.self.ZPTB_DEFAULT);
                //console.log("DownstreamAutomationParameters init");
                //console.log(down);
            });

            it("createParameterString()", function(){
                var down = Ext.create("Teselagen.models.DownstreamAutomationParameters", {});
                down.setDefaultValues();
                var str  = down.createParameterString();
                var strArr = str.split(/[\n]+/g);

                //console.log("DownstreamAutomationParameters createParamStr");
                //console.log(down);
                //console.log(str);

                //var url  = "/vede/test/data/j5input/downstream_automation.csv";
                //var txt  = Teselagen.bio.parsers.ParsersManager.loadFile(url);

                var txt = 'Parameter Name,Value,Default Value,Description\n' +
                    'MAXDELTATEMPERATUREADJACENTZONES,5,5,The maximum difference in temperature (in C) between adjacent zones on the thermocycler block\n' +
                    'MAXDELTATEMPERATUREREACTIONOPTIMUMZONEACCEPTABLE,5,5,"The maximum acceptable difference in temperature (in C) between the optimal annealing temperature of a PCR reaction, and the annealing temperature of the thermocycler block zone it is sitting in"\n' +
                    'MAXMCSTEPSPERZONE,1000,1000,The maximum number of Monte-Carlo steps attempted per thermocycler block zone\n' +
                    'MAXWELLVOLUMEMULTIWELLPLATE,100,100,The maximum liquid volume (in uL) that a well in the multi-well plate can hold\n' +
                    'MCTEMPERATUREFINAL,0.0001,0.0001,The final temperature at the end of the Monte-Carlo simulated annealing run (in arbitrary reduced units)\n' +
                    'MCTEMPERATUREINITIAL,0.1,0.1,The initial temperature in the beginning of the Monte-Carlo simulated annealing run (in arbitrary reduced units)\n' +
                    'MINPIPETTINGVOLUME,5,5,The minimum pipetting volume (e.g. for a robotics platform) (in uL)\n' +
                    'NCOLUMNSMULTIWELLPLATE,12,12,The number of columns in the multi-well plate\n' +
                    'NROWSMULTIWELLPLATE,8,8,The number of rows in the multi-well plate\n' +
                    'TRIALDELTATEMPERATURE,0.1,0.1,The Monte-Carlo step trial change in temperature for a thermocycler block zone\n' +
                    'WELLSPERTHERMOCYCLERZONE,16,16,The number of wells per thermocycler block zone\n' +
                    'ZONESPERTHERMOCYCLERBLOCK,6,6,The number of zones per thermocycler block\n';
                var txtArr = txt.split(/[\n]+/g);
                //console.log(txt);

                for (var i=0; i < strArr.length; i++) {
                    expect(strArr[i]).toBe(txtArr[i]);
                }
            });
            it("setDefaultValues()", function(){
                var down = Ext.create("Teselagen.models.DownstreamAutomationParameters", {});
                expect(down).not.toBe(null);
                down.setDefaultValues();

                //spot check
                expect(down.get("maxDeltaTemperatureAdjacentZonesValue")).toBe(down.self.MDTAZ_DEFAULT);
                expect(down.get("maxMcStepsPerZoneValue")).toBe(down.self.MMCSPZ_DEFAULT);
                expect(down.get("maxWellVolumeMultiwellPlateValue")).toBe(down.self.MWVMP_DEFAULT);

                expect(down.get("wellsPerThermocyclerZoneValue")).toBe(down.self.WPTZ_DEFAULT);
                expect(down.get("zonesPerThermocyclerBlockValue")).toBe(down.self.ZPTB_DEFAULT);
            });
        });
        
        describe("Teselagen.constants.Constants.js", function() {

            it("Calls Constants", function(){

                expect(Teselagen.constants.Constants.self.GENBANK).toBe("Genbank");

            });
        });

        describe("Teselagen.models.J5Parameters.js", function() {

            it("Creates J5Parameters with default values: setDefaultValues()", function(){
                var param = Ext.create("Teselagen.models.J5Parameters", {});
                expect(param).not.toBe(null);
                // param.setDefaultValues(); <-- this is automatically called on init

                //Spot checking
                expect(param.get("masterOligoNumberOfDigitsValue")).toBe(param.self.MONOD_Default);
                expect(param.get("maxOligoLengthBPsValue")).toBe(param.self.MOLB_Default);
                expect(param.get("maxIdentitiesGoldenGateOverhangsCompatibleValue")).toBe(param.self.MIGGOC_Default);
                expect(param.get("directSynthesisCostPerBPUSDValue")).toBe(param.self.DSCPB_Default);
                expect(param.get("primerMinTmValue")).toBe(param.self.PMT_Default);
                expect(param.get("primerPairMaxComplAnyThValue")).toBe(param.self.PPMCAT_Default);
                expect(param.get("mispriming3PrimeBoundaryBPToWarnIfHitValue")).toBe(param.self.M3BBTWIH_Default);
                expect(param.get("suppressPurePrimersValue")).toBe(param.self.SPP_Default);
            });

            it("Creates J5Parameters, changing a default parameter", function(){
                var param = Ext.create("Teselagen.models.J5Parameters", {
                    masterOligoNumberOfDigitsValue: 1
                });

                //Spot checking -- these are NOT correct
                
                expect(param.get("masterOligoNumberOfDigitsValue")).toBe(param.self.MONOD_Default);
                expect(param.get("maxOligoLengthBPsValue")).toBe(param.self.MOLB_Default);
                expect(param.get("maxIdentitiesGoldenGateOverhangsCompatibleValue")).toBe(param.self.MIGGOC_Default);

                param.set("masterOligoNumberOfDigitsValue", 1);
                expect(param.get("masterOligoNumberOfDigitsValue")).toBe(1);
            });

            it("createParameterString()", function(){
                var param   = Ext.create("Teselagen.models.J5Parameters");
                var parStr  = param.createJ5ParametersString("circular");

                //console.log(parStr);

                var url  = "/vede/test/data/j5input/j5_parameters.csv";
                var txt  = Teselagen.bio.parsers.ParsersManager.loadFile(url);

                //console.log(txt);
            });
        });

        describe("Teselagen.models.J5Bin.js", function() {

            beforeEach(function() {
            });

            it("Creates J5Bin", function(){
                var bin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "binName1"
                });
                expect(bin).not.toBe(null);
                
                // check -- Non-empty defaults do not work!
                expect(bin.get("binName")).toBe("binName1");
                expect(bin.get("iconID")).toBe("generic");
                expect(bin.get("directionForward")).toBe(true);
                expect(bin.get("fas")).toBe("");

                expect(bin.binCount()).toBe(0);
                //console.log(bin.parts());
                var part1   = Ext.create("Teselagen.models.Part");
                //bin.addToBin(part1);
                //console.log(bin);
                console.log(Ext.getClassName(bin.parts()));
            });

            it("TEST ASSOCIATIONS HERE() ???", function(){
            });

            it("indexOfPartInBin()", function(){
            });

            it("addToBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var part3   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    parts: []
                });
                expect(bin.binCount()).toBe(0);

                var success = bin.addToBin(part1);
                //console.log("J5Bin init-add part");
                //console.log(bin);

                // check
                expect(success).toBe(true);
                expect(bin.binCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part1);

                // add a second part, insert in front of previous part
                success = bin.addToBin(part2, 0);
                expect(success).toBe(true);
                expect(bin.binCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part1);

                // add a third in between
                success = bin.addToBin(part3, 1);
                expect(success).toBe(true);
                expect(bin.binCount()).toBe(3);

                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part3);
                expect(bin.parts().getAt(2)).toBe(part1);
                //console.log(bin.parts());
                console.log(bin);
                
            });
            
            it("removeFromBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");

                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    parts: [part1, part2]
                });

                expect(bin.binCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(1)).toBe(part2);

                var success = bin.removeFromBin(part1);
                expect(success).toBe(true);
                expect(bin.binCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part2);
                // should fail to remove it again
                success = bin.removeFromBin(part1);
                expect(success).toBe(false);

                success = bin.removeFromBin(part2);
                expect(success).toBe(true);
                expect(bin.binCount()).toBe(0);
            });
        });

        xdescribe("Teselagen.models.J5Collection.js", function() {

            beforeEach(function() {
            });

            it("Creates J5Collection", function(){
                var coll = Ext.create("Teselagen.models.J5Collection", {});
                expect(coll).not.toBe(null);

                // check
                expect(coll.get("binsVector").length).toBe(0);
                expect(coll.get("j5Ready")).toBe(false);
                expect(coll.get("combinatorial")).toBe(false);
                expect(coll.get("isCircular")).toBe(true);
            });

            it("TEST ASSOCIATIONS HERE()", function(){
            });


            it("addToBin() adds a J5Bin", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var bin3    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {});

                expect(coll.get("binsVector").length).toBe(0);

                var success = coll.addToBin(bin1);

                // check
                expect(coll.get("binsVector").length).toBe(1);
                expect(coll.get("binsVector")[0]).toBe(bin1);

                // check
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(1);
                expect(coll.get("binsVector")[0]).toBe(bin1);

                // add a second bin, insert in front of previous bin
                success = coll.addToBin(bin2, 0);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(2);
                expect(coll.get("binsVector")[0]).toBe(bin2);
                expect(coll.get("binsVector")[1]).toBe(bin1);

                // add a third in between
                success = coll.addToBin(bin3, 1);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(3);

                expect(coll.get("binsVector")[0]).toBe(bin2);
                expect(coll.get("binsVector")[1]).toBe(bin3);
                expect(coll.get("binsVector")[2]).toBe(bin1);
            });

            it("removeFromBin() removes a J5Bin", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1, bin2]
                });

                expect(coll.get("binsVector").length).toBe(2);
                expect(coll.get("binsVector")[0]).toBe(bin1);
                expect(coll.get("binsVector")[1]).toBe(bin2);

                var success = coll.removeFromBin(bin1);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(1);
                expect(coll.get("binsVector")[0]).toBe(bin2);

                // should fail to remove it again
                success = coll.removeFromBin(bin1);
                expect(success).toBe(false);

                success = coll.removeFromBin(bin2);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(0);
            });

            it("isPartInCollection() detects a part correctly.", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    parts: [part1]
                });
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1]
                });

                // Detects a part is in collection
                var success = coll.isPartInCollection(part1);
                expect(success).toBe(true);

                // Detects a part is not in collection
                success = coll.isPartInCollection(part2);
                expect(success).toBe(false);
            });

            it("isCircular()", function(){
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    isCircular: true
                });

                var success = coll.isCircular();
                expect(success).toBe(true);
            });

            it("getBinIndex()", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1]
                });

                // bin1 that is present
                var index   = coll.getBinIndex(bin1);
                expect(index).toBe(0);

                // bin2 that is not present
                index   = coll.getBinIndex(bin2);
                expect(index).toBe(-1);
            });

            it("addNewBinByIndex()", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1, bin2]
                });

                // add new bin between bin1 and bin2
                var success = coll.addNewBinByIndex("newBin", 1);

                expect(coll.get("binsVector").length).toBe(3);
                expect(coll.get("binsVector")[0]).toBe(bin1);
                expect(coll.get("binsVector")[1].get("binName")).toBe("newBin");
                expect(coll.get("binsVector")[2]).toBe(bin2);
            });

            it("deleteBinByIndex()", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1, bin2]
                });

                expect(coll.get("binsVector").length).toBe(2);
                expect(coll.get("binsVector")[0]).toBe(bin1);
                expect(coll.get("binsVector")[1]).toBe(bin2);

                var success = coll.deleteBinByIndex(0);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(1);
                expect(coll.get("binsVector")[0]).toBe(bin2);

                // 2 is out of range, will pop the remaining bin
                success = coll.deleteBinByIndex(-1);
                expect(success).toBe(true);
                expect(coll.get("binsVector").length).toBe(0);
            });

            it("addPartToBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                //var part2   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1]
                });

                expect(coll.binCount()).toBe(1);
                expect(bin1.binCount()).toBe(0);
                var success = coll.addPartToBin(part1, 0, 0);
                expect(success).toBe(true);
                expect(coll.binCount()).toBe(1);
                expect(bin1.binCount()).toBe(1);
                expect(coll.get("binsVector")[0].binCount()).toBe(1);
            });

            
            it("removePartFromBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                //var part2   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    parts: [part1]
                });
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1]
                });

                expect(coll.binCount()).toBe(1);
                expect(bin1.binCount()).toBe(1);
                var success = coll.removePartFromBin(part1, 0);
                expect(success).toBe(true);
                expect(coll.binCount()).toBe(1);
                expect(bin1.binCount()).toBe(0);
                expect(coll.get("binsVector")[0].binCount()).toBe(0);
            });
            
            it("getBinAssignment()", function(){
                var part1   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    parts: [part1]
                });
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    binsVector: [bin1]
                });

                var tmp = coll.getBinAssignment(part1);
                //console.log(tmp);
                //console.log(bin1);
                expect(tmp).toBe(part1);
            });

            it("()", function(){
            });
        });

    });
});