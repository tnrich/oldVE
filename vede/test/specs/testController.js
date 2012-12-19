/**
 * Simple Controller tests.
 * @author Yuri Bendana
 */

/*global beforeEach, describe, expect, it, Vede*/
Ext.onReady(function() {
    describe("Test Controller", function() {
        var controller, controller2;
        beforeEach(function(){
            controller = Vede.app.getController("AppController");
            controller.foo = 1;
        });
        it("Can get controller", function(){
            expect(controller).toBeDefined();
        });
        it("Getting the same controller does not create another instance", function() {
            controller2 = Vede.app.getController("AppController");
            expect(controller).toEqual(controller2);
            expect(controller2.foo).toEqual(1);
        });
    });
});
