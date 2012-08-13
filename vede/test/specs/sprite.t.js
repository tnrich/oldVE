describe('Sprite test', function () {
	var window, box;
	beforeEach(function() {
		setFixtures(sandbox());
		Ext.widget('draw', {
			width: 100,
			height: 100,
			renderTo: "sandbox",
			items: [{
				type: "text",
				text: "Hello Sprite"
			}]
		});
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
