/*
 * @author Doug Hershberger
 * @author Micah Lerner
 */


Ext.require("Teselagen.utils.SystemUtils");

Ext.onReady(function() {

    // ====================================
    //   Gel Digestion Simulator Unit Testing
    // ====================================
    describe("Gel Digestion Simulator Unit Testing", function() {
        describe("Blunt ends for both", function() {
            var sourceDNA = "ttacgcccccgggtcgaaaaaaaaaaaaaaaaaaaaacccgggatccgacagag";
            var destinationDNA = "tgattacgcccagctggcatgcctgcaggtcgactctagaggatccccgggtaccgagctccagctgactggccgtc";
            var sourceLeftRE = "SmaI";
            var sourceRightRE ="SmaI";
            var destLeftRE = "PvuII";
            var destRightRE ="PvuII";
            var sourceStart = 7;
            var sourceStop = 37;
            var destStart = 10;
            var destStop = 67;
            var dm;
            it("Digestion Simulator exists", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                expect(dm).toBeDefined();
            });
            it("Source DNA initialized", function(){
                expect(!(dm.sourceOverhangStartSequence === null) && !(dm.sourceOverhangEndSequence === null) && !(dm.sourceOverhangStartType === null) && !(dm.sourceOverhangEndType === null)).toBeTruthy();
            });
            it("Destination DNA initialized", function(){
                expect(!(dm.destinationOverhangStartType === null) && !(dm.destinationOverhangEndType === null) && !(dm.destinationOverhangStartSequence === null) && !(dm.destinationOverhangEndSequence === null)).toBeTruthy();
            });
            it("The pair has a normal match", function(){
                expect(dm.hasNormalMatch()).toBeTruthy();
            });
            it("The pair has a reverse complementary  match", function(){
                expect(dm.hasRevComMatch()).toBeTruthy();
            });
            it("The pair has matching type of BOTH", function(){
                expect(dm.getMatchingType()).toBe(dm.self.matchBoth);
            });
            it("DestinationDNA digested", function(){
                dm.digest(dm.self.matchNormalOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgcccaggggtcgaaaaaaaaaaaaaaaaaaaaacccctgactggccgtc");
            });
            it("DestinationDNA pasted revcom", function(){
                dm = makeDigestionManager(sourceDNA, destinationDNA, sourceLeftRE, sourceRightRE, destLeftRE, destRightRE, sourceStart, sourceStop, destStart, destStop);
                dm.digest(dm.self.matchReverseComOnly);
                expect(dm.sequenceManager.sequence.toString()).toBe("tgattacgcccaggggtttttttttttttttttttttcgacccctgactggccgtc");
            });
        });
    });
});

function makeGelDigestionSimulator() {
}