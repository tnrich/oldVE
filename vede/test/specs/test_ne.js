Ext.require("Teselagen.utils.FeaturedDNASequenceUtils");

xdescribe("Models", function() {
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
            expect(fl.get("end")).toBe(203); fl.set("end", 1000);
            expect(fl.get("end")).toBe(1000); expect(fl.get("singleResidue")).toBeFalsy();
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
    xdescribe("FeaturedDNASequenceUtils", function() {
        var feature = Ext.create("Teselagen.bio.sequence.dna.Feature", {
            name: "MyFeature",
            start: 20,
            end: 203,
            type: "Special",
            strand: 1,
            notes: [Ext.create("Teselagen.bio.sequence.dna.FeatureNote", {
                name: "MyNote",
                value: "This is a note.",
                quoted: true
            })]
        });

        seqMan = Ext.create("Teselagen.manager.SequenceManager", {
            name: "MyFD",
            circular: false,
            sequence: "acgtcgcgattctatatcgcccgagcgagagtcgttgtcgctgacgacgatcactagtc",
            features: [feature, feature]
        });

        it("can convert sequenceManager -> FeaturedDNASequence", function() {
            convertedFd = Teselagen.utils.FeaturedDNASequenceUtils.sequenceManagerToFeaturedDNASequence(seqMan);

            expect(convertedFd).toBeDefined();

            expect(convertedFd.get("name")).toBe("MyFD");
            expect(convertedFd.get("isCircular")).toBeFalsy();
            expect(convertedFd.get("sequence")).toBe(fd.get("sequence"));

            expect(convertedFd.get("features")[0].get("name")).toBe("MyFeature");
            expect(convertedFd.get("features")[0].get("strand")).toBe(1);
            expect(convertedFd.get("features")[0].get("type")).toBe("Special");

            expect(convertedFd.get("features")[0].get("notes")[0].get("name")).toBe("MyNote");
            expect(convertedFd.get("features")[0].get("notes")[0].get("aValue")).toBe("This is a note.");
            expect(convertedFd.get("features")[0].get("notes")[0].get("quoted")).toBeTruthy();

            expect(convertedFd.get("features")[0].get("locations")[0].get("genbankStart")).toBe(21);
            expect(convertedFd.get("features")[0].get("locations")[0].get("end")).toBe(203);
        });

        it("can convert FeaturedDNASequence -> sequenceProvider", function() {
            try {
                var newSM = Teselagen.utils.FeaturedDNASequenceUtils.featuredDNASequenceToSequenceManager(convertedFd);
            }
            catch (e) {
                console.log(e);
            }

            expect(newSM).toBeDefined();

            expect(newSM.getName()).toBe("MyFD");
            expect(newSM.getCircular()).toBeFalsy();
            expect(newSM.getSequence()).toBe(fd.get("sequence"));

            expect(newSM.getFeatures()[0].getName()).toBe("MyFeature");
            expect(newSM.getFeatures()[0].getStrand()).toBe(1);
            expect(newSM.getFeatures()[0].getType()).toBe("Special");
            expect(newSM.getFeatures()[0].getStart()).toBe(20);
            expect(newSM.getFeatures()[0].getEnd()).toBe(203);

            expect(newSM.getFeatures()[0].getNotes()[0].getName()).toBe("MyNote");
            expect(newSM.getFeatures()[0].getNotes()[0].getValue()).toBe("This is a note.");
            expect(newSM.getFeatures()[0].getNotes()[0].getQuoted()).toBeTruthy();
        });
    });

    describe("SystemUtils", function() {
        it("can correctly identify OS", function() {
            expect(Teselagen.utils.SystemUtils.getSystemMonospaceFontFamily()).toBe("Monaco");
        });

        it("can correctly get application version", function() {
            var versionDate = new Date();
            expect(Teselagen.utils.SystemUtils.applicationVersion("v")).toBe("v" + String(versionDate.getFullYear()).substr(2,2) + 
                                                                            "." + String(versionDate.getMonth() + 1) + 
                                                                            "." + String(versionDate.getDate()));
        })
    });
});

describe("Mappers", function() {
    describe("Mapper", function() {
        var mapper = Ext.create("Teselagen.mappers.Mapper", {
            sequenceManager: seqMan
        });

        it("is defined", function() {
            expect(mapper).toBeDefined();
        });

        it("has working config", function() {
            expect(mapper.getSequenceManager()).toEqual(seqMan);
        });
    });

    describe("AAMapper", function() {
        var aa = Ext.create("Teselagen.mappers.AAMapper", {
            sequenceManager: seqMan
        });

        it("is defined", function() {
            expect(aa.toBeDefined());
        });

        it("can calculate amino acid sequences", function() {
            console.log(aa.getSequence(1, true));
        });
    });
});
