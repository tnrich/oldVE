/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Diana Wong, Rodrigo Pavez
 */

Ext.syncRequire(["Ext.Ajax", "Teselagen.bio.util.StringUtil", "Teselagen.bio.util.XmlToJson", "Teselagen.bio.util.Sha256", "Teselagen.bio.parsers.GenbankManager", "Teselagen.bio.parsers.ParsersManager", "Teselagen.utils.SequenceUtils", "Teselagen.utils.FormatUtils", "Teselagen.utils.DeXmlUtils", "Teselagen.constants.Constants", "Teselagen.models.SequenceFile", "Teselagen.models.Part", "Teselagen.models.J5Bin", "Teselagen.models.J5Collection", "Teselagen.models.EugeneRule", "Teselagen.models.SBOLvIconInfo", "Teselagen.models.J5Run", "Teselagen.models.J5Parameters", "Teselagen.models.DownstreamAutomationParameters", "Teselagen.models.J5Results", "Teselagen.models.DeviceDesign", "Teselagen.models.Project", "Teselagen.manager.SequenceFileManager", "Teselagen.manager.EugeneRuleManager", "Teselagen.manager.DeviceDesignManager"], function () {
    console.log('Requires are ready');


    Ext.define('sessionData', {
        singleton: true,
        data: null,
        baseURL: 'http://teselagen.local/api/'
    });

    function ajaxCheck(ajaxMethod, args, cb) {
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


    var design, deproject, projectManager, deprojectsaved;
    var server = 'http://teselagen.local/api/';

    describe("Connection to server", function () {
        it("Setup params", function () {
            Ext.Ajax.cors = true; // Allow CORS
            Ext.Ajax.method = 'POST'; // Set POST as default Method
            sessionData.baseURL = server;
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

        it("Create Authentication Manager and Login as Root on teselagen.local server", function () {
            var authenticationManager = Ext.create("Teselagen.manager.AuthenticationManager"); // Created Auth manager
            var args = ['rpavez', '', 'http://teselagen.local/api/'];
            ajaxCheck(authenticationManager.manualAuth, args, function () {
                expect(sessionData.AuthResponse).toBeDefined();
            });
        });

    });

    describe("Get User Profile and Projects", function () {
        it("Create Project Manager", function () {
            projectManager = Ext.create("Teselagen.manager.ProjectManager"); // Created Project Manager
        });

        it("Get User Profile and Get User Projects", function () {
            runs(function () {
                projectManager.loadUser(function () {
                    expect(projectManager.currentUser).toBeDefined();
                });
            });

            waitsFor(function () {
                if(sessionData.AuthResponse) return true;
                else return false;
            }, "Auth took too much time", 750);

        });

        it("Check if projects loaded", function () {
            waits(500);

            runs(function () {
                expect(projectManager.projects).toBeDefined();
            });
        });
    });

    
    describe("Read last project", function () {

            runs(function () {
                var deprojects = projectManager.projects.last().deprojects();
                waits(500);
                runs(function () {
                    var design = deprojects.last().getDesign({
                        callback: function(res,op){
                            console.log(design);
                            console.log(res);
                            console.log(op);
                        }
                    });
                });
            });

            waitsFor(function () {
                if(projectManager.projects) return true;
                else return false;
            }, "Auth took too much time", 750);

    });

    
});