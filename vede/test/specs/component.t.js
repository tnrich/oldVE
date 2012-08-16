describe('iframe test', function () {
	var cmp, panel;
	beforeEach(function() {
		setFixtures(sandbox());
		cmp = Ext.widget('component', {
			autoEl: {
				tag: 'iframe',
				src: 'http://localhost:3000'
			}
		});
		panel = Ext.widget('panel', {
			width: 500,
			height: 500,
			renderTo: "sandbox",
			items: [cmp]
		});
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
