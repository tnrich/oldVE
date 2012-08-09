describe("ui test", function () {

    it("display window", function () {
    	var window;
    	Ext.widget('window', {
    		title: 'Test Window',
    		x: 10,
    		renderTo: 'sandbox'
    	}).show();
    	//window = Ext.create("Vede.view.FileImportWindow");
    	//window.show();
    });

});
