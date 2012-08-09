describe("Test Controller", function() {
	var controller, controller2;
	beforeEach(function(){
	    controller = application.getController("AppController");
	    controller.foo = 1;
	});
	it("Can get controller", function(){
		expect(controller).toBeDefined();
	});
	it("Getting the same controller does not create another instance", function() {
		controller2 = application.getController("AppController");
		expect(controller).toEqual(controller2);
		expect(controller2.foo).toEqual(1);
	});
});