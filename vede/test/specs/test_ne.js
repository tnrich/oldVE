describe("Models", function() {
    describe("DNAFeatureLocation", function() {
        beforeEach(function() {
            fl = Ext.create("Teselagen.models.DNAFeatureLocation", {
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
            fl.set("genbankStart", 10);
            expect(fl.get("genbankStart")).toBe(10);

            expect(fl.get("end")).toBe(203);
            fl.set("end", 1000);
            expect(fl.get("end")).toBe(1000);

            expect(fl.get("singleResidue")).toBeFalsy();
            fl.set("singleResidue", true);
            expect(fl.get("singleResidue")).toBeTruthy();

            expect(fl.get("inBetween")).toBeFalsy();
            fl.set("inBetween", true);
            expect(fl.get("inBetween")).toBeTruthy();
        });
    });

    describe("DNAFeatureNote", function() {
        beforeEach(function() {
            fn = Ext.create("Teselagen.models.DNAFeatureNote", {
                name: "MyNote",
                aValue: "This is a note.",
                quoted: true
            });
        });

        it("can be created", function() {
            expect(fn).toBeDefined();
        });

        it("fields can be accessed", function() {
            expect(fn.get("name")).toBe("MyNote");
            fn.set("name", "HisNote");
            expect(fn.get("name")).toBe("HisNote");

            expect(fn.get("aValue")).toBe("This is a note.");
            fn.set("aValue", "This is not a note.");
            expect(fn.get("aValue")).toBe("This is not a note.");

            expect(fn.get("quoted")).toBeTruthy();
            fn.set("quoted", false);
            expect(fn.get("quoted")).toBeFalsy();
        });
    });

    describe("DNAFeature", function() {
        beforeEach(function() {
            f = Ext.create("Teselagen.models.DNAFeature", {
                genbankStart: 10,
                end: 90,
                name: "MyFeature",
                type: "Special",
                strand: 1,
                notes: [fn],
                annotationType: "Awesome",
                locations: [fl]
            });
        });

        it("can be created", function() {
            expect(f).toBeDefined();
        });

        it("fields can be accessed", function() {
            expect(f.get("name")).toBe("MyFeature");
            f.set("name", "ThatFeature");
            expect(f.get("name")).toBe("ThatFeature");

            expect(f.get("type")).toBe("Special");
            f.set("type", "Boring");
            expect(f.get("type")).toBe("Boring");

            expect(f.get("strand")).toBe(1);
            f.set("strand", -1);
            expect(f.get("strand")).toBe(-1);

            expect(f.get("notes")).toEqual([fn]);
            f.set("notes", [fn, fn]);
            expect(f.get("notes")).toEqual([fn, fn]);

            expect(f.get("locations")).toEqual([fl]);
            f.set("locations", [fl, fl]);
            expect(f.get("locations")).toEqual([fl, fl]);
        });
    });

    describe("FeaturedDNASequence", function() {
        var fd;

        beforeEach(function() {
            fd = Ext.create("Teselagen.models.FeaturedDNASequence", {
                name: "MyFD",
                sequence: "acgtcgcgattctatatcgcccgagcgagagtcgttgtcgctgacgacgatcactagtc",
                isCircular: false,
                features: [f, f]
            });
        });

        it("can be created", function() {
            expect(fd).toBeDefined();
        });

        it("can access child objects", function() {
            expect(fd.get("features")[1].get("notes")[0]).toEqual(fn);
            expect(fd.get("features")[0].get("locations")[0]).toEqual(fl);
        });
    });
});

describe("Utils", function() {
    describe("FeaturedDNASequenceUtils", function() {
        it("can convert sequenceProvider -> FeaturedDNASequence", function() {

        });

        it("can convert FeaturedDNASequence -> sequenceProvider", function() {

        });
    });
});