/* 
 * @author Diana Womg
 */

describe("Testing SequenceManager Classes", function() {
    //console.log(Ext.Loader.getConfig());
    

    describe("Init SequenceManager.js", function() {
        var tmp, sm;

        beforeEach(function() {
            //tmp = Ext.create("Teselagen.bio.parsers.GenbankManager");
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
            expect(sm.getSequence())).toBe("GATTACA");
        });
        
        it("Init?",function(){
            
            expect(sm.getSequence())).toBe("GATTACA");
        });

        

    });
});