describe("Test Controller", function() {
	var controller;
	beforeEach(function(){
		if (!controller) {
			controller = application.getController("AppController");
		}
	});
	it("Can get controller", function(){
		expect(controller).toBeDefined();
	});
});