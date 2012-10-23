/*global beforeEach, describe, expect, it*/
var userStore, partStore;
Ext.onReady(function() {
    describe("Device Editor models tests.", function () {
        var part, partData, seqfile;
        var user, orders, order, userData, address, bossStore;
        beforeEach(function() {
            Ext.define("User", {
                extend: "Ext.data.Model",
                fields: [
                         "name"
                         ],
                         hasMany: {model: "Order", name: "orders"},
                         hasOne: {model: "Address"},
                         belongsTo: {model: "Boss"},
                proxy: {
                    type: "memory"
                }
            });
            Ext.define("Order", {
                extend: "Ext.data.Model",
                fields: [
                         "total"
                         ],
                proxy: {
                    type: "memory"
                }
            });
            Ext.define("Address", {
                extend: "Ext.data.Model",
                fields: [
                         "street"
                         ],
                proxy: {
                    type: "memory"
                }
            });
            Ext.define("Boss", {
                extend: "Ext.data.Model",
                fields: [
                    "name"
                ],
                proxy: {
                    type: "memory"
                }
            });
            bossStore = Ext.create("Ext.data.Store", {
                model: "Boss",
                proxy: {
                    type: "sessionstorage",
                    id: "boss"
                }
            });
            userData = {
                    "users": [{
                        "id": 123,
                        "name": "Ed",
                        "orders": [{
                            "id": 50,
                            "total": 100
                        }],
                        "address": {
                            "id": 1,
                            "street": "Embarcadero"
                        }
                    }]
            };
            userStore = Ext.create("Ext.data.Store", {
                model: "User",
                data: userData,
                proxy: {
                    type: "memory",
                    reader: {type:"json", root: "users"}
                }
            });
        });
        it("Simple hasMany test", function() {
            user = userStore.first();
            expect(user).toBeDefined();
            expect(user.get("id")).toBe(123);
            expect(user.get("name")).toBe("Ed");
            orders = user.orders();
            expect(orders).toBeDefined();
            order = orders.first();
            expect(order).toBeDefined();
            expect(order.get("id")).toBe(50);
            expect(order.get("total")).toBe(100);
        });
        it("Simple hasOne test", function() {
            var addr;
            user = userStore.first();
            expect(user).toBeDefined();
            address = user.getAddress();
            expect(address).toBeDefined();
            expect(address.get("street")).toBe("Embarcadero");
            user.setAddress(2);
            expect(user.get("address_id")).toBe(2);
            expect(user.getAddress().getId()).toBe(2);
            addr = Ext.create("Address", {"id":3, "street": "Market"});
            user.setAddress(addr);
            expect(user.getAddress().getId()).toBe(3);
            expect(user.getAddress().get("street")).toBe("Market");
        });
        it("Simple belongsTo test", function() {
            var boss2;
            user = userStore.first();
            expect(user).toBeDefined();
            user.setBoss(10); // Default foreign key is set
            expect(user.get("boss_id")).toBe(10);
            expect(user.getBoss().getId()).toBe(10);
            boss2 = Ext.create("Boss", {id:20, name: "myboss2"});
            user.setBoss(boss2);
            expect(user.getBoss().getId()).toBe(20);
            expect(user.getBoss().get("name")).toBe("myboss2");
        });
        it("Part test using store", function() {
            partData = {
                    "parts": [{
                        "id": 123,
                        "name": "mypart",
                        "sequenceFile": {
                            "id": 10,
                            "sequenceFileName": "myFasta",
                            "sequenceFileFormat": "FASTA",
                            "sequenceFileContent": ">ssrA_tag_enhance\nGCGGCGAACGATGAAAACTATAACTATGCGCTGGCGGCG\n"

                        }
                    }]
            };
            partStore = Ext.create("Ext.data.Store", {
                model: "Teselagen.models.Part",
                data: partData,
                proxy: {
                    type: "memory",
                    reader: {type:"json", root: "parts"}
                }
            });
            part = partStore.first();
            expect(part).toBeDefined();
            expect(part.get("id")).toBe(123);
            expect(part.get("name")).toBe("mypart");
            seqfile = part.getSequenceFile();
            expect(seqfile).toBeDefined();
            expect(seqfile.get("sequenceFileName")).toBe("myFasta");
        });
        it("Create Part and access hasOne relation", function(){
            var part = Ext.create("Teselagen.models.Part", {
                "fas": "fas1",
                "sequenceFile": {
                    "sequenceFileName" : "myFasta"
                }
            });
            expect(part.get("fas")).toBe("fas1");
            seqfile = part.getSequenceFile();
            expect(seqfile).toBeDefined();
            expect(Ext.getClassName(seqfile)).toBe("Teselagen.models.SequenceFile");
        });
        describe("Ajax tests.", function() {
            var proj, veprojs;
            it("Project", function() {
                proj = Ext.create("Teselagen.models.Project", {id:1, name: "Project Z"});
            });
            it("VEProjects store", function() {
                veprojs = proj.veprojects();
                veprojs.on("load", function() {
                    expect(veprojs).toBeDefined();
                    expect(veprojs.count()).toBe(2);
                });
            });
        });
    });
});
