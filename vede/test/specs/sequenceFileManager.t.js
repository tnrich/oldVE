/**
 * SequenceFileManager tests
 * @author Diana Wong
 */

/*global beforeEach, describe, expect, it*/
Ext.onReady(function() {
    var SequenceFileManager = Teselagen.manager.SequenceFileManager;
    xdescribe("Teselagen.manager.SequenceFileManager.js", function() {

        it("addSequenceFile(): add to empty SequenceFileManager array", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

            seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            expect(seqFileMan.getSequenceFiles().length).toBe(1);

            var seq = seqFileMan.getSequenceFiles()[0];
            expect(seq.get("sequenceFileFormat")).toBe(Teselagen.constants.Constants.self.GENBANK);
            expect(seq.get("sequenceFileContent")).toBe("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n");
            expect(seq.get("sequenceFileName")).toBe("filename");
            expect(seq.get("partSource")).toBe("pj5_00028");
        });

        it("addSequenceFile(): no filename", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});
            seqFileMan.deleteAllItems();
            expect(seqFileMan.getSequenceFiles().length).toBe(0);

            seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r");

            var seq = seqFileMan.getSequenceFiles()[0];
            expect(seq.get("sequenceFileName")).toBe("pj5_00028.gb");
        });

        it("addSequenceFile(): filename with whitespace", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});
            seqFileMan.deleteAllItems();
            expect(seqFileMan.getSequenceFiles().length).toBe(0);

            var flag = false;
            try {
                seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "file name");
            } catch (e) {
                flag = true;
            }
            expect(flag).toBe(true);
        });

        it("addSequenceFile(): add to SequenceFileManager array containing sequenceFile", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

            var tmp = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            var tmp2 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            expect(seqFileMan.getSequenceFiles().length).toBe(1);
            expect(tmp).toBe(tmp2);
        });

        it("addSequenceFile(): add to SequenceFileManager array containing non-unique filename ", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

            var tmp = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            var flag = false;
            try {
                var tmp2 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               BLAH", "filename");
            } catch (e) {
                flag = true;
            }

            expect(seqFileMan.getSequenceFiles().length).toBe(1);
            expect(flag).toBe(true);
        });

        it("deleteItem()", function(){
            var seq = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Genbank",
                sequenceFileContent: "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r"
            });

            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {
                sequenceFiles: [seq]
            });
            expect(seqFileMan.getSequenceFiles().length).toBe(1);
            seqFileMan.deleteItem(seq);
            expect(seqFileMan.getSequenceFiles().length).toBe(0);
        });

        it("deleteAllItems(): no filename", function(){
            //var seqFileMan = null;
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {
                sequenceFiles: ["a", "b"]
            });
            //console.log(seqFileMan.getSequenceFiles());

            expect(seqFileMan.getSequenceFiles().length).toBe(2);
            seqFileMan.deleteAllItems();
            expect(seqFileMan.getSequenceFiles().length).toBe(0);
        });

        it("getItemByPartSource():", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

            var tmp1 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            var tmp2 = seqFileMan.getItemByPartSource("pj5_00028");
            expect(tmp1).toBe(tmp2);
        });

        it("getItemByHash():", function(){
            var seqFileMan = Ext.create("Teselagen.manager.SequenceFileManager", {});

            var tmp1 = seqFileMan.addSequenceFile("Genbank", "LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\r", "filename");

            var tmp2 = seqFileMan.getItemByHash(Teselagen.bio.util.Sha256.hex_sha256("LOCUS       pj5_00028               5371 bp ds-DNA     circular     1-APR-2012\n"));
            expect(tmp1).toBe(tmp2);
        });
    });
});
