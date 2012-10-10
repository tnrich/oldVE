/*global beforeEach, describe, expect, it, runs, waitsFor*/
var userStore;
describe("Device Editor models tests.", function () {
//    var bin, part, partvo, seqfile;
    var user, orders, order, data, address;
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
        data = {
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
                    data: data,
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
    xit("Create SequenceFile.", function() {
//        seqfile = Ext.create("Teselagen.models.SequenceFile", {
//            sequenceFileName: "Testfile"
//        });
        seqfileStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.SequenceFile",
            data: [
                {sequenceFileName: "file1"},
                {sequenceFileName: "file2"}
            ]
        });
    });
    it("Create PartVO.", function() {
        partvo = Ext.create("Teselagen.models.PartVO", {
            name: "mypartvo"
        });
    });
    it("Create Part.", function() {
        part = Ext.create("Teselagen.models.Part");
    });
    it("Create J5Bin.", function() {
        bin = Ext.create("Teselagen.models.J5Bin");
    });
});

