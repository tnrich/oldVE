Ext.require("Teselagen.bio.enzymes.RestrictionEnzymeManager");
Ext.require("Teselagen.bio.sequence.alphabets.DNAAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.ProteinAlphabet");
Ext.require("Teselagen.bio.sequence.alphabets.RNAAlphabet");
Ext.require("Teselagen.bio.sequence.DNATools");
Ext.require("Teselagen.manager.RestrictionEnzymeGroupManager");
Ext.require("Teselagen.utils.FeaturedDNASequenceUtils");
Ext.require("Teselagen.utils.SystemUtils");


Ext.onReady(function() {
    var DNATools = Teselagen.bio.sequence.DNATools;

    var agcEnz = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
        name: "agc enzyme",
        site: "agc",
        cutType: 1,
        forwardRegex: "agc",
        reverseRegex: "agc",
        dsForward: 1,
        dsReverse: 2,
        usForward: 1,
        usReverse: 2
    });

    var gntEnz = Ext.create("Teselagen.bio.enzymes.RestrictionEnzyme", {
        name: "gnt enzyme",
        site: "gnt",
        cutType: 1,
        forwardRegex: "g.t",
        reverseRegex: "g.t",
        dsForward: 1,
        dsReverse: 2,
        usForward: 1,
        usReverse: 2
    });

    var seqMan;
    var sequence;
    
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
                expect(fl.get("end")).toBe(203); fl.set("end", 1000);
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

        describe("UserRestrictionEnzymeGroup", function() {

            beforeEach(function() {
                uGroup = Ext.create("Teselagen.models.UserRestrictionEnzymeGroup");
            });

            it("can be created", function() {
                expect(uGroup).toBeDefined();
            });

            it("fields can be accessed", function() {
                expect(uGroup.get("name")).toBe("");
                uGroup.set("name", "hisgroup");
                expect(uGroup.get("name")).toBe("hisgroup");
            });
        });

        describe("UserRestrictionEnzyme", function() {
            beforeEach(function() {
                uEnz = Ext.create("Teselagen.models.UserRestrictionEnzyme");
            });

            it("can be created", function() {
                expect(uEnz).toBeDefined();
            });

            it("fields can be accessed", function() {
                expect(uEnz.get("name")).toBe("");
                uEnz.set("name", "myEnz");
                expect(uEnz.get("name")).toBe("myEnz");
            });
        });
    });

    describe("Utils", function() {
        describe("FeaturedDNASequenceUtils", function() {
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

            sequence = DNATools.createDNA(
                "acgtcgcgattctatatcgcccgagcgagagtcgttgtcgctgacgacgatcactagtc");

            seqMan = Ext.create("Teselagen.manager.SequenceManager", {
                name: "MyFD",
                circular: false,
                sequence: sequence,
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
                var os = Teselagen.utils.SystemUtils.getSystemMonospaceFontFamily();
                console.log(os);
            });

            it("can correctly get application version", function() {
                var versionDate = new Date();
                expect(Teselagen.utils.SystemUtils.applicationVersion("v")).toEqual("v." + String(versionDate.getFullYear()).substr(2,2) + 
                                                                                "." + String(versionDate.getMonth() + 1) + 
                                                                                "." + String(versionDate.getDate()));
            });
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

        describe("AAManager", function() {
            var aa = Ext.create("Teselagen.manager.AAManager", {
                sequenceManager: seqMan,
            });

            it("is defined", function() {
                expect(aa).toBeDefined();
            });

            it("can calculate amino acid sequences", function() {
                expect(aa.getSequenceFrame(0).toLowerCase()).toBe("tsrfyiararvvvadddh.");
                expect(aa.getSequenceFrame(1).toLowerCase()).toBe("rrdsispereslslttits");
                expect(aa.getSequenceFrame(2).toLowerCase()).toBe("vailyrpsesrcr.rrslv");

                expect(aa.getRevComFrame(0).toLowerCase()).toBe("d..sssatttlarai.nrd");
                expect(aa.getRevComFrame(1).toLowerCase()).toBe("tsdrrqrqrlslgryriat");
                expect(aa.getRevComFrame(2).toLowerCase()).toBe("lvivvsdndsrsgdiesrr");

                expect(aa.getSequenceFrame(0, true).toLowerCase()).toBe("t s r f y i a r a r v v v a d d d h .");
                expect(aa.getSequenceFrame(1, true).toLowerCase()).toBe("r r d s i s p e r e s l s l t t i t s");
                expect(aa.getSequenceFrame(2, true).toLowerCase()).toBe("v a i l y r p s e s r c r . r r s l v");

                expect(aa.getRevComFrame(0, true).toLowerCase()).toBe("d . . s s s a t t t l a r a i . n r d");
                expect(aa.getRevComFrame(1, true).toLowerCase()).toBe("t s d r r q r q r l s l g r y r i a t");
                expect(aa.getRevComFrame(2, true).toLowerCase()).toBe("l v i v v s d n d s r s g d i e s r r");
            });
        });

        describe("ORFManager", function() {
            var orfSequence = DNATools.createDNA("atgcctagaaaaaaaaaatgctag");

            var orfMan = Ext.create("Teselagen.manager.SequenceManager", {
                sequence: orfSequence,
            });

            var om = Ext.create("Teselagen.manager.ORFManager", {
                sequenceManager: orfMan,
                minORFSize: 3
            });

            it("is defined", function() {
                expect(om).toBeDefined();
            });

            it("can calculate linear ORFs", function() {
                var orf = om.getOrfs()[0];
                expect(om.getOrfs().length).toBe(1);

                expect(orf.getFrame()).toBe(0);
                expect(orf.getStrand()).toBe(1);
                expect(orf.getStart()).toBe(0);
                expect(orf.getEnd()).toBe(24);
            });

            it("can calculate circular ORFs", function() {
                orfMan.setCircular(true);
                om.setDirty(true);

                var orfs = om.getOrfs();

                expect(orfs.length).toBe(2);

                expect(orfs[1].getFrame()).toBe(0);
                expect(orfs[1].getStrand()).toBe(1);
                expect(orfs[1].getStart()).toBe(0);
                expect(orfs[1].getEnd()).toBe(24);

                expect(orfs[0].getFrame()).toBe(2);
                expect(orfs[0].getStrand()).toBe(1);
                expect(orfs[0].getStart()).toBe(17);
                expect(orfs[0].getEnd()).toBe(8);
            });

        });

        describe("RestrictionEnzymeManager", function() {
            var reGroup = Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
                name:"my group",
                enzymes: [agcEnz, gntEnz]
            });

            var reSequence = DNATools.createDNA("tagccccgctaaagccccccccctctctgatccgc");

            var reMan = Ext.create("Teselagen.manager.SequenceManager", {
                sequence: reSequence
            });

            var re = Ext.create("Teselagen.manager.RestrictionEnzymeManager", {
                restrictionEnzymeGroup: reGroup,
                sequenceManager: reMan
            });
            
            it("exists", function() {
                expect(re).toBeDefined();
            });

            it("has working getters and setters", function() {
                expect(re.getDirty()).toBeTruthy();

                expect(re.getMaxCuts()).toBe(-1);
                re.setMaxCuts(10)
                expect(re.getMaxCuts()).toBe(10);
                expect(re.getDirty()).toBeTruthy();
            });

            describe("can calculate cut sites for linear DNA", function() {
                it("getAllCutSites works", function() {
                    var allSites = re.getAllCutSites();
                    expect(allSites.length).toBe(4);

                    expect(allSites[0].getStart()).toBe(1);
                    expect(allSites[0].getEnd()).toBe(4);

                    expect(allSites[2].getStart()).toBe(7);
                    expect(allSites[2].getEnd()).toBe(10);

                    expect(allSites[1].getStart()).toBe(12);
                    expect(allSites[1].getEnd()).toBe(15);

                    expect(allSites[3].getStart()).toBe(28);
                    expect(allSites[3].getEnd()).toBe(31);
                });

                it("getAllCutSitesMap works", function() {
                    var allMap = re.getAllCutSitesMap();

                    expect(allMap.get(agcEnz).length).toBe(2);
                    expect(allMap.get(gntEnz).length).toBe(2);
                });

                it("can filter based on maxcutsites", function() {
                    re.setMaxCuts(1);
                    expect(re.getCutSites().length).toBe(0);
                    re.setMaxCuts(10);
                });
            });

            it("can calculate cut sites for circular DNA", function() {
                reMan.setCircular(true);
                re.setDirty(true);
                var sites = re.getCutSites();

                expect(sites.length).toBe(5);

                expect(sites[4].getStart()).toBe(33);
                expect(sites[4].getEnd()).toBe(1);
            });
        });

        // As far as I can tell, trace manager is never used.
        // If we plan on doing sequence alignment in the future, it may be useful.
        describe("TraceManager", function() {
            var tm = Ext.create("Teselagen.manager.TraceManager", {
                sequenceManager: seqMan
            });

            it("is defined", function() {
                expect(tm).toBeDefined();
            });
        });
    });

    describe("Data Classes", function() {
        describe("RestrictionEnzymeGroup", function() {
            var group;

            beforeEach(function() {
                group = Ext.create("Teselagen.models.RestrictionEnzymeGroup", {
                    name: "MyGroup",
                    enzymes: [agcEnz, gntEnz]
                });
            });

            it("is defined", function() {
                expect(group).toBeDefined();
            });

            it("has working getters and setters", function() {
                var enzList = group.getEnzymes();

                expect(enzList.length).toBe(2);

                expect(enzList[0].getName()).toBe("agc enzyme");
                expect(enzList[1].getName()).toBe("gnt enzyme");

                group.setEnzymes([gntEnz]);
                expect(group.getEnzymes()).toEqual([gntEnz]);
            });

            describe("addRestrictionEnzyme", function() {
                it("rejects duplicate enzymes", function() {
                    var addFn = function() {
                        group.addRestrictionEnzyme(agcEnz);
                    };
                    expect(addFn).toThrow();
                });

                it("accepts new enzymes", function() {
                    group.setEnzymes([gntEnz]);
                    group.addRestrictionEnzyme(agcEnz);
                    expect(group.getEnzymes()).toEqual([gntEnz, agcEnz]);
                });
            });

            describe("removeRestrictionEnzyme", function() {
                it("rejects enzymes which are not present", function() {
                    var remFn = function() {
                        group.setEnzymes([agcEnz]);
                        group.removeRestrictionEnzyme(gntEnz);
                    };
                    expect(remFn).toThrow();
                });

                it("removes enzymes which are present", function() {
                    group.removeRestrictionEnzyme(agcEnz);
                    expect(group.getEnzymes()).toEqual([gntEnz]);
                });
            });

            it("hasEnzyme", function() {
                expect(group.hasEnzyme(agcEnz)).toBeTruthy();

                group.setEnzymes([agcEnz]);
                expect(group.hasEnzyme(gntEnz)).toBeFalsy();
            });

            it("getRestrictionEnzyme", function() {
                expect(group.getRestrictionEnzyme(0)).toBe(agcEnz);
                expect(group.getRestrictionEnzyme(1)).toBe(gntEnz);

                var getFn = function() {
                    group.getRestrictionEnzyme(-2);
                };

                expect(getFn).toThrow();
            });
        });
    });

    var cutSite1;
    var cutSite2;
    var feature;
    var orf;
    describe("Renderer Classes", function() {
        describe("pie renderers", function() {
            describe("CutSiteRenderer", function() {
                cutSite1 = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
                    start: 10,
                    end: 20,
                    restrictionEnzyme: agcEnz
                });

                cutSite2 = Ext.create("Teselagen.bio.enzymes.RestrictionCutSite", {
                    start: 0,
                    end: 2,
                    restrictionEnzyme: agcEnz
                });

                var csRenderer = Ext.create("Teselagen.renderer.pie.CutSiteRenderer", {
                    sequenceManager: seqMan,
                    center: 0,
                    railRadius: 10,
                    cutSites: [cutSite1, cutSite2]
                });

                it("exists", function() {
                    expect(csRenderer).toBeDefined();
                });
            });

            describe("FeatureRenderer", function() {
                feature = Ext.create("Teselagen.bio.sequence.dna.Feature", {
                    name: "Awesome Feature",
                    type: "terminator",
                    start: 1,
                    end: 18,
                    strand: 1
                });

                var fRenderer = Ext.create("Teselagen.renderer.pie.FeatureRenderer", {
                    sequenceManager: seqMan,
                    center: 0,
                    railRadius: 10,
                    features: [feature]
                });

                it("exists", function() {
                    expect(fRenderer).toBeDefined();
                });
            });

            describe("ORFRenderer", function() {
                orf = Ext.create("Teselagen.bio.orf.ORF", {
                    start: 2,
                    end: 33,
                    strand: -1,
                    frame: 1,
                    startCodons: [1, 10]
                });

                var oRenderer = Ext.create("Teselagen.renderer.pie.ORFRenderer", {
                    sequenceManager: seqMan,
                    center: 0,
                    railRadius: 10,
                    orfs: [orf]
                });

                it("exists", function() {
                    expect(oRenderer).toBeDefined();
                });
            });
        });
    });

    describe("Label classes", function() {
        describe("Label", function() {
            var label = Ext.create("Teselagen.renderer.common.Label", {
                annotation: feature
            });

            it("exists", function() {
                expect(label).toBeDefined();
            });

            it("can create sprite without dying", function() {
                expect(label.getAnnotation()).toBeDefined();
            });
        });

        describe("pie labels", function() {
            describe("CutSiteLabel", function() {
                var csLabel = Ext.create("Teselagen.renderer.pie.CutSiteLabel", {
                    annotation: cutSite1
                });

                it("exists", function() {
                    expect(csLabel).toBeDefined();
                });

                it("can generate labels and tooltips", function() {
                    console.log(csLabel.labelText());
                });
            });

            describe("FeatureLabel", function() {
                var fLabel = Ext.create("Teselagen.renderer.pie.FeatureLabel", {
                    annotation: feature
                });

                it("exists", function() {
                    expect(fLabel).toBeDefined();
                });

                it("can generate labels and tooltips", function() {
                    console.log(fLabel.labelText());
                });
            });
        });
    });

    describe("Manager Classes", function() {

        describe("PieManager", function() {
            var pieMan = Ext.create("Teselagen.manager.PieManager", {
                sequenceManager: seqMan,
                center: 0,
                railRadius: 0,
                cutSites: [cutSite1, cutSite2],
                features: [feature],
                orfs: [orf]
            });

            it("exists", function() {
                expect(pieMan).toBeDefined();
            });

            it("'show' flags work correctly", function() {
                pieMan.setShowCutSites(false);
                expect(pieMan.getShowCutSites()).toBeFalsy();
                
                pieMan.setShowFeatures(false);
                expect(pieMan.getShowFeatures()).toBeFalsy();

                pieMan.setShowOrfs(false);
                expect(pieMan.getShowOrfs()).toBeFalsy();
            });
        });
    });
});
