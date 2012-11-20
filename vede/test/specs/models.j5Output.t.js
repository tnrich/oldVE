/**
 * Unit Tests
 * @author Diana Wong
 */

Ext.require("Ext.Ajax");

//Ext.require("Teselagen.bio.util.StringUtil");
//Ext.require("Teselagen.bio.util.XmlToJson");
//Ext.require("Teselagen.bio.util.Sha256");

//Ext.require("Teselagen.utils.SequenceUtils");
//Ext.require("Teselagen.utils.FormatUtils");
//Ext.require("Teselagen.utils.DeXmlUtils");

Ext.require("Teselagen.constants.Constants");

Ext.require("Teselagen.models.j5Output.AssembledSequenceFile");
Ext.require("Teselagen.models.j5Output.Assembly");
Ext.require("Teselagen.models.j5Output.Warning");
//Ext.require("Teselagen.models.j5Output.NonMockAssembly");



Ext.onReady(function() {


    describe("Testing Teselagen.models.j5Output", function() {

        //================================================
        // Teselagen.models.j5Output.AssembledSequenceFile
        //================================================
        describe("Teselagen.models.j5Output.AssembledSequenceFile.js", function() {

            beforeEach(function() {
                assemblySeq = Ext.create("Teselagen.models.j5Output.AssembledSequenceFile");

                assemblySeq2 = Ext.create("Teselagen.models.j5Output.AssembledSequenceFile", {
                    fileType: "fasta",
                    fileContent: ">assSeq2\nGATTACA"
                });
            });

            it("Creates AssembledSequenceFile()", function(){
                //console.log(assemblySeq);
                //console.log(assemblySeq2);
                //console.log(assemblySeq2.getAssembly());
                expect(assemblySeq2.get("fileType")).toBe("FASTA");
                expect(assemblySeq2.get("fileContent")).toBe(">assSeq2\nGATTACA");
            });

            it("Associations()", function(){
                expect(Ext.getClassName(assemblySeq.getJ5Results())).toBe("Teselagen.models.J5Results");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.Assembly
        //================================================
        describe("Teselagen.models.j5Output.Assembly.js", function() {

            beforeEach(function() {
                assembly = Ext.create("Teselagen.models.j5Output.Assembly");

                assembly2 = Ext.create("Teselagen.models.j5Output.Assembly", {
                    type: "MOCK",
                    date: new Date()
                });
            });

            it("Creates Assembly()", function(){
                console.log(assembly2);
                console.log(assembly2.warnings());
                expect(assembly2.get("type")).toBe("MOCK");
                expect(assembly2.validate().length).toBe(0);
            });

            it("Associations()", function(){
                expect(Ext.getClassName(assembly.warnings())).toBe("Ext.data.Store");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.Warning
        //================================================
        describe("Teselagen.models.j5Output.Warning.js", function() {

            beforeEach(function() {
                warn = Ext.create("Teselagen.models.j5Output.Warning");

                warn2 = Ext.create("Teselagen.models.j5Output.Warning", {
                    //type: "MOCK",
                    message: "Warning: the MasterPlasmidListFile is empty. ..."
                });
            });

            it("Creates Warning()", function(){
                console.log(warn2);
                expect(warn2.get("message")).toBe("Warning: the MasterPlasmidListFile is empty. ...");
            });

            it("Associations()", function(){
                expect(Ext.getClassName(warn.getAssembly())).toBe("Teselagen.models.j5Output.Assembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });


        //================================================
        // Teselagen.models.j5Output.TargetPart
        //================================================
        describe("Teselagen.models.j5Output.TargetPart.js", function() {

            beforeEach(function() {
                tar = Ext.create("Teselagen.models.j5Output.TargetPart");
            });

            it("Creates TargetPart()", function(){
                //console.log(tar);
                expect(tar.get("direction")).toBe("forward");
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tar.getAssembly())).toBe("Teselagen.models.j5Output.Assembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });


        //================================================
        // Teselagen.models.j5Output.NonMockAssembly
        //================================================
        describe("Teselagen.models.j5Output.NonMockAssembly.js: inherits from Assembly", function() {

            beforeEach(function() {
                nonMock = Ext.create("Teselagen.models.j5Output.NonMockAssembly", {
                    type: "GOLDENGATE"
                });

                //tmp = Ext.create("Teselagen.models.j5Output.Incompatibility");

                //nonMock.comp().add(tmp);

                //nonMock2 = Ext.create("Teselagen.models.j5Output.NonMockAssembly", {
                //});
            });

            it("Create NonMockAssembly()", function(){
                console.log(nonMock);
                expect(Ext.getClassName(nonMock)).toBe("Teselagen.models.j5Output.NonMockAssembly");
                expect(nonMock.validate().length).toBe(0);
                expect(nonMock.get("type")).toBe("GOLDENGATE");
                //expect(nonMock.get("").toBe("");
            });

            it("Associations()", function(){
                expect(Ext.getClassName(nonMock.getAssembledSequenceFile())).toBe("Teselagen.models.j5Output.AssembledSequenceFile");
                expect(Ext.getClassName(nonMock.comp())).toBe("Ext.data.Store");//"Teselagen.models.j5Output.Incompatibility");
            });


            xit("()", function(){
            });

            xit("()", function(){
            });
        });
        
        //================================================
        // Teselagen.models.j5Output.Incompatibility
        //================================================
        describe("Teselagen.models.j5Output.Incompatibility.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.Incompatibility");
            });

            it("Creates Incompatibility()", function(){

                expect(tmp.get("assemblyPiece")).toBe(0);
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getNonMockAssembly())).toBe("Teselagen.models.j5Output.NonMockAssembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.SuggestedAssembly
        //================================================
        describe("Teselagen.models.j5Output.SuggestedAssembly.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.SuggestedAssembly");
            });

            it("Creates SuggestedAssembly()", function(){
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getNonMockAssembly())).toBe("Teselagen.models.j5Output.NonMockAssembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.Synthesis
        //================================================
        describe("Teselagen.models.j5Output.Synthesis.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.Synthesis");
            });

            it("Creates Synthesis()", function(){
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getNonMockAssembly())).toBe("Teselagen.models.j5Output.NonMockAssembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.PCRReactions
        //================================================
        describe("Teselagen.models.j5Output.PCRReactions.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.PCRReaction");
            });

            it("Creates PCRReactions()", function(){
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getNonMockAssembly())).toBe("Teselagen.models.j5Output.NonMockAssembly");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.CombinatorialAssembly
        //================================================
        describe("Teselagen.models.j5Output.CombinatorialAssembly.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.CombinatorialAssembly", {
                    type: "MOCK"
                });
            });

            it("Creates Assembly()", function(){
                console.log(tmp);
                expect(tmp.get("type")).toBe("MOCK");
                //expect(tmp.validate().length).toBe(0);
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getJ5Results())).toBe("Teselagen.models.J5Results");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.j5Output.CombinatorialNonMockAssembly
        //================================================
        describe("Teselagen.models.j5Output.CombinatorialNonMockAssembly.js", function() {

            beforeEach(function() {
                tmp = Ext.create("Teselagen.models.j5Output.CombinatorialNonMockAssembly", {
                    type: "GOLDENGATE"
                });
            });

            it("Creates Assembly()", function(){
                console.log(tmp);
                expect(tmp.get("type")).toBe("GOLDENGATE");
                //expect(tmp.validate().length).toBe(0);
            });

            it("Associations()", function(){
                expect(Ext.getClassName(tmp.getJ5Results())).toBe("Teselagen.models.J5Results");
            });

            xit("()", function(){
            });

            xit("()", function(){
            });
        });

        //================================================
        // Teselagen.models.
        //================================================
        xdescribe("Teselagen.models.j5Output..js", function() {

            it("()", function(){
            });

            it("()", function(){
            });

            it("()", function(){
            });

            it("()", function(){
            });
        });



    });
});