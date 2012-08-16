/**
 * Unit Tests
 * @author Diana Womg
 */

//Ext.require("Ext.Ajax");

//Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
//Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
//Ext.require("Teselagen.bio.sequence.common.StrandType");
//Ext.require("Teselagen.bio.sequence.DNATools");
 
//Ext.require("Teselagen.bio.util.StringUtil");
//Ext.require("Teselagen.bio.util.XmlToJson");
//Ext.require("Teselagen.bio.parsers.GenbankManager");
//Ext.require("Teselagen.bio.parsers.ParsersManager");

Ext.require("Teselagen.utils.SequenceUtils");
Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.onReady(function() {

    describe("Testing SequenceUtil.", function() {

        describe("isCompatibleDNASequence(): ", function() {

            it("Detects letters: 'ATGCYRSWKMBVDHN' ",function(){
                var seq = "ATGCYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleDNASequence(seq);
                expect(compatible).toBe(true);
            });

        });
        describe("isCompatibleRNASequence(): ", function() {

            it("Detects letters: 'AUGCYRSWKMBVDHN' ",function(){
                var seq = "AUGCYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleRNASequence(seq);
                expect(compatible).toBe(true);
            });

        });

        describe("isCompatibleSequence().(DNA or RNA)", function() {
            //console.log(Teselagen.bio.sequence.alphabets.DNAAlphabet.symbolByValue("a").getValue());

            it("Detects letters: 'A(T/U)GCYRSWKMBVDHN' (either U OR T, not both!)",function(){
                var seq = "AGCUYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);

                var seq = "AGCTYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detect white space: ' \t\n\r'",function(){
                var seq = " \t\n\r";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detect numbers: '0123456789'",function(){
                var seq = "0123456789";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

            it("Detects bad characters: 'FIJLOPQXZ' ",function(){
                var seq = "F";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
                var seq = "I";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
                var seq = "J";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(false);
            });


        });

        describe("purifyCompatibleSequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': DNA or RNA",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe(("ATGCUYRSWKMBVDHN").toLowerCase());
            });

            it("Removes whitespace: ' \t\n\r'",function(){
                var seq  = " \t\n\r";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes numbers: '0123456789'",function(){
                var seq  = "0123456789";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: '!@#$%^&*'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: 'FIJLOPQXZ'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleSequence(seq);
                expect(pure).toBe("");
            });

        });
        
        describe("purifyCompatibleDNASequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': removes RNA U's",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe(("ATGCYRSWKMBVDHN").toLowerCase());
            });

            it("Removes whitespace: ' \t\n\r'",function(){
                var seq  = " \t\n\r";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes numbers: '0123456789'",function(){
                var seq  = "0123456789";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: '!@#$%^&*'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

            it("Removes bad characters: 'FIJLOPQXZ'",function(){
                var seq  = "!@#$%^&*";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleDNASequence(seq);
                expect(pure).toBe("");
            });

        });
        describe("purifyCompatibleRNASequence(): ", function() {
            it("Leaves good characters alone: 'ATGCUYRSWKMBVDHN': removes RNA U's",function(){
                var seq  = "ATGCUYRSWKMBVDHN";
                var pure = Teselagen.utils.SequenceUtils.purifyCompatibleRNASequence(seq);
                expect(pure).toBe(("AGCUYRSWKMBVDHN").toLowerCase());
            });
        });
	});

    xdescribe("Testing XXXXXXX", function() {

        xdescribe("", function() {
            it("",function(){
                expect(false).toBe(false);
            });

        });
    });
});