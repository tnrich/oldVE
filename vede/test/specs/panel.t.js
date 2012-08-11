describe('Panel test', function () {
	var drawCmp, panel;
	beforeEach(function() {
		setFixtures(sandbox());
		drawCmp = Ext.widget('draw', {
			items: [{
				type: "circle",
				x: 100,
				y: 100,
				radius: 100,
				stroke: "black"
			}]
		});
		panel = Ext.widget('panel', {
			width: 500,
			height: 500,
			renderTo: "sandbox",
			items: [drawCmp],
//			layout: 'fit'
		});
	});
	it("Sandbox exists", function () {
		expect(Ext.get("sandbox")).toBeTruthy();
	});
});
