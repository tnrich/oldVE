describe('Window test', function () {
	var window, box;
	beforeEach(function() {
		box = sandbox();
		setFixtures(box);
		Ext.widget('window', {
			title: 'Test Window',
			x: 200,
			renderTo: "sandbox"
		}).show();
		Ext.create("Vede.view.FileImportWindow", {
			renderTo: "sandbox"
		}).show();
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
