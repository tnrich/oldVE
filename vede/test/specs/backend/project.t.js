/**
 * Project tests that access the server.
 * @author Rodrigo Pavez, Yuri Bendana
 */

/*global beforeEach, describe, it, expect, runs, waitsFor*/

Ext.require([
     "Ext.Ajax",
     "Teselagen.constants.Constants",
     "Teselagen.models.Project",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.SessionManager",
     "Teselagen.store.ProjectStore"]);

Ext.onReady(function () {
    var project, projects, user, userProjects, projectById;
    var isLoggedIn = false;
    var isTestDataDeleted = false;
    var isTestSetup = false;
    var isUserLoaded = false;
    var projectCreated = false;
    var projectEdited = false;
    var projectEditCheck1 = false;
    var projectEditCheck2 = false;
    var projectRemoved = false;
    var projectLoaded = false;
    var constants = Teselagen.constants.Constants;
    var projectManager = Teselagen.manager.ProjectManager;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var sessionManager = Teselagen.manager.SessionManager;
    var projStore = Ext.create("Teselagen.store.ProjectStore");

    describe("Project server tests.", function() {

        beforeEach(function() {
            Ext.Ajax.cors = true; // Allow CORS
            sessionManager.setEnv(constants.ENV_PROD);
        });

        it("Login", function() {
            runs(function() {
                authenticationManager.sendAuthRequest({
                    username: "rpavez",
                    password: "",
                    server: constants.API_URL
                }, function(pSuccess) {
                    if (pSuccess) {
                        isLoggedIn = true;
                    }
                });
            });
        });

        it("Clear test data", function() {
            waitsFor(function() {
                return isLoggedIn;
            }, "login", 500);
            runs(function() {
                Ext.Ajax.request({
                    url: "/api/projects",
                    method: "DELETE",
                    success: function() {
                        isTestDataDeleted = true;
                    }
                });
            });
        });

        it("Setup test data", function() {
            waitsFor(function() {
                return isTestDataDeleted;
            }, "login", 500);
            runs(function() {
                projStore.add({
                    name: "My Project #1",
                    dateCreated: new Date("11/14/12"),
                    dateModified: new Date("11/14/12")
                });
                projStore.sync({
                    success: function() {
                        isTestSetup = true;
                    }
                });
            });
        });

        it("Load user", function () {
            waitsFor(function() {
                return isTestSetup;
            }, "test data setup", 500);
            runs(function () {
                projectManager.loadUser();
            });
            waitsFor(function() {
                return !Ext.isEmpty(projectManager.projects);
            }, "user projects to be loaded", 500);
            runs(function() {
                isUserLoaded = true;
            });
        });

        it("Check user", function () {
            waitsFor(function() {
                return isUserLoaded;
            }, "currentUser", 500);
            runs(function() {
                user = projectManager.currentUser;
                expect(user.get("username")).toBe("rpavez");
            });
        });


        it("Check projects", function () {
            waitsFor(function () {
                return !Ext.isEmpty(projectManager.projects);
            }, "projects", 500);
            runs(function () {
                projects = projectManager.projects;
                project = projects.first();
                expect(project.get("name")).toBe("My Project #1");
            });
        });
        
        it("Create and save new Project", function () {
            waitsFor(function() {
                return Ext.isDefined(user);
            }, "user", 500);
            runs(function () {
                project = Ext.create("Teselagen.models.Project", {
                    name: "My Project #2",
                    dateCreated: new Date("11/15/12"),
                    dateModified: new Date("11/15/12")
                });
                userProjects = user.projects();
                userProjects.add(project);
                userProjects.sync({
                    success: function(){
                        projectCreated = true;
                    }
                });
            });
        });
        
        it("Check new project", function() {
            waitsFor(function() {
                return projectCreated;
            }, "projectCreated", 500);
            runs(function() {
                expect(userProjects.getCount()).toBe(2);
                // Why = 1?
                expect(userProjects.getTotalCount()).toBe(1);
                expect(project.getId()).toBeDefined();
                projStore.load( {
                    callback: function() {
                        projectLoaded = true;
                    }
                });
            });
            waitsFor(function() {
                return projectLoaded;
            }, "projectLoaded", 500);
            runs(function() {
                expect(projStore.getCount()).toBe(2);
                projectById = projStore.findRecord("id", project.getId());
                expect(projectById.get("name")).toBe("My Project #2");
            });
        });

        it("Edit project", function () {
            waitsFor(function() {
                return projectLoaded;
            }, "projectLoaded", 500);
            runs(function () {
                expect(project.dirty).toBe(false);
                project.set("name","My Project #3");
                expect(project.dirty).toBe(true);
                project.save({
                    success: function(){
                        projectEdited = true;
                    }
                });
            });
        });
        
        it("Check edited project", function() {
            waitsFor(function() {
                return projectEdited;
            }, "projectEdited", 500);
            runs(function() {
                expect(project.dirty).toBe(false);
                projStore.load( {
                    callback: function() {
                        projectEditCheck1 = true;
                    }
                });
            });
            waitsFor(function() {
                return projectEditCheck1;
            }, "projectEditCheck1", 500);
            runs(function() {
                projectById = projStore.findRecord("id", project.getId());
                expect(projectById.get("name")).toBe("My Project #3");
                projectEditCheck2=true;
            });
        });

        it("Remove Project", function () {
            waitsFor(function() {
                return projectEditCheck2;
            }, "projectEditCheck2", 500);
            runs(function () {
                userProjects.remove(project);
                userProjects.sync({
                    success: function() {
                        projectRemoved = true;
                    }
                });
            });
            waitsFor(function() {
                return projectRemoved;
            }, "projectRemoved", 500);
            runs(function() {
                expect(userProjects.getCount()).toBe(1);
                expect(userProjects.getTotalCount()).toBe(1);
                projStore.load(function() {
                    var proj = projStore.first();
                    expect(projStore.getCount()).toBe(1);
                    expect(proj.get("name")).toBe("My Project #1");
                });
            });
        });

    });
});