/* 
 * @author Diana Womg
 */

describe("Testing SequenceManager Classes", function() {
    
    

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
        }
        
        it("Init?",function(){
            expect(sm.getCircular()).toBeFalsy();
            expect(sm.getName()).toBe("test");
        });
        

    });
});