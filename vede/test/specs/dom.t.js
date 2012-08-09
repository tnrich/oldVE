//Ext.onReady(function() {
describe('UI tests', function () {
	var window, box;
	beforeEach(function() {
		console.log("beforeEach");
		box = sandbox();
		console.log(box);
		setFixtures(box);
		Ext.widget('window', {
			title: 'Test Window',
			x: 10,
			renderTo: "sandbox"
		});
		window = Ext.create("Vede.view.FileImportWindow");
		window.render("sandbox");
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
//});