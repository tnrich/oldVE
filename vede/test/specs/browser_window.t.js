describe('Browser window test.', function () {
	var windowA, windowB;
	beforeEach(function() {
		var box = sandbox();
		setFixtures(box);
		//windowA = window.open("", "windowA");
		//windowB = window.open("", "windowB");
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
	it("Should get reference to windows", function() {
		expect(windowA.name).toBe("WindowA");
		expect(windowB.name).toBe("WindowB");
	})
});
