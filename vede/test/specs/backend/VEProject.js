/**
 * Testing VEProject and Associate models
 * @author Rodrigo Pavez
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
 "Teselagen.manager.AuthenticationManager",
 "Teselagen.manager.ProjectManager"], function () {

    Ext.define('sessionData', {
        singleton: true,
        data: null,
        baseURL: 'http://teselagen.local/api/'
    });

    var project, design, deproject, projectManager, authenticationManager, deprojectsaved, designsaved;
    designsaved = false;
    deprojectsaved = false;
    var server = 'http://teselagen.local/api/';

    projectManager = Teselagen.manager.ProjectManager; // Now is singleton
    authenticationManager = Teselagen.manager.AuthenticationManager; // Now is singleton

    describe("Connection to server", function () {
        it("Setup params", function () {
            Ext.Ajax.cors = true; // Allow CORS
            Ext.Ajax.method = 'POST'; // Set POST as default Method
            sessionData.baseURL = server;
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

        it("Login with Manual-Auth in Authentication Manager", function () {
            var args = ['rpavez', '', 'http://teselagen.local/api/'];
            ajaxCheck(authenticationManager.manualAuth, args, function () {
                expect(sessionData.AuthResponse).toBeDefined();
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
                if(sessionData.AuthResponse) return true;
                else return false;
            }, "Auth took too much time", 750);

            waits(500);
            runs(function () {
                expect(projectManager.projects).toBeDefined();
            });

        });
    });

    describe("Create new Project, VE Project and Sequence", function () {
        it("Create new Project", function () {

            waits(1000);

            runs(function () {
                
                project = Ext.create("Teselagen.models.Project", {
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
            

        var sequenceSaved = false;
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


            var veproject_id;
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
                        sequenceSaved = true;
                    }
                });
                                
            });
        });

        it("Edit VEProject", function () {

            waitsFor(function () {
                if(sequenceSaved) return true;
                else return false;
            }, "DE Project creation took too much time", 100);


            runs(function () {
                veproject.set('name','Modified VEProject Name');
                
                veproject.save(function(){
                    console.log("Veproject updated!");
                });
            });

        });
        
        it("Edit Sequence", function () {

            waitsFor(function () {
                if(sequenceSaved) return true;
                else return false;
            }, "DE Project creation took too much time", 100);


            runs(function () {
                newSequence.set('sequenceFileName','Modified Sequence FileName');
                
                newSequence.save(function(){
                    console.log("Sequence updated!");
                });
            });

        });
        
    });

    var ajaxCheck = function(ajaxMethod, args, cb) {

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