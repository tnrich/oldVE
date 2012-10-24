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


Ext.require("Teselagen.models.SequenceFile");
Ext.require("Teselagen.models.Part");
Ext.require("Teselagen.models.J5Bin");
Ext.require("Teselagen.models.J5Collection");
Ext.require("Teselagen.models.EugeneRule");
Ext.require("Teselagen.models.SBOLvIconInfo");

Ext.require("Teselagen.models.J5Run");
Ext.require("Teselagen.models.J5Parameters");
Ext.require("Teselagen.models.DownstreamAutomationParameters");
Ext.require("Teselagen.models.J5Results");

Ext.require("Teselagen.models.DeviceDesign");
Ext.require("Teselagen.models.Project");


Ext.onReady(function() {

    var Sha256 = Teselagen.bio.util.Sha256;

    var modelProxy = {
        type: "memory",
        reader: {
            type: "json"
        }
    };

    describe("Testing Teselagen.models", function() {

        describe("Make sure Proxies can be set on a model:", function() {
            it("GetProxy and SetProxy", function() {
                var part  = Ext.create("Teselagen.models.Part");
                
                part.setProxy(modelProxy);
                expect(part.getProxy().type).toBe("memory");
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

                expect(Teselagen.constants.Constants.GENBANK).toBe("Genbank");

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
                //    <de:sequenceFile hash="7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3">
                //      <de:format>FASTA</de:format>
                //      <de:content><![CDATA[>ssrA_tag_enhance
                //GCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG
                //]]></de:content>
                //      <de:fileName>ssrA_tag_enhance.fas</de:fileName>
                //    </de:sequenceFile>*/
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
            it("Test Associations", function(){
                var seq = Ext.create("Teselagen.models.SequenceFile");
                seq.setProxy(modelProxy);
                expect(seq).not.toBe(null);

                expect(Ext.getClassName(seq.getPart())).toBe("Teselagen.models.Part");
                expect(Ext.getClassName(seq.getProject())).toBe("Teselagen.models.Project");
            });

            it("Creates empty SequenceFile", function(){
                var seq = Ext.create("Teselagen.models.SequenceFile");
                seq.setProxy(modelProxy);
                expect(seq).not.toBe(null);

                expect(seq.get("sequenceFileFormat")).toBe("");
                expect(seq.get("hash")).toBe(Teselagen.bio.util.Sha256.hex_sha256(""));
                expect(seq.get("hash")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
            });
            
            it("setSequenceFileContent(), setPartSource(), setSequenceFileName(), test validate()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var seq = Ext.create("Teselagen.models.SequenceFile");
                seq.setProxy(modelProxy);

                seq.set("sequenceFileFormat", "FASTA");

                var hash = seq.setSequenceFileContent(content);
                expect(hash).toBe(trueHash);

                var disp = seq.setPartSource();
                expect(disp).toBe("ssrA_tag_enhance");

                var name = seq.setSequenceFileName();
                expect(name).toBe("ssrA_tag_enhance.fas");

                expect(seq.validate().length).toBe(0);
            });

            it("Creates SequenceFile: depends on setSequenceFileContent, setPartSource, setSequenceFileName", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });
                seq.setProxy(modelProxy);

                expect(seq.get("sequenceFileFormat")).toBe("FASTA");
                expect(seq.get("sequenceFileContent")).toBe(content);
                expect(seq.get("sequenceFileName")).toBe("ssrA_tag_enhance.fas");
                expect(seq.get("partSource")).toBe("ssrA_tag_enhance");
                expect(seq.get("hash")).toBe(trueHash);

                //console.log(seq);
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

        describe("Teselagen.models.PartVO.js -- This Class will be Eliminated", function() {

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
                //expect(part.get("id").length).toBe(16);
                part.setId();
                expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
            });
        });

        describe("Teselagen.models.Part.js", function() {

            it("Creates Part, Test Associations", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });
                part.setProxy(modelProxy);
                expect(part.isEmpty()).toBe(false);

                expect(part.get("fas")).toBe("fas1");

                // Checking Associations
                // FILL IN TESTS FOR SEQUENCE FILE HERE!!!!
                expect(Ext.getClassName(part.getSequenceFile())).toBe("Teselagen.models.SequenceFile");
                expect(Ext.getClassName(part.getJ5Bin())).toBe("Teselagen.models.J5Bin");
            });

            it("Creates Part, Can Set SequenceFile", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    id: 5,
                    fas: "fas1"
                });
                part.setProxy(modelProxy);

                var newSeq = Ext.create("Teselagen.models.SequenceFile", {
                    id: 10,
                    sequenceFileName: "newSeq",
                    sequenceFileContent: "gattaca"
                });
                newSeq.setProxy(modelProxy);

                expect(part.getSequenceFile().get("sequenceFileName")).toBe("");
                expect(part.getSequenceFile().get("sequenceFileContent")).toBe("");

                part.setSequenceFile(newSeq);

                expect(part.getSequenceFile().get("sequenceFileName")).toBe("newSeq");
                expect(part.getSequenceFile().get("sequenceFileContent")).toBe("gattaca");

                expect(Ext.getClassName(part.getSequenceFile())).toBe("Teselagen.models.SequenceFile");
                expect(Ext.getClassName(part.getJ5Bin())).toBe("Teselagen.models.J5Bin");
            });

            it("Creates Empty Part, isEmpty", function(){
                var part = Ext.create("Teselagen.models.Part");
                part.setProxy(modelProxy);

                expect(part.isEmpty()).toBe(true);
                //expect(part.isPartVOEmpty()).toBe(true);

                //expect(part.get("partVO")).toBe(null);
                expect(part.get("fas")).toBe("");
                expect(part.get("id")).not.toBe("");

                // Added PartVO fields
                expect(part.get("name")).toBe("");
                expect(part.get("revComp")).toBe(false);
                expect(part.get("genbankStartBP")).toBe(0);
                expect(part.get("endBP")).toBe(0);
                expect(part.get("iconID")).toBe("");
            });

            it("Creates Part: setId() --- FIX THIS AFTER RODRIGO IS DONE WITH ID GENERATOR", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });
                part.setProxy(modelProxy);

                //expect(part.get("id").length).toBe(16); //toBe(13); // Date.now()
                part.setId();
                //expect(part.get("id").length).toBe(16); // Date.now() + 3 random digits
            });

            it("isEmpty() ***", function(){
                var part = Ext.create("Teselagen.models.Part");
                part.setProxy(modelProxy);

                expect(part.isEmpty()).toBe(true);
                //expect(part.isPartVOEmpty()).toBe(true);
            });

            it("isEqual()", function(){
                var part1 = Ext.create("Teselagen.models.Part");
                var part2 = Ext.create("Teselagen.models.Part");
                var part3 = Ext.create("Teselagen.models.Part", {
                    name: "blah"
                });
                //part1.setProxy(modelProxy);
                //part2.setProxy(modelProxy);
                //part3.setProxy(modelProxy);

                expect(part1.isEqual(part1)).toBe(true);
                expect(part1.isEqual(part2)).toBe(false); // Should this be equal??? They have different SeqFiles.
                expect(part1.isEqual(part3)).toBe(false);
            });
        });

        describe("Teselagen.models.EugeneRule.js", function() {

            it("Creates EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                eugene.setProxy(modelProxy);
                expect(eugene).not.toBe(null);

                expect(eugene.get("name")).toBe("rule0"); //
                expect(eugene.get("negationOperator")).toBe(false);
            });
//LAST HERE  DW: 10.16.2012
            it("Test Associations -- DEVICE DESIGN MUST HAVE PROXY", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                eugene.setProxy(modelProxy);

                expect(eugene.getDeviceDesign().getProxy().type).toBe("memory");
                eugene.getDeviceDesign().setProxy(modelProxy);
                

                expect(Ext.getClassName(eugene.getDeviceDesign())).toBe("Teselagen.models.DeviceDesign");
                expect(eugene.getDeviceDesign().getProxy().type).toBe("memory");
                expect(Ext.getClassName(eugene.getOperand1())).toBe("Teselagen.models.Part");
            });

            it("Creates EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                expect(eugene).not.toBe(null);

                expect(eugene.get("name").match(/rule/).length).toBe(1); //
                expect(eugene.get("negationOperator")).toBe(false);
            });

            it("Rejects unacceptable operand2", function(){
                var eugene, e;
                var flag = false;
                try {
                    eugene = Ext.create("Teselagen.models.EugeneRule", {
                        compositionalOperator: "AFTER"
                    } );
                } catch (bio) {
                    flag = true;
                    expect(bio.message).toBe("Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or Part.");
                }
                expect(flag).toBe(true);
            });

            it("Repairs a bad name", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "blah blah",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                expect(eugene.get("name")).toBe("blahblah");
            });

            it("setOperand1() -- Using hasOne", function(){

                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    //operand1: Ext.create("Teselagen.models.Part", { name: "part"}),
                    compositionalOperator: "BEFORE",
                    operand2: 123
                });
                eug.setProxy(modelProxy);

                expect(eug.getOperand1().get("name")).toBe("");

                var op1 = Ext.create("Teselagen.models.Part", { name: "part", genbankStartBP: 200});
                eug.setOperand1(op1);
                expect(eug.getOperand1().get("name")).toBe("part");
            });

            it("setOperand2() (test to make sure its ok)", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "name1",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                expect(eugene).not.toBe(null);

                var flag = false;
                try {
                    eugene.setOperand2("bad string");
                } catch (e) {
                    flag = true;
                    //console.log("Correctly caught: " + e.message);
                }
                eugene.setOperand2(567);
                expect(eugene.get("name")).toBe("name1");
                expect(eugene.get("operand2")).toBe(567);
                expect(eugene).not.toBe(null);
                expect(flag).toBe(true);
            });

            it("generateText()", function(){

                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    //operand1: Ext.create("Teselagen.models.Part", { name: "part"}),
                    compositionalOperator: "BEFORE",
                    operand2: 123
                });
                eug.setProxy(modelProxy);

                var op1 = Ext.create("Teselagen.models.Part", { name: "part", genbankStartBP: 200});
                eug.setOperand1(op1);

                //console.log(eug.validate());
                var str = eug.generateText();
                expect(str).toBe("Rule eug(part BEFORE 123);");
            });
        });
        
        

        describe("Teselagen.models.J5Bin.js", function() {

            beforeEach(function() {
            });

            it("Creates J5Bin", function(){
                var bin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "binName1"
                });
                bin.setProxy(modelProxy);
                expect(bin).not.toBe(null);
                
                // check -- Non-empty defaults do not work!
                expect(bin.get("binName")).toBe("binName1");
                expect(bin.get("iconID")).toBe("generic");
                expect(bin.get("directionForward")).toBe(true);
                expect(bin.get("fas")).toBe("");

                expect(bin.partCount()).toBe(0);
            });

            it("Test Associations()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");

                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1, part2]
                });
                bin.setProxy(modelProxy);
                bin.addToParts([part1, part2]);

                expect(bin.parts()).not.toBe(null);
                expect(Ext.getClassName(bin.parts())).toBe("Ext.data.Store");
                expect(Ext.getClassName(bin.getJ5Collection())).toBe("Teselagen.models.J5Collection");
            });

            it("indexOfPart()//hasPart()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");

                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1, part2]
                });
                bin.setProxy(modelProxy);
                bin.addToParts([part1, part2]);

                expect(bin.indexOfPart(part1)).toBe(0);
                expect(bin.indexOfPart(part2)).toBe(1);

                expect(bin.hasPart(part1)).toBe(true);
                expect(bin.hasPart("blah")).toBe(false);
            });

            it("addToParts()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var part3   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    parts: []
                });
                bin.setProxy(modelProxy);
                expect(bin.partCount()).toBe(0);

                var success = bin.addToParts(part1);
                //console.log("J5Bin init-add part");
                //console.log(bin);

                // check
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part1);

                // add a second part, insert in front of previous part
                success = bin.addToParts(part2, 0);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part1);

                // add a third in between
                success = bin.addToParts(part3, 1);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(3);

                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part3);
                expect(bin.parts().getAt(2)).toBe(part1);
                //console.log(bin.parts());
            });


            it("addToParts(): Is Part1 and the bin.part1 linked or cloned?", function(){
                var part1   = Ext.create("Teselagen.models.Part", {
                    fas: "tmpname"
                });
                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: []
                });
                bin.setProxy(modelProxy);
                expect(bin.partCount()).toBe(0);

                var success = bin.addToParts(part1);

                // check if the structure is correct.
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(0).get("fas")).toBe("tmpname");

                // change part 1. Change should be reflected in the bin's parts
                part1.set("fas", "blahblah");
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(0).get("fas")).toBe("blahblah"); //double check change

            });
            
            it("removeFromParts()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");

                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1, part2]
                });
                bin.setProxy(modelProxy);
                bin.addToParts([part1, part2]);

                expect(bin.partCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(1)).toBe(part2);

                var success = bin.removeFromParts(part1);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part2);

                // should fail to remove it again
                success = bin.removeFromParts(part1);
                expect(success).toBe(false);

                success = bin.removeFromParts(part2);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(0);
            });

            it("getPartById() -- THIS WILL NOT WORK UNTIL RODRIGO/MONGO'S ID GENERATOR WORKS", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");

                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1, part2]
                });
                bin.setProxy(modelProxy);
                bin.addToParts([part1, part2]);

                //var id1     = bin.getPartById(part1.get("id"));
                //expect(id1).toBe(part1);

                //var id2     = bin.getPartById(part2.get("id"));
                //expect(id2).toBe(part2);

                //expect(id1).not.toBe(part2);
                //expect(id2).not.toBe(part1);
            });

            it("deletePart() -- Depends on DeviceDesign.getRulesInvolvingPart() and removeFromRules()", function(){

                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule1",
                    //operand1: part1,
                    operand2: part2,
                    compositionalOperator: "AFTER"
                });
                rule1.setOperand1(part1);

                // Create a bin with parts
                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1, part2]
                });
                bin.setProxy(modelProxy);
                bin.addToParts([part1, part2]);

                // Create a Device with eugene rules that include the parts
                var device  = Ext.create("Teselagen.models.DeviceDesign");
                device.addToRules(rule1);

                // Check Structure
                expect(bin.parts().count()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(device.rules().count()).toBe(1);

                // Delete the part with rule
                bin.deletePart(part1, device);

                // Check New Structure
                expect(bin.parts().count()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part2);
                expect(device.rules().count()).toBe(0);
            });

            it("createPart() ***", function(){
            });

            it("isUniquePartName()", function(){
                var part1   = Ext.create("Teselagen.models.Part", {
                    name: "blah"
                });
                var bin     = Ext.create("Teselagen.models.J5Bin");
                bin.addToParts([part1]);

                var unique  = bin.isUniquePartName("blah");
                expect(unique).toBe(false);
                unique      = bin.isUniquePartName("newName");
                expect(unique).toBe(true);
            });
        });
        
        describe("Teselagen.models.J5Collection.js", function() {

            beforeEach(function() {
            });

            it("Creates J5Collection and Check Associations", function(){
                var coll = Ext.create("Teselagen.models.J5Collection", {});
                expect(coll).not.toBe(null);

                // check
                expect(coll.bins().count()).toBe(0);
                expect(coll.get("j5Ready")).toBe(false);
                expect(coll.get("combinatorial")).toBe(false);
                expect(coll.get("isCircular")).toBe(true);

                expect(Ext.getClassName(coll.bins())).toBe("Ext.data.Store");
                coll.getDeviceDesign().setProxy(modelProxy);
                expect(Ext.getClassName(coll.getDeviceDesign())).toBe("Teselagen.models.DeviceDesign");
                //console.log(coll.getDeviceDesign());

                // Do validation
                var err = coll.validate();
                expect(err.length).toBe(0);
            });


            it("addToBin() adds a J5Bin", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var bin3    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {});

                expect(coll.bins().count()).toBe(0);

                var success = coll.addToBin(bin1);

                // check
                expect(coll.bins().count()).toBe(1);
                expect(coll.bins().getAt(0)).toBe(bin1);

                // check
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(1);
                expect(coll.bins().getAt(0)).toBe(bin1);

                // add a second bin, insert in front of previous bin
                success = coll.addToBin(bin2, 0);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(2);
                expect(coll.bins().getAt(0)).toBe(bin2);
                expect(coll.bins().getAt(1)).toBe(bin1);

                // add a third in between
                success = coll.addToBin(bin3, 1);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(3);

                expect(coll.bins().getAt(0)).toBe(bin2);
                expect(coll.bins().getAt(1)).toBe(bin3);
                expect(coll.bins().getAt(2)).toBe(bin1);
            });

            it("removeFromBin() removes a J5Bin", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1, bin2]
                });
                coll.addToBin([bin1, bin2]);

                expect(coll.bins().count()).toBe(2);
                expect(coll.bins().getAt(0)).toBe(bin1);
                expect(coll.bins().getAt(1)).toBe(bin2);

                var success = coll.removeFromBin(bin1);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(1);
                expect(coll.bins().getAt(0)).toBe(bin2);

                // should fail to remove it again
                success = coll.removeFromBin(bin1);
                expect(success).toBe(false);

                success = coll.removeFromBin(bin2);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(0);
            });

            
            it("isPartInCollection() detects a part correctly.", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1]
                });
                bin1.addToParts(part1);
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1]
                });
                coll.addToBin(bin1);

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
                    //binsVector: [bin1]
                });
                coll.addToBin(bin1);

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
                    //binsVector: [bin1, bin2]
                });
                coll.addToBin([bin1, bin2]);

                // add new bin between bin1 and bin2
                var success = coll.addNewBinByIndex("newBin", 1);

                expect(coll.bins().count()).toBe(3);
                expect(coll.bins().getAt(0)).toBe(bin1);
                expect(coll.bins().getAt(1).get("binName")).toBe("newBin");
                expect(coll.bins().getAt(2)).toBe(bin2);
            });
            
            it("deleteBinByIndex()", function(){
                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var bin2    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1, bin2]
                });
                coll.addToBin([bin1, bin2]);

                expect(coll.bins().count()).toBe(2);
                expect(coll.bins().getAt(0)).toBe(bin1);
                expect(coll.bins().getAt(1)).toBe(bin2);

                var success = coll.deleteBinByIndex(0);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(1);
                expect(coll.bins().getAt(0)).toBe(bin2);

                // 2 is out of range, will pop the remaining bin
                success = coll.deleteBinByIndex(-1);
                expect(success).toBe(true);
                expect(coll.bins().count()).toBe(0);
            });
            
            it("addPartToBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                //var part2   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin");
                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1]
                });
                coll.addToBin([bin1]);

                expect(coll.binCount()).toBe(1);
                expect(bin1.partCount()).toBe(0);
                var success = coll.addPartToBin(part1, 0, 0);
                expect(success).toBe(true);
                expect(coll.binCount()).toBe(1);
                expect(bin1.partCount()).toBe(1);
                expect(coll.bins().getAt(0).partCount()).toBe(1);
            });

            it("removePartFromBin()", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                //var part2   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1]
                });
                bin1.addToParts(part1);

                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1]
                });
                coll.addToBin(bin1);

                expect(coll.binCount()).toBe(1);
                expect(bin1.partCount()).toBe(1);
                var success = coll.removePartFromBin(part1, 0);
                expect(success).toBe(true);
                expect(coll.binCount()).toBe(1);
                expect(bin1.partCount()).toBe(0);
                expect(coll.bins().getAt(0).partCount()).toBe(0);
            });
            
            it("getBinAssignment()", function(){
                var part1   = Ext.create("Teselagen.models.Part");

                var bin1    = Ext.create("Teselagen.models.J5Bin", {
                    //parts: [part1]
                });
                bin1.addToParts(part1);

                var coll    = Ext.create("Teselagen.models.J5Collection", {
                    //binsVector: [bin1]
                });
                coll.addToBin(bin1);

                var tmp = coll.getBinAssignment(part1);
                expect(tmp).toBe(part1);
            });

            it("isUniqueBinName()", function(){
                var bin     = Ext.create("Teselagen.models.J5Bin", {
                    binName: "newBinName"
                });

                var coll    = Ext.create("Teselagen.models.J5Collection");
                coll.addToBin(bin);

                var unique  = coll.isUniqueBinName("newBinName");
                expect(unique).toBe(false);
                unique      = bin.isUniquePartName("blah");
                expect(unique).toBe(true);
            });
        });

        describe("Teselagen.models.DeviceDesign.js", function() {

            it("Create DeviceDesign, Check Associations", function(){

                var device = Ext.create("Teselagen.models.DeviceDesign");

                expect(device).not.toBe(null);
                expect(Ext.getClassName(device.getJ5Collection())).toBe("Teselagen.models.J5Collection");
                expect(Ext.getClassName(device.rules())).toBe("Ext.data.Store");
                //expect(Ext.getClassName(device.runs())).toBe("Ext.data.Store");

                //console.log(device.j5Collection());
                expect(Ext.getClassName(device.getDeviceEditorProject())).toBe("Teselagen.models.DeviceEditorProject");
            });

            it("Create DeviceDesign", function(){

                var device = Ext.create("Teselagen.models.DeviceDesign");

                expect(device).not.toBe(null);
                device.createNewCollection(3);

                expect(device.getJ5Collection().binCount()).toBe(3);
                expect(device.getJ5Collection().bins().getAt(0).get("binName")).toBe("No_Name0");
            });


            it("addToRules() & removeFromRules()", function(){
                var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule1",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                var rule2   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule2",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });

                // Create a Device, add rule1
                var device  = Ext.create("Teselagen.models.DeviceDesign");
                expect(device.rules().count()).toBe(0);
                var success = device.addToRules(rule1);

                expect(success).toBe(true);
                expect(device.rules().count()).toBe(1);

                // Remove a non-existant rule
                success = device.removeFromRules(rule2);
                expect(success).toBe(false);
                expect(device.rules().count()).toBe(1);

                // Remove the rules
                success = device.removeFromRules(rule1);
                expect(success).toBe(true);
                expect(device.rules().count()).toBe(0);

            });

            it("getRuleByName()", function(){
                var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule1",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });

                // Create a Device with eugene rule
                var device  = Ext.create("Teselagen.models.DeviceDesign");
                device.addToRules(rule1);

                var foundRule = device.getRuleByName("rule1");
                expect(foundRule).toBe(rule1);

                foundRule = device.getRuleByName("rule100");
                expect(foundRule).toBe(null);

            });

            it("getRulesInvolvingPart() -- Depends on DeviceDesign.getRulesInvolvingPart() and removeFromRules()", function(){

                var part1   = Ext.create("Teselagen.models.Part", {name: "part1"});
                var part2   = Ext.create("Teselagen.models.Part");
                var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule1",
                    //operand1: part1,
                    operand2: part2,
                    compositionalOperator: "AFTER"
                });
                rule1.setOperand1(part1);

                // Create a bin with parts
                var bin     = Ext.create("Teselagen.models.J5Bin");
                bin.addToParts([part1, part2]);

                // Create a Device with eugene rules that include the parts
                var device  = Ext.create("Teselagen.models.DeviceDesign");
                device.addToRules(rule1);

                // Search for rules that have part1
                var eugRules = device.getRulesInvolvingPart(part1);

                expect(eugRules[0]).toBe(rule1);
//LAST HERE  DW: 10.16.2012

            });

            it("isUniqueRuleName()", function(){
                var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule1",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });
                var rule2   = Ext.create("Teselagen.models.EugeneRule", {
                    name: "rule2",
                    operand2: 123,
                    compositionalOperator: "AFTER"
                });

                // Create a Device, add rule1
                var device  = Ext.create("Teselagen.models.DeviceDesign");
                device.addToRules(rule1);
                device.addToRules(rule2);

                var unique = device.isUniqueRuleName("rule1");
                expect(unique).toBe(false);
                unique = device.isUniqueRuleName("rule3");
                expect(unique).toBe(true);

            });
        });

        describe("Teselagen.models.J5Run.js", function() {

            it("Create J5Run, Check Associations", function(){
                var run = Ext.create("Teselagen.models.J5Run");

                //console.log(run);

                expect(Ext.getClassName(run.getJ5Parameters())).toBe("Teselagen.models.J5Parameters");
                expect(Ext.getClassName(run.getDownstreamAutomationParameters())).toBe("Teselagen.models.DownstreamAutomationParameters");
                expect(Ext.getClassName(run.getJ5Results())).toBe("Teselagen.models.J5Results");

                expect(Ext.getClassName(run.getDeviceEditorProject())).toBe("Teselagen.models.DeviceEditorProject");
            });
            it("Create J5Run, Check Parameter files.", function(){
                var run = Ext.create("Teselagen.models.J5Run");

                var j5p = Ext.create("Teselagen.models.J5Parameters");
                var dsa = Ext.create("Teselagen.models.DownstreamAutomationParameters");

                run.setJ5Parameters(j5p);
                run.setDownstreamAutomationParameters(dsa);

                // run should have default j5 and downstream parameters
                expect(run.getJ5Parameters().get("masterOligoNumberOfDigitsValue")).toBe(j5p.self.MONOD_Default);
                expect(run.getDownstreamAutomationParameters().get("maxDeltaTemperatureAdjacentZonesValue")).toBe(dsa.self.MDTAZ_DEFAULT);
            });
        });

        describe("Teselagen.models.J5Results.js", function() {

            it("Create J5Results", function(){
                var results = Ext.create("Teselagen.models.J5Results");

                expect(results).not.toBe(null);

                //console.log(results);
                expect(Ext.getClassName(results.getJ5Run())).toBe("Teselagen.models.J5Run");
            });
        });



    });
});