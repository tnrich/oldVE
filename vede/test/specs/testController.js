describe("Test Controller", function() {
	var controller;
	it("Can get controller", function(){
		controller = application.getController("AppController");
		expect(controller).toBeDefined();
	});
});