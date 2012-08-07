//Ext.onReady(function() {
    var Point = "Teselagen.bio.util.Point";
	var Caret = "Vede.view.pie.Caret";
    describe("Point", function() {
        var p, p2;
        it("Create", function() {
            p = Ext.create(Point, 1, 2);
            expect(p).toBeDefined();
        });
        it("Check values", function() {
            expect(p.x).toBe(1);
            expect(p.y).toBe(2);
        });
        it("Clone", function() {
            p2 = p.clone();
            expect(p2.x).toBe(1);
            expect(p2.y).toBe(2);
        });
        it("Equals", function() {
            expect(p===p2).toBe(false);
            expect(p.equals(p2)).toBe(true);
        });
    });
    describe("pie.Caret", function() {
    	var c, centerPt;
    	beforeEach(function() {
	    	centerPt = Ext.create(Point, 1, 2);
	    	c = Ext.create(Caret, {
	    		angle : 50,
	    		center : centerPt,
	    		radius : 10,
	    		stroke : "red"
	    	});
    	});
    	it("callParent initializes config", function() {
    		expect(c.angle).toBe(50);
    		expect(c.center).toBe(centerPt);
    		expect(c.radius).toBe(10);
    	});
    	it("Default config", function() {
    		expect(c.type).toBe("path");
    	});
    	it("Argument overrides default config", function() {
    		expect(c.stroke).toBe("red");
    	});
    });
//});
