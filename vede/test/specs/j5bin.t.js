/**
 * J5Bin model tests.
 * @author Yuri Bendana, Diana Wong
 */

/*global beforeEach, describe, expect, it*/
//Ext.require("Teselagen.models.J5Bin");
//Ext.require("Teselagen.models.Part");
Ext.onReady(function() {
    var modelProxy = {
        type: "memory",
        reader: {
            type: "json"
        }
    };

    describe("Teselagen.models.J5Bin", function() {

        it("Create J5Bin and check defaults", function(){
            var bin = Ext.create("Teselagen.models.J5Bin", {iconID:null});
            bin.setProxy(modelProxy);
            expect(bin).not.toBe(null);

            // check -- Non-empty defaults do not work!
            expect(bin.get("binName").match("Bin")).not.toBe(null);
            expect(bin.get("iconID")).toBe("USER-DEFINED");
            expect(bin.get("directionForward")).toBe(true);
            expect(bin.get("fases").length).toBe(0);
            expect(bin.partCount()).toBe(0);
        });

        it("Validate()", function(){
            var bin = Ext.create("Teselagen.models.J5Bin", {iconID:null});
            expect(bin.validate().length).toBe(0);

            bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "binName1"
            });
            expect(bin.validate().length).toBe(0);

            bin = Ext.create("Teselagen.models.J5Bin", {
                binName: "binName1",
                iconID: "NOT A REAL ICON"
            });
            expect(bin.validate().length).toBe(1);
        });

        it("Test Associations()", function(){
            var part1   = Ext.create("Teselagen.models.Part");
            var part2   = Ext.create("Teselagen.models.Part");

            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.setProxy(modelProxy);
            bin.addToParts([part1, part2]);

            expect(bin.parts()).not.toBe(null);
            expect(Ext.getClassName(bin.parts())).toBe("Ext.data.Store");
            expect(Ext.getClassName(bin.getJ5Collection())).toBe("Teselagen.models.J5Collection");
        });

        it("indexOfPart()//hasPart()", function(){
            var part1   = Ext.create("Teselagen.models.Part");
            var part2   = Ext.create("Teselagen.models.Part");

            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.setProxy(modelProxy);
            bin.addToParts([part1, part2]);

            expect(bin.indexOfPart(part1)).toBe(0);
            expect(bin.indexOfPart(part2)).toBe(1);

            expect(bin.hasPart(part1)).toBe(true);
            expect(bin.hasPart("blah")).toBe(false);
        });

        describe("addToParts", function() {
            var success;
            it("Should be able to add parts individually to a bin", function(){
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var part3   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                // Append first part
                success = bin.addToParts(part1);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.get("fases")[0]).toBe("None");
                //Add a second part, insert in front of previous part
                success = bin.addToParts(part2, 0, "fas1");
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part1);
                expect(bin.get("fases")[0]).toBe("fas1");
                expect(bin.get("fases")[1]).toBe("None");
                //Add a third part in between
                success = bin.addToParts(part3, 1, "fas2");
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(3);
                expect(bin.parts().getAt(0)).toBe(part2);
                expect(bin.parts().getAt(1)).toBe(part3);
                expect(bin.parts().getAt(2)).toBe(part1);
                expect(bin.get("fases")[0]).toBe("fas1");
                expect(bin.get("fases")[1]).toBe("fas2");
                expect(bin.get("fases")[2]).toBe("None");
            });
            it("Should be able to pass null for part index and non-null fas", function() {
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                success = bin.addToParts(part1);
                expect(success).toBe(true);
                success = bin.addToParts(part2, null, "fas1");
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(2);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(1)).toBe(part2);
                expect(bin.get("fases")[0]).toBe("None");
                expect(bin.get("fases")[1]).toBe("fas1");
            });
            it("Should be able to append an array of parts and implicit array of fas", function() {
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                success = bin.addToParts([part1, part2]);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(2);
                var fases = bin.get("fases");
                expect(fases.length).toBe(2);
                expect(fases[1]).toBe("None");
            });
            it("Should be able to append an array of parts and array of fas", function() {
                var part1   = Ext.create("Teselagen.models.Part");
                var part2   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                success = bin.addToParts([part1, part2], null, ["fas1", "fas2"]);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(2);
                var fases = bin.get("fases");
                expect(fases.length).toBe(2);
                expect(fases[1]).toBe("fas2");
            });
            it("Should be able to insert an array of parts and array of fas", function() {
                var part1   = Ext.create("Teselagen.models.Part", {name:"part1"});
                var part2   = Ext.create("Teselagen.models.Part", {name:"part2"});
                var part3   = Ext.create("Teselagen.models.Part", {name:"part3"});
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                bin.addToParts(part1);
                // Insert array before first part
                success = bin.addToParts([part2, part3], 0, ["fas2", "fas3"]);
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(3);
                expect(bin.parts().getAt(1).get("name")).toBe("part3")
                var fases = bin.get("fases");
                expect(fases.length).toBe(3);
                expect(fases[1]).toBe("fas3");
            });
            it("Should return false if part index is negative", function() {
                var part1   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin");
                success = bin.addToParts(part1, -1);
                expect(success).toBe(false);
            });
            it("Should return false if part index is not a number", function() {
                var part1   = Ext.create("Teselagen.models.Part");
                var bin     = Ext.create("Teselagen.models.J5Bin");
                success = bin.addToParts(part1, "a");
                expect(success).toBe(false);
            });
            it("Is a part and the owner bin linked or cloned?", function(){
                var part1   = Ext.create("Teselagen.models.Part", {
                    partSource: "tmpname"
                });
                var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
                bin.setProxy(modelProxy);
                expect(bin.partCount()).toBe(0);

                var success = bin.addToParts(part1);

                // check if the structure is correct.
                expect(success).toBe(true);
                expect(bin.partCount()).toBe(1);
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(0).get("partSource")).toBe("tmpname");

                // change part 1. Change should be reflected in the bin's parts
                part1.set("partSource", "blahblah");
                expect(bin.parts().getAt(0)).toBe(part1);
                expect(bin.parts().getAt(0).get("partSource")).toBe("blahblah"); //double check change

            });
        });
        
        xit("removeFromParts()", function(){
            var part1   = Ext.create("Teselagen.models.Part");
            var part2   = Ext.create("Teselagen.models.Part");
            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            var fases = bin.get("fases");
            bin.setProxy(modelProxy);
            bin.addToParts([part1, part2]);

            expect(bin.partCount()).toBe(2);
            expect(bin.parts().getAt(0)).toBe(part1);
            expect(bin.parts().getAt(1)).toBe(part2);
            expect(fases.length).toBe(2);

            var success = bin.removeFromParts(part1);
            expect(success).toBe(true);
            expect(bin.partCount()).toBe(1);
            expect(bin.parts().getAt(0)).toBe(part2);
            expect(fases.length).toBe(1);

            // should fail to remove it again
            success = bin.removeFromParts(part1);
            expect(success).toBe(false);

            success = bin.removeFromParts(part2);
            expect(success).toBe(true);
            expect(bin.partCount()).toBe(0);
            expect(fases.length).toBe(0);
        });

        it("getPartByName should find part with given name", function() {
            var part1   = Ext.create("Teselagen.models.Part", {name:"foo"});
            var part2   = Ext.create("Teselagen.models.Part", {name:"foo2"});
            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.addToParts([part1, part2]);
            var part = bin.getPartByName("foo2");
            expect(part.get("name")).toBe("foo2");
        });

        it("getPartByName should find part with null name", function() {
            var part1   = Ext.create("Teselagen.models.Part", {name:"foo"});
            var part2   = Ext.create("Teselagen.models.Part", {name:""});
            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.addToParts([part1, part2]);
            var part = bin.getPartByName("");
            expect(part.get("name")).toBe("");
        });
        
        xit("getPartById() -- THIS WILL NOT WORK UNTIL RODRIGO/MONGO'S ID GENERATOR WORKS", function(){
            var part1   = Ext.create("Teselagen.models.Part");
            var part2   = Ext.create("Teselagen.models.Part");

            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.setProxy(modelProxy);
            bin.addToParts([part1, part2]);

            //var id1     = bin.getPartById(part1.get("id"));
            //expect(id1).toBe(part1);

            //var id2     = bin.getPartById(part2.get("id"));
            //expect(id2).toBe(part2);

            //expect(id1).not.toBe(part2);
            //expect(id2).not.toBe(part1);
        });

        it("deletePart() -- Depends on DeviceDesign.getRulesInvolvingPart() and removeFromRules()", function(){

            var part1   = Ext.create("Teselagen.models.Part");
            var part2   = Ext.create("Teselagen.models.Part");
            var rule1   = Ext.create("Teselagen.models.EugeneRule", {
                name: "rule1",
                //operand1: part1,
                operand2: part2,
                compositionalOperator: "AFTER"
            });
            rule1.setOperand1(part1);

            // Create a bin with parts
            var bin     = Ext.create("Teselagen.models.J5Bin", {
                iconID:null
            });
            bin.setProxy(modelProxy);
            bin.addToParts([part1, part2]);

            // Create a Device with eugene rules that include the parts
            var device  = Ext.create("Teselagen.models.DeviceDesign");
            device.addToRules(rule1);

            // Check Structure
            expect(bin.parts().count()).toBe(2);
            expect(bin.parts().getAt(0)).toBe(part1);
            expect(device.rules().count()).toBe(1);

            // Delete the part with rule
            bin.deletePart(part1, device);

            // Check New Structure
            expect(bin.parts().count()).toBe(1);
            expect(bin.parts().getAt(0)).toBe(part2);
            expect(device.rules().count()).toBe(0);
        });

        it("createPart() ***", function(){
        });

        it("isUniquePartName()", function(){
            var part1   = Ext.create("Teselagen.models.Part", {
                name: "blah"
            });
            var bin     = Ext.create("Teselagen.models.J5Bin", {iconID:null});
            bin.addToParts([part1]);

            var unique  = bin.isUniquePartName("blah");
            expect(unique).toBe(false);
            unique      = bin.isUniquePartName("newName");
            expect(unique).toBe(true);
        });

    });
});
