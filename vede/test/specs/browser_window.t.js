describe('Browser window test', function () {
	var window, box;
	beforeEach(function() {
		box = sandbox();
		setFixtures(box);
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
