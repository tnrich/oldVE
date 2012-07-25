Ext.onReady(function() {
    describe("Point", function() {
        var p, p2;
        it("Create", function() {
            p = Ext.create("Teselagen.bio.util.Point", 1, 2);
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
});
