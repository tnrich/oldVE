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
Ext.onReady(function() {

    describe("Testing SequenceUtil", function() {

        describe("isCompatibleSequence()", function() {
            it("Detects letters: ATGCUYRSWKMBVDHN",function(){
                var seq = "ATGCUYRSWKMBVDHN";
                var compatible = Teselagen.utils.SequenceUtils.isCompatibleSequence(seq);
                expect(compatible).toBe(true);
            });

        });

        xdescribe("purifyCompatibleSequence()", function() {
            it("",function(){
                expect(false).toBe(true);
            });

        });
	});

    xdescribe("Testing XXXXXXX", function() {

        describe("", function() {
            it("",function(){
 
            });

        });
    });
});