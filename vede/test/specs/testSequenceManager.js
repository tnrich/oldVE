/* 
 * @author Diana Womg
 */

Ext.require(["Teselagen.bio.sequence.DNATools","Teselagen.bio.sequence.dna.Feature"]);
describe("Testing SequenceManager Classes", function() {
    //console.log(Ext.Loader.getConfig());
    

    describe("Init SequenceManager.js", function() {
        var tmp, sm;

        beforeEach(function() {
            sm  = Ext.create("Teselagen.manager.SequenceManager", {
                name: "test",
                circular: true,
                sequence: "GATTACA",
                features: []
            });
        });

        it("Init?",function(){
            expect(sm.getName()).toBe("test");
            expect(sm.getCircular()).toBeTruthy();
            expect(sm.getSequence()).toBe("GATTACA");
            expect(sm.getFeatures()).toBeDefined();
            expect(sm.getManualUpdateStarted()).toBeFalsy();

        });
        
        it("setSequence() ",function(){
            sm.setSequence("GATTACAGATTACA");
            expect(sm.getSequence()).toBe("GATTACAGATTACA");
        });
        it("create/setMemento()",function(){
            expect(sm.createMemento()).toBe(null); //FIX LATER
            //sm.setMemento();
            //expect(sm);
        });

        it("",function(){
        });

    });
    
    describe("Test cases from 'SequenceProviderTestCases.as'", function() {
        var seqStr, seq, feat1, feat2, sm;

        beforeEach(function() {
            seqStr  = "tcgcgcgtttcggtgatgacggtgaaaacctctgacacatgcagctcccggagacggtcacagc";
            seq     = Teselagen.bio.sequence.DNATools.createDNA(seqStr);
            console.log(seq);

            feat1   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "lacZalpha",
                start: 10,
                end: 20,
                _type: "CDS",
                strand: -1,
                notes: null
            });
            feat2   = Ext.create("Teselagen.bio.sequence.dna.Feature",{
                name: "cds2",
                start: 40,
                end: 50,
                _type: "CDS",
                strand: 1,
                notes: null
            });
            sm      = Ext.create("Teselagen.manager.SequenceManager", {
                name: "test",
                circular: true,
                sequence: seq,
                features: []
            });
            console.log(sm);
        });
        it("Check Setup",function(){
            expect(sm.getName()).toBe("test");

        });
        it("",function(){
        });

    });
});