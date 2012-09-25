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
                expect(seq.get("hash")).toBe("");
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
        
        describe("Teselagen.constants.Constants.js", function() {

            it("Calls Constants", function(){

                expect(Teselagen.constants.Constants.self.GENBANK).toBe("Genbank");

            });
        });

        describe("Teselagen.models.J5Parameters.js", function() {

            it("Creates J5Parameters", function(){
                var param = Ext.create("Teselagen.models.J5Parameters", {
                    masterOligoNumberOfDigitsValue: 1
                });
                expect(param).not.toBe(null);

                //Spot checking -- these are NOT correct
                expect(param.get("masterOligoNumberOfDigitsValue")).toBe(1);
                expect(param.get("maxOligoLengthBPsValue")).toBe(0);
                expect(param.get("maxIdentitiesGoldenGateOverhangsCompatibleValue")).toBe(0);
                expect(param.get("directSynthesisCostPerBPUSDValue")).toBe(0);
                expect(param.get("primerMinTmValue")).toBe(0);
                expect(param.get("primerPairMaxComplAnyThValue")).toBe(0);
                expect(param.get("mispriming3PrimeBoundaryBPToWarnIfHitValue")).toBe(0);
                expect(param.get("suppressPurePrimersValue")).toBe(false);

            });

            it("setDefaultValues()", function(){
                var param = Ext.create("Teselagen.models.J5Parameters", {});

                //console.log("J5Parameters init");
                //console.log(param);

                param.setDefaultValues();

                //Spot checking
                expect(param.get("masterOligoNumberOfDigitsValue")).toBe(5);
                expect(param.get("maxOligoLengthBPsValue")).toBe(110);
                expect(param.get("maxIdentitiesGoldenGateOverhangsCompatibleValue")).toBe(2);
                expect(param.get("directSynthesisCostPerBPUSDValue")).toBe(0.39);
                expect(param.get("primerMinTmValue")).toBe(60);
                expect(param.get("primerPairMaxComplAnyThValue")).toBe(47);
                expect(param.get("mispriming3PrimeBoundaryBPToWarnIfHitValue")).toBe(4);
                expect(param.get("suppressPurePrimersValue")).toBe(true);
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
                console.log("DownstreamAutomationParameters init");
                console.log(down);
            });

            /*it("createParameterString()", function(){
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
                expect(down.get("maxDeltaTemperatureAdjacentZonesValue")).toBe(5);
                expect(down.get("maxDeltaTemperatureReactionOptimumZoneAcceptableValue")).toBe(5);

                expect(down.get("wellsPerThermocyclerZoneValue")).toBe(16);
                expect(down.get("zonesPerThermocyclerBlockValue")).toBe(6);
            });*/
        });

        describe("Teselagen.models.J5Bin.js", function() {

            it("Creates J5Bin", function(){
                var bin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "binName1"
                });
                expect(bin).not.toBe(null);

                //console.log("J5Bin init");
                //console.log(bin);
                
                // check -- Non-empty defaults do not work!
                expect(bin.get("binName")).toBe("binName1");
                expect(bin.get("iconID")).toBe("generic");
                expect(bin.get("directionForward")).toBe(true);
                expect(bin.get("fas")).toBe("");
            });

            it("setDefaultValues()", function(){
                var bin = Ext.create("Teselagen.models.J5Bin", {
                    binItemsVector: []
                });
                bin.setDefaultValues();
                //console.log("J5Bin init");
                //console.log(bin);

                // check
                expect(bin.get("binName")).toBe("");
                expect(bin.get("iconID")).toBe("generic");
                expect(bin.get("directionForward")).toBe(true);
                expect(bin.get("dsf")).toBe(false);
                expect(bin.get("fas")).toBe("");
            });

            it("addToBin()", function(){
                var part = Ext.create("Teselagen.models.Part");
                var bin = Ext.create("Teselagen.models.J5Bin", {
                    binItemsVector: []
                });
                expect(bin.get("binItemsVector").length).toBe(0);

                bin.addToBin(part, bin.get("binItemsVector").length);
                //console.log("J5Bin init-add part");
                //console.log(bin);

                // check
                expect(bin.get("binItemsVector").length).toBe(1);
            });

            it("removeFromBin()", function(){
                var part  = Ext.create("Teselagen.models.Part");
                var part2 = Ext.create("Teselagen.models.Part");
                console.log(part.get("id"));
                console.log(part2.get("id"));

                var bin   = Ext.create("Teselagen.models.J5Bin", {
                    binItemsVector: [part, part2]
                });
                //console.log("J5Bin init-remove part here");
                //console.log(bin);
                //console.log(bin.get("binItemsVector"));

                expect(bin.get("binItemsVector").length).toBe(2);

                bin.removeFromBin(part);
                //console.log("J5Bin init-remove   part gone");
                //console.log(bin);
                expect(bin.get("binItemsVector").length).toBe(1);
                bin.removeFromBin(part2);
                //console.log("J5Bin init-remove   part2   gone");
                //console.log(bin);

                // check
                //console.log(bin.get("binItemsVector"));
                expect(bin.get("binItemsVector").length).toBe(0);
            });
        });



    });
});