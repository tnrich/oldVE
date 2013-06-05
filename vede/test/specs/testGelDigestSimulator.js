/*
 * @author Doug Hershberger
 */
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Ext: '.',
        'Ext.ux': '../extjs/examples/ux',
//        Teselagen: './app/teselagen',
        Vede: './app',
        'Teselagen.bio': '../biojs/src/teselagen/bio'
    }
});


Ext.require('Ext.app.Application');

var Application = null, ctlr = null, store = null;
var testREs=new Array("EcoRI","EcoRV","EcoVIII", "M.EcoKDam", "BciVI", "BbvI", "BamHI");


Ext.onReady(function() {
	var simulateDigestionWindow = null;
	describe("GelDigestSimulator testing", function() {
		beforeEach(function(){
			waitsFor( function(){
					return (Vede.app !== null); 
				},
				"Vede never loaded",
				400
			);
			runs( function(){
				Application = Vede.app;
		        if (!ctlr) {
		            ctlr = Application.getController('VectorEditor.SimulateDigestionController');
		        }
			});
		});
		afterEach(function(){
			if(simulateDigestionWindow)simulateDigestionWindow.destroy();
		});
		describe("Basic Assumptions", function() {
	
		    it("has ExtJS4 loaded", function() {
		        expect(Ext).toBeDefined();
		        expect(Ext.getVersion()).toBeTruthy();
		        expect(Ext.getVersion().major).toEqual(4);
		    });
	
		    it("has loaded Vede code",function(){
		        expect(Vede).toBeDefined();
		    });
		});
		describe("Initializes objects to be tested", function() {
		    it("loads the SimulateDigestionController", function() {
		        expect(ctlr).toBeDefined();
		    });
		    it("loads other important objects in the controller", function() {
		        expect(ctlr.GroupManager).not.toBe(null);
		        expect(ctlr.DigestionCalculator).not.toBe(null);
		        expect(ctlr.DNATools).not.toBe(null);
		    });
//		    it("loads other important objects at Window opening in the controller", function() {
//		        simulateDigestionWindow = Ext.create("Vede.view.SimulateDigestionWindow");
//		        simulateDigestionWindow.show();
//		        simulateDigestionWindow.center();
//		        Application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
//		        expect(ctlr.managerWindow).not.toBe(null);
//		        expect(ctlr.enzymeListSelector).not.toBe(null);
//		        expect(ctlr.GroupManager.getIsInitialized()).toBeTruthy();
//		    });
		});
		describe("Can work with enzyme groups", function() {
			beforeEach(function(){
				runs( function(){
			        simulateDigestionWindow = Ext.create("Vede.view.ve.SimulateDigestionWindow");
			        simulateDigestionWindow.show();
			        simulateDigestionWindow.center();
			        Application.fireEvent("SimulateDigestionWindowOpened", simulateDigestionWindow);
				});
				waitsFor( function(){
						return (ctlr.GroupManager.getIsInitialized()); 
					},
					"GroupManager never loaded",
					400
				);
			});
		    it("Filters enzymes correctly", function() {
				var testGroup = ctlr.GroupManager.createGroupByEnzymes("TEST", new Array("EcoRI","EcoRV","EcoVIII", "M.EcoKDam", "BciVI", "BbvI", "BamHI"));
				ctlr.GroupManager.userGroups.push(testGroup);
				var newGroup = ctlr.GroupManager.groupByName("TEST");
		        expect(newGroup).toBeDefined();
		        expect(newGroup).toBeTruthy();
		        expect(newGroup.getEnzymes()[0].getName()).toBe("EcoRI");
		        var groupCombobox = ctlr.managerWindow.query("#enzymeGroupSelector-digest")[0];
		        groupCombobox.setValue("TEST");
		        //ctlr.onEnzymeGroupSelected(groupCombobox);
		        var tempSelectedEnzymes = ctlr.enzymeListSelector.fromField.store.data.items;
		        expect(tempSelectedEnzymes.length).toBe(7);
		        expect(tempSelectedEnzymes[0].data.name).toBe("BamHI");
		        var searchCombobox = ctlr.managerWindow.query("#enzymeGroupSelector-search")[0];
		        searchCombobox.setValue("eco");
		        ctlr.searchEnzymes(searchCombobox);
		        tempSelectedEnzymes = ctlr.enzymeListSelector.fromField.store.data.items;
	        	expect(tempSelectedEnzymes.length).toBe(4);
	        	expect(tempSelectedEnzymes[0].data.name).toBe("EcoRI");
	        	searchCombobox.setValue("eco");
	        	var newSelectedEnzymes = ctlr.enzymeListSelector.fromField.store.data.items;
	        	expect(tempSelectedEnzymes).toBe(newSelectedEnzymes);
	        	var temp = 0;
		    });
		});
	});
});


//function doStuff(){
//	// simulate async stuff and wait 10ms
//	setTimeout(function(){
//		done = true;
//	}, 10000); 
//};
//runs(doStuff);
//waitsFor(function(){
//	return done;
//});