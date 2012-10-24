/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Diana Wong, Rodrigo Pavez
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

Ext.require("Teselagen.manager.SequenceFileManager");
Ext.require("Teselagen.manager.EugeneRuleManager");
Ext.require("Teselagen.manager.DeviceDesignManager");

Ext.define('sessionData', { 
          singleton: true, 
          data: null,
          baseURL: 'http://teselagen.local/api/'
}); 


Ext.onReady(function() {

    //Sha256              = Teselagen.bio.util.Sha256;
    //SequenceFileManager = Teselagen.manager.SequenceFileManager;
    DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    describe("Testing j5 Server submssion", function() {

        beforeEach(function() {

            // In creating this design, use bare minimum required fields
            // Will build this from the models.
            // The correct way would be to use DeviceDesignManager.js

            // Create Bin1 with 2 Part with 1 SequenceFile each
            seq1a   = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileConttent: ">seq1a\nGATTACA"
            });
            part1a  = Ext.create("Teselagen.models.Part", {
                name: "part1a",
                genbankStartBP: 1,
                endBP: 10
            });
            part1a.setSequenceFile(seq1a);


            seq1b   = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1b\nTTTTTTTTTT"
            });
            part1b  = Ext.create("Teselagen.models.Part", {
                name: "part1b",
                genbankStartBP: 20,
                endBP: 30
            });
            part1b.setSequenceFile(seq1b);

            bin1    = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin1"
            });
            bin1.addToParts([part1a, part1b]);

            // Create Bin2 with 1 Part with 1 SequenceFile
            seq2a   = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1b\nAAAAAAAAA"
            });
            part2a  = Ext.create("Teselagen.models.Part", {
                name: "part2a",
                genbankStartBP: 1,
                endBP: 10
            });
            part2a.setSequenceFile(seq2a);

            bin2    = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin2"
            });
            bin2.addToParts(part2a);

            // CREATE THE COLLECTION WITH BINS
            design  = DeviceDesignManager.createDeviceDesignFromBins([bin1, bin2]);

            // EUGENE RULE
            rule1   = Ext.create("Teselagen.models.EugeneRule", {
                name: "rule1",
                negationOperator: false,
                compositionalOperator: "BEFORE",
                operand2: part2a
            });
            rule1.setOperand1(part1a);
            design.addToRules(rule1);

        });
        
        describe("Test the Model", function() {
            it("Design", function(){
                //console.log(Ext.getClassName(design));
                //console.log(design);
                design.save();
                //console.log(DeviceDesignManager.generateRuleText(design, rule1));
            });
        });


        describe("Testing Conversion from Model to JSON", function() {
        });

    });

});