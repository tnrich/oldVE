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
                console.log(assemblySeq2);
                console.log(assemblySeq2.getAssembly());
                expect(assemblySeq2.get("fileType")).toBe("FASTA");
                expect(assemblySeq2.get("fileContent")).toBe(">assSeq2\nGATTACA");
            });

            it("Associations()", function(){
                expect(Ext.getClassName(assemblySeq.getJ5Results())).toBe("Teselagen.models.J5Results");
            });

            it("()", function(){
            });

            it("()", function(){
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