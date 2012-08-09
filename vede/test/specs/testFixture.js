describe("Fixture tests", function() {
	beforeEach(function() {
		setFixtures(sandbox());
	});
	it("Show window", function() {
		var window, sandbox;
		Ext.widget('container', {
			renderTo: "sandbox",
			items: [
			    {
			    	xtype: "panel",
			    	title: 'Test Window'
			    }
			]
		}).show();
//		Ext.widget('window', {
//			title: 'Test Window',
//			renderTo: "sandbox",
//			style: {
//				left: "30px",
//				top: "50px"
//			}
//		}).show();
//		window = Ext.create("Vede.view.FileImportWindow");
//		console.log(window);
//		sandbox = Ext.get("sandbox");
//		window.render(sandbox);
	});
	it("Some test", function() {
		
	});
});
