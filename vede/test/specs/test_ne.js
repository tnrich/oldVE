Ext.require("Teselagen.model.DNAFeatureLocation");

describe("DNAFeatureLocation", function() {
    beforeEach(function() {
        var fl = new Teselagen.model.DNAFeatureLocation({
            genbankStart: 20,
            end: 203,
            singleResidue: false,
            inBetween: false
        });
    });

    it("can be created", function() {
        expect(fl).toBeDefined();
    });

    it("fields can be accessed", function() {
        expect(fl.get("genbankStart")).toBe(20);
        expect(fl.get("end")).toBe(203);
        expect(fl.get("singleResidue")).toBeFalsy();
        expect(fl.get("inBetween")).toBeFalsy();
    });
});