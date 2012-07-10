/* 
 * @author Diana Womg
 */

describe("Testing SequenceManager Classes", function() {
    
    

    describe("Init SequenceManager.js", function() {
        var gbMan = Ext.create("Teselagen.bio.parsers.GenbankManager");
        var sm = Ext.create("Teselagen.manager.SequenceManager", {
            name: "test"
        });
        
        it("Init?",function(){
            expect(sm.getCircular()).toBeFalsy();
            expect(sm.getName()).toBe("test");
        });
        

    });
});