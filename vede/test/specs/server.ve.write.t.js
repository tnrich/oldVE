/**
 * Testing J5 submission.
 * Creates models and converts to JSON for J5 server submission.
 * @author Diana Wong, Rodrigo Pavez
 */

Ext.syncRequire(["Ext.Ajax",
 "Teselagen.bio.util.StringUtil",
 "Teselagen.bio.util.XmlToJson",
 "Teselagen.bio.util.Sha256",
 "Teselagen.bio.parsers.GenbankManager",
 "Teselagen.bio.parsers.ParsersManager",
 "Teselagen.utils.SequenceUtils",
 "Teselagen.utils.FormatUtils",
 "Teselagen.utils.DeXmlUtils",
 "Teselagen.constants.Constants",
 "Teselagen.models.SequenceFile",
 "Teselagen.models.Part",
 "Teselagen.models.Project",
 "Teselagen.models.VectorEditorProject",
 "Teselagen.manager.SequenceFileManager",
 "Teselagen.manager.DeviceDesignManager",
 "Teselagen.manager.ProjectManager"], function () {
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


    var newSequence, veproject, projectManager, veprojectsaved;
    var server = 'http://teselagen.local/api/';
    veprojectsaved = false;

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
            projectManager = Teselagen.manager.ProjectManager; // Created Project Manager
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

    //Sha256              = Teselagen.bio.util.Sha256;
    //SequenceFileManager = Teselagen.manager.SequenceFileManager;
    DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

    
    describe("Create new Project, De Project and DE Design", function () {


        it("Create new Project", function () {

            waits(1000);

            runs(function () {
                
                var project = Ext.create("Teselagen.models.Project", {
                    name: "My Project #"+Math.floor(Math.random()*11),
                    DateCreated: new Date((new Date).getTime()*Math.random()),
                    DateModified: new Date((new Date).getTime()*Math.random())
                });

                projectManager.currentUser.projects().add(project);

                project.save();
                
            });

        });

        
        it("Create VE Project", function () {

            waits(500);

            runs(function () {
                
                veproject = Ext.create("Teselagen.models.VectorEditorProject", {
                    name: "My DE Project #"+Math.floor(Math.random()*11)
                });
                
                var currentProject = projectManager.currentUser.projects().last();
                currentProject.deprojects().add(veproject);

                veproject.save({
                    callback: function(){
                        console.log("VE project saved");
                        veprojectsaved = true;
                    }
                });

            });
        });
            
        it("Create new SequenceFile", function () {

            
            var selectedFile = '/test/data/sequences/gen_bank_ex.gb';

            Ext.Ajax.request({
                url: selectedFile,
                method: 'GET',
                success: function(response){

                    var text = response.responseText;

                    newSequence = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileName: "gen_bank_ex.gb",
                        sequenceFileFormat: "Genbank",
                        sequenceFileContent: text
                    });
                }
            });


            var veproject_id = 0;
            waitsFor(function () {
                veproject_id = veproject.get('id');

                if(veproject_id!=0 && veproject_id!=undefined && newSequence!=null && newSequence!= undefined) return true; else return false;
            }, "VE Project creation took too much time", 100);


            runs(function () {

                veproject.setSequenceFile(newSequence);
                newSequence.set( 'veproject_id', veproject_id )
                newSequence.save({
                    callback: function(succ,op)
                    {

                    }
                });
                                
            });

        });

        /*
        it("Save DE Design to Server", function () {

            waitsFor(function () {
                if(design&&deprojectsaved&&deproject) return true;
                else return false;
            }, "DE Project creation took too much time", 100);


            runs(function () {
                design.set( 'deproject_id', deproject.get('id') )
                deproject.setDesign(design);
                
                design.save(function(){
                    console.log("Design saved!");
                });
            });

        });
        */
    });
});