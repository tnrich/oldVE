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
Ext.require("Teselagen.constants.SBOLIcons");


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

        //================================================
        // Teselagen.models.DownstreamAutomationParameters
        //================================================
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
        
        //================================================
        // Teselagen.constants.Constants
        //================================================
        describe("Teselagen.constants.Constants.js", function() {

            it("Calls Constants", function(){

                expect(Teselagen.constants.Constants.GENBANK).toBe("GENBANK");

            });
        });

        //================================================
        // Teselagen.models.J5Parameters
        //================================================
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

        //================================================
        // Teselagen.models.SequenceFile
        //================================================
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
                var seq = Ext.create("Teselagen.models.SequenceFile", {sequenceFileFormat: "FASTA"});
                seq.setProxy(modelProxy);
                expect(seq).not.toBe(null);

                expect(Ext.getClassName(seq.getPart())).toBe("Teselagen.models.Part");
            });

            it("Creates empty SequenceFile", function(){
                var seq = Ext.create("Teselagen.models.SequenceFile", {sequenceFileFormat: "FASTA"});
                seq.setProxy(modelProxy);
                expect(seq).not.toBe(null);

                expect(seq.get("sequenceFileFormat")).toBe("FASTA");
                expect(seq.get("hash")).toBe(Teselagen.bio.util.Sha256.hex_sha256(""));
                expect(seq.get("hash")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
            });
            
            it("setSequenceFileContent(), setPartSource(), setSequenceFileName(), test validate()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";

                var seq = Ext.create("Teselagen.models.SequenceFile", {sequenceFileFormat: "FASTA"});

                seq.set("sequenceFileFormat", "FASTA");
                expect(seq.get("sequenceFileFormat")).toBe("FASTA");

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

            it("setSequenceFileContent()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var trueHash    =  "7ded0adb8463aa8b7bfe30d093bc4f6d8718bd1182906f283b04d303860dd0f3";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });

                var hash = seq.setSequenceFileContent("");
                expect(hash).not.toBe(trueHash);
                expect(seq.get("sequenceFileContent")).toBe("");
            });

            it("makePartSource()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });
                var name = seq.makePartSource("FASTA", content);
                expect(name).toBe("ssrA_tag_enhance");
            });

            it("setPartSource()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });

                var source = seq.setPartSource("");
                expect(source).toBe("ssrA_tag_enhance");
                source = seq.setPartSource(undefined);
                expect(source).toBe("ssrA_tag_enhance");
                source = seq.setPartSource(null);
                expect(source).toBe("ssrA_tag_enhance");

                source = seq.setPartSource("newName");
                expect(source).toBe("newName");
            });

            it("makeSequenceFileName()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });
                var name = seq.makeSequenceFileName("FASTA", "ssrA_tag_enhance");
                expect(name).toBe("ssrA_tag_enhance.fas");
            });

            it("setSequenceFileName()", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });

                var name = seq.setSequenceFileName("");
                expect(name).toBe("ssrA_tag_enhance.fas");

                name = seq.setSequenceFileName(null);
                expect(name).toBe("ssrA_tag_enhance.fas");

                name = seq.setSequenceFileName(undefined);
                expect(name).toBe("ssrA_tag_enhance.fas");

                name = seq.setSequenceFileName("newName.fas");
                expect(name).toBe("newName.fas");
            });

            it("getLength(): For FASTA FILE", function(){
                var content     = ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: content
                });

                var len = seq.getLength();
                expect(len).toBe(39);
            });

            it("getLength(): For Genbank FILE", function(){
                var content   = "ORIGIN      \n" +
                                "        1 gacgtcttat gacaacttga";
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "GENBANK",
                    sequenceFileContent: content
                });

                var len = seq.getLength();
                expect(len).toBe(20);
            });

            xit("getLength(): For JbeiSeqXml FILE", function(){

                var url = "/biojs/test/data/jbeiseq/test.xml";
                var content = jasmine.getFixtures().read(url);
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "JBEISEQXML",
                    sequenceFileContent: content
                });

                var len = seq.getLength();
                expect(len).toBe(64);
            });

            xit("getLength(): For SBOL FILE ***** NOT DONE", function(){
                //var content     = "";
                var url = "/biojs/test/data/sbol/signal_peptide_SBOL.xml";
                var content = jasmine.getFixtures().read(url);
                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "SBOLXML",
                    sequenceFileContent: content
                });

                var len = seq.getLength();
                expect(len).toBe(64);
            });


        });

        //================================================
        // Teselagen.models.SBOLvIconInfo
        //================================================
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

        //================================================
        // Teselagen.models.PartVO
        //================================================
        xdescribe("Teselagen.models.PartVO.js -- This Class will be Eliminated", function() {

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

        //================================================
        // Teselagen.models.Part
        //================================================
        describe("Teselagen.models.Part.js", function() {

            it("Creates Part, Test Associations", function(){
                var part = Ext.create("Teselagen.models.Part");
                expect(part.isEmpty()).toBe(true);

                expect(part.get("fas")).toBe("None");
//                expect(part.get("name").match("Part")).not.toBe(null);

                // Checking Associations
                // FILL IN TESTS FOR SEQUENCE FILE HERE!!!!
                expect(Ext.getClassName(part.getSequenceFile())).toBe("Teselagen.models.SequenceFile");
                //expect(Ext.getClassName(part.getJ5Bin())).toBe("Teselagen.models.J5Bin");
            });

            it("Creates Part, setSequenceFile()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    id: 5,
                    fas: "fas1"
                });
                part.setProxy(modelProxy);

                var newSeq = Ext.create("Teselagen.models.SequenceFile", {
                    id: 10,
                    sequenceFileFormat: "FASTA",
                    sequenceFileName: "newSeq",
                    sequenceFileContent: "gattaca"
                });

                expect(part.get("genbankStartBP")).toBe(0);
                expect(part.get("endBP")).toBe(0);
                expect(part.getSequenceFile().get("sequenceFileName")).toBe("");
                expect(part.getSequenceFile().get("sequenceFileContent")).toBe("");

                part.setSequenceFile(newSeq);

                expect(part.getSequenceFile().get("sequenceFileName")).toBe("newSeq");
                expect(part.getSequenceFile().get("sequenceFileContent")).toBe("gattaca");

                expect(part.get("genbankStartBP")).toBe(1);
                expect(part.get("endBP")).toBe(7);
            });

            it("Creates Empty Part, isEmpty", function(){
                var part = Ext.create("Teselagen.models.Part");

                expect(part.isEmpty()).toBe(true);
                //expect(part.isPartVOEmpty()).toBe(true);

                //expect(part.get("partVO")).toBe(null);
                expect(part.get("fas")).toBe("None");
                expect(part.get("id")).not.toBe("");

                // Added PartVO fields
//                expect(part.get("name").match("Part")).not.toBe(null);
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

            it("isEmpty() *** Check to see if this is a good definition", function(){
                var part = Ext.create("Teselagen.models.Part");

                expect(part.isEmpty()).toBe(true);
            });

            it("isEqual()", function(){
                var part1 = Ext.create("Teselagen.models.Part");
                var part2 = Ext.create("Teselagen.models.Part");
                var part3 = Ext.create("Teselagen.models.Part", {
                    name: "blah"
                });

                expect(part1.isEqual(part1)).toBe(true);
                expect(part1.isEqual(part2)).toBe(false); // Should this be equal??? They have different SeqFiles.
                expect(part1.isEqual(part3)).toBe(false);
            });

            it("setSequenceFile()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });

                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: ">seq\ngattaca"
                });

                expect(part.getSequenceFile().get("sequenceFileName")).toBe("");
                expect(part.getStart()).toBe(0);
                expect(part.getEnd()).toBe(0);

                part.setSequenceFile(seq);

                expect(part.getSequenceFile().get("sequenceFileName")).toBe("seq.fas");
                expect(part.getStart()).toBe(1);
                expect(part.getEnd()).toBe(7);
            });

            it("removeSequenceFile()", function(){
                var part = Ext.create("Teselagen.models.Part", {
                    fas: "fas1"
                });

                var seq = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "FASTA",
                    sequenceFileContent: ">seq\ngattaca"
                });

                part.setSequenceFile(seq);
                expect(part.getStart()).toBe(1);
                expect(part.getEnd()).toBe(7);

                var success = part.removeSequenceFile();
                var s = part.getSequenceFile();
                expect(success).toBe(true);
                expect(s.get("sequenceFileFormat")).toBe("INIT");
                expect(part.getStart()).toBe(0);
                expect(part.getEnd()).toBe(0);
            });
        });
        
        //================================================
        // Teselagen.models.EugeneRule
        //================================================
        describe("Teselagen.models.EugeneRule.js", function() {

            beforeEach(function() {
                operand1 = Ext.create("Teselagen.models.Part", {name: "op1"});
                operand2 = Ext.create("Teselagen.models.Part", {name: "op2"});
            });

            it("Creates EugeneRule", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    compositionalOperator: "AFTER"
                });
                expect(eugene).not.toBe(null);

                expect(eugene.get("name")).toBe("rule0"); //
                expect(eugene.get("negationOperator")).toBe(false);
            });
            
            it("Test Associations", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    compositionalOperator: "AFTER"
                });
                eugene.setOperand1(operand1);
                eugene.setOperand2(operand2);

//                expect(Ext.getClassName(eugene.getDeviceDesign())).toBe("Teselagen.models.DeviceDesign");
                expect(Ext.getClassName(eugene.getOperand1())).toBe("Teselagen.models.Part");
                expect(Ext.getClassName(eugene.getOperand2())).toBe("Teselagen.models.Part");
            });

            it("Rejects unacceptable compositionalOperator: this test will fail if EugeneRule does not throw and error for a bad compOp", function(){
                var eugene, e;
                var flag = false;
                try {
                    eugene = Ext.create("Teselagen.models.EugeneRule", {
                        compositionalOperator: ""
                    });
                } catch (bio) {
                    flag = true;
                    //expect(bio.message).toBe("Teselagen.models.EugeneRule: Illegal CompositionalOperator: ");
                }
                expect(flag).toBe(true);
            });

            it("Repairs a bad name", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "blah blah",
                    compositionalOperator: "AFTER"
                });
                expect(eugene.get("name")).toBe("blahblah");
            });

            it("setOperand1()", function(){

                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    compositionalOperator: "BEFORE"
                });

//                expect(eug.getOperand1().get("name").match("Part")).not.toBe(null);

                var op1 = Ext.create("Teselagen.models.Part", { name: "part", genbankStartBP: 200});
                eug.setOperand1(op1);
                expect(eug.getOperand1().get("name")).toBe("part");
            });

            it("setOperand2(): Rejects unacceptable operand2", function(){
                var eugene, e;
                var flag = false;
                try {
                    eugene = Ext.create("Teselagen.models.EugeneRule", {
                        compositionalOperator: "AFTER"
                    });
                    eugene.setOperand1(operand1);
                    eugene.setOperand2("badString");
                } catch (bio) {
                    flag = true;
                    expect(bio.message).toBe("Teselagen.models.EugeneRule.setOperand2(): Illegal operand2. Must be a Number or Part.");
                }
                expect(flag).toBe(true);
            });

            it("setOperand2()/getOperand2(): accepts Number", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "name1",
                    compositionalOperator: "AFTER"
                });
                eugene.setOperand1(operand1);
                eugene.setOperand2(567);

                expect(eugene.get("operand2isNumber")).toBe(true); //do not use outside of model
                expect(eugene.getOperand2()).toBe(567);
            });

            it("setOperand2()/getOperand2(): accepts Part", function(){
                var eugene = Ext.create("Teselagen.models.EugeneRule", {
                    name: "name1",
                    compositionalOperator: "AFTER"
                });
                eugene.setOperand1(operand1);
                eugene.setOperand2(operand2);

                expect(eugene.get("operand2isNumber")).toBe(false); //do not use outside of model
                expect(eugene.getOperand1().get("name")).toBe("op1");
                expect(eugene.getOperand2().get("name")).toBe("op2");
            });

            it("generateText(): Operand2 is number", function(){

                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    compositionalOperator: "BEFORE"
                });

                eug.setOperand1(operand1);
                eug.setOperand2(123);

                var str = eug.generateText();
                expect(str).toBe("Rule eug(op1 BEFORE 123);");
            });

            it("generateText(): Operand2 is Part", function(){

                var eug = Ext.create("Teselagen.models.EugeneRule", {
                    name: "eug",
                    compositionalOperator: "BEFORE"
                });

                eug.setOperand1(operand1);
                eug.setOperand2(operand2);

                var str = eug.generateText();
                expect(str).toBe("Rule eug(op1 BEFORE op2);");
            });
        });
        
        //================================================
        // Teselagen.models.J5Bin: See j5bin.t.js.
        //================================================

        //================================================
        // Teselagen.models.J5Collection
        //================================================
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
//                coll.getDeviceDesign().setProxy(modelProxy);
//                expect(Ext.getClassName(coll.getDeviceDesign())).toBe("Teselagen.models.DeviceDesign");
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

            
            xit("isPartInCollection() detects a part correctly.", function(){
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
                var success = coll.addNewBinByIndex(1, "newBin");

                expect(coll.bins().count()).toBe(3);
                expect(coll.bins().getAt(0)).toBe(bin1);
                expect(coll.bins().getAt(1).get("binName")).toBe("newBin");
                expect(coll.bins().getAt(2)).toBe(bin2);
                expect(success).toBe(true);
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
            
            xit("addPartToBin()", function(){
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

            xit("removePartFromBin()", function(){
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
            
            xit("getBinAssignment()", function(){
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
                expect(tmp).toBe(0);
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

        //================================================
        // Teselagen.models.DeviceDesign
        //================================================
        describe("Teselagen.models.DeviceDesign.js", function() {

            it("Create DeviceDesign, Check Associations", function(){

                var device = Ext.create("Teselagen.models.DeviceDesign");

                expect(device).not.toBe(null);
                expect(Ext.getClassName(device())).toBe("Teselagen.models.J5Collection");
                expect(Ext.getClassName(device.rules())).toBe("Ext.data.Store");
                //expect(Ext.getClassName(device.runs())).toBe("Ext.data.Store");

                //console.log(device.j5Collection());
            });

            it("Create DeviceDesign: createNewCollection()", function(){

                var device = Ext.create("Teselagen.models.DeviceDesign");

                expect(device).not.toBe(null);
                device.createNewCollection(3);

                expect(device().binCount()).toBe(3);
                expect(device().bins().getAt(0).get("binName")).toBe("No_Name0");
            });

            it("Create DeviceDesign: createCollectionFromBins()", function(){

                var device  = Ext.create("Teselagen.models.DeviceDesign");

                var bin1    = Ext.create("Teselagen.models.J5Bin", {binName: "bin1"});
                var bin2    = Ext.create("Teselagen.models.J5Bin");

                device.createCollectionFromBins([bin1, bin2]);

                expect(device().binCount()).toBe(2);
                expect(device().bins().getAt(0).get("binName")).toBe("bin1");
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

                expect(eugRules.first().get("name")).toBe("rule1");

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

        //================================================
        // Teselagen.models.J5Run
        //================================================
        describe("Teselagen.models.J5Run.js", function() {

            it("Create J5Run, Check Associations", function(){
                var run = Ext.create("Teselagen.models.J5Run");

                //console.log(run);

                //expect(Ext.getClassName(run.getJ5Parameters())).toBe("Teselagen.models.J5Parameters");
                //expect(Ext.getClassName(run.getDownstreamAutomationParameters())).toBe("Teselagen.models.DownstreamAutomationParameters");
                expect(Ext.getClassName(run.getJ5Results())).toBe("Teselagen.models.J5Results");
                expect(Ext.getClassName(run.getJ5Input())).toBe("Teselagen.models.J5Input");

            });
            
            xit("Create J5Run, Check Parameter files.", function(){
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

        //================================================
        // Teselagen.models.J5Input
        //================================================
        describe("Teselagen.models.J5Input.js", function() {

            it("Create J5Results", function(){
                var input = Ext.create("Teselagen.models.J5Input");

                expect(input).not.toBe(null);

                //console.log(results);
                expect(Ext.getClassName(input.getJ5Run())).toBe("Teselagen.models.J5Run");

                expect(Ext.getClassName(input.getJ5Parameters())).toBe("Teselagen.models.J5Parameters");
                expect(Ext.getClassName(input.getDownstreamAutomationParameters())).toBe("Teselagen.models.DownstreamAutomationParameters");
            });


            it("Create J5Run, Check Parameter files.", function(){
                var input = Ext.create("Teselagen.models.J5Input");

                var j5p = Ext.create("Teselagen.models.J5Parameters");
                var dsa = Ext.create("Teselagen.models.DownstreamAutomationParameters");

                input.setJ5Parameters(j5p);
                input.setDownstreamAutomationParameters(dsa);

                // input should have default j5 and downstream parameters
                expect(input.getJ5Parameters().get("masterOligoNumberOfDigitsValue")).toBe(j5p.self.MONOD_Default);
                expect(input.getDownstreamAutomationParameters().get("maxDeltaTemperatureAdjacentZonesValue")).toBe(dsa.self.MDTAZ_DEFAULT);
            });
        });

        //================================================
        // Teselagen.models.J5Results
        //================================================
        describe("Teselagen.models.J5Results.js", function() {

            it("Create J5Results", function(){
                var results = Ext.create("Teselagen.models.J5Results");

                expect(results).not.toBe(null);

                //console.log(results);
                expect(Ext.getClassName(results.assemblies())).toBe("Ext.data.Store");//"Teselagen.models.j5Output.AssembledSequenceFile");
                expect(Ext.getClassName(results.getCombinatorialAssembly())).toBe("Teselagen.models.j5Output.CombinatorialAssembly");
            });
        });



    });
});