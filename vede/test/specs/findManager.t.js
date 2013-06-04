Ext.onReady(function() {
    var DNATools = Teselagen.bio.sequence.DNATools;
    var sequenceManager = Ext.create("Teselagen.manager.SequenceManager", {
        sequence: DNATools.createDNA("atcgagagagatcgatctacgagctagctacgaccgta")
    });
    var AAManager = Ext.create("Teselagen.manager.AAManager");
    AAManager.setSequenceManager(sequenceManager);

    describe("FindManager", function() {
        var findManager;
        it("can be created", function() {
            findManager = Ext.create("Teselagen.manager.FindManager", {
                sequenceManager: sequenceManager,
                AAManager: AAManager
            });

            expect(findManager).toBeDefined();
        });

        describe("can search DNA", function() {
            it("can find one result", function() {
                var result = findManager.findOne("gag", "DNA", "literal", 0);

                expect(result.start).toBe(3);
                expect(result.end).toBe(7);
            });

            it("can find multiple results", function() {
                var result = findManager.findOne("anc", "DNA", "ambiguous", 0);

                expect(result.length).toBe(10);
            });
        });

        describe("can search amino acids", function() {
            it("can find one result", function() {
                var result = findManager.findOne("er", "Amino Acids", "literal", 0);

                expect(result.start).toBe(3);
                expect(result.end).toBe(8);
            });

            it("can find multiple results", function() {
                var result = findManager.findOne("yx", "Amino Acids", "ambiguous", 0);

                expect(result.length).toBe(3);
            });
        });
    });
});
