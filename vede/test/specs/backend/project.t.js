/*global beforeEach, describe, it, expect, runs, waitsFor*/
/**
 * @author Diana Wong, Rodrigo Pavez
 */

Ext.require([
     "Ext.Ajax",
     "Teselagen.constants.Constants",
     "Teselagen.models.Project",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.SessionManager"]);

Ext.onReady(function () {
    var project, projects, user, userProjects, projectById;
    var projectCreated = false;
    var projectEdited = false;
    var projectEditCheck = false;
    var projectRemoved = false;
    var projectLoaded = false;
    var constants = Teselagen.constants.Constants;
    var projectManager = Teselagen.manager.ProjectManager;
    var authenticationManager = Teselagen.manager.AuthenticationManager;
    var sessionManager = Teselagen.manager.SessionManager;
    var Project = Teselagen.models.Project;
    var projectAction = Project.getProxy().action;

    describe("Project server tests.", function() {

        beforeEach(function() {
            Ext.Ajax.cors = true; // Allow CORS
            sessionManager.setEnv(constants.ENV_PROD);
        });

        it("Login and load user", function () {
            runs(function() {
                authenticationManager.sendAuthRequest({
                    username: "rpavez",
                    password: "",
                    server: constants.API_URL
                });
            });
            waitsFor(function() {
                return !Ext.isEmpty(authenticationManager.authResponse);
            }, "authentication");
            runs(function () {
                projectManager.loadUser();
            });
        });

        it("Check user", function () {
            waitsFor(function() {
                return !Ext.isEmpty(projectManager.currentUser);
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
                expect(project.get("name")).toBe("My Project #2");
            });
        });
        
        it("Create and save new Project", function () {
            waitsFor(function() {
                return Ext.isDefined(user);
            }, "user", 500);
            runs(function () {
                project = Ext.create("Teselagen.models.Project", {
                    name: "My Project #3",
                    dateCreated: new Date("11/14/12"),
                    dateModified: new Date("11/14/12")
                });
                userProjects = user.projects();
                userProjects.add(project);
                userProjects.sync({
                    success: function(){
                        projectCreated = true;
                    }});
            });
            waitsFor(function() {
                return projectCreated;
            }, "projectCreated", 500);
            runs(function() {
                expect(userProjects.getCount()).toBe(2);
                // Why = 1?
                expect(userProjects.getTotalCount()).toBe(1);
                expect(project.getId()).toBeDefined();
                Project.getProxy().action="project";
                Teselagen.models.Project.load(project.getId(), {
                    callback: function() {
                        Project.getProxy().action=projectAction;
                    },
                    success: function(record) {
                        projectById = record;
                        projectLoaded = true;
                    }
                });
            });
            waitsFor(function() {
                return projectLoaded;
            }, "projectLoaded", 500);
            runs(function() {
                expect(projectById.get("name")).toBe("My Project #3");
            });
        });

        it("Edit project", function () {
            waitsFor(function() {
                return projectLoaded;
            }, "projectLoaded", 500);
            runs(function () {
                expect(project.dirty).toBe(false);
                project.set("name","changed name");
                expect(project.dirty).toBe(true);
                project.save({
                    success: function(){
                        projectEdited = true;
                    }
                });
            });
            waitsFor(function() {
                return projectEdited;
            }, "projectEdited", 500);
            runs(function() {
                expect(project.dirty).toBe(false);
                Project.getProxy().action="project";
                Teselagen.models.Project.load(project.getId(), {
                    callback: function() {
                        Project.getProxy().action=projectAction;
                    },
                    success: function(record) {
                        projectById = record;
                        projectEditCheck = true;
                    }
                });
            });
            waitsFor(function() {
                return projectEditCheck;
            }, "projectEditCheck", 500);
            runs(function() {
                expect(projectById.get("name")).toBe("changed name");
            });
        });

        it("Remove Project", function () {
            waitsFor(function() {
                return projectEdited;
            }, "projectEdited", 500);
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
            });
        });

    });
});