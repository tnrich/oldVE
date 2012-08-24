describe('Sprite test', function () {
    beforeEach(function() {
        setFixtures(sandbox());
        Ext.widget('draw', {
            width: "100px",
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
