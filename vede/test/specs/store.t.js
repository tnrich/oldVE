/**
 * Device Editor Store tests.
 * @author Yuri Bendana
 */

/*global describe, expect, it, runs, waitsFor*/
Ext.require("Teselagen.constants.Constants");
Ext.require("Teselagen.store.PartStore");
Ext.require("Teselagen.store.ProjectStore");
Ext.require("Teselagen.store.UserStore");

Ext.onReady(function () {
    describe("Store tests - ", function () {

        describe("Project.", function () {
            var projStore;
            var project, veproject, deproject, part, design;

            it("Load ProjectStore from file", function () {
                projStore = Ext.create("Teselagen.store.ProjectStore");
                projStore.load(function() {
                    expect(projStore.getCount()).toBe(3);
                    expect(projStore.getAt(0).get("name")).toBe("Project A");
                    expect(projStore.getAt(1).get("name")).toBe("Project B");
                    expect(projStore.getAt(2).get("name")).toBe("Project C");
                });
            });
            it("Insert project in store", function() {
                projStore.on("load", function() {
                   var proj = Ext.create("Teselagen.models.Project", {name: "proj1"});
                   projStore.insert(2, proj); // 0 < index < count
                   expect(projStore.getCount()).toBe(4);
                   expect(projStore.getAt(2).get("name")).toBe("proj1");
                   expect(projStore.getAt(3).get("name")).toBe("Project C");
                   projStore.removeAt(2);
                   expect(projStore.getCount()).toBe(3);
                   projStore.insert(5, proj); // index > count
                   expect(projStore.getCount()).toBe(4);
                   expect(projStore.getAt(3).get("name")).toBe("proj1"); // appended record
                   projStore.removeAt(3);
                });
            });
            it("Load Specific Project", function () {
                projStore.on("load", function() {
                    project = projStore.first();
                    expect(project).toBeDefined();
                    if (project) {
                        expect(project.getId()).toBe(1);
                        expect(project.get("name")).toBe("Project A");
                    }
                });
            });
            it("Get VE projects", function() {
                waitsFor(function() {
                    return Ext.isDefined(project);
                }, "Project to be defined.", 500);
                runs(function() {
                    var veprojects = project.veprojects();
                    veprojects.on("load", function() {
                        expect(veprojects).toBeDefined();
                        expect(veprojects.count()).toBe(2);
                        veproject = veprojects.first();
                        expect(veproject).toBeDefined();
                        if (veproject) {
                            expect(veproject.get("name")).toBe("VE Proj 1");
                        }
                    });
                });
            });
            it("Get Part from VE project", function() {
                waitsFor(function() {
                    return Ext.isDefined(veproject);
                }, "VE project to be defined", 500);
                runs(function() {
                    var parts = veproject.parts();
                    parts.on("load", function() {
                        expect(parts).toBeDefined();
                        expect(parts.count()).toBe(2);
                        part = parts.first();
                        expect(part).toBeDefined();
                        if (part) {
                            expect(part.get("name")).toBe("Part 1");
                        }
                    });
                });
            });
            it("Get SequenceFile from VE project", function() {
                waitsFor(function() {
                    return Ext.isDefined(veproject);
                }, "VE project to be defined", 500);
                runs(function() {
                    veproject.getSequenceFile(function(pModel) {
                        expect(pModel).toBeDefined();
                        if (pModel) {
                            expect(pModel.get("sequenceFileName")).toBe("SequenceFile1.fas");
                        }
                    });
                });
            });
            it("Get DE projects", function() {
                waitsFor(function() {
                    return Ext.isDefined(project);
                }, "Project to be defined", 500);
                runs(function() {
                    var deprojects = project.deprojects();
                    deprojects.on("load", function() {
                        expect(deprojects).toBeDefined();
                        expect(deprojects.count()).toBe(2);
                        deproject = deprojects.first();
                        expect(deproject).toBeDefined();
                        if (deproject) {
                            expect(deproject.get("name")).toBe("DE Proj 1");
                        }
                    });
                });
            });
            it("Get j5 run from DE project", function() {
                waitsFor(function() {
                    return Ext.isDefined(deproject);
                }, "DE Project to be defined", 500);
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
                }, "DE Project to be defined", 500);
                runs(function() {
                    deproject.getDesign(function(pModel) {
                        design = pModel;
                        expect(pModel).toBeDefined();
                        if (pModel) {
                            expect(pModel.getId()).toBe(1);
                        }
                    });
                });
            });
            it("Device design is loaded", function () {
                waitsFor(function() {
                    return Ext.isDefined(design);
                }, "DeviceDesign to be defined.", 500);
            });
        });
        
        describe("Part.", function () {
            var aPart, partStore;

            it("Load PartStore", function () {
                runs(function() {
                    partStore = Ext.create("Teselagen.store.PartStore");
                    partStore.load(function(pRecs, pOp, pSuccess) {
                        if (pSuccess) {
                            aPart = partStore.first();
                        }
                    });
                });
                waitsFor(function() {
                    return Ext.isDefined(aPart);
                }, "aPart to be defined", 500);
                runs(function() {
                    expect(partStore.getCount()).toBe(2);
                });
            });
        });

        describe("User.", function () {
            var userStore, user, projects, project;

            it("Load UserStore", function () {
                userStore = Ext.create("Teselagen.store.UserStore");
                userStore.load(function() {
                    user = userStore.first();
                });
            });
            it("Load user projects", function () {
                waitsFor(function() {
                    return Ext.isDefined(user);
                }, "User to be defined", 500);
                runs(function() {
                    expect(userStore.getCount()).toBe(2);
                    projects = user.projects();
                    projects.on("load", function() {
                        expect(projects).toBeDefined();
                        project = projects.first();
                    });
                });
            });
            it("Load project", function () {
                waitsFor(function() {
                    return Ext.isDefined(project);
                }, "User to be defined", 500);
                runs(function() {
                    expect(project.get("name")).toBe("Project A");
                });
            });
        });

    });
    
});