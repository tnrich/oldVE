/*global describe, expect, it, runs, waitsFor*/
Ext.require("Ext.Ajax");
Ext.require("Teselagen.constants.Constants");
Ext.require("Teselagen.store.ProjectStore");

Ext.onReady(function () {

    describe("Store tests - ", function () {

        describe("Project.", function () {

            var projStore;
            var project, veproject, deproject;

            it("Load ProjectStore", function () {
                projStore = Ext.create("Teselagen.store.ProjectStore");
                projStore.load(function() {
                    expect(projStore.getCount()).toBe(3);
                });
            });

            it("Load Specific Project", function () {
                projStore.on("load", function() {
                    project = projStore.first();
                    expect(project.getId()).toBe(1);
                    expect(project.get("name")).toBe("Project A");
                });
            });
            it("Get VE projects", function() {
                waitsFor(function() {
                    return Ext.isDefined(project);
                }, "Project is not defined.", 500);
                runs(function() {
                    var veprojects = project.veprojects();
                    veprojects.on("load", function() {
                        expect(veprojects).toBeDefined();
                        expect(veprojects.count()).toBe(2);
                        veproject = veprojects.first();
                        expect(veproject).toBeDefined();
                        expect(veproject.get("name")).toBe("VE Proj 1");
                    });
                });
            });
            it("Get Part from VE project", function() {
                waitsFor(function() {
                    return Ext.isDefined(veproject);
                });
                runs(function() {
                    veproject.getPart(function(pModel) {
                        expect(pModel).toBeDefined();
                        expect(pModel.get("name")).toBe("Part 1");
                    });
                });
            });
            it("Get DE projects", function() {
                waitsFor(function() {
                    return Ext.isDefined(project);
                }, "Project is not defined.", 500);
                runs(function() {
                    var deprojects = project.deprojects();
                    deprojects.on("load", function() {
                        expect(deprojects).toBeDefined();
                        expect(deprojects.count()).toBe(2);
                        deproject = deprojects.first();
                        expect(deproject).toBeDefined();
                        expect(deproject.get("name")).toBe("DE Proj 1");
                    });
                });
            });
            it("Get j5 run from DE project", function() {
                waitsFor(function() {
                    return Ext.isDefined(deproject);
                });
                runs(function() {
                    var j5runs, j5run;
                    j5runs = deproject.j5runs();
                    expect(j5runs).toBeDefined();
                    j5run = j5runs.first();
                    expect(j5run).toBeDefined();
                    expect(j5run.get("name")).toBe("j5 Run 1");
                });
            });
            it("Load device design", function () {
                waitsFor(function() {
                    return Ext.isDefined(deproject);
                });
                runs(function() {
                    deproject.getDesign(function(pModel) {
                        expect(pModel).toBeDefined();
                        expect(pModel.getId()).toBe(1);
                    });
                });
            });

        });

    });
});