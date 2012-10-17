/*global beforeEach, describe, expect, it, runs, waitsFor*/
var userStore, partStore;
describe("Device Editor models tests.", function () {
//    var bin, part, partvo, seqfile;
    var part, partData;
    var user, orders, order, userData, address;
    beforeEach(function() {
        Ext.define("User", {
            extend: 'Ext.data.Model',
            fields: [
                     'name'
                     ],
            hasMany: {model: 'Order', name: 'orders'},
            hasOne: {model: "Address"}
        });
        Ext.define("Order", {
            extend: 'Ext.data.Model',
            fields: [
                     'total'
                     ]
        });
        Ext.define("Address", {
            extend: 'Ext.data.Model',
            fields: [
                     'street'
                     ]
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
                        "street": "Embarcadero"
                    }
                }]
        };
        runs(function() {
            Ext.onReady(function() {
                userStore = Ext.create('Ext.data.Store', {
                    model: "User",
                    data: userData,
                    proxy: {
                        type: 'memory',
                        reader: {type:'json', root: 'users'}
                    }
                });
            });
        });
    });
    it("Simple hasMany test", function() {
        waitsFor(function() {
            if (userStore) {
                return true;
            }
        });
        runs(function() {
            user = userStore.first();
            expect(user).toBeDefined();
            expect(user.data.id).toBe(123);
            expect(user.data.name).toBe("Ed");
            orders = user.orders();
            expect(orders).toBeDefined();
            order = orders.first();
            expect(order).toBeDefined();
            expect(order.data.id).toBe(50);
            expect(order.data.total).toBe(100);
        });
    });
    it("Simple hasOne test", function() {
        waitsFor(function() {
            if (userStore) {
                return true;
            }
        });
        runs(function() {
            user = userStore.first();
            expect(user).toBeDefined();
            address = user.getAddress();
            expect(address).toBeDefined();
            expect(address.data.street).toBe("Embarcadero");
        });
    });
    it("Part test", function() {
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
        runs(function() {
            Ext.onReady(function() {
                partStore = Ext.create('Ext.data.Store', {
                    model: "Teselagen.models.Part",
                    data: partData,
                    proxy: {
                        type: 'memory',
                        reader: {type:'json', root: 'parts'}
                    }
                });
            });
        });
        waitsFor(function() {
            if (partStore) {
                return true;
            }
        }, "partStore to be defined.");
        runs(function() {
            part = partStore.first();
            expect(part).toBeDefined();
            expect(part.data.id).toBe(123);
            expect(part.data.name).toBe("mypart");
            seqfile = part.getSequenceFile();
            expect(seqfile).toBeDefined();
            expect(seqfile.data.sequenceFileName).toBe("myFasta");
        });
    });
    xit("Create J5Bin.", function() {
        bin = Ext.create("Teselagen.models.J5Bin");
    });
});

