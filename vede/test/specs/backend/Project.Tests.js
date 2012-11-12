/**
 * Testing Project and Associate models
 * @author Rodrigo Pavez
 */

Ext.syncRequire([
     "Ext.Ajax",
     "Teselagen.models.Project",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.SessionManager"],
 function () {

    var project, projectManager, authenticationManager;
    projectCreated = false;
    var server = 'http://teselagen.local/api/';

    projectManager = Teselagen.manager.ProjectManager; // Now is singleton
    authenticationManager = Teselagen.manager.AuthenticationManager; // Now is singleton

    describe("Connection to server", function () {
        it("Setup params", function () {
            Ext.Ajax.cors = true; // Allow CORS
            Teselagen.manager.SessionManager.baseURL = server;
            Teselagen.manager.SessionManager.env = 'prod';
        });

        it("Checking server " + server + " is running", function () {
            var check = function (cb) {
                    Ext.Ajax.request({
                        url: server,
                        method: 'GET',
                        success: function () {
                            return cb(true);
                        },
                        failure: function () {
                            return cb(false);
                        }
                    });
                };
            ajaxCheck(check, [], function (res) {
                expect(res).toBe(true);
            });
        });
    });

    describe("Authentication", function () {

        it("Login using rpavez/nopassword", function () {
            var params = {
                    username: 'rpavez',
                    password: '',
                    server: 'http://teselagen.local/api/'
            };

            authenticationManager.sendAuthRequest(params, function(success) {
                expect(Teselagen.manager.AuthenticationManager.authResponse).toBeDefined();
            });
        });
    });

    describe("Get User Profile and Projects", function () {
        it("Get User Profile and Get User Projects", function () {
            runs(function () {
                projectManager.loadUser(function () {
                    expect(projectManager.currentUser).toBeDefined();
                });
            });

            waitsFor(function () {
                if(Teselagen.manager.AuthenticationManager.authResponse) return true;
                else return false;
            }, "Auth took too much time", 750);

            waits(500);
            runs(function () {
                expect(projectManager.projects).toBeDefined();
            });
        });
    });

    describe("Create new Project, DE Project and DE Design", function () {
        it("Create new Project", function () {

            waits(1000);

            runs(function () {
                
                project = Ext.create("Teselagen.models.Project", {
                    name: "My Project #"+Math.floor(Math.random()*11),
                    DateCreated: new Date((new Date).getTime()*Math.random()),
                    DateModified: new Date((new Date).getTime()*Math.random())
                });

                projectManager.currentUser.projects().add(project);

                project.save({
                    callback:function(){
                        projectCreated = true;
                }});
                
            });
        });
    });

    var projectEdited = false;
    describe("Editing Project", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(projectCreated) return true; else return false;
            }, "Saving DE Design Timeout", 9000);

            runs(function () {
                console.log("Editing Project");
                project.set('name','changed name');
                project.save({
                    callback: function(){
                        projectEdited = true;
                    }
                });
            });
            
        });

        it("Remove Project", function () {
            waitsFor(function () {
                if(projectEdited) return true; else return false;
            }, "Alter Project Timeout", 9000);


            runs(function () {
                projectManager.currentUser.projects().remove(project);
                projectManager.currentUser.projects().sync();
            });
        });
    });
    
    var ajaxCheck = function(ajaxMethod, args, cb) {
        /**
         * @author Rodrigo Pavez
         * Custom function for checking ajax request
         * Need to add in the method: if (cb) return cb(true); // for testing
         *
         * Input: (method,args,cb)
         * method: Method to test
         * args: array of arguments
         * cb (optional): function to be called after success
         */

        var ajaxTimeOut = 10000;

        args.push(function (r) {
            flag = r;
        });
        var flag = false;
        runs(function () {
            ajaxMethod.apply(this, args);
        });

        waitsFor(function () {
            if(flag) cb(flag);
            return flag;
        }, "Ajax has not responded in setup timeout", ajaxTimeOut);
    };
});