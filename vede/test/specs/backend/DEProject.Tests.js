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

    var project, design, deproject, projectManager, authenticationManager, projectcreated, deprojectsaved, designsaved;
    var project_id;
    var deproject_id;
    var parts = [];
    var sequences = [];
    var designsaved = false;
    var deprojectsaved = false;
    var designGenerated = false;
    var sequencesSaved = false;
    var partsSaved = false;
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

    describe("Get User Profile and Projects", function () {

    beforeEach(function () {    
            var params = {
                    username: 'rpavez',
                    password: ''
            };

            authenticationManager.sendAuthRequest(params, function(success) {
                expect(Teselagen.manager.AuthenticationManager.authResponse).toBeDefined();
            });
    });

        it("Get User Profile and Get User Projects", function () {
            
            waits(1000);

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
                    dateCreated: new Date((new Date).getTime()*Math.random()),
                    dateModified: new Date((new Date).getTime()*Math.random())
                });

                projectManager.currentUser.projects().add(project);

                project.save({
                    callback: function(){
                        projectcreated = true;
                        project_id = project.data.id;
                    }
                });
                
            });

            waitsFor(function () {
                if(projectManager.currentUser) return true;
                else return false;
            }, "Auth took too much time", 1750);


        });
        
        it("Create DE Project", function () {

            waits(500);

            runs(function () {
                
                deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
                    name: "My DE Project #"+Math.floor(Math.random()*11),
                    dateCreated: new Date((new Date).getTime()*Math.random()),
                    dateModified: new Date((new Date).getTime()*Math.random())
                });
                
                var currentProject = projectManager.currentUser.projects().last();
                currentProject.deprojects().add(deproject);

                deproject.save({
                    callback: function(rec){
                        deproject_id = deproject.data.id;
                        console.log("DE project saved");
                        deprojectsaved = true;
                        console.log(deproject);
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
            var binsArray = [];

            for(var binIndex = 0;binIndex<6;binIndex++)
            {
                var newBin = Ext.create("Teselagen.models.J5Bin", {
                    binName: "bin"+binIndex
                });
                var tempParts = [];
                for(var i=0;i<6;i++)
                {
                    var newPart = Ext.create("Teselagen.models.Part", {
                        name: "part1a",
                        genbankStartBP: 1,
                        endBP: 7
                    });
                    parts.push(newPart);
                    tempParts.push(newPart);
                }
                newBin.addToParts(tempParts);
                binsArray.push(newBin);
            }

            // CREATE THE COLLECTION WITH BINS
            design = DeviceDesignManager.createDeviceDesignFromBins(binsArray);


            expect(design).toBeDefined();
            designGenerated = true;
        });

    });

    describe("Saving Design", function () {

        
        it("Saving Sequences", function () {

            waitsFor(function () { if(designGenerated && deprojectsaved) return true; else return false; }, "", 1750);

            runs(function(){
                sequences.forEach(function(sequence,key){
                    sequence.save({callback:function(){ 
                        parts[key].setSequenceFile(sequences[key]); // Updated Ids
                        if(key==sequences.length-1) sequencesSaved = true; 
                    }});
                });
            });

        });
        
        it("Saving Parts", function () {

            waitsFor(function () { if(sequencesSaved) return true; else return false; }, "", 1750);

            runs(function(){
                parts.forEach(function(part,key){
                    part.save({callback:function(){ if(key==parts.length-1) partsSaved = true; }});
                });
            });

        });

        it("Saving Design", function () {

            waitsFor(function () {
                if(partsSaved) return true;
                else return false;
            }, "", 100);


            runs(function () {
                var deproject_id = deproject.get('id');
                design.set( 'deproject_id', deproject_id );
                deproject.set('id',deproject_id);
                deproject.setDesign(design);
                
                design.save({callback:function(){
                    designsaved = true;
                    console.log("Design saved!");
                }});
            });
        });

    });


    /*

    var projectedited = false;
    describe("Editing Project", function () {
        it("Alter design model", function () {
            
            runs(function () {
                console.log("Editing Project");
                project.set('name','changed name');
                project.set('id',project_id);
                project.save({
                    callback: function(){
                        projectedited = true;
                    }
                });
            });
            
            waitsFor(function () {
                if(projectcreated) return true; else return false;
            }, "Saving DE Design Timeout", 9000);

        });

        it("Get Altered Project", function () {

            runs(function () {
                //console.log(project);
            });

            waitsFor(function () {
                if(projectedited) return true; else return false;
            }, "Editing Project Timeout", 9000);

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
                deproject.set('name','DE Project changed');
                deproject.set('id',deproject_id);
                console.log(deproject);
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
    
    var designedited = true;
    */
    /*
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
*/
    
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