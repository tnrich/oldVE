/**
 * Testing DEProject and Associate models
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
     "Teselagen.models.J5Bin",
     "Teselagen.models.J5Collection",
     "Teselagen.models.EugeneRule",
     "Teselagen.models.SBOLvIconInfo",
     "Teselagen.models.J5Run",
     "Teselagen.models.J5Parameters",
     "Teselagen.models.DownstreamAutomationParameters",
     "Teselagen.models.J5Results",
     "Teselagen.models.DeviceDesign",
     "Teselagen.models.Project",
     "Teselagen.manager.SequenceFileManager",
     "Teselagen.manager.DeviceDesignManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.AuthenticationManager",
     "Teselagen.manager.ProjectManager",
     "Teselagen.manager.SessionManager"],

 function () {

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

                project.save();
                
            });
        });
        
        it("Create DE Project", function () {

            waits(500);

            runs(function () {
                
                deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
                    name: "My DE Project #"+Math.floor(Math.random()*11)
                });
                
                var currentProject = projectManager.currentUser.projects().last();
                currentProject.deprojects().add(deproject);

                deproject.save({
                    callback: function(){
                        console.log("DE project saved");
                        deprojectsaved = true;
                    }
                });

            });
        });
        
        it("Generate in-memory DE Design", function () {

            var DeviceDesignManager = Teselagen.manager.DeviceDesignManager;

            // In creating this design, use bare minimum required fields
            // Will build this from the models.
            // The correct way would be to use DeviceDesignManager.js
            // Create Bin1 with 2 Part with 1 SequenceFile each
            seq1a = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileName: "part1a.fas",
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1a\nGATTACA"
            });
            part1a = Ext.create("Teselagen.models.Part", {
                name: "part1a",
                genbankStartBP: 1,
                endBP: 7
            });
            part1a.setSequenceFile(seq1a);


            seq1b = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileName: "part1b.fas",
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1b\nTTTTTTTTTT"
            });
            part1b = Ext.create("Teselagen.models.Part", {
                name: "part1b",
                genbankStartBP: 1,
                endBP: 7
            });
            part1b.setSequenceFile(seq1b);

            bin1 = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin1"
            });
            bin1.addToParts([part1a, part1b]);

            // Create Bin2 with 1 Part with 1 SequenceFile
            seq2a = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileName: "part2a.fas",
                sequenceFileFormat: "Fasta",
                sequenceFileContent: ">seq1c\nAAAAAAAAA"
            });
            part2a = Ext.create("Teselagen.models.Part", {
                name: "part2a",
                genbankStartBP: 1,
                endBP: 7
            });
            part2a.setSequenceFile(seq2a);

            bin2 = Ext.create("Teselagen.models.J5Bin", {
                binName: "bin2"
            });
            bin2.addToParts(part2a);

            // CREATE THE COLLECTION WITH BINS
            design = DeviceDesignManager.createDeviceDesignFromBins([bin1, bin2]);

            // EUGENE RULE
            rule1 = Ext.create("Teselagen.models.EugeneRule", {
                name: "rule1",
                negationOperator: false,
                compositionalOperator: "BEFORE",
                operand2: part2a
            });
            rule1.setOperand1(part1a);
            design.addToRules(rule1);
        });

        it("Save DE Design to Server", function () {

            waitsFor(function () {
                if(design&&deprojectsaved&&deproject) return true;
                else return false;
            }, "DE Project creation took too much time", 100);


            runs(function () {
                design.set( 'deproject_id', deproject.get('id') )
                deproject.setDesign(design);
                
                design.save({callback:function(){
                    designsaved = true;
                    console.log("Design saved!");
                }});
            });
        });
    });

    var projectedited = false;
    describe("Editing Project", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(designsaved) return true; else return false;
            }, "Saving DE Design Timeout", 9000);

            runs(function () {
                console.log("Editing Project");
                project.set('name','changed name');
                project.save({
                    callback: function(){
                        projectedited = true;
                    }
                });
            });
            
        });

        it("Get Altered Project", function () {
            waitsFor(function () {
                if(projectedited) return true; else return false;
            }, "Editing Project Timeout", 9000);


            runs(function () {
                project.load({callback: function(){
                    console.log(project);
                }});
            });
        });

    });
    
    var deprojectedited = false;
    describe("Editing DE Project", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(projectedited&&deprojectsaved) return true; else return false;
            }, "Project editing Timeout", 9000);


            runs(function () {
                console.log("Editing DE Project");
                //console.log(deproject);
                deproject.set('name','DE Project changed');
                deproject.save({
                    callback: function(){
                        deprojectedited = true;
                    }
                });
            });
            
        });

        it("Get Altered DE Project", function () {
            waitsFor(function () {
                if(deprojectedited) return true; else return false;
            }, "Editing DE Project Timeout", 9000);


            runs(function () {
                //console.log(deproject);
            });
        });

    });

    var designedited = false;
    describe("Editing DE Design", function () {
        it("Alter design model", function () {
            
            waitsFor(function () {
                if(deprojectedited) return true; else return false;
            }, "Editing DE Project Timeout", 9000);


            runs(function () {
                console.log("Editing design");
                design.createNewCollection(1);
                design.save({
                    callback: function(){
                        console.log("Design edited!");
                        designedited = true;
                    }
                });
            });
            
        });

        it("Get Altered design model", function () {
            waitsFor(function () {
                if(designedited) return true; else return false;
            }, "Editing Design Timeout", 9000);


            runs(function () {
                var editedDesign = deproject.getDesign();
                //console.log(editedDesign);
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